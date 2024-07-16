import express from 'express';
import cors from 'cors';
import metricsRouter from './routes/metrics.js';
import usageRouter from './routes/usage.js';
import { updateMetrics } from './routes/metrics.js';
import { captureCpuUsage } from './cpuutilization.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use('/metrics', metricsRouter);
app.use('/usage', usageRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Update metrics periodically
  setInterval(updateMetrics, 5000); // Update metrics every 5 seconds
});
