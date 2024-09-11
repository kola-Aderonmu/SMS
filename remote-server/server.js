import express from "express";
import cors from "cors";
import metricsRouter from "./routes/metrics.js";
import usageRouter from "./routes/usage.js";
import { updateMetrics } from "./routes/metrics.js";
import si from "systeminformation";
import statusMonitor from "express-status-monitor";
import http from "http";
import socketIo from "socket.io";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { setupWebSocket } from "./cron.js";

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const io = socketIo(server);

// WebSocket setup
setupWebSocket(io);

app.use(cors());
app.use(statusMonitor());

// Route to fetch historical logs from 'file_operations.log'
app.get("/logs", (req, res) => {
  const logFile = path.join(__dirname, "file_operations.log");

  if (fs.existsSync(logFile)) {
    const logs = fs.readFileSync(logFile, "utf8").split("\n").filter(Boolean);
    const parsedLogs = logs.map((log) => JSON.parse(log)); // Assuming the logs are in JSON format
    res.json(parsedLogs);
  } else {
    res.status(404).json({ message: "No logs found." });
  }
});

app.get("/", async (req, res) => {
  const data = await si.fullLoad();
  res.json(data);
});

app.use("/metrics", metricsRouter);
app.use("/usage", usageRouter);

app.get("/status", statusMonitor().pageRoute);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  setInterval(updateMetrics, 5000);
});
