import { useContext } from "react";
import { ServerMetricsContext } from "../lib/ServerMetricsContext";
import UtilizationCard from "./UtilizationCard";
import { ProgressBar } from "./ProgressBar";
import CPUUtilizationGraph from "./CPUUtilization";

const Dashboard = () => {
  const serverMetrics = useContext(ServerMetricsContext);

  if (!serverMetrics) {
    return <div>Loading...</div>;
  }

  const {
    utilization,
    // platform,
    // cpuCores,
    // totalMemory,
    // freeMemory,
    // loadAverage,
    memory,
  } = serverMetrics;
  console.log(serverMetrics);
  return (
    <div className="p-8 bg-white shadow rounded-lg border-red-500">
      <h1 className="text-2xl font-bold mb-4"></h1>

      {/* <div className="mb-4">
        <h2 className="text-xl font-semibold">System Information</h2>
        <p>Platform: {platform}</p>
        <p>CPU Cores: {cpuCores}</p>
        <p>Total Memory: {totalMemory}</p>
        <p>Free Memory: {freeMemory}</p>
        <p>Load Average: {loadAverage.join(", ")}</p>
      </div> */}

      {/* <div className="mb-4">
        <h2 className="text-xl font-semibold">Utilization</h2>
        <p>RAM Usage: {utilization[0].value.toFixed(2)}%</p>
        <p>CPU Usage: {utilization[1].value.toFixed(2)}%</p>
        <p>Disk Usage: {utilization[2].value.toFixed(2)}%</p>
      </div> */}

      {/* First part */}
      <div className="flex flex-col md:flex-row justify-start md:items-center gap-3 p-3">
        {/* Utilization RAM, Disk and CPU */}
        <div className="flex flex-col md:flex-row gap-2">
          {utilization.map(({ name, value }) => {
            return <UtilizationCard key={name} name={name} value={value} />;
          })}
        </div>
        {/* RAM disposition */}
        <div className="flex gap-3 flex-col w-full">
          {memory.map((mem, index) => (
            <ProgressBar key={index} {...mem} />
          ))}
        </div>
      </div>

      <CPUUtilizationGraph />
    </div>
  );
};

export default Dashboard;
