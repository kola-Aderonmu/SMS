/* eslint-disable react/prop-types */
import { Progress } from "@material-tailwind/react";

export function ProgressBar({ label, value, percentage }) {
  return (
    <div className="leading-0 -m-1">
      <div className="flex justify-between items-center gap-1 px-3 -m-2 text-xs">
        <h4 className="text-sm">{label}</h4>
        <p className="font-bold">{value.toFixed(2)} GB</p>
      </div>
      <Progress value={Math.round(percentage, 2)} />
    </div>
  );
}
