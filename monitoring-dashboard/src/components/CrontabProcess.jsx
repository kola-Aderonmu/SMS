import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const CrontabProcess = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("update", (data) => {
      setLogs(data);
    });

    return () => socket.disconnect(); // Cleanup on unmount
  }, []);

  return (
    <div className="container mx-auto p-6 bg-deep-orange-200">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          File Operations Logs
        </h1>
        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Operation</th>
              <th className="px-4 py-2">File</th>
              <th className="px-4 py-2">Start Time</th>
              <th className="px-4 py-2">Duration (s)</th>
              <th className="px-4 py-2">End Time</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="bg-gray-50 hover:bg-gray-100">
                <td className="border px-4 py-2">{log.operation}</td>
                <td className="border px-4 py-2">{log.file}</td>
                <td className="border px-4 py-2">
                  {new Date(log.start_time * 1000).toLocaleString()}
                </td>
                <td className="border px-4 py-2">{log.duration}</td>
                <td className="border px-4 py-2">
                  {log.end_time
                    ? new Date(log.end_time * 1000).toLocaleString()
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrontabProcess;
