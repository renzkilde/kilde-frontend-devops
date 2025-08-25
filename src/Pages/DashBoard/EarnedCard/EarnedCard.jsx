import React from "react";
import { Col, Row } from "antd";
import Earned_icon from "../../../Assets/Images/Icons/Dashboard/earned_icon.svg";
import "./style.css";
import { formatCurrency } from "../../../Utils/Reusables";

const EarnedCard = ({ dashboardData, checked }) => {
  return (
    <Row style={{ flex: 1 }}>
      <Col
        sm={24}
        md={24}
        lg={24}
        className="gutter-row dashboard-earned-div"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <div>
          <img src={Earned_icon} alt="earned_icon" className="mb-4" />
        </div>
        <p className="m-0 dashboard-white-14-text">
          You have earned with Kilde
        </p>
        <p className="dashboard-white-32-text mt-12 mb-20">
          {dashboardData?.investorSummary?.lifetimeInvestments
            ?.actualInterestIncome === undefined ||
          dashboardData?.investorSummary?.currentInvestments
            ?.actualInterestIncome === undefined
            ? "$0"
            : formatCurrency(
                dashboardData?.investorSummary?.currencySymbol,
                checked === true
                  ? dashboardData?.investorSummary?.currentInvestments
                      ?.interestIncome <= 0
                    ? 0
                    : dashboardData?.investorSummary?.lifetimeInvestments
                        ?.actualInterestIncome
                  : dashboardData?.investorSummary?.lifetimeInvestments
                      ?.interestIncome <= 0
                  ? 0
                  : dashboardData?.investorSummary?.currentInvestments
                      ?.actualInterestIncome
              )}
        </p>
      </Col>
    </Row>
  );
};

export default EarnedCard;
