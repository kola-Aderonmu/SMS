// const express = require("express");
// const app = express();
// const fs = require("fs");
// const port = 3000;

// app.get("/logs", (req, res) => {
//   const logFilePath = path.join(__dirname, "logfile");
//   fs.readFile(logFilePath, "utf8", (err, data) => {
//     if (err) {
//       res.status(500).send("Error reading log file");
//       return;
//     }
//     const logs = parseLogs(data);
//     res.json(logs);
//   });
// });

// function parseLogs(data) {
//   const lines = data.split("\n");
//   const jobs = [];
//   let currentJob = {};

//   lines.forEach((line) => {
//     if (line.includes("Job started")) {
//       currentJob.startTime = parseTime(line);
//     } else if (line.includes("Job ended")) {
//       currentJob.endTime = parseTime(line);
//       currentJob.duration =
//         (new Date(currentJob.endTime) - new Date(currentJob.startTime)) / 1000;
//       jobs.push(currentJob);
//       currentJob = {};
//     } else if (line.trim()) {
//       currentJob.errors = currentJob.errors || [];
//       currentJob.errors.push(line.trim());
//     }
//   });

//   return jobs;
// }

// function parseTime(logLine) {
//   const timeStr = logLine.split(": ")[1].trim();
//   return new Date(timeStr);
// }

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });

//! SERVER CODE 2

const express = require("express");
const axios = require("axios");
const os = require("os");
const app = express();
const port = 3000;

// Endpoint to fetch computing details

app.get("/", (req, res) => {
  res.send("this is 3000");
});

app.get("/server-details", async (req, res) => {
  try {
    const response = await axios.get(
      " https://d053-105-112-101-109.ngrok-free.app/computing-details"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch computing details" });
  }
});

app.get("/system-info", (req, res) => {
  const systemInfo = {
    freeMemory: os.freemem(),
    totalMemory: os.totalmem(),
    uptime: os.uptime(),
    platform: os.platform(),
    cpuCores: os.cpus().length,
    loadAverage: os.loadavg(),
  };
  res.json(systemInfo);
});

async function fetchSystemInfo() {
  try {
    const response = await axios.get(
      "  https://d053-105-112-101-109.ngrok-free.app/system-info"
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching system info:", error);
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

  // Call fetchSystemInfo after the server starts listening
  fetchSystemInfo();
});
