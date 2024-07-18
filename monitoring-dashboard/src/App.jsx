import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import ServerMetricsProvider from "./lib/ServerMetricsContext";

const App = () => {
  return (
    <ServerMetricsProvider>
      <div className="font-Inter ">
        <NavBar />
        <Dashboard />
      </div>
    </ServerMetricsProvider>
  );
};

export default App;
