import os
import time
import logging
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from flask import Flask, jsonify
from flask_cors import CORS 

# Directory to monitor and log file
DIRECTORY_TO_MONITOR = "C:\\monitor"
LOG_FILE = os.path.join(DIRECTORY_TO_MONITOR, "file_operations.log")

if not os.path.exists(DIRECTORY_TO_MONITOR):
    os.makedirs(DIRECTORY_TO_MONITOR)

# Watchdog event handler
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
        log_entry = {
            "operation": operation,
            "file": event.src_path,
            "start_time": start_time,
            "status": "In Progress"
        }

        with open(LOG_FILE, 'a') as log_file:
            log_file.write(json.dumps(log_entry) + "\n")

        time.sleep(1)  # Simulate some operation duration
        end_time = time.time()
        log_entry["duration"] = end_time - start_time
        log_entry["end_time"] = end_time
        log_entry["status"] = "Completed"

        with open(LOG_FILE, 'a') as log_file:
            log_file.write(json.dumps(log_entry) + "\n")

# Flask app to serve log data
app = Flask(__name__)
CORS(app)

@app.route('/logs', methods=['GET'])
def get_logs():
    try:
        with open(LOG_FILE, 'r') as log_file:
            logs = []
            for line in log_file:
                try:
                    log_entry = json.loads(line.strip())
                    logs.append(log_entry)
                except json.JSONDecodeError:
                    print(f"Skipping invalid JSON line: {line}")
                    continue
        return jsonify(logs)
    except FileNotFoundError:
        return jsonify({"error": f"Log file not found at {LOG_FILE}"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    logging.basicConfig(filename=LOG_FILE, level=logging.INFO, format='%(asctime)s - %(message)s')

    event_handler = FileOperationEventHandler()
    observer = Observer()
    observer.schedule(event_handler, DIRECTORY_TO_MONITOR, recursive=True)
    observer.start()

    # Start Flask server with debug mode enabled
    app.run(port=5000, debug=True)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()