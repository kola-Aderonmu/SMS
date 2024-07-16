import express from 'express';
import os from 'os';
import cors from "cors";
import pidusage from 'pidusage';
import osUtils from 'os-utils';
import si from 'systeminformation';
import psList from 'ps-list';
import client from 'prom-client';
import fs from 'fs';
import NodeCache from 'node-cache';

const app = express();
const PORT = 3000;
app.use(cors());

// Create Prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics
const nodeCpuGauge = new client.Gauge({ name: 'nodejs_cpu_usage', help: 'Node.js CPU Usage', registers: [register] });
const nodeMemGauge = new client.Gauge({ name: 'nodejs_memory_usage', help: 'Node.js Memory Usage in GB', registers: [register] });
const sysCpuGauge = new client.Gauge({ name: 'system_cpu_usage', help: 'System CPU Usage', registers: [register] });
const sysTotalMemGauge = new client.Gauge({ name: 'system_total_memory', help: 'System Total Memory in GB', registers: [register] });
const sysFreeMemGauge = new client.Gauge({ name: 'system_free_memory', help: 'System Free Memory in GB', registers: [register] });
const loadGauge = new client.Gauge({ name: 'load_average', help: 'System Load Average', registers: [register] });
const ramUsageGauge = new client.Gauge({ name: 'ram_usage_percentage', help: 'RAM Usage Percentage', registers: [register] });
const cpuUsageGauge = new client.Gauge({ name: 'cpu_usage_percentage', help: 'CPU Usage Percentage', registers: [register] });
const diskUsageGauge = new client.Gauge({ name: 'disk_usage_percentage', help: 'Disk Usage Percentage', registers: [register] });

// Function to get the system IP address
function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const alias of interfaces[iface]) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'IP address not found';
}

// Convert bytes to gigabytes
function bytesToGB(bytes) {
  return bytes / (1024 ** 3);
}

// Function to read cron job logs
function readCronJobLogs() {
  try {
    const logFile = 'cronjob.log';
    if (fs.existsSync(logFile)) {
      const logs = fs.readFileSync(logFile, 'utf8').split('\n');
      const cronJobs = [];
      logs.forEach(log => {
        if (log.trim() !== '') {
          const [name, startTime, endTime] = log.split(',');
          const duration = (new Date(endTime) - new Date(startTime)) / 1000; // Duration in seconds
          cronJobs.push({
            name: name,
            startTime: startTime,
            endTime: endTime,
            duration: duration
          });
        }
      });
      return cronJobs;
    } else {
      console.log('Cron job log file does not exist.');
      return [];
    }
  } catch (error) {
    console.error('Error reading cron job logs:', error);
    return [];
  }
}

// Function to update Prometheus metrics
async function updateMetrics() {
  try {
    const stats = await pidusage(process.pid);
    const cpuUsage = await new Promise((resolve) => osUtils.cpuUsage(resolve));
    const diskInfo = await si.fsSize();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    const ramUsagePercentage = (usedMemory / totalMemory) * 100;
    const totalDiskSize = diskInfo.reduce((acc, disk) => acc + disk.size, 0);
    const totalDiskUsed = diskInfo.reduce((acc, disk) => acc + disk.used, 0);
    const diskUsagePercentage = (totalDiskUsed / totalDiskSize) * 100;

    // Update Prometheus metrics
    nodeCpuGauge.set(stats.cpu);
    nodeMemGauge.set(bytesToGB(stats.memory));
    sysCpuGauge.set(cpuUsage * 100); // Convert to percentage
    sysTotalMemGauge.set(bytesToGB(totalMemory));
    sysFreeMemGauge.set(bytesToGB(freeMemory));
    loadGauge.set(os.loadavg()[0]);

    ramUsageGauge.set(ramUsagePercentage);
    cpuUsageGauge.set(cpuUsage * 100); // Convert to percentage
    diskUsageGauge.set(diskUsagePercentage);
  } catch (error) {
    console.error('Error updating Prometheus metrics:', error);
  }
}

