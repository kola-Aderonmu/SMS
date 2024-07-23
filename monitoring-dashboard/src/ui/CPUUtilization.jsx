/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import CPUUtilizationGraph from "../components/CPUUtilizationGraph";
import { baseUrl } from "../lib/utils";
import axios from "axios";
import { SummaryMetricsContext } from "../lib/SummaryMetricsContext";
import { RowDetail } from "../components/RowDetail";

function Detail({ label, value, measurement, className }) {
  return (
    <div className="flex flex-col items-start">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-md font-bold pl-1 ${className}`}>
        {value}
        {measurement}
      </p>
    </div>
  );
}

export default function CPUUtilization() {
  const [cpuMetrics, setCpuMetrics] = useState(null);
  const summary = useContext(SummaryMetricsContext);
  const cpu = summary[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseUrl + "/usage/cpumetrics");
        const newData = response.data;

        // Assuming response.data is an array of objects
        // Append new data and remove the oldest data to create a scrolling effect
        setCpuMetrics(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000); //refetch every 5000ms;

    return () => clearInterval(interval);
  }, []);

  if (!cpuMetrics) {
    return;
  }

  const {
    baseSpeed,
    brand,
    cache,
    logicalProcessor,
    manufacturer,
    physicalCores,
    processes,
    socket,
    speed,
    uptime,
    virtualization,
  } = cpuMetrics;

  const duration = moment.duration(uptime, "seconds");

  // Format the duration into a readable time string (HH:mm:ss.SSS)
  const formattedTime = moment
    .utc(duration.asMilliseconds())
    .format("D:HH:mm:ss.SS");

  return (
    <div className="shadow-2xl border-dotted p-4">
      <div className="flex items-center justify-between px-3 gap-2 ">
        <h1 className="text-white/80">CPU</h1>
        <p className="text-xs font-light">
          {manufacturer}
          {brand} CPU @ {speed.toFixed(2)}GHz
        </p>
      </div>
      <div className="flex justify-between px-3 text-sm text-gray-800 font-medium pt-2">
        <p className="text-white mb-0.2">Utilization</p>
        <p>100%</p>
      </div>
      {/* CPU Utilization details */}
      <div className="flex flex-col">
        <CPUUtilizationGraph />
        <div className="flex flex-row justify-start gap-20  p-3">
          <div className="gap-2 flex flex-col">
            <Detail label={"Utilization"} value={cpu.value} measurement={"%"} />
            <Detail label={"Processes"} value={processes} />
            <Detail
              label={"Uptime"}
              value={formattedTime}
              className={"font-light text-xs"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <RowDetail
              label={"Base Speed"}
              value={baseSpeed}
              measurement={"GHz"}
            />
            <RowDetail label={"Sockets"} value={socket} />
            <RowDetail label={"Cores"} value={physicalCores} />
            <RowDetail label={"Logical Processors"} value={logicalProcessor} />
            <RowDetail
              label={"Virtualization"}
              value={virtualization ? "Enabled" : "Disabled"}
            />
            <RowDetail
              label={"L1 Cache"}
              value={cache.l1i}
              measurement={"kB"}
            />
            <RowDetail
              label={"L2 Cache"}
              value={cache.l2 / 1024 ** 2}
              measurement={"MB"}
            />
            <RowDetail
              label={"L3 Cache"}
              value={cache.l3 / 1024 ** 2}
              measurement={"MB"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
