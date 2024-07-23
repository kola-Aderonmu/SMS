/* eslint-disable react/prop-types */
import { Progress } from "@material-tailwind/react";

export function ProgressBar({ label, value, percentage }) {
  return (
    <div className=" w-70 h-auto p-0.4 rounded ml-3">
      <div className="flex justify-between items-center gap-1  text-xs ">
        <h6 className="text-sm">{label}</h6>
        <p className="font-sans">{value.toFixed(2)} GB</p>
      </div>
      <Progress
        value={Math.round(percentage, 2)}
        label={Math.round(percentage, 2)}
        className=" bg-blue-900/80 p-0.5"
      />
    </div>
  );
}
