/* eslint-disable react/prop-types */
export default function UtilizationCard({value, name}) {
    return <div className="relative overflow-hidden bg-gray-900 w-[150px] border-2 border-gray-900 p-3 py-2 rounded-md shadow-xl">
        <div className="text-gray-50">
            <h1 className="text-xl text-gray-200 opacity-80">{value.toFixed(2)} %</h1>
            <p className="font-xs capitalize font-medium">{name}</p>
        </div>
        <div className="absolute top-2 -right-2 opacity-50">
            <img src="/ram.jpg" className="inline-block w-14 h-14" />
        </div>
    </div>
}