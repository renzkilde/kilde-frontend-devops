import React, { useEffect, useState } from "react";
import { Col, Row, Tooltip } from "antd";
import { britishFormatDate } from "../../../Utils/Helpers";
import { formatCurrency } from "../../../Utils/Reusables";

const TranchInvestInfo = ({ TrancheRes }) => {
  const [hasIRR, setHasIRR] = useState(false);
  useEffect(() => {
    if (
      TrancheRes?.tranche?.details?.expectedReturnPerYear != null &&
      TrancheRes?.tranche?.details?.expectedReturnPerYear !== 0
    ) {
      setHasIRR(true);
    } else {
      setHasIRR(false);
    }
  }, [TrancheRes]);

  return (
    <Col className="gutter-row" lg={24} md={24} sm={24} xs={24}>
      <Row>
        <Col
          sm={24}
          md={24}
          lg={24}
          className="gutter-row infomation-div"
          style={{ flex: 1 }}
        >
          <Row
            className="sub-info-div sb-text-align"
            gutter={40}
            style={{ textAlign: "justify" }}
          >
            <Col
              xs={24}
              sm={hasIRR ? 4 : 6}
              md={hasIRR ? 4 : 6}
              className="sing-col gutter-row sub-info-invest-col"
            >
              <p className="mb-5 mt-0">Available to invest </p>
              <p className="info-val m-0 media-b-m">
                {formatCurrency(
                  TrancheRes?.tranche?.currencyCode === "USD"
                    ? "$"
                    : TrancheRes?.tranche?.currencyCode === "SGD"
                    ? "S$"
                    : "€",
                  TrancheRes?.tranche?.principalAvailable
                )}
              </p>
            </Col>
            <Col
              xs={24}
              sm={hasIRR ? 5 : 6}
              md={hasIRR ? 5 : 6}
              className="sing-col gutter-row media-invest-col"
            >
              <p className="mb-5 mt-0 media-t-m">Interest rate</p>
              <p className="info-val m-0 media-b-m">
                {formatCurrency("", TrancheRes?.tranche?.interestRate) + "%"}
              </p>
            </Col>
            {TrancheRes?.tranche?.details?.expectedReturnPerYear != null &&
              TrancheRes?.tranche?.details?.expectedReturnPerYear !== 0 && (
                <Col
                  xs={24}
                  sm={hasIRR ? 5 : 4}
                  md={hasIRR ? 5 : 4}
                  className="sing-col gutter-row media-invest-col"
                >
                  <p className="mb-5 mt-0 media-t-m">
                    IRR{" "}
                    <Tooltip title="The effective annual rate of interest on an investment. Useful for understanding the return on an investment where interest is not received annually and/or where the interest amount varies.">
                      <box-icon
                        name="info-circle"
                        size="13px"
                        color="#1C1C1C66"
                      ></box-icon>
                    </Tooltip>
                  </p>
                  <p className="info-val m-0 media-b-m">
                    {TrancheRes?.tranche?.details?.expectedReturnPerYear + "%"}
                  </p>
                </Col>
              )}

            <Col
              xs={24}
              sm={hasIRR ? 5 : 6}
              md={hasIRR ? 5 : 6}
              className="sing-col gutter-row media-invest-col"
            >
              <p className="mb-5 mt-0 media-t-m">Maturity date</p>
              <p className="info-val m-0 media-b-m ">
                {britishFormatDate(TrancheRes?.tranche?.maturityDate)}
              </p>
            </Col>
            <Col
              xs={24}
              sm={hasIRR ? 5 : 6}
              md={hasIRR ? 5 : 6}
              className="last-sing-col gutter-row media-invest-col"
            >
              <p className="mb-5 mt-0 media-t-m">Bond sold</p>
              <p className="info-val m-0">
                {formatCurrency("", TrancheRes?.tranche?.debenturesSold)}
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};

export default TranchInvestInfo;
