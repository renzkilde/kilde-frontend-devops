import React from "react";
import InfoIcon from "../../../Assets/Images/SVGs/Info.svg";

import { Checkbox, Col, Row, Tooltip } from "antd";
import "./style.css";
import {
  accruedInterestExpenseTooltip,
  feesExpenseTooltip,
  interestAccruedTooltip,
  interestForecastTooltip,
  netAverageProfitabilityTooltip,
  showLifetimeIncomeTooltip,
  totalIncomeTooltip,
} from "../TooltopContent";
import { formatCurrency } from "../../../Utils/Reusables";

const NetAverageProfitCard = ({ dashboardData, setChecked, checked }) => {
  return (
    <Row>
      <Col xs={18} sm={18} md={18} lg={18} className="mb-16">
        <p className="m-0 tranch-head">Net Average Profitability</p>
      </Col>
      <Col xs={6} sm={6} md={6} lg={6} className="mb-16">
        <div className="profit-val-detail">
          <p className="m-0 tranch-head">
            {dashboardData?.investorSummary?.lifetimeInvestments
              ?.averageProfitability === undefined ||
            dashboardData?.investorSummary?.currentInvestments
              ?.averageProfitability === undefined
              ? "$0"
              : formatCurrency(
                  "",
                  checked === true
                    ? dashboardData?.investorSummary?.lifetimeInvestments
                        ?.averageProfitability * 100
                    : dashboardData?.investorSummary?.currentInvestments
                        ?.averageProfitability * 100
                )}
            %
          </p>
          <Tooltip placement="top" title={netAverageProfitabilityTooltip}>
            <img src={InfoIcon} alt="info-icon" className="ml-4" />
          </Tooltip>
        </div>
      </Col>

      <Col xs={12} lg={12} className="mb-8">
        <p className="m-0 add-doc-setting">Interest received</p>
      </Col>
      <Col xs={12} lg={12} className="mb-8">
        <div className="profit-val-detail">
          <p className="m-0 card-profit-val-tag">
            {dashboardData?.investorSummary?.lifetimeInvestments
              ?.interestIncome === undefined ||
            dashboardData?.investorSummary?.currentInvestments
              ?.interestIncome === undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  checked === true
                    ? dashboardData?.investorSummary?.lifetimeInvestments
                        ?.interestIncome
                    : dashboardData?.investorSummary?.currentInvestments
                        ?.interestIncome
                )}
          </p>
          <Tooltip placement="top" title={interestAccruedTooltip}>
            <img src={InfoIcon} alt="info-icon" className="ml-4" />
          </Tooltip>
        </div>
      </Col>
      <Col xs={12} lg={12} className="mb-8">
        <p className="m-0 add-doc-setting">Interest forecast</p>
      </Col>
      <Col xs={12} lg={12} className="mb-8">
        <div className="profit-val-detail">
          <p className="m-0 card-profit-val-tag">
            {dashboardData?.investorSummary?.lifetimeInvestments
              ?.outstandingInterestIncome === undefined ||
            dashboardData?.investorSummary?.currentInvestments
              ?.outstandingInterestIncome === undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  checked === true
                    ? dashboardData?.investorSummary?.lifetimeInvestments
                        ?.outstandingInterestIncome
                    : dashboardData?.investorSummary?.currentInvestments
                        ?.outstandingInterestIncome
                )}
          </p>
          <Tooltip placement="top" title={interestForecastTooltip}>
            <img src={InfoIcon} alt="info-icon" className="ml-4" />
          </Tooltip>
        </div>
      </Col>
      <Col xs={12} lg={12} className="mb-8">
        <p className="m-0 add-doc-setting">Fees expense</p>
      </Col>
      <Col xs={12} lg={12} className="mb-8">
        <div className="profit-val-detail">
          <p className="m-0 card-profit-val-tag">
            {dashboardData?.investorSummary?.lifetimeInvestments
              ?.feesExpense === undefined ||
            dashboardData?.investorSummary?.currentInvestments?.feesExpense ===
              undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  checked === true
                    ? dashboardData?.investorSummary?.lifetimeInvestments
                        ?.feesExpense
                    : dashboardData?.investorSummary?.currentInvestments
                        ?.feesExpense
                )}
          </p>
          <Tooltip placement="top" title={feesExpenseTooltip}>
            <img src={InfoIcon} alt="info-icon" className="ml-4" />
          </Tooltip>
        </div>
      </Col>
      <Col xs={12} lg={12} className="mb-8">
        <p className="m-0 add-doc-setting">Accrued interest expense</p>
      </Col>
      <Col xs={12} lg={12} className="mb-8">
        <div className="profit-val-detail">
          <p className="m-0 card-profit-val-tag">
            {dashboardData?.investorSummary?.lifetimeInvestments
              ?.accruedInterestExpense === undefined ||
            dashboardData?.investorSummary?.currentInvestments
              ?.accruedInterestExpense === undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  checked === true
                    ? dashboardData?.investorSummary?.lifetimeInvestments
                        ?.accruedInterestExpense
                    : dashboardData?.investorSummary?.currentInvestments
                        ?.accruedInterestExpense
                )}
          </p>
          <Tooltip placement="top" title={accruedInterestExpenseTooltip}>
            <img src={InfoIcon} alt="info-icon" className="ml-4" />
          </Tooltip>
        </div>
      </Col>
      <Col xs={12} lg={12} className="mb-16">
        <p className="m-0 profit-total-income-tag">Total income</p>
      </Col>
      <Col xs={12} lg={12} className="mb-16">
        <div className="profit-val-detail">
          <p className="m-0 profit-total-income-val-tag">
            {dashboardData?.investorSummary?.lifetimeInvestments
              ?.totalIncome === undefined ||
            dashboardData?.investorSummary?.currentInvestments?.totalIncome ===
              undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  checked === true
                    ? dashboardData?.investorSummary?.lifetimeInvestments
                        ?.totalIncome
                    : dashboardData?.investorSummary?.currentInvestments
                        ?.totalIncome
                )}
          </p>
          <Tooltip placement="top" title={totalIncomeTooltip}>
            <img src={InfoIcon} alt="info-icon" className="ml-4" />
          </Tooltip>
        </div>
      </Col>
      <Col xs={24} lg={24} className="m-0">
        <Checkbox
          onChange={(e) => {
            setChecked(e.target.checked);
          }}
          key="borrower"
          className="checkbox-kilde"
        >
          <span style={{ display: "flex" }}>
            Show lifetime income{" "}
            <Tooltip placement="top" title={showLifetimeIncomeTooltip}>
              <img src={InfoIcon} alt="info-icon" className="ml-4" />
            </Tooltip>
          </span>
        </Checkbox>
      </Col>
    </Row>
  );
};

export default NetAverageProfitCard;
