import React, { useEffect, useState } from "react";
import paynow from "../../../Assets/Images/paynow.svg";
import wire from "../../../Assets/Images/wiretransfer.svg";
import arrow from "../../../Assets/Images/frontarrow.svg";
import WireTransfer from "./WireTransfer";
import PayNow from "./PayNow";
import { Col, message, Row } from "antd";
import { useSelector } from "react-redux";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import { useNavigate } from "react-router-dom";
import { handleFinish } from "../../../Utils/Reusables";
import ROUTES from "../../../Config/Routes";
import paynowimg from "../../../Assets/Images/paynow-seeklogo 2 1.svg";

const Deposit = ({ sendData }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );
  const [show, setShow] = useState("");

  useEffect(() => {
    sendData(show);
  }, [sendData, show]);

  const handleCopy = (copyText) => {
    navigator.clipboard.writeText(copyText);
    message.success("Text copied to clipboard!");
  };

  return (
    <Row>
      <Col
        sm={24}
        md={24}
        lg={24}
        className="gutter-row wallet-info-div"
        style={{ flex: 1 }}
      >
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
                  investing, deposits, withdrawals, and currency exchange.
                  Contact{" "}
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
                  investing, deposits, withdrawals, and currency exchange.
                  Contact{" "}
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
              {" "}
              {show === "PayNow" ? (
                <PayNow setShow={setShow} />
              ) : show === "wire" ? (
                <WireTransfer setShow={setShow} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p className="wallet-sub-head m-0 mb-16">
                    How would you like to deposit?
                  </p>
                  <div
                    className="deposit-div"
                    onClick={() => setShow("PayNow")}
                  >
                    <img src={paynow} alt="PayNow Icon" />
                    <div style={{ flex: 1, marginLeft: "16px" }}>
                      <p className="m-0 deposit-head-p">
                        <img src={paynowimg} alt="paynowimg" />
                      </p>
                      <p className="m-0 mt-4 deposit-second-p">
                        Fastest - Receive funds instantly
                      </p>
                      <p className="mb-4 mt-4 deposit-second-p">
                        Use PayNow to transfer funds to your Kilde account from
                        any bank in Singapore, including DBS/POSB, OCBC, UOB,
                        and others.
                      </p>
                      <p className="m-0 deposit-third-p">
                        For SGD transfers only.
                      </p>
                    </div>
                    <img src={arrow} alt="Arrow Icon" />
                  </div>

                  <div className="deposit-div" onClick={() => setShow("wire")}>
                    <img src={wire} alt="Wire Icon" />
                    <div style={{ flex: 1, marginLeft: "16px" }}>
                      <p className="m-0 deposit-head-p">Bank Transfer</p>
                      <p className="m-0 mt-4 deposit-second-p">
                        Processing time varies - Up to 1 business day for local
                        transfers, and up to 5 business days for telegraphic
                        transfers.
                      </p>
                      <p className="mt-4 mb-4 deposit-second-p">
                        Send funds to your Kilde account from any bank. For both
                        local and international transfers.
                      </p>
                      <p className="m-0 deposit-third-p">
                        Note: Sending USD/EUR from a local non-DBS bank to our
                        escrow account will be treated as a telegraphic
                        transfer.
                      </p>
                    </div>
                    <img src={arrow} alt="Arrow Icon" />
                  </div>
                </div>
              )}
            </Row>
          </>
        ) : (
          <>
            <p className="wallet-sub-head mt-0 mb-16">
              Banking Information Required
            </p>
            <p className="wallet-unactive-ins mt-0 mb-16">
              To start investing, please provide your banking information for
              fund deposits.
            </p>
          </>
        )}
      </Col>
    </Row>
  );
};

export default Deposit;
