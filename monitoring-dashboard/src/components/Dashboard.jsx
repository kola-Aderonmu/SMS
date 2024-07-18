import { useContext } from "react";
import { ServerMetricsContext } from "../lib/ServerMetricsContext";
import { ProgressBar } from "./ProgressBar";
import CPUUtilization from "../ui/CPUUtilization";
import { Spinner } from "@material-tailwind/react";
import OverallUtilization from "../ui/OverallUtilization";
import DiskThroughput from "../ui/DiskThroughput";

const Dashboard = () => {
  const serverMetrics = useContext(ServerMetricsContext);

  if (!serverMetrics) {
    return (
      <div className="min-h-screen bg-black/80 text-gray-50 min-w-full flex items-center justify-center flex-col gap-5 overflow-hidden">
        <Spinner className="h-12 w-12 text-gray-900/50" />
        <p className="text-xs py-3">Your Server metrics is loading</p>
      </div>
    );
  }

  const { memory } = serverMetrics;

  return (
    <div className="p-8 bg-black/95 text-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Server Metrics Dashboard</h1>

      {/* First part */}
      <div className="flex flex-col md:flex-row justify-start md:items-center gap-3 p-3">
        <div className="w-full lg:w-1/2">
        <div className="flex items-center justify-between px-3 gap-2">
          <h1 className="text-white/80">Summary</h1>
      </div>
          {/* Utilization RAM, Disk and CPU */}
          <OverallUtilization />
        </div>

        {/* RAM disposition */}
        <div className="flex gap-3 flex-col w-full lg:w-1/2 ">
        <div className="flex items-center justify-between px-3 gap-2">
          <h1 className="text-white/80">RAM</h1>
      </div>
          {memory.map((mem, index) => (
            <ProgressBar key={index} {...mem} />
          ))}
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      {/* Processor Utilization & Disk throughput */}
      <div className="flex gap-5 flex-col lg:flex-row">
      <div className="w-full md:w-1/2">
      <CPUUtilization />
      </div>
       
        <div className="w-full md:w-1/2">
          <DiskThroughput />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
