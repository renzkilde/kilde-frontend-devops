import React from "react";
import { Button, Col, Divider, Row } from "antd";
import { useNavigate } from "react-router-dom";

import "./style.css";
import EditIcon from "../../../Assets/Images/edit_icon.svg";
import PlayInvest from "../../../Assets/Images/playinvest.svg";
import PauseInvest from "../../../Assets/Images/pause.svg";
import DeleteInvest from "../../../Assets/Images/deleteinvest.svg";
import ROUTES from "../../../Config/Routes";
import { formatCurrency } from "../../../Utils/Reusables";

const AutoInvestmentCard = ({
  item,
  handlePauseStrategy,
  handleActiveStrategy,
  handleDeleteStrategy,
}) => {
  const navigate = useNavigate();
  return (
    <Col xs={24} sm={24} className="auto-invest-card">
      <div className="manual-inv-card">
        <div className="sb-flex-justify-between">
          <p className="card-val-tag ">{item?.name}</p>
          {item?.status === "ACTIVE" ? (
            <div className="stratergy-status-div">
              <span className="active-stratergy-span"></span>
              <p className="active-stratergy-p">{item?.status}</p>
            </div>
          ) : (
            <div className="stratergy-status-div">
              <span className="pause-invest-span"></span>
              <p className="pause-invest-p">{item?.status}</p>
            </div>
          )}
        </div>
        <Divider className="inv-card-divider" />
        <Row className="cursor-pointer">
          <Col xs={12} lg={12}>
            <p className="mb-5 mt-0 card-info-tag">Currency</p>
          </Col>
          <Col xs={12} lg={12}>
            <p className="mb-5 mt-0 card-val-stratergy-tag">
              {item?.currencyCode}
            </p>
          </Col>
          <Col xs={12} lg={12}>
            <p className="m-0 mb-5 card-info-tag">Interest Rate</p>
          </Col>
          <Col xs={12} lg={12}>
            <p className="m-0 mb-5 card-val-stratergy-tag">
              {item?.params?.minInterestRate}% - {item?.params?.maxInterestRate}
              %
            </p>
          </Col>
          <Col xs={12} lg={12}>
            <p className="m-0 mb-5 card-info-tag">Portfolio Size</p>
          </Col>
          <Col xs={12} lg={12}>
            <p className="m-0 mb-5 card-val-stratergy-tag">
              {formatCurrency(
                item?.currencySymbol,
                item?.params?.portfolioSize
              )}
            </p>
          </Col>
          <Col xs={12} lg={12}>
            <p className="m-0 mb-5 card-info-tag">Outstanding amount</p>
          </Col>
          <Col xs={12} lg={12}>
            <p className="m-0 mb-5 card-val-stratergy-tag">
              {formatCurrency(item?.currencySymbol, item?.outstandingPrincipal)}
            </p>
          </Col>
          <Col xs={12} lg={12}>
            <p className="m-0 mb-5 card-info-tag">Remaining Loan Term (m)</p>
          </Col>
          <Col xs={12} lg={12}>
            <p className="m-0 mb-5 card-val-stratergy-tag">
              {item?.params?.minRemainingLoanTerm} -
              {item?.params?.maxRemainingLoanTerm} m.
            </p>
          </Col>
        </Row>
        <div className="mt-15 startegy-card-btn-div">
          <div className="w-100">
            <Button
              onClick={() => navigate(`${ROUTES.EDIT_STRATEGY}/${item?.uuid}`)}
              className="create_stratergy_btn"
              icon={<img src={EditIcon} alt="Edit" />}
              style={{ width: "100%", height: 40 }}
            >
              Edit
            </Button>
          </div>
          <div>
            {item.status === "PAUSED" ? (
              <Button
                className="strategy-btn ml-4"
                onClick={() => handleActiveStrategy(item?.uuid, item?.name)}
              >
                <img src={PauseInvest} alt="pauseStratergy" />
              </Button>
            ) : (
              <Button
                className="strategy-btn ml-4"
                onClick={() => handlePauseStrategy(item?.uuid, item?.name)}
              >
                <img src={PlayInvest} alt="continueStratergy" />
              </Button>
            )}
          </div>
          <div>
            <Button
              className="strategy-btn ml-4"
              onClick={() => handleDeleteStrategy(item?.uuid, item?.name)}
            >
              <img src={DeleteInvest} alt="deleteStratergy" />
            </Button>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default AutoInvestmentCard;
