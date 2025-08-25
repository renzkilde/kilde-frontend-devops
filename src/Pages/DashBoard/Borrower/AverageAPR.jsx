import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const Charts = () => {
  const [chartWidth, setChartWidth] = useState(300);
  const [chartHeight, setChartHeight] = useState(300);

  const data = [
    {
      name: "Jan",
      uv: 0,
      pv: 50,
      cv: 10,
    },
    {
      name: "Feb",
      uv: 30,
      pv: 55,
      cv: 12,
    },
    {
      name: "Mar",
      uv: 40,
      pv: 150,
      cv: 110,
    },
    {
      name: "Apr",
      uv: 200,
      pv: 130,
      cv: 90,
    },
    {
      name: "May",
      uv: 180,
      pv: 120,
      cv: 80,
    },
    {
      name: "Jun",
      uv: 140,
      pv: 120,
      cv: 80,
    },
    {
      name: "Jul",
      uv: 250,
      pv: 200,
      cv: 100,
    },
  ];

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("chart-container");
      if (container) {
        const containerWidth = container.offsetWidth;
        setChartWidth(containerWidth);
        setChartHeight(300);
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);
  return (
    <>
      <p className="mt-0 tranch-head">Bar chart</p>
      <div id="chart-container" className="chart-container">
        <LineChart width={chartWidth} height={chartHeight} data={data}>
          <CartesianGrid horizontal={true} vertical={false} axisLine={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            ticks={[0, 50, 100, 150, 200, 250, 300]}
          />
          <Tooltip />
          <Legend />
          <Line
            type="step"
            dataKey="pv"
            strokeWidth={3}
            stroke="#95A4FC"
            dot={{ stroke: "#95A4FC", strokeWidth: 6, r: 1 }}
          />
          <Line
            type="step"
            dataKey="uv"
            strokeWidth={3}
            stroke="#A1E3CB"
            dot={{ stroke: "#A1E3CB", strokeWidth: 6, r: 1 }}
          />
          <Line
            type="step"
            dataKey="cv"
            strokeWidth={3}
            stroke="#FF4747"
            dot={{ stroke: "#FF4747", strokeWidth: 6, r: 1 }}
          />
        </LineChart>
      </div>
    </>
  );
};

export default Charts;