// Cache configuration
const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

const getCachedData = async (key, fetchFunction) => {
  const cachedData = cache.get(key);
  if (cachedData) return cachedData;
  const data = await fetchFunction();
  cache.set(key, data);
  return data;
};

const fetchCronJobs = async () => {
  // Dummy function for example
  return [];
};

app.get('/usage', async (req, res) => {
  try {
    const [cpuUsage, mem, disk, networkStats,currentLoad, diskIO,  processes, cronJobs] = await Promise.all([
      pidusage(process.pid),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      
      si.currentLoad(),
      si.disksIO(),
      psList(),
      fetchCronJobs(), // Define fetchCronJobs() to get cron jobs info
    ]);

    const utilization =  [{
      name: "RAM Usage",
      value: (1 - mem.available / mem.total) * 100
    }, {
      name: "Disk Usage",
      value: disk.reduce((acc, disk) => acc + (1 - disk.available / disk.size) * 100, 0) / disk.length
    }, {
      name: "CPU Usage",
      value: cpuUsage.cpu
    }]

    const memory = [{
      label: "Total Memory",
      value: bytesToGB(mem.total),
      percentage: (bytesToGB(mem.total) / bytesToGB(mem.total)) * 100
    }, {
      label: "Used Memory",
      value: bytesToGB(mem.used),
      percentage: (bytesToGB(mem.used) / bytesToGB(mem.total)) * 100
    }, {
      label: "Free Memory",
      value: bytesToGB(mem.available),
      percentage: (bytesToGB(mem.available) / bytesToGB(mem.total)) * 100
    }]

    const data = {
      platform: os.platform(),
      cpuCores: os.cpus().length,
      totalMemory: (mem.total / (1024 ** 3)).toFixed(2) + ' GB',
      freeMemory: (mem.available / (1024 ** 3)).toFixed(2) + ' GB',
      loadAverage: os.loadavg(),
      diskInfo: disk.map(d => ({
        filesystem: d.fs,
        size: (d.size / (1024 ** 3)).toFixed(2) + ' GB',
        used: (d.used / (1024 ** 3)).toFixed(2) + ' GB',
        available: ((d.size - d.used) / (1024 ** 3)).toFixed(2) + ' GB',
        use: d.use.toFixed(2) + '%',
        mount: d.mount,
      })),
      networkStats: networkStats.map(net => ({
        iface: net.iface,
        rx_bytes: net.rx_bytes,
        tx_bytes: net.tx_bytes,
        rx_dropped: net.rx_dropped,
        tx_dropped: net.tx_dropped,
        rx_errors: net.rx_errors,
        tx_errors: net.tx_errors,
      })),
      processes: processes.map(p => ({
        pid: p.pid,
        ppid: p.ppid,
        name: p.name,
        cpu: p.cpu,
        memory: bytesToGB(p.memory), // Convert from bytes to GB
        cmd: p.cmd,
        // Additional details
        diskIO: {
          read: p.rIO, // Read IO operations
          write: p.wIO // Write IO operations
        },
        networkUsage: {
          tx: p.tx, // Transmit data
          rx: p.rx // Receive data
        }
      })),
      cronJobs,
      currentLoad: {
        avgLoad: currentLoad.avgLoad,
        currentLoad: currentLoad.currentLoad,
        currentLoadUser: currentLoad.currentLoadUser,
        currentLoadSystem: currentLoad.currentLoadSystem,
        currentLoadNice: currentLoad.currentLoadNice,
        currentLoadIdle: currentLoad.currentLoadIdle,
        currentLoadIrq: currentLoad.currentLoadIrq,
      },
      diskIO: diskIO ? {
        rIO: diskIO.rIO,
        wIO: diskIO.wIO,
      } : {
        rIO: 'N/A',
        wIO: 'N/A',
      },
      utilization,
      memory
    };

    res.json(data);
  } catch (error) {
    console.error('Error fetching usage data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Update metrics periodically
  setInterval(updateMetrics, 5000); // Update metrics every 5 seconds
});
