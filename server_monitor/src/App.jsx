import React, { useState } from "react";
import "./App.css";
import SystemInfo from "./component/SystemInfo";
import "./index.css";

function App() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex">
      <div
        className={`bg-zinc-200 hover:bg-zinc-500 text-white flex flex-col rounded-xl items-center py-4 transition-all duration-300 ${
          isSidebarExpanded ? "w-60" : "w-16"
        }`}
      >
        <div
          className="toggle-btn cursor-pointer text-xl mb-4"
          onClick={toggleSidebar}
        >
          &#9776;
        </div>
        <div className="icon flex flex-col items-center mb-4 text-xs">
          <i className="fa-solid fa-house text-xl"></i>
          <span
            className={`ml-2 transition-opacity duration-300 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Home
          </span>
        </div>
        <div className="icon flex flex-col items-center mb-4 text-xs">
          <i className="fa-solid fa-memory text-xl"></i>
          <span
            className={`ml-2 transition-opacity duration-300 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Memory
          </span>
        </div>
        <div className="icon flex flex-col items-center text-xs">
          <i className="fa-solid fa-chart-line text-xl"></i>
          <span
            className={`ml-2 transition-opacity duration-300 ${
              isSidebarExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Charts
          </span>
        </div>
      </div>
      <div className="flex-1">
        <div className="content p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="card bg-white p-4 shadow rounded bg-orange-50 transition-transform transform hover:scale-105 ease-ins">
              <h3 className="text-lg font-semibold font-mono font-thin text-slate-700 tracking-widest">
                Disk Space
              </h3>
            </div>
            <div className="card bg-white p-4 shadow rounded bg-orange-50 transition-transform transform hover:scale-105 ease-ins">
              <h3 className="text-lg font-semibold font-mono font-thin text-slate-700 tracking-widest">
                RAM Allocation
              </h3>
              <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">System Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SystemInfo />
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-white p-4 shadow rounded bg-orange-50">
            <div className="card bg-white p-4 shadow rounded">
              <h3 className="text-lg font-bold mb-4 font-sans font-meduim text-slate-700 tracking-widest">
                Crontab Job Status
              </h3>
              <table className="w-full text-left table-auto">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 font-thin text-slate-700 font-sans">
                      Start Time
                    </th>
                    <th className="border px-4 py-2 font-thin text-slate-700 font-sans">
                      End Time
                    </th>
                    <th className="border px-4 py-2 font-thin text-slate-700 font-sans">
                      Duration
                    </th>
                    <th className="border px-4 py-2 font-thin text-slate-700 font-sans">
                      Errors
                    </th>
                  </tr>
                </thead>
                <tbody id="jobsTable">{/* Data will be inserted here */}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
