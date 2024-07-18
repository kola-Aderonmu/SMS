import { useContext } from "react";
import UtilizationCard from "../components/UtilizationCard";

import { SummaryMetricsContext } from "../lib/SummaryMetricsContext";


export default function OverallUtilization() {
    const utilization = useContext(SummaryMetricsContext);

  return (
    <div className="flex flex-wrap lg:flex-nowrap lg:flex-row  gap-2">
          {utilization.map(({ name, value }) => {
            return <UtilizationCard key={name} name={name} value={value} />;
          })}
        </div>
  )
}
