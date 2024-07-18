import express from 'express';
import cors from 'cors';
import metricsRouter from './routes/metrics.js';
import usageRouter from './routes/usage.js';
import { updateMetrics } from './routes/metrics.js';

const app = express();
const PORT = 3000;
import si from "systeminformation"

app.get("/", async (req, res) => {
  const data = await si.fullLoad();
  res.json(data);
})

app.use(cors());
app.use('/metrics', metricsRouter);
app.use('/usage', usageRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Update metrics periodically
  setInterval(updateMetrics, 5000); // Update metrics every 5seconds
});
