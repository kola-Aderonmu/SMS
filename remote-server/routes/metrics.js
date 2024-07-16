import express from 'express';
import client from 'prom-client';
import os from 'os';
import si from 'systeminformation';
import pidusage from 'pidusage';
import osUtils from 'os-utils';
import { bytesToGB } from '../utils.js';

const router = express.Router();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Define your Prometheus metrics
const nodeCpuGauge = new client.Gauge({ name: 'nodejs_cpu_usage', help: 'Node.js CPU Usage', registers: [register] });
const nodeMemGauge = new client.Gauge({ name: 'nodejs_memory_usage', help: 'Node.js Memory Usage in GB', registers: [register] });
const sysCpuGauge = new client.Gauge({ name: 'system_cpu_usage', help: 'System CPU Usage', registers: [register] });
const sysTotalMemGauge = new client.Gauge({ name: 'system_total_memory', help: 'System Total Memory in GB', registers: [register] });
const sysFreeMemGauge = new client.Gauge({ name: 'system_free_memory', help: 'System Free Memory in GB', registers: [register] });
const loadGauge = new client.Gauge({ name: 'load_average', help: 'System Load Average', registers: [register] });
const ramUsageGauge = new client.Gauge({ name: 'ram_usage_percentage', help: 'RAM Usage Percentage', registers: [register] });
const cpuUsageGauge = new client.Gauge({ name: 'cpu_usage_percentage', help: 'CPU Usage Percentage', registers: [register] });
const diskUsageGauge = new client.Gauge({ name: 'disk_usage_percentage', help: 'Disk Usage Percentage', registers: [register] });




// Function to update Prometheus metrics
export async function updateMetrics() {
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

// Middleware to expose Prometheus metrics
router.get('/', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default router;
