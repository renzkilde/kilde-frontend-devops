import { Breadcrumb, Col, message } from "antd";
import React from "react";
import { useState } from "react";
import dot from "../../../Assets/Images/DotOutline.svg";
import copy from "../../../Assets/Images/CopyButton.svg";
import caretup from "../../../Assets/Images/CaretUp.svg";
import caretdown from "../../../Assets/Images/CaretDown.svg";
import { useSelector } from "react-redux";

const PayNow = ({ setShow }) => {
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);

  const [third, setThird] = useState(false);

  const user = useSelector((state) => state.user);

  const toggleFirst = () => {
    setFirst(!first);
  };

  const toggleSecond = () => {
    setSecond(!second);
  };

  const toggleThird = () => {
    setThird(!third);
  };

  const handleCopy = (copyText) => {
    navigator.clipboard.writeText(copyText);
    message.success("Text copied to clipboard!");
  };

  return (
    <>
      <div style={{ display: "block", width: "100%" }}>
        <Breadcrumb
          className="mb-8"
          separator=" / "
          items={[
            {
              title: (
                <span onClick={() => setShow("")} style={{ cursor: "pointer" }}>
                  Deposit
                </span>
              ),
            },
            {
              title: "Paynow",
            },
          ]}
        />

        <div>
          <p className="wallet-sub-head m-0 mb-20">Paynow</p>

          <div className="mb-24">
            <div onClick={toggleFirst} className="paynow-div m-0">
              <p className="m-0">Option 1: use Scan & Pay</p>
              {first ? (
                <img src={caretup} alt="up" />
              ) : (
                <img src={caretdown} alt="down" />
              )}
            </div>

            {first && (
              <>
                <div>
                  <ol>
                    <li>
                      <div className="sb-flex mb-8">
                        <p className="notification-title">
                          Open your banking app and go to PayNow
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="sb-flex mb-8">
                        <p className="notification-title">
                          Select ‘Scan & Pay’ and scan the QR code displayed on
                          the Kilde platform.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="sb-flex mb-8">
                        <p className="notification-title">
                          Verify the recipient: Perpetual (Asia) Limited - Kilde
                          AC.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="sb-flex mb-8">
                        <p className="notification-title">
                          Enter the payment amount
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="sb-flex mb-8">
                        <p className="notification-title">
                          Check your prefilled investor identification number{" "}
                          <span
                            style={{
                              color: "var(--kilde-blue)",
                              cursor: "pointer",
                            }}
                            onClick={() => handleCopy(user?.number)}
                          >
                            {user?.number}
                          </span>
                          <img
                            src={copy}
                            alt="copy"
                            className="cursor-pointer"
                            onClick={() => handleCopy(user?.number)}
                            style={{
                              width: "15px",
                              height: "15px",
                            }}
                          />{" "}
                          in the reference field.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="sb-flex mb-8">
                        <p className="notification-title">
                          Confirm and complete the payment.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
                <div>
                  <p className="notification-title">
                    You can save the QR code for future top-ups by clicking the
                    ‘Save image’ button under the QR code.
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="mb-24">
            <div onClick={toggleSecond} className="paynow-div m-0">
              <p className="m-0">
                {" "}
                Option 2: use your Unique Entity Number (Singapore UEN)
              </p>
              {second ? (
                <img src={caretup} alt="up" />
              ) : (
                <img src={caretdown} alt="down" />
              )}
            </div>

            {second && (
              <div>
                <ol>
                  <li>
                    <div className="sb-flex mb-8">
                      <p className="notification-title ">
                        Open your banking app and go to PayNow.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="sb-flex mb-8">
                      <p className="notification-title ">
                        Select ‘Transfer via UEN’ and enter{" "}
                        <span
                          style={{ color: "var(--kilde-blue)" }}
                          onClick={() => handleCopy("200518022MKLD")}
                          className="cursor-pointer"
                        >
                          200518022MKLD
                        </span>
                        <img
                          src={copy}
                          alt="copy"
                          className="cursor-pointer"
                          onClick={() => handleCopy("200518022MKLD")}
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "2px",
                          }}
                        />{" "}
                        .
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="sb-flex mb-8">
                      <p className="notification-title ">
                        Verify the recipient: Perpetual (Asia) Limited - Kilde
                        AC.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="sb-flex mb-8">
                      <p className="notification-title ">
                        Enter the payment amount and your investor
                        identification number{" "}
                        <span
                          style={{ color: "var(--kilde-blue)" }}
                          onClick={() => handleCopy(user?.number)}
                          className="cursor-pointer"
                        >
                          {user?.number}
                        </span>
                        <img
                          src={copy}
                          alt="copy"
                          className="cursor-pointer"
                          onClick={() => handleCopy("200518022MKLD")}
                          style={{
                            width: "15px",
                            height: "15px",
                          }}
                        />{" "}
                        in the reference field.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="sb-flex mb-8">
                      <p className="notification-title ">
                        Confirm and complete the payment.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PayNow;
