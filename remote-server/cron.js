import fs from "fs";

// Function to read cron job logs
export function readCronJobLogs() {
  try {
    const logFile = "cronjob.log";
    if (fs.existsSync(logFile)) {
      const logs = fs.readFileSync(logFile, "utf8").split("\n");
      // Process logs
      return logs;
    } else {
      console.log("Cron job log file does not exist.");
      return [];
    }
  } catch (error) {
    console.error("Error reading cron job logs:", error);
    return [];
  }
}

// Function to read cron job logs
export function fetchCronJobs() {
  try {
    const logFile = "cronjob.log";
    if (fs.existsSync(logFile)) {
      const logs = fs.readFileSync(logFile, "utf8").split("\n");
      const cronJobs = [];
      logs.forEach((log) => {
        if (log.trim() !== "") {
          const [name, startTime, endTime] = log.split(",");
          const duration = (new Date(endTime) - new Date(startTime)) / 1000; // Duration in seconds
          const status = index % 2 === 0 ? 200 : 500;
          cronJobs.push({
            name: name,
            startTime: startTime,
            endTime: endTime,
            duration: duration,
            status: status,
          });
        }
      });
      return cronJobs;
    } else {
      console.log("Cron job log file does not exist.");
      return [];
    }
  } catch (error) {
    console.error("Error reading cron job logs:", error);
    return [];
  }
}
