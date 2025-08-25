import { Col, Row, Tooltip } from "antd";
import React from "react";
import { britishFormatDate } from "../../../Utils/Helpers";
import {
  camelCaseSting,
  formatCurrency,
  getPaymentFrequencyHeading,
} from "../../../Utils/Reusables";
import TagSimple from "../../../Assets/Images/SVGs/TagSimple.svg";

const BondDescription = ({ TrancheRes }) => {
  return (
    <Row>
      <Col xs={24}>
        <p className="mt-0 tranch-head">Bond</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="mb-8 mt-0 borrower-info-tag">Currency</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="mb-8 mt-0 card-val-tag">
          {TrancheRes?.tranche?.currencyCode}
        </p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="mb-8 mt-0 borrower-info-tag">Interest frequency</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="mb-8 mt-0 card-val-tag">
          {camelCaseSting(TrancheRes?.tranche?.paymentPeriod)}
        </p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 borrower-info-tag">Nominal value</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 card-val-tag">
          {formatCurrency(
            TrancheRes?.tranche?.currencyCode === "USD"
              ? "$"
              : TrancheRes?.tranche?.currencyCode === "SGD"
              ? "S$"
              : "€",
            TrancheRes?.tranche?.nominalValue
          )}
        </p>
      </Col>
      {TrancheRes?.tranche?.discountedPrice > 0 ? (
        <>
          <Col xs={12} lg={12}>
            <div className="discount-tag mb-8">
              <img src={TagSimple} alt="TagSimple" />
              <p className="m-0 mb-0 borrower-info-tag">Discounted price</p>
            </div>
          </Col>
          <Col xs={12} lg={12}>
            <p className="m-0 mb-8 card-val-tag">
              {formatCurrency(
                TrancheRes?.tranche?.currencyCode === "USD"
                  ? "$"
                  : TrancheRes?.tranche?.currencyCode === "SGD"
                  ? "S$"
                  : "€",
                TrancheRes?.tranche?.discountedPrice
              )}
            </p>
          </Col>{" "}
        </>
      ) : null}
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 borrower-info-tag">Interest commencement date</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 card-val-tag">
          {TrancheRes?.tranche?.interestCommencementDate === null
            ? "-"
            : britishFormatDate(TrancheRes?.tranche?.interestCommencementDate)}
        </p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 borrower-info-tag">Next interest payment</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 card-val-tag">
          {TrancheRes?.tranche?.nextPaymentDate === null
            ? "-"
            : britishFormatDate(TrancheRes?.tranche?.nextPaymentDate)}
        </p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 borrower-info-tag">Maturity date</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 card-val-tag">
          {TrancheRes?.tranche?.maturityDate === null
            ? "-"
            : britishFormatDate(TrancheRes?.tranche?.maturityDate)}
        </p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 borrower-info-tag">Early redemption frequency</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 card-val-tag">
          {TrancheRes?.tranche?.capitalCallEnabled === false
            ? "Not Applicable"
            : getPaymentFrequencyHeading(
                TrancheRes?.tranche?.paymentPeriodInTerms,
                TrancheRes?.tranche?.capitalCallFrequency
              )}
        </p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 borrower-info-tag">Next early redemption</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 card-val-tag">
          {TrancheRes?.tranche?.nextCapitalCallDate === null
            ? "-"
            : britishFormatDate(TrancheRes?.tranche?.nextCapitalCallDate)}
        </p>
      </Col>

      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 borrower-info-tag">Status</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 card-val-tag">
          {camelCaseSting(TrancheRes?.tranche?.status)}
        </p>
      </Col>
      {TrancheRes?.tranche?.minimalSettlementAmount != null &&
        TrancheRes?.tranche?.minimalSettlementAmount !== 0 && (
          <Col xs={12} lg={12}>
            <div style={{ display: "flex", gap: 3 }}>
              <p
                className="m-0 mb-8 borrower-info-tag"
                style={{ marginTop: 1 }}
              >
                Minimum Settlement Amount
              </p>{" "}
              <div>
                <Tooltip title="The minimum committed funds from all investors required for an investment to go ahead. If the minmum is not reached you will receive a refund of your committed funds.">
                  <box-icon
                    name="info-circle"
                    size="13px"
                    color="#1C1C1C66"
                  ></box-icon>
                </Tooltip>
              </div>
            </div>
          </Col>
        )}
      {TrancheRes?.tranche?.minimalSettlementAmount != null &&
        TrancheRes?.tranche?.minimalSettlementAmount !== 0 && (
          <Col xs={12} lg={12}>
            <p className="m-0 mb-8 card-val-tag">
              {formatCurrency(
                TrancheRes?.tranche?.currencyCode === "USD"
                  ? "$"
                  : TrancheRes?.tranche?.currencyCode === "SGD"
                  ? "S$"
                  : "€",
                TrancheRes?.tranche?.minimalSettlementAmount
              )}
            </p>
          </Col>
        )}
      <Col xs={24} lg={24}>
        <p className="tranch-head">Collateral</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 borrower-info-tag">Collateral</p>
      </Col>
      <Col xs={12} lg={12}>
        <p className="m-0 mb-8 card-val-tag">
          {TrancheRes?.tranche?.collateral[0]}
        </p>
      </Col>
    </Row>
  );
};

export default BondDescription;
