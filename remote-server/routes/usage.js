import express from "express";
import os from "os";
import si from "systeminformation";
import pidusage from "pidusage";
import osUtils from "os-utils";
import psList from "ps-list";
import NodeCache from "node-cache";

// Helper functions (e.g., getIPAddress, bytesToGB, readCronJobLogs, updateMetrics, etc.)
import { getIPAddress, bytesToGB, getCurrentCpuUsage } from "../utils.js";
import { fetchCronJobs } from "../cron.js";
import { getCpuUtilizationIntervals } from "../cpu.js";

const router = express.Router();
const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

// Endpoint to get CPU data
router.get("/cpu", async (req, res) => {
  try {
    const cpuIntervals = getCpuUtilizationIntervals();
    res.json(cpuIntervals);
  } catch (error) {
    console.error("Error fetching usage data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to get disk data
router.get("/disk", async (req, res) => {
  const [diskLayout, diskInfo] = await Promise.all([
    si.diskLayout(),
    si.fsSize(),
  ]);
  const {
    device,
    type,
    name,
    vendor,
    size,
    bytesPerSector,
    totalCylinders,
    totalHeads,
    totalSectors,
    totalTracks,
    tracksPerCylinder,
    sectorsPerTrack,
    firmwareRevision,
    serialNum,
    interfaceType,
    smartStatus,
    temperature,
  } = diskLayout[0];

  const { fs, used, available, use, mount, rw } = diskInfo[0];
  const diskUsage =  [
    { name: "used", value: parseFloat(bytesToGB(used).toFixed(2)) },
    { name: "Available", value: parseFloat(bytesToGB(available).toFixed(2)) },
    { name: "Total", value: parseFloat(bytesToGB(size).toFixed(2)) }
  ];

  const data = {
    device,
    type,
    name,
    vendor,
    size: bytesToGB(size),
    bytesPerSector,
    totalCylinders,
    totalHeads,
    totalSectors,
    totalTracks,
    tracksPerCylinder,
    sectorsPerTrack,
    firmwareRevision,
    serialNum,
    interfaceType,
    smartStatus,
    temperature,
    fs,
    used: bytesToGB(used),
    available: bytesToGB(available),
    use: use,
    mount,
    rw,
    diskUsage
  };


  try {
    res.json(data);
  } catch (error) {
    console.error("Error fetching disk data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/cpumetrics", async (req, res) => {
  try {
    const cpuMetrics = await getCPUMetrics();

    res.json(cpuMetrics);
  } catch (error) {
    console.error("Error fetching usage data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/overall", async (req, res) => {
  try {
    const [mem, disk] = await Promise.all([si.mem(), si.fsSize()]);
    const cpuUsage = await getCurrentCpuUsage();

    const utilization = [
      {
        name: "RAM",
        value: (1 - mem.available / mem.total) * 100,
      },
      {
        name: "Disk",
        value:
          disk.reduce(
            (acc, disk) => acc + (1 - disk.available / disk.size) * 100,
            0
          ) / disk.length,
      },
      {
        name: "CPU",
        value: cpuUsage,
      },
    ];
    res.json(utilization);
  } catch (error) {
    console.error("Error fetching usage data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to fetch usage data
router.get("/", async (req, res) => {
  try {
    // Fetch necessary data
    const [
      cpuUsage,
      mem,
      disk,
      networkStats,
      currentLoad,
      diskIO,
      processes,
      cronJobs,
    ] = await Promise.all([
      pidusage(process.pid),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.currentLoad(),
      si.disksIO(),
      psList(),
      fetchCronJobs(), // Define fetchCronJobs() to get cron jobs info
    ]);

    // Process data as needed
    const cpuMetrics = await getCPUMetrics(processes, currentLoad);
    //  response
    const data = {
      ip: getIPAddress(),
      platform: os.platform(),
      cpuCores: os.cpus().length,
      totalMemory: (mem.total / 1024 ** 3).toFixed(2) + " GB",
      freeMemory: (mem.available / 1024 ** 3).toFixed(2) + " GB",
      loadAverage: osUtils.loadavg(),
      diskInfo: disk?.map((d) => ({
        filesystem: d.fs,
        size: (d.size / 1024 ** 3).toFixed(2) + " GB",
        used: (d.used / 1024 ** 3).toFixed(2) + " GB",
        available: ((d.size - d.used) / 1024 ** 3).toFixed(2) + " GB",
        use: d.use.toFixed(2) + "%",
        mount: d.mount,
      })),
      networkStats: networkStats.map((net) => ({
        iface: net.iface,
        rx_bytes: net.rx_bytes,
        tx_bytes: net.tx_bytes,
        rx_dropped: net.rx_dropped,
        tx_dropped: net.tx_dropped,
        rx_errors: net.rx_errors,
        tx_errors: net.tx_errors,
      })),
      processes: processes.length,
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
      diskIO: diskIO
        ? {
            rIO: diskIO.rIO,
            wIO: diskIO.wIO,
          }
        : {
            rIO: "N/A",
            wIO: "N/A",
          },
      utilization: [
        {
          name: "RAM Usage",
          value: (1 - mem.available / mem.total) * 100,
        },
        {
          name: "Disk Usage",
          value:
            disk.reduce(
              (acc, disk) => acc + (1 - disk.available / disk.size) * 100,
              0
            ) / disk.length,
        },
        {
          name: "CPU Usage",
          value: currentLoad.currentLoad,
        },
      ],
      memory: [
        {
          label: "Total Memory",
          value: bytesToGB(mem.total),
          percentage: (bytesToGB(mem.total) / bytesToGB(mem.total)) * 100,
        },
        {
          label: "Used Memory",
          value: bytesToGB(mem.used),
          percentage: (bytesToGB(mem.used) / bytesToGB(mem.total)) * 100,
        },
        {
          label: "Free Memory",
          value: bytesToGB(mem.available),
          percentage: (bytesToGB(mem.available) / bytesToGB(mem.total)) * 100,
        },
      ],
      cpuMetrics,
    };

    res.json(data);
  } catch (error) {
    console.error("Error fetching usage data:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function getCPUMetrics() {
  try {
    const processes = await psList();
    const cpuData = await si.cpu();

    const {
      manufacturer,
      brand,
      vendor,
      model,
      stepping,
      speed,
      speedMin,
      speedMax,
      cores,
      physicalCores,
      processors,
      socket,
      flag,
      virtualization,
      cache,
    } = cpuData;

    const cpuMetrics = {
      uptime: os.uptime(),
      manufacturer,
      brand,
      vendor,
      model,
      stepping,
      speed,
      speedMin,
      baseSpeed: speedMax,
      logicalProcessor: cores,
      physicalCores,
      processors,
      socket,
      flag,
      virtualization,
      cache,
      processes: processes?.length,
    };

    return cpuMetrics;
  } catch (error) {
    console.error("Error fetching CPU metrics:", error);
    return {};
  }
}

export default router;
