import { Tooltip } from "antd";
import { txStatusMap } from "./TransactionStatus";

const TxStatus = ({ txTitle, txType }) => {
  let status = txStatusMap[txTitle];
  if (!status) {
    const found = Object.entries(txStatusMap).find(
      ([k, value]) => value.type === "txType" && txType === k
    );
    if (found) status = found[1];
  }

  if (!status) return null;

  return (
    <div className={`acc-status-div ${status.className}`}>
      <img src={status.icon} alt={status.label} />
      {status.label.length > 21 ? (
        <Tooltip title={status.label}>
          <p>{status.label.slice(0, 21) + "..."}</p>
        </Tooltip>
      ) : (
        <p>{status.label}</p>
      )}
    </div>
  );
};

export default TxStatus;
