#Create the Python Script for Monitoring File Operations

import os
import time
import logging
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Directory to monitor
DIRECTORY_TO_MONITOR = "C:\\monitor" 
LOG_FILE = os.path.join(DIRECTORY_TO_MONITOR, "file_operations.log")

# Create the directory if it doesn't exist
if not os.path.exists(DIRECTORY_TO_MONITOR):
    os.makedirs(DIRECTORY_TO_MONITOR)
    print(f"Created directory successfully!: {DIRECTORY_TO_MONITOR}")

# Create the log file if it doesn't exist
if not os.path.exists(LOG_FILE):
    with open(LOG_FILE, 'w') as log_file:
        pass  # Just create the empty file
    print(f"Created log file successfully!: {LOG_FILE}")
else:
    print(f"Log file already exists!: {LOG_FILE}")

class FileOperationEventHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        operation = "Unknown"
        if event.event_type == 'created':
            operation = "Created"
        elif event.event_type == 'modified':
            operation = "Modified"
        elif event.event_type == 'moved':
            operation = "Moved"
        elif event.event_type == 'deleted':
            operation = "Deleted"

        self.log_event(event, operation)

    def log_event(self, event, operation):
        start_time = time.time()
        end_time = None  # Will update upon completion
        duration = 0  # Initial duration is 0, will update upon completion
        status = "In Progress"

        log_entry = {
            "operation": operation,
            "file": event.src_path,
            "start_time": start_time,
            "duration": duration,
            "end_time": end_time,
            "status": status
        }

        with open(LOG_FILE, 'a') as log_file:
            log_file.write(json.dumps(log_entry) + "\n")

        print(f"Logged: {log_entry}")  # Print to console for debugging

        # Simulate some operation duration
        time.sleep(1)  # Simulate duration
        end_time = time.time()
        duration = end_time - start_time
        log_entry["duration"] = duration
        log_entry["end_time"] = end_time
        log_entry["status"] = "Completed"

        with open(LOG_FILE, 'a') as log_file:
            log_file.write(json.dumps(log_entry) + "\n")

        print(f"Updated log: {log_entry}")  # Print to console for debugging

if __name__ == "__main__":
    logging.basicConfig(filename=LOG_FILE, level=logging.INFO, format='%(asctime)s - %(message)s')
    
    event_handler = FileOperationEventHandler()
    observer = Observer()
    observer.schedule(event_handler, DIRECTORY_TO_MONITOR, recursive=True)
    observer.start()
    print("Monitoring started. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("Monitoring stopped.")
    observer.join()

