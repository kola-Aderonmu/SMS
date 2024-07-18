import Dashboard from './components/Dashboard';
import ServerMetricsProvider from './lib/ServerMetricsContext';
import SummaryMetricsProvider from './lib/SummaryMetricsContext';

const App = () => {
  return (
    <ServerMetricsProvider>
    <SummaryMetricsProvider>
      <div className="font-sans bg-black">
      <Dashboard />
      </div>
      </SummaryMetricsProvider>
    </ServerMetricsProvider>
  );
};

export default App;

