import { FaComputer } from "react-icons/fa6";
import { IoIosSpeedometer } from "react-icons/io";
import { BsFillDiagram3Fill } from "react-icons/bs";
import { MdOutlineStorage } from "react-icons/md";

// Define a mapping for icons based on card type
const iconMap = {
  RAM: <BsFillDiagram3Fill className="text-white" />,
  Disk: <MdOutlineStorage className="text-white" />,
  CPU: <IoIosSpeedometer className="text-white" />,
  "Connected Nodes": <FaComputer className="text-white" />, // Changed this line
};

export default function UtilizationCard({ value, name }) {
  return (
    <div className="bg-blue-900 w-full h-[180px] sm:w-[250px] sm:h-[150px] border-2 border-gray-400 rounded-md shadow-6xl transition-transform duration-500 ease-in-out transform hover:scale-95">
      <div className="flex justify-between items-center bg-black/50 text-white p-3">
        <div className="text-xs">
          <span className="font-bold text-sm italic pr-1">{name}</span> -
          {name === "Connected Nodes" ? " Online " : " Now"}
        </div>
        <p>{iconMap[name] || <GiSpanner className="text-white" />}</p>
      </div>
      <div className="flex items-center pt-12 sm:pt-7 justify-center">
        <h1 className="text-3xl xl:text-2xl text-white font-extrabold">
          {name === "Connected Nodes" ? value : value.toFixed(2)}
          {name !== "Connected Nodes" && <span className="text-sm"> %</span>}
        </h1>
      </div>
    </div>
  );
}
