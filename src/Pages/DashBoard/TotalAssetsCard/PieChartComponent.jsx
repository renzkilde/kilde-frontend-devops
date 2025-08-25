import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Label } from "recharts";
import "./style.css";
import { formatCurrency } from "../../../Utils/Reusables";

const PieChartComponent = ({
  displayData,
  allValuesZero,
  COLORS,
  GRAY_COLOR,
  dashboardData,
}) => {
  const groupColorMapping = {
    "Group A": "#FFCB83",
    "Group B": "#A1E3CB",
    "Group C": "#B1E3FF",
  };

  const getChartSize = () => {
    if (window.innerWidth <= 1024) {
      return { width: 120, height: 125, innerRadius: 50, outerRadius: 60 };
    } else if (window.innerWidth <= 1345) {
      return { width: 110, height: 110, innerRadius: 40, outerRadius: 50 };
    } else {
      return { width: 120, height: 125, innerRadius: 50, outerRadius: 60 };
    }
  };

  const { width, height, innerRadius, outerRadius } = getChartSize();

  return (
    <div className="pie-chart-wrapper">
      <PieChart width={width} height={height} className="pie-chart">
        <Pie
          data={displayData}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#F8F7F2"
          paddingAngle={3}
          dataKey="value"
          cornerRadius={100}
        >
          {displayData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                allValuesZero
                  ? GRAY_COLOR
                  : groupColorMapping[entry.name] ||
                    COLORS[index % COLORS.length]
              }
            />
          ))}
        </Pie>
        <Pie
          data={displayData}
          dataKey="value"
          innerRadius={0}
          outerRadius={45}
          isAnimationActive={false}
        >
          {displayData.map((entry, index) => (
            <Cell key={`inner-cell-${index}`} fill="#F8F7F2" stroke="#F8F7F2" />
          ))}
          <Label
            position="center"
            fill="#111"
            style={{
              fontSize: "12px",
              fontWeight: "600",
              fontFamily: "Inter Tight",
              lineHeight: "18px",
              color: "#000",
            }}
          >
            {formatCurrency(
              dashboardData?.investorSummary?.currencySymbol,
              dashboardData?.investorSummary?.totalAssets
            )}
          </Label>
        </Pie>
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
