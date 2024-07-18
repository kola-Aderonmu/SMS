/* eslint-disable react/prop-types */ import { GiSpanner } from "react-icons/gi";
export default function UtilizationCard({ value, name }) {
  return (
    <div className="bg-green-900 w-full h-[180px] sm:w-[250px]  sm:h-[150px] border-2 border-gray-900 rounded-md shadow-6xl transition-transform duration-500 ease-in-out transform hover:scale-95">
      <div className="flex justify-between items-center bg-black/50 text-gray-100 p-3">
        <div className="text-xs">
          <span className="font-bold text-sm italic pr-1">{name}</span> - Now
        </div>
        <p>
          <GiSpanner className="text-white" />
        </p>
      </div>
      <div className="flex items-center pt-12 sm:pt-7 justify-center">
        <h1 className="text-3xl xl:text-2xl text-blue-200/80 font-extrabold">
          {value.toFixed(2)} %
        </h1>
      </div>
    </div>
  );
}
