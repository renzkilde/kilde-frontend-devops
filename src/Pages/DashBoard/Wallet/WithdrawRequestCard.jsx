import React from "react";
import { Col, Row, Tooltip } from "antd";
import CalendarBlank from "../../../Assets/Images/Icons/Dashboard/CalendarBlank.svg";
import { britishFormatDate } from "../../../Utils/Helpers";
import { formatCurrency } from "../../../Utils/Reusables";
import { walletWithdrawRequestListTooltipContent } from "../TooltopContent";
import InfoIcon from "../../../Assets/Images/SVGs/Info.svg";

const WithdrawRequestCard = ({ request, index }) => {
  return (
    <Col xs={24} className="withdraw-card mt-8">
      <Row>
        <Col xs={12} lg={12} className="withraw-card-first-col mb-12">
          <div className="m-0 withdraw-card-heading-data">
            <img src={CalendarBlank} alt="CalendarBlank" />{" "}
            {britishFormatDate(request.requestDate)}
          </div>
        </Col>
        <Col xs={12} lg={12} className="withraw-card-sec-col mb-12">
          <div className="withdraw-status-card-div sb-text-align-end">
            {request.status === "PENDING" ? (
              <div className="withdraw-status-div">
                <span className="progress-circle-span"></span>
                <p className="progress-p m-0">Pending</p>
              </div>
            ) : request.status === "SETTLED" ? (
              <div className="withdraw-status-div">
                <span className="settled-circle-span"></span>
                <p className="settled-p m-0">Processed</p>
              </div>
            ) : request.status === "EXPORTED" ? (
              <div className="withdraw-status-div">
                <span className="progress-circle-span"></span>
                <p className="progress-p m-0">Processing</p>
              </div>
            ) : request.status === "FAILED" ? (
              <div className="withdraw-status-div">
                <span className="failed-circle-span"></span>
                <p className="failed-p m-0">Failed</p>
              </div>
            ) : request.status === "ON_HOLD" ? (
              <div className="withdraw-status-div">
                <span className="progress-circle-span"></span>
                <p className="progress-p m-0">Under Review</p>
              </div>
            ) : request.status === "SENT" ? (
              <div className="withdraw-status-div">
                <span className="progress-circle-span"></span>
                <p className="progress-p m-0">Processing</p>
              </div>
            ) : (
              <div className="withdraw-status-div">
                <span className="failed-circle-span"></span>
                <p className="failed-p m-0">Cancelled</p>
              </div>
            )}
          </div>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-4 mt-0 card-info-tag">Amount</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-4 mt-0 withdraw-card-tag">
            {formatCurrency("", request?.amount)}
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-4 mt-0 card-info-tag">Currency</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-4 mt-0 withdraw-card-tag">{request.currencyCode}</p>
        </Col>
      </Row>
    </Col>
  );
};

export default WithdrawRequestCard;
