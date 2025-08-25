import { Tooltip } from "antd";
import { formatCurrency } from "../../../Utils/Reusables";

const NewFundedBar = ({ tranchInfo }) => {
  const formatNumber = (num) => {
    const value = Number(num) || 0;
    return Number.isInteger(value) ? value : Number(value?.toFixed(2));
  };

  const funded = formatNumber(tranchInfo?.fundedPercentage?.toFixed(2)) || 0;
  const reserved =
    formatNumber(tranchInfo?.reservedPercentage?.toFixed(2)) || 0;
  const available = formatNumber(100 - (funded + reserved));

  return (
    <div style={{ textAlign: "center", width: "100%" }} className="mt-12">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "14px",
          fontWeight: "bold",
        }}
        className="mb-5"
      >
        <span className="tranche-id">{funded}% Subscribed</span>
        <span className="tranche-id">{available}% Available</span>
      </div>

      <div
        style={{
          position: "relative",
          height: "8px",
          borderRadius: "10px",
          background: "#E0E0E0",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Tooltip
          title={`${formatCurrency(
            tranchInfo?.currencySymbol,
            tranchInfo?.principalSubscribed + tranchInfo?.principalSettled
          )} Subscribed`}
        >
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
        <Tooltip
          title={`${formatCurrency(
            tranchInfo?.currencySymbol,
            tranchInfo?.principalReserved
          )} Reserved`}
        >
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
        <Tooltip
          title={`${formatCurrency(
            tranchInfo?.currencySymbol,
            tranchInfo?.principalAvailable
          )} Available`}
        >
          <div
            style={{
              width: `${available}%`,
              background: "#E5ECF6",
              height: "100%",
              position: "absolute",
              left: `${funded + reserved}%`,
            }}
          ></div>
        </Tooltip>
      </div>
    </div>
  );
};

export default NewFundedBar;
