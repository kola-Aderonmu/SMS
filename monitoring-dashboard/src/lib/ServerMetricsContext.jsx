/* eslint-disable react/prop-types */

import { createContext, useState, useEffect } from 'react';

export const ServerMetricsContext = createContext();

const ServerMetricsProvider = ({ children }) => {
  const [serverMetrics, setServerMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:3000/usage');
        const data = await response.json();
        setServerMetrics(data);
      } catch (error) {
        console.error('Error fetching server metrics:', error);
      }
    };

    fetchMetrics(); // Initial fetch

    const interval = setInterval(fetchMetrics, 60000); // Fetch metrics every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <ServerMetricsContext.Provider value={serverMetrics}>
      {children}
    </ServerMetricsContext.Provider>
  );
};

export default ServerMetricsProvider;
