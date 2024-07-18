/* eslint-disable react/prop-types */

import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import { baseUrl } from './utils';

export const ServerMetricsContext = createContext();

const ServerMetricsProvider = ({ children }) => {
  const [serverMetrics, setServerMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(baseUrl+'/usage');
        const data = response.data;
        setServerMetrics(data);
      } catch (error) {
        console.error('Error fetching server metrics:', error);
      }
    };

    fetchMetrics(); // Initial fetch

    const interval = setInterval(fetchMetrics, 60000); // Fetch metrics every 100ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <ServerMetricsContext.Provider value={serverMetrics}>
      {children}
    </ServerMetricsContext.Provider>
  );
};

export default ServerMetricsProvider;
