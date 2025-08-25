import { Tooltip } from "antd";
import React from "react";

const FundedBar = ({ tranchInfo }) => {
  const formatNumber = (num) => {
    const value = Number(num) || 0;
    return Number.isInteger(value) ? value : Number(value?.toFixed(2));
  };

  const funded = formatNumber(tranchInfo?.fundedPercentage?.toFixed(2)) || 0;
  const reserved =
    formatNumber(tranchInfo?.reservedPercentage?.toFixed(2)) || 0;
  const available = formatNumber(100 - (funded + reserved));

  return (
    <div style={{ textAlign: "center", width: "100%" }} className="mt-16">
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          fontSize: "14px",
          fontWeight: "bold",
        }}
        className="mb-16"
      >
        <span className="tranche-id">{available}% Available</span>
      </div>

      <div
        style={{
          position: "relative",
          height: "14px",
          borderRadius: "10px",
          background: "#E0E0E0",
          overflow: "hidden",
          width: "100%",
        }}
        className="mb-8 mt-8"
      >
        <Tooltip title={`${funded}% Subscribed`}>
          <div
            style={{
              width: `${funded}%`,
              background: "#B1E3FF    ",
              height: "100%",
              position: "absolute",
              left: "0%",
            }}
          ></div>
        </Tooltip>
        <Tooltip title={`${reserved}% Reserved`}>
          <div
            style={{
              width: `${reserved}%`,
              background: "#FFCB83",
              height: "100%",
              position: "absolute",
              left: `${funded}%`,
            }}
          ></div>
        </Tooltip>
        <div
          style={{
            width: `${available}%`,
            background: "#E5ECF6",
            height: "100%",
            position: "absolute",
            left: `${funded + reserved}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FundedBar;
