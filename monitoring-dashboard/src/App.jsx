import CrontabProcess from "./components/CrontabProcess";
import Dashboard from "./components/Dashboard";
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
            <CrontabProcess />
          </div>
        </SummaryMetricsProvider>
      </ServerMetricsProvider>
    </>
  );
};

export default App;
