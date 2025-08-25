import React, { useState } from "react";
import { Card, Row, Col, Button, Tag, Skeleton, Tooltip } from "antd";
import tranche_currency from "../../../Assets/Images/SVGs/tranche_currency.svg";
import tranche_rate from "../../../Assets/Images/SVGs/tranche_rate.svg";
import InfoIcon from "../../../Assets/Images/SVGs/Info.svg";
import NewFundedBar from "./NewFundedBar";
import GlobalVariabels from "../../../Utils/GlobalVariabels";
import {
  formatCurrency,
  formatPeriod,
  getCountryNameByCode,
  getPaymentFrequencyHeading,
  truncateText,
} from "../../../Utils/Reusables";
import { britishFormatDate, getCountries } from "../../../Utils/Helpers";
import ROUTES from "../../../Config/Routes";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NewTrancheCard = ({ tranchInfo, newTranche, onClickAnalytics }) => {
  const navigate = useNavigate();
  const countryList = getCountries();
  const [imageLoaded, setImageLoaded] = useState(false);
  const user = useSelector((state) => state?.user);

  const handleViewTranche = async () => {
    const payload = {
      eventType: "TRANCHE_VIEW",
      pageUrl: `${window.location.origin}/tranche-invest/${tranchInfo?.uuid}`,
      details: {
        id: tranchInfo?.trancheNumber,
      },
    };
    await onClickAnalytics(payload);
    navigate(`${ROUTES.TRANCH_INVEST}/${tranchInfo?.uuid}`);
  };

  return (
    <Card
      bodyStyle={{ padding: "16px", paddingBottom: "0" }}
      onClick={handleViewTranche}
      className="deal-card cursor-pointer"
      cover={
        <div className="deal-image-wrapper">
          {!imageLoaded && (
            <Skeleton.Image className="deal-skeleton-image" active />
          )}
          <img
            alt={tranchInfo.name}
            src={`${GlobalVariabels.VIEW_IMG}/${tranchInfo?.mainPictureFileReference}`}
            className={`deal-logo ${imageLoaded ? "loaded" : ""}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => console.error("Image failed to load")}
          />
          <div className="deal-top">
            {newTranche && (
              <Tag color="blue" className="deal-status-flag">
                New
              </Tag>
            )}
            <Tag color="blue" className="currency-flag">
              <img src={tranche_currency} alt="tranche_currency" />
              {tranchInfo?.currencyCode}
            </Tag>
            {tranchInfo?.creditRating ? (
              <Tag color="blue" className="currency-flag">
                <img src={tranche_rate} alt="tranche_currency" />
                {tranchInfo?.creditRating}
              </Tag>
            ) : null}
          </div>
        </div>
      }
      bordered
    >
      <div className="deal-body">
        <div className="deal-top-content">
          <div>
            <p className="tranche-id m-0">
              {tranchInfo?.trancheNumber === null
                ? "-"
                : tranchInfo?.trancheNumber}
              <br />
              <span className="tranche-name">
                {tranchInfo?.details?.title?.length > 50 ? (
                  <Tooltip title={tranchInfo?.details?.title}>
                    <span className="tranche-name">
                      {truncateText(tranchInfo?.details?.title)}
                    </span>
                  </Tooltip>
                ) : (
                  <span className="tranche-name">
                    {tranchInfo?.details?.title}
                  </span>
                )}
              </span>
            </p>
          </div>
          <div className="mb-20">
            <NewFundedBar tranchInfo={tranchInfo} />
          </div>
          <Row className="cursor-pointer mb-20">
            <Col xs={12} lg={12}>
              <p className="m-0 mb-5 card-info-tag">Currency</p>
            </Col>
            <Col xs={12} lg={12}>
              <p className="m-0 mb-5 card-val-tag">
                {tranchInfo?.currencyCode}
              </p>
            </Col>
            <Col xs={12} lg={12}>
              <p className="mb-5 mt-0 card-info-tag">Interest rate</p>
            </Col>
            <Col xs={12} lg={12} className="sb-text-align-end country-flag">
              {formatCurrency("", tranchInfo?.interestRate) + "%"}
            </Col>
            <Col xs={12} lg={12}>
              <p className="mb-5 mt-0 card-info-tag">Interest frequency</p>
            </Col>
            <Col xs={12} lg={12}>
              <p className="mb-5 mt-0 card-val-tag">
                {formatPeriod(tranchInfo?.paymentPeriodInTerms)}
              </p>
            </Col>
            <Col xs={12} lg={12}>
              <p className="m-0 mb-5 card-info-tag">Available to invest</p>
            </Col>
            <Col xs={12} lg={12}>
              <p className="m-0 mb-5 card-val-tag">
                {formatCurrency(
                  tranchInfo?.currencyCode === "USD"
                    ? "$"
                    : tranchInfo?.currencyCode === "SGD"
                    ? "S$"
                    : "€",
                  tranchInfo?.principalAvailable
                )}
              </p>
            </Col>
            <Col xs={12} lg={12}>
              <p className="m-0 mb-5 card-info-tag">Outstanding principal</p>
            </Col>
            <Col xs={12} lg={12}>
              <p className="m-0 mb-5 card-val-tag">
                {formatCurrency(
                  tranchInfo?.currencyCode === "USD"
                    ? "$"
                    : tranchInfo?.currencyCode === "SGD"
                    ? "S$"
                    : "€",
                  tranchInfo?.principalSettled
                )}
              </p>
            </Col>
            <Col xs={12} lg={12}>
              <p className="m-0 mb-5 card-info-tag">Maturity date</p>
            </Col>
            <Col xs={12} lg={12}>
              <p className="m-0 mb-5 card-val-tag">
                {tranchInfo?.maturityDate === null
                  ? "-"
                  : britishFormatDate(tranchInfo?.maturityDate)}
              </p>
            </Col>
            <Col xs={12} lg={12}>
              <p className="m-0 mb-5 card-info-tag">Country</p>
            </Col>
            <Col xs={12} lg={12} className="sb-text-align-end">
              {tranchInfo?.countries?.length > 0
                ? tranchInfo?.countries?.map((countryCode, index) => (
                    <Tooltip
                      key={index}
                      title={getCountryNameByCode(countryList, countryCode)}
                    >
                      <span
                        style={{
                          filter:
                            "drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.20))",
                        }}
                        key={index}
                        className={`mb-5 ml-5 mt-0 fi fi-${countryCode.toLowerCase()}`}
                      />
                    </Tooltip>
                  ))
                : "-"}
            </Col>
          </Row>
          <div className="deal-tags mb-20">
            {tranchInfo?.capitalCallFrequency === 0 ? (
              ""
            ) : (
              <div style={{ display: "flex", gap: "2px" }}>
                <Tag color="default" className="tranche-tag">
                  Early Redemption:{" "}
                  {getPaymentFrequencyHeading(
                    tranchInfo?.paymentPeriodInTerms,
                    tranchInfo?.capitalCallFrequency
                  )}
                </Tag>
                {tranchInfo?.details?.summary?.tooltips && (
                  <Tooltip
                    placement="top"
                    title={tranchInfo?.details?.summary?.tooltips}
                  >
                    <img src={InfoIcon} alt="info-icon" />
                  </Tooltip>
                )}
              </div>
            )}
            <Tag>Senior Secured</Tag>
            {tranchInfo?.secondaryMarketEnabled ? (
              <Tag>Market Maker</Tag>
            ) : null}
          </div>
        </div>
        <Row className="invest-button-container">
          <Button
            title="Invest"
            style={{
              width: "100%",
              cursor:
                user?.investorStatus !== "ACTIVE" ||
                tranchInfo?.principalAvailable <= 0 ||
                tranchInfo?.trancheStatus !== "ISSUED"
                  ? "not-allowed"
                  : "pointer",
            }}
            disabled={
              user?.investorStatus !== "ACTIVE" ||
              tranchInfo?.principalAvailable <= 0 ||
              tranchInfo?.trancheStatus !== "ISSUED"
            }
            className={
              user?.investorStatus !== "ACTIVE" ||
              tranchInfo?.principalAvailable <= 0 ||
              tranchInfo?.trancheStatus !== "ISSUED"
                ? "invest-buttoncard-disabled"
                : "invest-buttoncard"
            }
            onClick={() =>
              navigate(`${ROUTES.TRANCH_INVEST}/${tranchInfo?.uuid}`)
            }
          >
            Invest
          </Button>
        </Row>
      </div>
    </Card>
  );
};

export default NewTrancheCard;
