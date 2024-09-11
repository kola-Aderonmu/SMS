import CrontabProcess from "./components/CrontabProcess";
import Dashboard from "./components/Dashboard";
import LogViewer from "./components/LogViewer";

import MonitorStatus from "./components/MonitorStatus";
import Navbar from "./components/Navbar";

import ServerMetricsProvider from "./lib/ServerMetricsContext";
import SummaryMetricsProvider from "./lib/SummaryMetricsContext";

const App = () => {
  return (
    <>
      <ServerMetricsProvider>
        <SummaryMetricsProvider>
          <div className="font-sans bg-black">
            <Navbar />
            <Dashboard />

            <br />
            {/* <MonitorStatus /> */}
            <CrontabProcess />
            {/* // For test purpose */}
            <LogViewer />
          </div>
        </SummaryMetricsProvider>
      </ServerMetricsProvider>
    </>
  );
};

export default App;
