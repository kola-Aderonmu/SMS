import os from 'os';
import fs from 'fs';

// Function to get the system IP address
export function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const alias of interfaces[iface]) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'IP address not found';
}

// Convert bytes to gigabytes
export function bytesToGB(bytes) {
  return bytes / (1024 ** 3);
}

// Function to read cron job logs (moved to routes/usage.js)
// Function to update Prometheus metrics (moved to routes/metrics.js)
