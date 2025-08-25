import { Badge, Button, Col, Divider, Row, Skeleton, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import GlobalVariabels from "../../../Utils/GlobalVariabels";
import "./style.css";
import ROUTES from "../../../Config/Routes";
import { useNavigate } from "react-router";
import { britishFormatDate, getCountries } from "../../../Utils/Helpers";
import { useSelector } from "react-redux";
import {
  formatCurrency,
  formatPeriod,
  getCountryNameByCode,
  getPaymentFrequencyHeading,
  truncateText,
} from "../../../Utils/Reusables";
import InfoIcon from "../../../Assets/Images/SVGs/Info.svg";
import FundedBar from "../../FundedBar";

const ManualInvestmentCard = ({ tranchInfo, newTranche, onClickAnalytics }) => {
  const navigate = useNavigate();
  const countryList = getCountries();
  const user = useSelector((state) => state?.user);
  const [isLoading, setIsLoading] = useState(true);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const handleImageLoaded = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const cardDesc = tranchInfo?.details?.summary?.shortDescription;

  useEffect(() => {
    const logWidths = () => {
      const manualInvCardDivs = document.querySelectorAll(".manual-inv-card");
      manualInvCardDivs.forEach((manualInvCardDiv) => {
        const divWidth = manualInvCardDiv.offsetWidth;
        const skeletonElements = manualInvCardDiv.querySelectorAll(
          ".ant-skeleton.ant-skeleton-element .ant-skeleton-image"
        );
        skeletonElements.forEach((skeletonElement) => {
          skeletonElement.style.width = divWidth + "px";
          skeletonElement.style.height = "216px";
        });
      });
    };
    logWidths();
    window.addEventListener("resize", logWidths);

    return () => {
      window.removeEventListener("resize", logWidths);
    };
  }, []);

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
    <div className="manual-inv-card">
      <Badge
        className="credit-rating-badge"
        count={tranchInfo?.creditRating}
        style={{ height: "auto" }}
      >
        <Badge
          style={{ height: "auto" }}
          className={
            newTranche === true ? "new-label-badge" : "hide-tranche-badge"
          }
          count={newTranche === true ? "New" : tranchInfo?.creditRating}
        >
          {isLoading || tranchInfo?.mainPictureFileReference === null ? (
            <div className="tranch-list-skeleton">
              <Skeleton.Image active={isLoading} />
            </div>
          ) : (
            <div className="p-relative">
              {tranchInfo?.companyLogo !== null ? (
                <div className="financial-logo">
                  <img
                    src={`${GlobalVariabels.VIEW_IMG}/${tranchInfo?.companyLogo}`}
                    alt="borrower_icon"
                  />
                </div>
              ) : null}
              {tranchInfo?.mainPictureFileReference ? (
                <img
                  onClick={handleViewTranche}
                  src={`${GlobalVariabels.VIEW_IMG}/${tranchInfo?.mainPictureFileReference}`}
                  alt="card-img"
                  className="w-100 tranch-card-mainImg cursor-pointer"
                  onLoad={handleImageLoaded}
                  onError={handleImageError}
                />
              ) : null}
            </div>
          )}
          <div className="manual-card-bottom-div">
            <div>
              <div
                className="tranche-card-top cursor-pointer tranche-card-content"
                onClick={handleViewTranche}
              >
                <div>
                  <p className="tranche-id m-0">
                    {tranchInfo?.trancheNumber === null
                      ? "-"
                      : tranchInfo?.trancheNumber}
                    <br />
                    {tranchInfo?.details?.title?.length > 24 ? (
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
                  </p>
                </div>
                <div style={{ textAlign: "end" }}>
                  {tranchInfo?.capitalCallFrequency === 0 ? (
                    ""
                  ) : (
                    <div style={{ display: "flex", gap: "2px" }}>
                      <Tag color="default" className="tranche-tag">
                        Early Redemption
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

                  <Tag color="default" className="tranche-tag">
                    {tranchInfo?.collateral[0] === "Unsecured" ? (
                      "Unsecured"
                    ) : (
                      <Tooltip title="If a borrowing institution goes out of business, investors holding senior debt are first priority to get paid. Senior debt is also backed by assets which can be sold to repay what's owed.">
                        <span>Senior secured</span>
                      </Tooltip>
                    )}
                  </Tag>
                </div>
              </div>
              {cardDesc === "" ? (
                "-"
              ) : (
                <Row onClick={handleViewTranche} className="cursor-pointer">
                  <div className="card-desc">
                    {expanded ? cardDesc : `${cardDesc?.slice(0, 100)}`}
                    {!expanded && (
                      <Button className="expand-btn" onClick={toggleExpand}>
                        ...
                      </Button>
                    )}
                  </div>
                </Row>
              )}
            </div>
            <div className="mb-16">
              <FundedBar tranchInfo={tranchInfo} />
            </div>

            <Divider className="inv-card-divider" />
            <Row onClick={handleViewTranche} className="cursor-pointer mb-16">
              <Col xs={12} lg={12}>
                <Tooltip
                  placement="top"
                  title={
                    "A measure of credit risk. This is the risk that the borrowing institution you have invested in will not make their payments. A is the lowest risk; D is the highest risk."
                  }
                >
                  <p className="mb-5 mt-0 card-info-tag">Rating</p>
                </Tooltip>
              </Col>
              <Col xs={12} lg={12}>
                <p className="mb-5 mt-0 card-val-tag">
                  {tranchInfo?.creditRating ? tranchInfo?.creditRating : null}
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="mb-5 mt-0 card-info-tag">Country</p>
              </Col>
              <Col xs={12} lg={12} className="sb-text-align-end country-flag">
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
              <Col xs={12} lg={12}>
                <p className="mb-5 mt-0 card-info-tag">Currency</p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="mb-5 mt-0 card-val-tag">
                  {tranchInfo?.currencyCode}
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-info-tag">Minimum investment</p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-val-tag">
                  {formatCurrency(
                    tranchInfo?.currencyCode === "USD"
                      ? "$"
                      : tranchInfo?.currencyCode === "SGD"
                      ? "S$"
                      : "€",
                    tranchInfo?.nominalValue
                  )}
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-info-tag">Interest rate</p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-val-tag">
                  {formatCurrency("", tranchInfo?.interestRate) + "%"}
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-info-tag">Interest frequency</p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-val-tag">
                  {formatPeriod(tranchInfo?.paymentPeriodInTerms)}
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <Tooltip
                  placement="top"
                  title={
                    "The mimimum period for which you can hold an investment before making a withdrawal."
                  }
                >
                  <p className="m-0 mb-5 card-info-tag">
                    Early redemption frequency
                  </p>
                </Tooltip>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-val-tag">
                  {getPaymentFrequencyHeading(
                    tranchInfo?.paymentPeriodInTerms,
                    tranchInfo?.capitalCallFrequency
                  )}
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
              {/* <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-info-tag">Bond sold</p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-val-tag">
                  {formatCurrency("", tranchInfo?.debenturesSold)}
                </p>
              </Col> */}
              {/* <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-info-tag">Industry</p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-val-tag">
                  {tranchInfo?.trancheType
                    ?.toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
              </Col> */}
              <Col xs={12} lg={12}>
                <Tooltip
                  placement="top"
                  title={
                    " Assets which can be taken from a borrower if they do not make their interest or loan repayments."
                  }
                >
                  <p className="m-0 mb-5 card-info-tag">Collaterals type</p>
                </Tooltip>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-val-tag">
                  {tranchInfo?.collateral[0]}
                </p>
              </Col>

              <Col xs={12} lg={12}>
                <Tooltip
                  placement="top"
                  title={
                    "The date at which your investment in a particular deal ends, triggering repayment of your investment and any outstanding interest."
                  }
                >
                  <p className="m-0 mb-5 card-info-tag">Maturity date</p>
                </Tooltip>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-val-tag">
                  {tranchInfo?.maturityDate === null
                    ? "-"
                    : britishFormatDate(tranchInfo?.maturityDate)}
                </p>
              </Col>
            </Row>
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
        </Badge>
      </Badge>
    </div>
  );
};

export default ManualInvestmentCard;
