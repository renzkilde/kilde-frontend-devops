import React, { useEffect, useState } from "react";
import TotpIcon from "../../Assets/Images/SVGs/totp-setup-icon-new.svg";
import FAConfirmIcom from "../../Assets/Images/SVGs/2fa-confirm.svg";
import OtpInput from "react18-input-otp";
import { Link } from "react-router-dom";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault.jsx";

import GlobalVariabels from "../../Utils/GlobalVariabels.js";

import { convertMaskedFormat } from "../../Utils/Reusables.js";
import { useWindowWidth } from "../../Utils/Reusables.js";

const TwoFAComponent = ({
  onInit,
  onAuthenticate,
  secFactorAuth,
  loader,
  codes,
  mobileNo,
  usedIn,
  icon,
  showFooter,
  changeContent,
  user,
  changeStyle,
  clearOtp,
}) => {
  const windowWidth = useWindowWidth();
  const [otp, setOtp] = useState("");
  const [code, setCode] = useState(codes || "");
  const [time, setTime] = useState(59);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [mobile, setMobile] = useState(mobileNo || "");

  let currentEnv = GlobalVariabels.NODE_ENV;

  useEffect(() => {
    setCode(codes || "");
  }, [codes]);

  const resendInit = async () => {
    setIsTimerRunning(true);
    setTime(59);
    await onInit()
      .then((res) => {
        if (res) {
          setCode(res.authenticationCode || "");
          setMobile(res.mobilePhone || "");
        }
      })
      .catch(() => {
        console.error("Error re-sending 2FA code");
      });
  };

  // AUTO VERIFY OTP
  useEffect(() => {
    if (otp.length === 6) {
      handleAuthentication(otp);
    }
  }, [otp]);

  useEffect(() => {
    const intervalTimer = setInterval(() => {
      if (isTimerRunning) {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalTimer);
            setIsTimerRunning(false);
          }
          return prevTime - 1;
        });
      }
    }, 1000);

    return () => clearInterval(intervalTimer);
  }, [isTimerRunning]);

  const handleAuthentication = async () => {
    if (!otp) {
      console.error("Please enter OTP");
      return;
    }

    await onAuthenticate(otp)
      .catch(() => {
        console.error("Authentication failed");
      })
      .finally(() => {
        console.log("Authentication passed");
        if (clearOtp) {
          setOtp("");
        }
      });
  };

  const inputStyle = {
    borderRadius: "12px",
    border: "1px solid rgba(26, 32, 44, 0.10)",
    background: "rgba(255, 255, 255, 0.80)",
    width: windowWidth <= 380 ? "35px" : "40px",
    marginLeft: "4px",
    marginRight: "4px",
    height: windowWidth <= 380 ? "35px" : "40px",
    fontSize: "14px",
    padding: "4px 12px",
    color: "var(--kilde-blue)",
  };

  return (
    <div
      className={
        usedIn === "login"
          ? "sb-onboarding-form-container"
          : "twofa-addresschange"
      }
    >
      {/* {changeContent && (
        <div className="setupsinfo-container">
          <h3>Setup Passkey</h3>
          <p>Setup passkey to login faster and more securely.</p>
        </div>
      )} */}
      <div className="sb-flex-column-item-center mb-28">
        {icon ? (
          <img src={icon} alt="totp" className="kl-mobile" />
        ) : secFactorAuth === "TOTP" ? (
          <img src={TotpIcon} alt="totp" className="kl-mobile" />
        ) : (
          <img src={FAConfirmIcom} alt="sms" className="kl-mobile" />
        )}
      </div>
      <div>
        <p className="kl-title  m-0">
          {changeContent
            ? "Two-Factor Authentication"
            : "Two-Factor Authentication"}
        </p>

        {changeStyle ? (
          <p className="kl-subtitle mt-8 mb-28">
            {secFactorAuth === "TOTP" ? (
              "Enter current one time password from your Google Authentication app."
            ) : (
              <>
                Enter the verification code we sent to{" "}
                {convertMaskedFormat(mobile)}
                <br />
                via SMS text or WhatsApp
              </>
            )}
          </p>
        ) : (
          <p className="kl-subtitle mt-8 mb-28">
            {secFactorAuth === "TOTP" ? (
              "Enter current one time password from your Google Authentication app."
            ) : (
              <>
                Enter the verification code we sent to{" "}
                {convertMaskedFormat(mobile)}
                <br />
                via SMS text or WhatsApp
              </>
            )}
          </p>
        )}
      </div>

      <div className="sb-otp-input-div mb-28">
        <OtpInput
          value={otp}
          onChange={setOtp}
          inputStyle={inputStyle}
          numInputs={6}
          renderSeparator={<span></span>}
          isInputNum={true}
          inputProps={{ type: "number", inputMode: "numeric" }}
          renderInput={(props) => (
            <input {...props} type="number" inputMode="numeric" />
          )}
          shouldAutoFocus
        />
      </div>

      {secFactorAuth === "SMS" && isTimerRunning === true && (
        <div className="kd-resend">
          <p className="mb-16">
            Resend code in{" "}
            <span id="timer">{isTimerRunning ? `(${time}s)` : ""}</span>{" "}
          </p>
        </div>
      )}
      {secFactorAuth === "SMS" && isTimerRunning === false && (
        <p
          className="sb-twofa-link mb-16"
          onClick={isTimerRunning ? null : resendInit}
        >
          <Link> Resend Code</Link>
        </p>
      )}

      <div className="sb-TwoFa-actions m-0">
        {currentEnv === "DEV" &&
          (secFactorAuth === "SMS" ||
            secFactorAuth === null ||
            user?.secondFactorAuth === "SMS") && (
            <div>
              <p style={{ textAlign: "right", color: "#ddd", margin: "0px" }}>
                Authentication Code: {code}
              </p>
            </div>
          )}

        <ButtonDefault
          title="Verify"
          block={true}
          loading={loader}
          onClick={handleAuthentication}
          style={{ marginTop: "12px" }}
        />
      </div>

      {showFooter && (
        <>
          <p
            className="kl-subtitle"
            style={{ margin: "12px 0px 5px 0px", padding: 0 }}
          >
            Didn’t get the code?
          </p>
          <p className="kl-subtitle" style={{ margin: 0, padding: 0 }}>
            Contact{" "}
            <Link
              style={{
                fontSize: 14,
                color: "var(--kilde-blue)",
              }}
              to="mailto:sales@kilde.sg"
            >
              sales@kilde.sg
            </Link>{" "}
            if the issue persists
          </p>
        </>
      )}
    </div>
  );
};

export default TwoFAComponent;
