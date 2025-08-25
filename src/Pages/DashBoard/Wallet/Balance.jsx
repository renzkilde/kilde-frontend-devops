import React from "react";
import "./Style.css";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../../Utils/Reusables";

const Balance = () => {
  const user = useSelector((state) => state?.user);

  const getBalanceForCurrency = (currencyArray, currencyCode) => {
    const currency = currencyArray?.find(
      (curr) => curr.currencyCode === currencyCode
    );
    return currency ? currency.balance : null;
  };

  return (
    <Col className="gutter-row" xl={17} lg={18} md={22} sm={24} xs={24}>
      <Row>
        <Col
          sm={24}
          md={24}
          lg={24}
          className="gutter-row wallet-info-div"
          style={{ flex: 1 }}
        >
          <Row>
            <p className="mt-0 wallet-sub-head mb-28">Your Balance</p>
          </Row>
          <Row
            className="balance-info-div sb-text-align"
            gutter={window.innerWidth >= 576 ? 40 : 0}
            style={{ textAlign: "justify" }}
          >
            <Col
              xs={24}
              sm={8}
              md={8}
              className="sing-col gutter-row sub-info-invest-col media-wallet-display-div"
            >
              <p className="mb-16 mt-0 balance-currency-head">USD</p>
              <p className="info-val m-0 media-b-m">
                {formatCurrency(
                  "$",
                  getBalanceForCurrency(user?.accounts, "USD")
                )}
              </p>
            </Col>
            <Col
              xs={24}
              sm={8}
              md={8}
              className="sing-col gutter-row media-invest-col media-wallet-display-div media-wallet-top-margin"
            >
              <p className="mb-16 mt-0 balance-currency-head">EUR</p>

              <p className="info-val m-0 media-b-m">
                {formatCurrency(
                  "€",
                  getBalanceForCurrency(user?.accounts, "EUR")
                )}
              </p>
            </Col>
            <Col
              xs={24}
              sm={8}
              md={8}
              className="gutter-row media-invest-col media-wallet-display-div media-wallet-top-margin"
            >
              <p className="mb-16 mt-0 balance-currency-head">SGD</p>

              <p className="info-val m-0 media-b-m ">
                {formatCurrency(
                  "S$",
                  getBalanceForCurrency(user?.accounts, "SGD")
                )}
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};

export default Balance;
