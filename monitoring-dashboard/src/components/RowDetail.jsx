/* eslint-disable react/prop-types */
export function RowDetail({label, value, measurement, className}) {
    return <div className="flex justify-between gap-3 w-[250px]">
      <p className="text-sm font-bold">{label}:</p>
      <p className={`text-xs font-light pl-1 ${className}`}>{value}{measurement}</p>
    </div>  
    }