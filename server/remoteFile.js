const axios = require("axios");

async function testRemoteEndpoints() {
  try {
    const computingDetails = await axios.get(
      " https://87f3-41-242-58-34.ngrok-free.app/computing-details"
    );
    console.log("Computing Details:", computingDetails.data);
  } catch (error) {
    console.error("Error fetching computing details:", error);
  }

  try {
    const systemInfo = await axios.get(
      " https://87f3-41-242-58-34.ngrok-free.app/system-info"
    );
    console.log("System Info:", systemInfo.data);
  } catch (error) {
    console.error("Error fetching system info:", error);
  }
}

testRemoteEndpoints();
