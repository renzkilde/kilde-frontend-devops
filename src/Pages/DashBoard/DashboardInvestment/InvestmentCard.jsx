import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "antd";

import Close from "../../../Assets/Images/Icons/Dashboard/close_icon.svg";
import Arrow from "../../../Assets/Images/arrow.svg";

import "./style.css";
import { britishFormatDate } from "../../../Utils/Helpers";
import ROUTES from "../../../Config/Routes";
import { useNavigate } from "react-router-dom";
import { formatCurrency, useWindowWidth } from "../../../Utils/Reusables";

const InvestmentCard = ({ item, onCancelCommit }) => {
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();

  const handleCancelCommit = () => {
    onCancelCommit(item?.uuid);
  };

  const handleViewTranche = (tranchUuid) => {
    navigate(`${ROUTES.TRANCH_INVEST}/${tranchUuid}`);
  };

  return (
    <Col xs={24} sm={24} md={12} className="dashboard-invest-card mt-8">
      <div className="dashboard-invest-card-topDiv">
        <div>
          <p className="m-0 dashborad-inv-text">{item?.trancheNumber}</p>
          <h3 className="m-0 card-val-tag">{item?.trancheTitle}</h3>
        </div>
        <div className="dashboard-invest-btn-div">
          {item?.investmentStatus === "COMMITED" ? (
            <Button
              className="dashboard-invest-cancel-button-icon"
              onClick={handleCancelCommit}
            >
              {windowWidth <= 576 ? null : (
                <span className="dashboard-invest-cancel-title">Cancel</span>
              )}
              <img src={Close} alt="close_icon" />
            </Button>
          ) : null}

          <Button
            className="dashboard-invest-view-button-icon"
            onClick={() => handleViewTranche(item?.uuid)}
          >
            {windowWidth <= 576 ? null : (
              <span className="dashboard-invest-view-title">View</span>
            )}
            <img src={Arrow} alt="right_arrow" style={{ width: "8px" }} />
          </Button>
        </div>
      </div>
      <Row className="dashboard-invest-card-bottomDiv">
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 card-info-tag">Kilde rating</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 dashboard-card-val-tag">
            {item?.creditRating}
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 card-info-tag">Interest rate</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 dashboard-card-val-tag">
            {formatCurrency("", item?.interestRate)}%
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 card-info-tag">Interest received</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 dashboard-card-val-tag">
            {formatCurrency(item?.currencySymbol, item?.interestPaid)}
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 card-info-tag">Outstanding principal</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 dashboard-card-val-tag">
            {formatCurrency(item?.currencySymbol, item?.principalInvestment)}
          </p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 card-info-tag">Maturity date</p>
        </Col>
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 dashboard-card-val-tag">
            {britishFormatDate(item?.maturityDate)}
          </p>
        </Col>
        <Row className="w-100">
          <Col xs={12} lg={12}>
            <p className="mb-5 mt-0 card-info-tag">Next payment</p>
          </Col>
          <Col xs={12} lg={12}>
            <div className="mb-8 mt-0 dashboard-card-val-tag">
              <div>
                <p className="dashborad-inv-text">
                  {item?.investmentStatus === "OUTSTANDING"
                    ? item?.nextPaymentDate === null
                      ? ""
                      : britishFormatDate(item?.nextPaymentDate)
                    : item?.investmentStatus === "COMMITED"
                    ? item?.nextPaymentDateOfSubscribed === null
                      ? ""
                      : britishFormatDate(item?.nextPaymentDateOfSubscribed)
                    : "-"}
                </p>
                <p className="dashborad-inv-text">
                  {item?.investmentStatus === "OUTSTANDING"
                    ? item?.nextPaymentDate === null
                      ? ""
                      : formatCurrency(
                          item?.currencySymbol,
                          item?.nextPaymentAmount
                        )
                    : item?.investmentStatus === "COMMITED"
                    ? item?.nextPaymentDateOfSubscribed === null
                      ? ""
                      : formatCurrency(
                          item?.currencySymbol,
                          item?.nextPaymentAmountOfSubscribed
                        )
                    : null}
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
        <Col xs={12} lg={12}>
          <p className="mb-5 mt-0 card-info-tag">Status</p>
        </Col>
        <Col xs={12} lg={12}>
          <div className="mb-5 mt-0 dashboard-card-val-tag">
            {item?.investmentStatus === "OUTSTANDING" ? (
              <p className="invest-repaid-p">Outstanding</p>
            ) : item?.investmentStatus === "REPAID" ? (
              <p className="invest-committed-p">Repaid</p>
            ) : (
              <p className="invest-outstanding-p">Committed</p>
            )}
          </div>
        </Col>
      </Row>
    </Col>
  );
};

export default InvestmentCard;
