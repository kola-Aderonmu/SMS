import React, { useEffect } from "react";

const MonitorStatus = () => {
  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = "http://localhost:3000/status";
    iframe.style.width = "100%";
    iframe.style.height = "100%"; // Adjusted height to fit within the grid
    iframe.style.border = "none"; // Optional: remove iframe border
    document.getElementById("monitor-status-container").appendChild(iframe);
  }, []);

  return (
    <div className="grid grid-rows-3 grid-flow-row gap-4 p-4 bg-gray-100 h-screen">
      <div className="row-span-1 flex items-center justify-center">
        <h2 className="text-xl font-bold text-blue-600">Server Status</h2>
      </div>

      <div
        id="monitor-status-container"
        className="row-span-2 w-full h-full bg-white shadow-lg rounded-lg"
      >
        {/* The iframe will be appended here */}
      </div>
    </div>
  );
};

export default MonitorStatus;
