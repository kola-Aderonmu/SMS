/* eslint-disable react/prop-types */
import { Progress } from "@material-tailwind/react";

export function ProgressBar({ label, value, percentage }) {
  return (
    <div className=" w-99 ml-3 h-auto">
      <div className="flex justify-between items-center gap-1 px-2 text-xs ">
        <h4 className="text-sm font-black">{label}</h4>
        <p className="font-bold">{value.toFixed(2)} GB</p>
      </div>
      <Progress
        value={Math.round(percentage, 2)}
        label={Math.round(percentage, 2)}
        className=" bg-blue-400/50 p-1"
      />
    </div>
  );
}
