import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { FaSyncAlt } from "react-icons/fa"; // For loading animation

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial logs
    fetchLogs();

    // Set up WebSocket connection
    const socket = io("http://localhost:5000"); // Adjust the URL to match your server

    socket.on("logUpdate", (newLogs) => {
      console.log("New logs received from WebSocket:", newLogs); // Debugging line
      setLogs((prevLogs) => [...newLogs, ...prevLogs]); // Append new logs
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/usage/logs");
      console.log("Logs fetched from API:", response.data); // Debugging line
      setLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            File Operation Logs
          </h2>
          <button
            onClick={fetchLogs}
            className="text-blue-600 hover:text-blue-800 transition ease-in-out duration-200"
          >
            <FaSyncAlt className={`animate-spin ${loading ? "" : "hidden"}`} />
            {!loading && "Refresh Logs"}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <FaSyncAlt className="animate-spin text-blue-500 text-3xl" />
          </div>
        ) : logs.length > 0 ? (
          <ul className="divide-y divide-gray-200 overflow-y-auto max-h-96">
            {logs.map((log, index) => (
              <li key={index} className="py-4 px-2 flex justify-between">
                <span className="text-gray-700">{log.operation}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(log.timestamp * 1000).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No logs found.</p>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
