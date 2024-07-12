import React, { useEffect, useState } from "react";
import axios from "axios";

const SystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState({});

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get(
          "https://d053-105-112-101-109.ngrok-free.app/system-info"
        );
        setSystemInfo(response.data);
      } catch (error) {
        console.error("Error fetching system info:", error);
      }
    };
    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">System Information</h2>
      <p>
        <strong>Free Memory:</strong> {systemInfo.freeMemory}
      </p>
      <p>
        <strong>Total Memory:</strong> {systemInfo.totalMemory}
      </p>
      <p>
        <strong>Uptime:</strong> {systemInfo.uptime}
      </p>
      <p>
        <strong>Platform:</strong> {systemInfo.platform}
      </p>
      <p>
        <strong>CPU Cores:</strong> {systemInfo.cpuCores}
      </p>
      <p>
        <strong>Load Average:</strong> {systemInfo.loadAverage}
      </p>
    </div>
  );
};

export default SystemInfo;
