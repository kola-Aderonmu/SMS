import os from 'os';
import osUtils from "os-utils";

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

// Promisify the cpuUsage function
export const cpuUsageAsync = () => new Promise((resolve, reject) => {
  osUtils.cpuUsage((value) => {
    if (value !== undefined) {
      resolve(value);
    } else {
      reject(new Error('Failed to retrieve CPU usage'));
    }
  });
});

export async function getCurrentCpuUsage() {
  const currentCpuUsage = await cpuUsageAsync();
  return parseFloat((currentCpuUsage * 100).toFixed(2));
}