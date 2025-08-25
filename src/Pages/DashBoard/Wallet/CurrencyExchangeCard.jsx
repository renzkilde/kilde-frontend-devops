import React from "react";
import { Col, Row } from "antd";
import CalendarBlank from "../../../Assets/Images/Icons/Dashboard/CalendarBlank.svg";
import { britishFormatDate } from "../../../Utils/Helpers";
import { formatCurrency } from "../../../Utils/Reusables";

const CurrencyExchangeCard = ({ request, index }) => {
  return (
    <Col xs={24} className="withdraw-card mt-8">
      <Row>
        <Col xs={12} lg={12} className="withraw-card-first-col mb-12">
          <div>
            <div className="m-0 withdraw-card-heading-data">
              <img src={CalendarBlank} alt="CalendarBlank" />{" "}
              {britishFormatDate(request.requestDate)}
            </div>
          </div>
        </Col>
        <Col xs={12} lg={12} className="withraw-card-sec-col mb-12">
          <div className="withdraw-status-card-div sb-text-align-end">
            <span className="progress-circle-span"></span>
            <p className="progress-p m-0">In Progress</p>
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
          <p className="mb-4 mt-0 card-info-tag">Currency From</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-4 mt-0 withdraw-card-tag">{request.currencyFrom}</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-4 mt-0 card-info-tag">Currency To</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-4 mt-0 withdraw-card-tag">{request.currencyTo}</p>
        </Col>
      </Row>
    </Col>
  );
};

export default CurrencyExchangeCard;
