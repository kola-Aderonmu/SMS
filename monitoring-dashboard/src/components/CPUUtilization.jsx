import  { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CPUUtilization = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/usage/cpu');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        style={{ background: '#1a1a1a' }} // Dark background color
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#3d3d3d" />
        <XAxis dataKey="time" stroke="#ffffff" />
        <YAxis domain={[0, 100]} stroke="#ffffff" /> {/* White Y-axis labels */}
        <Tooltip
          contentStyle={{ background: '#333333', border: 'none', color: '#ffffff' }} // Dark tooltip background with white text
          cursor={{ stroke: '#ffffff', strokeWidth: 1 }} // White cursor line
        />
        <Area
          type="monotone"
          dataKey="utilization"
          stroke="#82ca9d" // Greenish stroke color
          fill="#82ca9d" // Greenish fill color
          dot={{ strokeWidth: 2, fill: '#82ca9d', r: 4 }} // Greenish dots
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CPUUtilization;
