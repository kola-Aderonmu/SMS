/* eslint-disable react/prop-types */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MetricsPanel = ({ serverMetrics }) => {
  console.log(serverMetrics);
  const data = [
    { name: "RAM Usage", value: serverMetrics.utilization.ramUsagePercentage },
    {
      name: "Disk Usage",
      value: serverMetrics.utilization.diskUsagePercentage,
    },
    { name: "CPU Usage", value: serverMetrics.utilization.cpuUsagePercentage },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Server Metrics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsPanel;
