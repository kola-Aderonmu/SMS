import Dashboard from './components/Dashboard';
import ServerMetricsProvider from './lib/ServerMetricsContext';

const App = () => {
  return (
    <ServerMetricsProvider>
      <div className="font-sans ">
      <Dashboard />
      </div>
    </ServerMetricsProvider>
  );
};

export default App;

