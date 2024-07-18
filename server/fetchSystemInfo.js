const axios = require("axios");

async function fetchSystemInfo() {
  try {
    const response = await axios.get(
      "https://9597-41-242-58-34.ngrok-free.app/system-info"
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching system info:", error);
  }
}

fetchSystemInfo();
