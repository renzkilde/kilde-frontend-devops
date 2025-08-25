import React from "react";
import Deposit from "../../../Assets/Images/Icons/Dashboard/deposit.svg";
import { Badge, Col, Row, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import InfoIcon from "../../../Assets/Images/SVGs/Info.svg";

import "./style.css";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import ROUTES from "../../../Config/Routes";
import {
  walletTooltipContent,
  TATooltipContent,
  committedTooltipContent,
  investmentsTooltipContent,
} from "../TooltopContent";
import PieChartComponent from "./PieChartComponent";
import { formatCurrency } from "../../../Utils/Reusables";

const COLORS = ["#FFCB83", "#A1E3CB", "#B1E3FF"];
const GRAY_COLOR = "#D3D3D3";

const TotalAssetsCard = ({ dashboardData }) => {
  const navigate = useNavigate();

  const data = [
    {
      name: "Group A",
      value: dashboardData?.investorSummary?.wallet ?? 0,
    },
    {
      name: "Group B",
      value: dashboardData?.investorSummary?.investments ?? 0,
    },
    {
      name: "Group C",
      value: dashboardData?.investorSummary?.subscribed ?? 0,
    },
  ];

  const allValuesZero = data.every((item) => item.value === 0);
  const displayData = allValuesZero ? [{ name: "Empty", value: 1 }] : data;

  return (
    <div className="total-assets-card-container">
      <div className="total-assets-card-top">
        <p className="m-0 tranch-head assets-align-div">
          Total Assets{" "}
          <Tooltip placement="top" title={TATooltipContent}>
            <img src={InfoIcon} alt="info-icon" style={{ marginTop: 3 }} />
          </Tooltip>
        </p>
        <Link to={ROUTES.WALLET} className="cursor-pointer">
          <img src={Deposit} alt="deposit" />
        </Link>
      </div>
      <div className="chart-main-div">
        <div>
          <PieChartComponent
            displayData={displayData}
            allValuesZero={allValuesZero}
            COLORS={COLORS}
            GRAY_COLOR={GRAY_COLOR}
            dashboardData={dashboardData}
          />
        </div>
        <div className="full-width-div">
          <Row className="total-assets-info" gutter={[8, 8]} wrap>
            <Col sx={24} sm={24} md={24} className="total-assets-info-main">
              <div className="badge-assets">
                <Badge color="#FFCB83" text="Wallet" />
              </div>
              <div className="total-assets-info-detail">
                <div>
                  <p>
                    {dashboardData?.investorSummary?.wallet === undefined
                      ? "$0"
                      : `${formatCurrency(
                          dashboardData?.investorSummary?.currencySymbol,
                          dashboardData?.investorSummary?.wallet
                        )}`}
                  </p>
                </div>
                <div>
                  <Tooltip placement="top" title={walletTooltipContent}>
                    <img
                      src={InfoIcon}
                      alt="info-icon"
                      style={{ marginTop: 3 }}
                    />
                  </Tooltip>
                </div>
              </div>
            </Col>
            <Col sx={24} sm={24} md={24} className="total-assets-info-main">
              <div className="badge-assets">
                <Badge color="#A1E3CB" text="Investments" />
              </div>
              <div className="total-assets-info-detail">
                <div>
                  <p>
                    {dashboardData?.investorSummary?.investments === undefined
                      ? "$0"
                      : formatCurrency(
                          dashboardData?.investorSummary?.currencySymbol,
                          dashboardData?.investorSummary?.investments
                        )}
                  </p>
                </div>
                <div>
                  <Tooltip placement="top" title={investmentsTooltipContent}>
                    <img
                      src={InfoIcon}
                      alt="info-icon"
                      style={{ marginTop: 3 }}
                    />
                  </Tooltip>
                </div>
              </div>
            </Col>
            <Col sx={24} sm={24} md={24} className="total-assets-info-main">
              <div className="badge-assets">
                <Badge color="#B1E3FF" text="Committed" />
              </div>
              <div className="total-assets-info-detail">
                <div>
                  <p>
                    {dashboardData?.investorSummary?.subscribed === undefined
                      ? "$0"
                      : formatCurrency(
                          dashboardData?.investorSummary?.currencySymbol,
                          dashboardData?.investorSummary?.subscribed
                        )}
                  </p>
                </div>
                <div>
                  <Tooltip placement="top" title={committedTooltipContent}>
                    <img
                      src={InfoIcon}
                      alt="info-icon"
                      style={{ marginTop: 3 }}
                    />
                  </Tooltip>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="total-assets-card-top">
        <ButtonDefault
          title="Start Investing"
          onClick={() => navigate(ROUTES.TRANCH_LISTING)}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default TotalAssetsCard;
