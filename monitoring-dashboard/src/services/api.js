import axios from 'axios';
import { baseUrl } from '../lib/utils';

const apiClient = axios.create({
  baseURL: baseUrl, // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});


export const fetchMetrics = async () => {
  try {
    const response = await apiClient.get('/usage'); // Endpoint to fetch server usage data
    return response.data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
};

export const fetchPrometheusMetrics = async () => {
  try {
    const response = await apiClient.get('/metrics'); // Endpoint to fetch Prometheus metrics
    return response.data;
  } catch (error) {
    console.error('Error fetching Prometheus metrics:', error);
    throw error;
  }
};

// Polling function to fetch metrics at regular intervals
export const startPollingMetrics = (callback, interval = 5000) => {
  const fetchAndUpdate = async () => {
    try {
      const metrics = await fetchMetrics();
      callback(metrics);
    } catch (error) {
      console.error('Error fetching metrics during polling:', error);
    }
  };

  fetchAndUpdate(); // Fetch immediately
  return setInterval(fetchAndUpdate, interval);
};

export const stopPollingMetrics = (intervalId) => {
  clearInterval(intervalId);
};
