import React from "react";
import { Card, Skeleton, Row, Col } from "antd";

const SkeletonCard = () => {
  return (
    <Card className="deal-card p-0" bordered>
      <Skeleton.Image
        style={{ width: "100%", height: 200, padding: 0 }}
        active
      />
      <Row
        justify="space-between"
        style={{ margin: "10px 0", padding: "0 24px" }}
      >
        <Skeleton.Input active style={{ width: "30%", height: 10 }} />
        <Skeleton.Input active style={{ width: "30%", height: 10 }} />
        <Skeleton.Input
          className="mt-8"
          active
          style={{ width: "100%", height: 8, borderRadius: 4 }}
        />
      </Row>
      <div className="skeleton-details" style={{ padding: "0 24px" }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton.Input
            key={index}
            active
            style={{ width: "90%", height: 14, marginTop: 10 }}
          />
        ))}
      </div>
      <Row gutter={10} style={{ marginTop: 15, padding: "0 24px" }}>
        <Col>
          <Skeleton.Button
            active
            size="small"
            style={{ width: 100, height: 24 }}
          />
        </Col>
        <Col style={{ padding: "0 24px" }}>
          <Skeleton.Button
            active
            size="small"
            style={{ width: 120, height: 24 }}
          />
        </Col>
      </Row>

      <Col style={{ paddingLeft: "24px", paddingRight: "24px" }}>
        <Skeleton.Button
          active
          block
          style={{
            height: 40,
            marginTop: 15,
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        />
      </Col>
    </Card>
  );
};

export default SkeletonCard;
