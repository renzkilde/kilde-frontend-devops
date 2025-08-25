import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "antd";

import Close from "../../../Assets/Images/Icons/Dashboard/close_icon.svg";

import "./style.css";
import { britishFormatDate } from "../../../Utils/Helpers";
import { formatCurrency, useWindowWidth } from "../../../Utils/Reusables";
import Identify_tickmark from "../../../Assets/Images/identify_tickmark.svg";

const ReservedInvestmentCard = ({
  item,
  setCancelReservedInvestId,
  setApprovedReservedModal,
  setCancelReservedModal,
}) => {
  const windowWidth = useWindowWidth();

  const handleOpenModal = (investId) => {
    setCancelReservedInvestId(investId);
    setCancelReservedModal(true);
  };

  const handleOpenApprovedModal = (investId) => {
    setCancelReservedInvestId(investId);
    setApprovedReservedModal(true);
  };

  return (
    <Col xs={24} sm={24} md={12} className="dashboard-invest-card mt-8">
      <div className="dashboard-invest-card-topDiv">
        <div>
          <p className="m-0 dashborad-inv-text">{item?.trancheNumber}</p>
          <h3 className="m-0 card-val-tag">{item?.trancheTitle}</h3>
        </div>
        <div className="dashboard-invest-btn-div">
          <Button
            className="dashboard-invest-cancel-button-icon"
            onClick={() => handleOpenModal(item?.uuid)}
          >
            {windowWidth <= 576 ? null : (
              <span className="dashboard-invest-cancel-title">Cancel</span>
            )}
            <img src={Close} alt="close_icon" />
          </Button>

          <Button
            className="dashboard-invest-view-button-icon"
            onClick={() => handleOpenApprovedModal(item?.uuid)}
          >
            {windowWidth <= 576 ? null : (
              <span className="dashboard-invest-view-title">Approved</span>
            )}
            <img
              src={Identify_tickmark}
              alt="right_arrow"
              style={{ width: "14px" }}
            />
          </Button>
        </div>
      </div>
      <Row className="dashboard-invest-card-bottomDiv">
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 card-info-tag">Kilde Rating</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 dashboard-card-val-tag">
            {item?.creditRating}
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 card-info-tag">Principal Reseved</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 dashboard-card-val-tag">
            {formatCurrency(item?.currencySymbol, item?.principalReserved)}
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 card-info-tag">Interest Rate</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 dashboard-card-val-tag">
            {formatCurrency("", item?.interestRate)}%
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 card-info-tag">Maturity Date</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 dashboard-card-val-tag">
            {britishFormatDate(item?.maturityDate)}
          </p>
        </Col>
        <Row className="w-100">
          <Col xs={12} lg={12}>
            <p className="mb-5 mt-0 card-info-tag">Next Payment</p>
          </Col>
          <Col xs={12} lg={12}>
            <div className="mb-8 mt-0 dashboard-card-val-tag">
              <div>
                <p className="dashborad-inv-text">
                  {item?.nextPaymentDateOfSubscribed === null
                    ? "-"
                    : britishFormatDate(item?.nextPaymentDateOfSubscribed)}
                </p>
                <p className="dashborad-inv-text">
                  {item?.nextPaymentDateOfSubscribed === null
                    ? ""
                    : formatCurrency(
                        item?.currencySymbol,
                        item?.nextPaymentAmountOfSubscribed
                      )}
                </p>
                {item?.dpd > 0 ? (
                  <p className="invest-table-warning-msg">
                    {item?.investmentStatus === "OUTSTANDING"
                      ? `Days past due: ${item?.dpd}`
                      : null}
                  </p>
                ) : null}
              </div>
            </div>
          </Col>
        </Row>
      </Row>
    </Col>
  );
};

export default ReservedInvestmentCard;
