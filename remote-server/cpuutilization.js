import osUtils from 'os-utils';
import fs from 'fs';

const INTERVAL_DURATION = 10 * 1000; // Interval in milliseconds (e.g., every 10 seconds)
const DATA_RETENTION_PERIOD = 23 * 60 * 60 * 1000; // 23 hours in milliseconds
const MAX_ENTRIES_TO_KEEP = 20;
const DATA_FILE = 'cpu_utilization_intervals.json';

let cpuUsageData = [];

// Function to write CPU utilization intervals to a file
function writeCpuUtilizationToFile() {
  const dataToWrite = JSON.stringify(cpuUsageData);

  fs.writeFile(DATA_FILE, dataToWrite, { flag: 'w' }, (err) => {
    if (err) {
      console.error('Error writing CPU utilization data:', err);
    } else {
      console.log('CPU utilization data written to file.');
    }
  });
}

// Function to read CPU utilization intervals from file (if exists)
function readCpuUtilizationFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      cpuUsageData = JSON.parse(data);
      console.log('CPU utilization data loaded from file.');
      return cpuUsageData
    }
  } catch (err) {
    console.error('Error reading CPU utilization data:', err);
  }
}

// Function to capture CPU utilization at intervals
function captureCpuUsage() {
  osUtils.cpuUsage((currentCpuUsage) => {
    cpuUsageData.push({ timestamp: Date.now(), utilization: parseFloat((currentCpuUsage * 100).toFixed(2)) }); // Convert to percentage

    // Write to file periodically or conditionally
    if (cpuUsageData.length > MAX_ENTRIES_TO_KEEP) {
      cpuUsageData.shift(); // Remove oldest entry if exceeds max limit
    }

    writeCpuUtilizationToFile();
  });
}

// Function to clean up old data periodically
function cleanUpOldData() {
  const currentTime = Date.now();
  cpuUsageData = cpuUsageData.filter((entry) => currentTime - entry.timestamp <= DATA_RETENTION_PERIOD);

  writeCpuUtilizationToFile();
}



function getCpuUtilizationIntervals() {
  // Initial setup
setInterval(captureCpuUsage, INTERVAL_DURATION);
setInterval(cleanUpOldData, 60 * 60 * 1000); // Check every hour for old data
return readCpuUtilizationFromFile() || [];

}

// Export functions or data if needed
export { getCpuUtilizationIntervals, captureCpuUsage };
