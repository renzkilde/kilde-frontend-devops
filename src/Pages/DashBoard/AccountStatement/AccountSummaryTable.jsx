import { Col, Divider, Row, Spin } from "antd";
import React, { useState, useEffect } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import File from "../../../Assets/Images/File.svg";
import { camelCaseSting, formatCurrency } from "../../../Utils/Reusables";

const AccountSummaryTable = () => {
  const [transactionLoader, setTransactionLoader] = useState(true);

  const accountSummary = useSelector(
    (state) => state?.dashboards?.DashboardData?.transactionData
  );

  useEffect(() => {
    setTransactionLoader(false);
  }, [accountSummary]);

  return (
    <div>
      {transactionLoader ? (
        <Spin
          indicator={
            <LoadingOutlined
              style={{ fontSize: 50, color: "var(--kilde-blue)" }}
            />
          }
          spinning={transactionLoader}
        />
      ) : (
        <Col className="summary-table-div">
          <p className="summary-table-p m-0">Account Summary</p>
          {accountSummary?.turnovers?.length > 0 ? (
            <Row className="w-100">
              <Col xs={12} lg={12}>
                <p className="mb-5 mt-0 summary-table-openClose-p">
                  Opening balance
                </p>
              </Col>
              <Col
                xs={12}
                lg={12}
                className="sb-text-align-end summary-table-openClose-value"
              >
                <p className="mb-5 mt-0 summary-table-textright ">
                  {formatCurrency(
                    accountSummary?.currencySymbol,
                    accountSummary?.openingBalance
                  )}
                </p>
              </Col>
              <Divider className="acc-summary-divider" />
              {accountSummary?.turnovers?.map(
                (turnover, index) =>
                  turnover.total !== 0 && (
                    <React.Fragment key={index}>
                      <Col xs={12} lg={12}>
                        <p className="mb-5 mt-0 summary-table-textleft">
                          {turnover?.txTitle === "Repayment (Interest)"
                            ? "Interest earned"
                            : turnover?.txTitle ===
                              "FEE (INVESTOR_MANAGEMENT_FEE)"
                            ? "Fee (Management Fee)"
                            : camelCaseSting(turnover?.txTitle)}
                        </p>
                      </Col>
                      <Col
                        xs={12}
                        lg={12}
                        className="sb-text-align-end summary-table-openClose-value"
                      >
                        <p className="mb-5 mt-0 summary-table-textright">
                          {formatCurrency(
                            accountSummary?.currencySymbol,
                            turnover?.total
                          )}
                        </p>
                      </Col>
                      <Divider className="inv-card-divider" />
                    </React.Fragment>
                  )
              )}
              <Col xs={12} lg={12}>
                <p className="m-0 summary-table-openClose-p">Closing balance</p>
              </Col>
              <Col
                xs={12}
                lg={12}
                className="sb-text-align-end summary-table-openClose-value"
              >
                <p className="m-0 summary-table-textright ">
                  {formatCurrency(
                    accountSummary?.currencySymbol,
                    accountSummary?.closingBalance
                  )}
                </p>
              </Col>
            </Row>
          ) : (
            <div className="not-found-container">
              <img alt="nothing found" src={File} />
              <p className="not-found-text">Nothing found</p>
            </div>
          )}
        </Col>
      )}
    </div>
  );
};

export default AccountSummaryTable;
