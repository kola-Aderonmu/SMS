#Create the Flask API for Serving Log Data

from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
import os
import json

app = Flask(__name__)
socketio = SocketIO(app)

LOG_FILE = "C:\\monitor\\file_operations.log"

@app.route('/file-operations', methods=['GET'])
def file_operations():
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r') as log_file:
            log_data = log_file.readlines()
            log_entries = [json.loads(line.strip()) for line in log_data]
        return jsonify(log_entries), 200
    else:
        return jsonify({"error": "Log file not found"}), 404

def read_log_file():
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r') as log_file:
            log_data = log_file.readlines()
            log_entries = [json.loads(line.strip()) for line in log_data]
            return log_entries
    return []

@socketio.on('connect')
def handle_connect():
    emit('update', read_log_file())

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)

