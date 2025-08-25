import React from "react";

import { Col, Row } from "antd";
import "./style.css";
import { formatCurrency } from "../../../Utils/Reusables";

const InvestmentCard = ({ dashboardData }) => {
  return (
    <Row>
      <Col xs={18} sm={24} md={24} lg={24} className="mb-16">
        <p className="m-0 tranch-head">Investments</p>
      </Col>

      <Col xs={12} lg={12} className="mb-8">
        <p className="m-0 add-doc-setting">Current investments </p>
      </Col>
      <Col xs={12} lg={12} className="mb-8">
        <div className="profit-val-detail">
          <p className="m-0 card-profit-val-tag">
            {dashboardData?.investorSummary?.investmentsCurrent === undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  dashboardData?.investorSummary?.investmentsCurrent
                )}
          </p>
        </div>
      </Col>
      <Col xs={18} lg={18} className="mb-8">
        <p className="m-0 add-doc-setting">Delayed repayment (1-15 Days)</p>
      </Col>
      <Col xs={6} lg={6} className="mb-8">
        <div className="profit-val-detail">
          <p className="m-0 card-profit-val-tag">
            {dashboardData?.investorSummary?.investmentsPastDue15 === undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  dashboardData?.investorSummary?.investmentsPastDue15
                )}
          </p>
        </div>
      </Col>
      <Col xs={18} lg={18} className="mb-8">
        <p className="m-0 add-doc-setting">Delayed repayment (16-30 Days)</p>
      </Col>
      <Col xs={6} lg={6} className="mb-8">
        <div className="profit-val-detail">
          <p className="m-0 card-profit-val-tag">
            {dashboardData?.investorSummary?.investmentsPastDue30 === undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  dashboardData?.investorSummary?.investmentsPastDue30
                )}
          </p>
        </div>
      </Col>
      <Col xs={18} lg={18} className="mb-8">
        <p className="m-0 add-doc-setting">Delayed repayment (31-60 Days)</p>
      </Col>
      <Col xs={6} lg={6} className="mb-8">
        <div className="profit-val-detail">
          <p className="m-0 card-profit-val-tag">
            {dashboardData?.investorSummary?.investmentsPastDue60 === undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  dashboardData?.investorSummary?.investmentsPastDue60
                )}
          </p>
        </div>
      </Col>
      <Col xs={18} lg={18} className="mb-8">
        <p className="m-0 add-doc-setting">Delayed repayment (61+ Days)</p>
      </Col>
      <Col xs={6} lg={6} className="mb-8">
        <div className="profit-val-detail">
          <p className="m-0 card-profit-val-tag">
            {dashboardData?.investorSummary?.investmentsDefault === undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  dashboardData?.investorSummary?.investmentsDefault
                )}
          </p>
        </div>
      </Col>
      <Col xs={12} lg={12} className="mb-16">
        <p className="m-0 profit-total-income-tag">Total</p>
      </Col>
      <Col xs={12} lg={12} className="mb-16">
        <div className="profit-val-detail">
          <p className="m-0 profit-total-income-val-tag">
            {dashboardData?.investorSummary?.investments === undefined
              ? "$0"
              : formatCurrency(
                  dashboardData?.investorSummary?.currencySymbol,
                  dashboardData?.investorSummary?.investments
                )}
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default InvestmentCard;
