import { Skeleton } from "antd";

const RedemptionSkeleton = () => {
  return (
    <div className="mt-16">
      {/* Redemption principal */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <Skeleton.Input style={{ width: 150 }} active size="small" />
        <Skeleton.Input style={{ width: 50 }} active size="small" />
      </div>

      {/* Fees */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <Skeleton.Input style={{ width: 80 }} active size="small" />
        <Skeleton.Input style={{ width: 30 }} active size="small" />
      </div>

      {/* Redemption date */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Skeleton.Input style={{ width: 120 }} active size="small" />
        <Skeleton.Input style={{ width: 90 }} active size="small" />
      </div>

      {/* Submit button */}
      <Skeleton.Button
        active
        block
        style={{
          height: "40px",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default RedemptionSkeleton;
