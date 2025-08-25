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

const Charts = ({ TrancheRes }) => {
  const [chartWidth, setChartWidth] = useState(300);
  const [chartHeight, setChartHeight] = useState(300);
  const repaymentRate = TrancheRes?.tranche?.details?.repaymentRate;

  const vintageNumbers =
    repaymentRate?.length > 0 &&
    Object.keys(repaymentRate[0]).filter((key) => key !== "Vintage");

  const data =
    vintageNumbers?.length > 0 &&
    vintageNumbers.map((number) => {
      const obj = {
        name: number,
        vintage0: parseInt(repaymentRate[0][number]),
        vintage1: parseInt(repaymentRate[1][number]),
        vintage2: parseInt(repaymentRate[2][number]),
        vintage3: parseInt(repaymentRate[3][number]),
      };
      return obj;
    });

  const xAxisTicks = ["0"];
  for (let i = 20; i <= 140; i += 20) {
    xAxisTicks.push(i.toString());
  }

  const yAxisTicks = [];
  for (let i = 0; i <= 100; i += 50) {
    yAxisTicks.push(i.toString());
  }

  const vintage0Object = {
    name: "0",
    vintage0: 0,
    vintage1: 0,
    vintage2: 0,
    vintage3: 0,
  };

  data?.length > 0 && data?.unshift(vintage0Object);

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("repayment-chart-container");
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
    <div className="infomation-div">
      <p className="mt-0 tranch-head">Repayment Rate (Monthly Cohorts)</p>
      <div id="repayment-chart-container" className="chart-container">
        <LineChart width={chartWidth} height={chartHeight} data={data}>
          <CartesianGrid horizontal={true} vertical={false} axisLine={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            ticks={[0, 50, 100, 150, 200]}
          />
          <Tooltip />
          <Legend />
          <Line
            dataKey="vintage0"
            strokeWidth={3}
            stroke="#95A4FC"
            dot={{ stroke: "#95A4FC", strokeWidth: 6, r: 0 }}
          />
          <Line
            dataKey="vintage1"
            strokeWidth={3}
            stroke="#A1E3CB"
            dot={{ stroke: "#A1E3CB", strokeWidth: 6, r: 0 }}
          />
          <Line
            dataKey="vintage2"
            strokeWidth={3}
            stroke="#FF4747"
            dot={{ stroke: "#FF4747", strokeWidth: 6, r: 0 }}
          />
          <Line
            dataKey="vintage3"
            strokeWidth={3}
            stroke="yellow"
            dot={{ stroke: "#FF4747", strokeWidth: 6, r: 0 }}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default Charts;
