import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = "C:\\monitor\\file_operations.log";

// Watch the specific file for changes
const watcher = chokidar.watch(logFilePath, {
  persistent: true,
});

// Function to read the latest log entries
function readLatestLogs(numLines = 10) {
  const content = fs.readFileSync(logFilePath, "utf8");
  const lines = content.split("\n").filter(Boolean);
  return lines.slice(-numLines);
}

// Set up WebSocket connection 
export function setupWebSocket(io) {
  watcher.on("change", (path) => {
    const latestLogs = readLatestLogs();
    io.emit("logUpdate", latestLogs);
  });
}

// Implement your cron job logic here
export function fetchCronJobs() {
  // Implementation of fetchCronJobs
  // For example:
  return [
    { id: 1, name: "Daily Backup", schedule: "0 0 * * *" },
    { id: 2, name: "Weekly Report", schedule: "0 0 * * 0" },
  ];
}

// New function to get the latest logs
export function getLatestLogs(req, res) {
  try {
    const latestLogs = readLatestLogs();
    res.json(latestLogs);
  } catch (error) {
    console.error("Error reading log file:", error);
    res.status(500).send("Error reading log file");
  }
}
