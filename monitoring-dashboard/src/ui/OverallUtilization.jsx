import { useEffect, useState, useContext } from "react";
import UtilizationCard from "../components/UtilizationCard";
import { SummaryMetricsContext } from "../lib/SummaryMetricsContext";

export default function OverallUtilization() {
  const utilization = useContext(SummaryMetricsContext);
  const [connectedNodes, setConnectedNodes] = useState(null);

  useEffect(() => {
    // Fetch connected nodes data from the backend
    const fetchConnectedNodes = async () => {
      try {
        const response = await fetch("/connected-nodes");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setConnectedNodes(data.connected_nodes);
      } catch (error) {
        console.error("Error fetching connected nodes:", error);
      }
    };

    fetchConnectedNodes();
  }, []);

  // Add connected nodes to utilization data
  const updatedUtilization = [
    ...utilization,
    {
      name: "Connected Nodes",
      value: connectedNodes !== null ? connectedNodes : 0,
    },
  ];

  return (
    <div className="flex flex-wrap lg:flex-nowrap lg:flex-row gap-2 text-sm">
      {updatedUtilization.map(({ name, value }) => (
        <UtilizationCard key={name} name={name} value={value} />
      ))}
    </div>
  );
}
