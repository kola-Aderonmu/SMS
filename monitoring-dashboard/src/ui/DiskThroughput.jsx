/* eslint-disable react/prop-types */
import {   useEffect, useState } from "react";
import { baseUrl } from "../lib/utils";
import axios from "axios";
import DiskPieChart from "../components/DiskPieChart";
import { RowDetail } from "../components/RowDetail";


export default function DiskThroughput() {
  const [disk, setDisk] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseUrl+'/usage/disk');
        const newData = response.data;

        // Assuming response.data is an array of objects
        // Append new data and remove the oldest data to create a scrolling effect
        setDisk(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000*60*60*2) //refetch every 2 hour;

    return () => clearInterval(interval);
  }, []);

  if(!disk) {
    return;
  }

  const {
    type,
    name,
    bytesPerSector,
    totalCylinders,
    totalHeads,
    totalSectors,
    totalTracks,
    tracksPerCylinder,
    sectorsPerTrack,
    firmwareRevision,
    smartStatus,
    temperature,
    use,
    mount,
    rw,
    used,
    available,
    size,
    diskUsage
  } = disk;

  

 
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-3 gap-2">
          <h1 className="text-white/80">Disk</h1>
          <p className="text-xs font-light">
            {name}
          </p>
      </div>
      <div className="flex justify-between px-3 text-sm text-gray-400 font-bold pt-2">
          <p>use</p>
          <p>{use}%</p>
      </div>
      {/* CPU Utilization details */}
      <div className="flex flex-col">
      <DiskPieChart data={diskUsage} />
      <div className="flex flex-row justify-start gap-20  p-3">
        <div className="gap-2 flex flex-col">
        
        <RowDetail label={"Type"} value={type} />
        <RowDetail label={"Size"} value={size.toFixed(2)} measurement="GB" /> 
        <RowDetail label={"Used"} value={available.toFixed(2)} measurement="GB" />    
        <RowDetail label={"Available"} value={used.toFixed(2)} measurement="GB" />
        <RowDetail label={"Total Sector"} value={totalSectors} />
        <RowDetail label={"Total Track"} value={totalTracks} />
        <RowDetail label={"Byte per Sector"} value={bytesPerSector} />
        <RowDetail label={"Total Cylinders"} value={totalCylinders} />
        </div>
        <div className="flex flex-col gap-2">
        <RowDetail label={"Total Heads"} value={totalHeads} />
        <RowDetail label={"Tracks per cylinder"} value={tracksPerCylinder} />
        <RowDetail label={"Sectors per Track"} value={sectorsPerTrack} />
        <RowDetail label={"Firmware"} value={firmwareRevision} />
        <RowDetail label={"RW"} value={rw? "true": "false"}  />
        <RowDetail label={"Status"} value={smartStatus}  />
        <RowDetail label={"Temperature"} value={temperature}  />
        <RowDetail label={"Mount"} value={mount}  />
  
        </div>
      </div>
      </div>
          
      </div>
   
  )
}
