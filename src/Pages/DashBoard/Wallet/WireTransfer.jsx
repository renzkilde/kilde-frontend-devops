import { Breadcrumb, Col, message, Row } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import { useNavigate } from "react-router-dom";
import { handleFinish } from "../../../Utils/Reusables";
import ROUTES from "../../../Config/Routes";
import { CopyOutlined } from "@ant-design/icons";

const WireTransfer = ({ setShow }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );

  const handleCopy = (copyText) => {
    navigator.clipboard.writeText(copyText);
    message.success("Text copied to clipboard!");
  };

  return (
    <>
      {(user?.verificationState === "" ||
        user?.verificationState === null ||
        user?.verificationState === "WAITING_INVESTOR_DATA") &&
      user?.investorStatus !== "ACTIVE" ? (
        <>
          <p className="wallet-sub-head mt-0 mb-16">
            Your account is not active yet.
          </p>

          <p className="wallet-unactive-ins mt-0 mb-16">
            {user?.investorType === "INDIVIDUAL" ? (
              "You will be able to deposit and invest funds once your account is activated."
            ) : (
              <>
                Complete onboarding and KYB to unlock full platform features:
                investing, deposits, withdrawals, and currency exchange. Contact{" "}
                <a
                  href="mailto:sales@kilde.sg"
                  style={{ color: "var(--kilde-blue)" }}
                >
                  sales@kilde.sg
                </a>{" "}
                for assistance.
              </>
            )}
          </p>
          <ButtonDefault
            title="Finish Onboarding"
            onClick={() => handleFinish(user, navigate)}
          />
        </>
      ) : user?.investorStatus !== "ACTIVE" &&
        (user?.verificationState === "MANUAL_REVIEW" ||
          user?.verificationState === "COMPLETED") &&
        user?.secondFactorAuth !== null ? (
        <>
          <p className="wallet-sub-head mt-0 mb-16">
            Your account is not active yet.
          </p>
          <p className="wallet-unactive-ins mt-0 mb-16">
            {user?.investorType === "INDIVIDUAL" ? (
              "We are currently reviewing the documents you have submitted. Once the review process is complete and your KYC requirements are met, your account will be activated. After activation, you will be able to deposit funds and start investing."
            ) : (
              <>
                Complete onboarding and KYB to unlock full platform features:
                investing, deposits, withdrawals, and currency exchange. Contact{" "}
                <a
                  href="mailto:sales@kilde.sg"
                  style={{ color: "var(--kilde-blue)" }}
                >
                  sales@kilde.sg
                </a>{" "}
                for assistance.
              </>
            )}
          </p>
        </>
      ) : (user?.investorStatus !== "ACTIVE" ||
          user?.verificationState === "MANUAL_REVIEW" ||
          user?.verificationState === "COMPLETED") &&
        user?.secondFactorAuth === null &&
        user?.twoFaCheckEnabled === true ? (
        <>
          <p className="wallet-sub-head mt-0 mb-16">
            Secure your account to start investing
          </p>
          <p className="wallet-unactive-ins mt-0 mb-16">
            To begin investing, you’ll need to set up biometric login (like
            fingerprint or face ID) or two-factor authentication. It’s quick,
            secure, and required to protect your portfolio.
          </p>
          <ButtonDefault
            title="Protect your Account"
            onClick={() => navigate(ROUTES.TWO_FACTOR_AUTH)}
          />
        </>
      ) : accountNo?.length > 0 ? (
        <>
          <Row>
            <div className="mt-5">
              <Breadcrumb
                className="mb-8"
                separator=" / "
                items={[
                  {
                    title: (
                      <span
                        onClick={() => setShow("")}
                        style={{ cursor: "pointer" }}
                      >
                        Deposit
                      </span>
                    ),
                  },
                  {
                    title: "Bank transfer",
                  },
                ]}
              />
              <p className="mt-0 wallet-sub-head mb-8">
                How to deposit funds into your Kilde account
              </p>
              <p className="mt-0  mb-0 deposit-sub-heading">
                Please use a bank transfer, using the bank details below. <br />
                Please include your Investor number :{" "}
                <strong className="hover-blue">{user?.number}</strong>
                <button
                  className="copy-button"
                  onClick={() => handleCopy(`${user?.number}`)}
                >
                  <CopyOutlined />
                </button>{" "}
                in the payment reference box.
              </p>
              <p className="mt-0  mb-0 deposit-sub-heading">
                Local transfers are usally made the same day. International
                transfers take up to five working days.
              </p>
            </div>
          </Row>
          <Row className="mb-20 deposit-list">
            {/* <ol> */}
            {/* <li className="deposit-list-tag">
                    Ensure you include your Investor Number in the payment
                    reference/details to ensure accurate processing of your
                    deposit.
                    <div className="deposit-list-example m-0">
                      Payment Reference: <strong>{user?.number}</strong>
                      <button
                        className="copy-button"
                        onClick={() => handleCopy(`${user?.number}`)}
                      >
                        <CopyOutlined />
                      </button>
                    </div>
                  </li> */}
            {/* <p className="deposit-list-tag">
                  Local transfers are usally made the same day. International
                  transfers take up to five working days.
                </p> */}
            {/* <li className="deposit-list-tag">
                    Once your deposit is confirmed, your funds will be ready for
                    you to invest.
                  </li> */}
            {/* </ol> */}
          </Row>
          <Col className="deposit-bank-transffer-detail-div">
            <Row>
              <Col xs={12} lg={12}>
                <p className="mb-5 mt-0 deposit-list-title">Bank</p>
              </Col>
              <Col xs={12} lg={12} className="sb-text-align-end">
                <p className="mb-5 mt-0 card-val-tag">DBS Bank Singapore</p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="mb-5 mt-0 deposit-list-title">Beneficiary name</p>
              </Col>
              <Col xs={12} lg={12}>
                <div className="mb-5 mt-0 card-val-tag">
                  {user?.depositBankAccountType === "KILDE"
                    ? "KILDE - CLIENT MONIES ACCOUNT"
                    : "PERPETUAL ASIA LIMITED KILDE AC"}

                  <button
                    className="copy-button"
                    onClick={() =>
                      handleCopy(
                        user?.depositBankAccountType === "KILDE"
                          ? "KILDE - CLIENT MONIES ACCOUNT"
                          : "PERPETUAL ASIA LIMITED KILDE AC"
                      )
                    }
                  >
                    <CopyOutlined />
                  </button>
                </div>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 deposit-list-title">
                  Beneficiary bank account number
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <div className="m-0 mb-5 card-val-tag">
                  {user?.depositBankAccountType === "KILDE"
                    ? "0721237431"
                    : "0721270692"}{" "}
                  <button
                    className="copy-button"
                    onClick={() =>
                      handleCopy(
                        user?.depositBankAccountType === "KILDE"
                          ? "0721237431"
                          : "0721270692"
                      )
                    }
                  >
                    <CopyOutlined />
                  </button>
                </div>
              </Col>
              {/* <Col xs={12} lg={12}>
                    <p className="m-0 mb-5 deposit-list-title">
                      Beneficiary Registration Number
                    </p>
                  </Col>
                  <Col xs={12} lg={12}>
                    <p className="m-0 mb-5 card-val-tag">201533125Z</p>
                  </Col> */}
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 deposit-list-title">
                  Beneficiary bank SWIFT/BIC code
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <div className="m-0 mb-5 card-val-tag">
                  DBSSSGSG{" "}
                  <button
                    className="copy-button"
                    onClick={() => handleCopy("DBSSSGSG")}
                  >
                    <CopyOutlined />
                  </button>
                </div>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 deposit-list-title">
                  Beneficiary bank address
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <div className="m-0 mb-5 card-val-tag">
                  12 Marina Boulevard, DBS Asia Central, Marina Bay Financial
                  Centre Tower 3, Singapore 018982
                  <button
                    className="copy-button"
                    onClick={() =>
                      handleCopy(
                        "12 Marina Boulevard, DBS Asia Central, Marina Bay Financial Centre Tower 3, Singapore 018982"
                      )
                    }
                  >
                    <CopyOutlined />
                  </button>
                </div>
              </Col>
              <Col xs={24} lg={24} className="mt-20">
                <p className="filter-subtitle m-0">Payment details</p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 deposit-list-title">
                  Investor account number
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-val-tag">
                  {user?.number}{" "}
                  <button
                    className="copy-button"
                    onClick={() => handleCopy(user?.number)}
                  >
                    <CopyOutlined />
                  </button>
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 deposit-list-title">
                  Payment instruction
                </p>
              </Col>
              <Col xs={12} lg={12}>
                <p className="m-0 mb-5 card-val-tag">
                  OUR: Charges are borne by the Remitter
                </p>
              </Col>
            </Row>
          </Col>
        </>
      ) : (
        <>
          <p className="wallet-sub-head mt-0 mb-16">
            Banking Information Required
          </p>
          <p className="wallet-unactive-ins mt-0 mb-16">
            To start investing, please provide your banking information for fund
            deposits.
          </p>
        </>
      )}
    </>
  );
};

export default WireTransfer;
