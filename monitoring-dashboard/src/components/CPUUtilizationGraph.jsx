import { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { baseUrl } from "../lib/utils";

const CPUUtilizationGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseUrl + "/usage/cpu");
        const newData = response.data;

        // Assuming response.data is an array of objects
        // Append new data and remove the oldest data to create a scrolling effect
        setData((prevData) => {
          const combinedData = [...prevData, ...newData];
          return combinedData.slice(-30); // Keep only the latest 30 data points
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 3000); //refetch every 5000ms;

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        style={{ background: "#1a1a1a" }} // Dark background color
      >
        <CartesianGrid strokeDasharray="3 3" stroke="" />
        <XAxis dataKey="time" stroke="#ffffff" />
        <YAxis domain={[0, 100]} stroke="#ffffff" /> {/* White Y-axis labels */}
        <Tooltip
          contentStyle={{
            background: "#333333",
            border: "none",
            color: "#ffffff",
          }} // Dark tooltip background with white text
          cursor={{ stroke: "#ffffff", strokeWidth: 0 }} // White cursor line
        />
        <Area
          type="monotone"
          dataKey="utilization"
          stroke="none" // Greenish stroke color
          fill="#42A5F5CC" // Greenish fill color
          dot={{ strokeWidth: 2, fill: "none", r: 4 }} // Greenish dots
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CPUUtilizationGraph;
