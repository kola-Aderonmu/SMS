/* eslint-disable react/prop-types */

import { createContext, useState, useEffect } from 'react';
import { baseUrl } from './utils';
import axios from 'axios';

export const SummaryMetricsContext = createContext();

const SummaryMetricsProvider = ({ children }) => {
  const [summaryMetrics, setSummaryMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(baseUrl+'/usage/overall');
        const data = response.data;
        setSummaryMetrics(data);
      } catch (error) {
        console.error('Error fetching Summary metrics:', error);
      }
    };

    fetchMetrics(); // Initial fetch

    const interval = setInterval(fetchMetrics, 5000); // Fetch metrics every 100ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <SummaryMetricsContext.Provider value={summaryMetrics}>
      {children}
    </SummaryMetricsContext.Provider>
  );
};

export default SummaryMetricsProvider;
