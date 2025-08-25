import { Button, message, Modal, QRCode } from "antd";
import React, { useEffect, useState } from "react";
import OtpInput from "react18-input-otp";
import {
  enableSMS,
  enableTOTP,
  getUser,
  setupSms,
  setupTotp,
} from "../../Apis/UserApi.js";
import GlobalVariabels from "../../Utils/GlobalVariabels.js";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault.jsx";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentSate } from "../../Redux/Action/common.js";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../Redux/Action/User.js";
import ROUTES from "../../Config/Routes.js";
import {
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
  useWindowWidth,
} from "../../Utils/Reusables.js";
import ReactLoading from "react-loading";
import SMS from "../../Assets/Images/sms-2fa.svg";
import Device from "../../Assets/Images/auth-2fa.svg";
import PasskeyIcon from "../../Assets/Images/SVGs/passkey-icon.svg";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./style.css";
import {
  getPassKeyChallenge,
  getPassKeyToggleStatus,
  registerPasskey,
} from "../../Apis/InvestorApi.js";
import { startRegistration } from "@simplewebauthn/browser";

const TwoFAModal = ({ twoFaModal, setTwoFaModal, setShouldNavigate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();
  const user = useSelector((state) => state.user);
  const [time, setTime] = useState(59);
  const [setUpSMS, setSetUpSMS] = useState(false);
  const [tOtpLoader, setTotpLoader] = useState(false);
  const [totp, setTotp] = useState(false);
  const [qrUrl, setQrURL] = useState("");
  const [tOTPLoader, setTOTPLoader] = useState(false);
  const [otp, setOtp] = useState("");
  const [twoFaLoader, setTwoFaLoader] = useState(false);
  let currentEnv = GlobalVariabels.NODE_ENV;
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [email, setEmail] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [loader, setLoader] = useState(false);
  const current = useSelector((state) => state.common.current);

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        setEmail(response?.email);
        return response;
      } else {
        console.error("Error fetching user data:");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    getPassKeyToggleStatus()
      .then((res) => {
        if (res?.passkeyFeatureEnabled === true) {
          setShowPasskey(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setShowPasskey(true);
      });
  }, []);

  const handleEnablePasskey = async () => {
    setLoader(true);
    try {
      await getPassKeyChallenge()
        .then(async (res) => {
          let publicKeyCredentialCreationOptions = res;

          const attestationResponse = await startRegistration(
            publicKeyCredentialCreationOptions
          );

          let updatedReponse = {
            ...attestationResponse,
            email,
          };

          await registerPasskey(updatedReponse)
            .then((res) => {
              message.success(res?.message);
              setLoader(false);
              handleContinue();
            })
            .catch((err) => {
              console.log(err);
              if (err.name === "AbortError" || err.name === "NotAllowedError") {
                message.info("Passkey setup was canceled.");
              } else {
                console.error("Error during passkey registration:", err);
                message.error("Something went wrong.. Please try again.");
              }
              setLoader(false);
            });
        })
        .catch((err) => {
          if (err.name === "AbortError" || err.name === "NotAllowedError") {
            message.info("Passkey setup was cancelled.");
          } else {
            console.error("Error during passkey registration:", err);
            message.error("Something went wrong.. Please try again.");
          }
          setLoader(false);
        });
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

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

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTwoFaAuth = async () => {
    setTwoFaLoader(true);
    await setupSms()
      .then((res) => {
        showMessageWithCloseIcon(
          "We've sent an OTP to your mobile number. Please check your messages."
        );
        window?.dataLayer?.push({
          event: "click_SMS_Setup",
          user_id: user?.number,
          register_method: user?.registrationType,
        });
        setIsTimerRunning(true);
        setTime(59);
        setSetUpSMS(res);
        setTwoFaLoader(false);
      })
      .catch(() => {
        setTwoFaLoader(false);
      });
  };

  const handleEnableSMS = async () => {
    setTwoFaLoader(true);
    if (otp !== "") {
      const requestBody = {
        smsToken: otp,
      };
      const response = await enableSMS(requestBody);
      if (!response) {
        window?.dataLayer?.push({
          event: "authenticationTwoFactorConfirm",
          user_id: user?.number,
          register_method: user?.registrationType,
        });
        showMessageWithCloseIcon(
          "You've successfully enabled Two-Factor Authentication for your account."
        );
        await getUserDetails();
        setTwoFaLoader(false);
        setSetUpSMS(true);
        setIsTimerRunning(false);
      } else {
        setTwoFaLoader(false);
      }
    } else {
      setTwoFaLoader(false);
      showMessageWithCloseIconError("Please enter OTP!");
    }
  };

  const skipForNow = async () => {
    setTwoFaModal(false);
    window?.dataLayer?.push({
      event: "Iwill_doItLater",
      user_id: user?.number,
      register_method: user?.registrationType,
    });
    if (user?.singpassUser === true) {
      setShouldNavigate(true);
    } else {
      if (user?.investorType === "INDIVIDUAL") {
        setCurrentSate(current + 1, dispatch);
      } else {
        setCurrentSate(2, dispatch);
      }
    }
  };

  const handleContinue = async () => {
    setTwoFaModal(false);
    if (user?.singpassUser === true) {
      if (user?.investorType === "INDIVIDUAL") {
        navigate(ROUTES.INDIVIDUAL_VERIFICATION);
      } else {
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
      }
    } else {
      if (user?.investorType === "INDIVIDUAL") {
        setCurrentSate(current + 1, dispatch);
      } else {
        setCurrentSate(2, dispatch);
      }
    }
  };

  const inputStyle = {
    borderRadius: "var(--12, 12px)",
    border: "1px solid var(--black-10, rgba(26, 32, 44, 0.10))",
    background: "var(--white-80, rgba(255, 255, 255, 0.80))",
    width: windowWidth <= 380 ? "35px" : "40px",
    marginLeft: "4px",
    marginRight: "4px",
    height: windowWidth <= 380 ? "35px" : "40px",
    fontSize: "14px",
    fontWeight: "400",
    padding: "var(--4, 4px) var(--12, 12px)",
    color: "var(--kilde-blue)",
  };

  const handleSetupTotp = async () => {
    setTotpLoader(true);
    await setupTotp()
      .then((res) => {
        if (res) {
          window?.dataLayer?.push({
            event: "click_GAuthenticator_Setup",
            user_id: user?.number,
            register_method: user?.registrationType,
          });
          setTotp("showqr");
          setQrURL(res?.registrationURL);
          setTotpLoader(false);
        }
      })
      .catch(() => {
        setTotpLoader(false);
      });
  };

  const handleAuthentication = async () => {
    setTOTPLoader(true);
    if (otp !== "") {
      const requestBody = {
        totpToken: otp,
      };
      const response = await enableTOTP(requestBody);
      if (!response) {
        await getUserDetails();
        showMessageWithCloseIcon(
          "You've successfully enabled Two-Factor Authentication for your account."
        );
        setTotp("completed");
        window?.dataLayer?.push({
          event: "authenticationTwoFactorConfirm",
          user_id: user?.number,
          register_method: user?.registrationType,
        });
        window.scrollTo(0, 0);
        setTOTPLoader(false);
      } else {
        setTOTPLoader(false);
      }
    } else {
      setTOTPLoader(false);
      showMessageWithCloseIconError("Please enter 6 digit OTP!");
    }
  };

  const handleGoBack = () => {
    setTotp(false);
    setSetUpSMS(false);
  };

  return (
    <div>
      <Modal
        open={twoFaModal}
        footer={null}
        onCancel={skipForNow}
        maskClosable={false}
        closable={true}
        width={470}
      >
        {(Object.keys(setUpSMS).length > 0 || totp === "showqr") && (
          <ArrowLeftOutlined onClick={handleGoBack} />
        )}

        <div style={{ padding: "20px" }}>
          <div className="kd-2fa-firstdiv">
            {/* {setUpSMS?.phoneNumber ? (
              <img src={twofaicon} alt="2fa" />
            ) : setUpSMS === true ? (
              <img src={twofadone} alt="2fa" />
            ) : (
              <img src={DeviceMobile} alt="2fa" />
            )} */}

            {setUpSMS?.phoneNumber ? (
              <>
                <p className="sb-TwoFa-title m-0">Enter Authentication Code</p>
                <p className="sb-TwoFa-subtitle m-0">
                  We have sent a code to <b>{user?.mobilePhone}</b>
                </p>
              </>
            ) : setUpSMS === true || totp === "completed" ? (
              <>
                <p className="sb-TwoFa-title m-0">2FA Setup Completed</p>
                {user?.secondFactorAuth === "SMS" ? (
                  <p className="sb-TwoFa-subtitle m-0 mb-24">
                    Your account is more secure. You will receive a verification
                    code via SMS to your number <b>{user?.mobilePhone}</b> for
                    every login.
                  </p>
                ) : (
                  <p className="sb-TwoFa-subtitle m-0 mb-24">
                    Your account is more secure. You will need to enter a
                    verification code from your authenticator app for every
                    login.
                  </p>
                )}
              </>
            ) : totp === "showqr" ? (
              <div>
                <div>
                  <p className="auth-head">
                    1.Install the Google Authenticator app on your device
                  </p>
                  <p className="auth-head">
                    2.Scan the QR code with Google Authenticator app.
                  </p>
                </div>

                <div className="sb-TwoFa-center">
                  {qrUrl ? (
                    <QRCode type="svg" value={qrUrl} size={100} />
                  ) : (
                    <p>Loading QR Code...</p>
                  )}
                </div>
                <p className="auth-head">
                  3.Enter the current one time password for your Google
                  Authenticator app.
                </p>

                <div
                  className="authenticate-otp-input-div mb-16"
                  style={{ justifyContent: "center" }}
                >
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    inputStyle={{
                      border: "1px solid #1A202C1A",
                      borderRadius: "12px",
                      width: "40px",
                      height: "40px",
                      fontSize: "18px",
                      fontWeight: "400",
                    }}
                    numInputs={6}
                    renderSeparator={<span></span>}
                    isInputNum={true}
                    inputProps={{
                      type: "number",
                      inputMode: "numeric",
                    }}
                    renderInput={(props) => (
                      <input {...props} type="number" inputMode="numeric" />
                    )}
                  />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  className="mt-24 mb-16"
                >
                  <ButtonDefault
                    title="Enable"
                    onClick={handleAuthentication}
                    loading={tOTPLoader}
                    block={true}
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="sb-TwoFa-title m-0">
                  Protect your investments
                  <br /> with two-factor authentication
                </p>
                <p className="sb-TwoFa-subtitle m-0 mb-12">
                  Add an extra layer of security to keep your account and funds
                  safe.
                </p>
                <div>
                  {" "}
                  {(tOtpLoader === true || twoFaLoader === true) && (
                    <div
                      style={{
                        position: "absolute",

                        left: "50%",
                        top: "50%",
                        zIndex: 99,
                        transform: "translate(-37px, -33px)",
                      }}
                    >
                      <ReactLoading
                        type="spin"
                        color="var(--kilde-blue)"
                        height={60}
                        width={60}
                      />
                    </div>
                  )}
                  {showPasskey && (
                    <div
                      className="setting-twofa-modal mb-12"
                      style={{ position: "relative" }}
                    >
                      <div className="twofamodal-subdiv">
                        <img src={PasskeyIcon} alt="authenticateapp" />
                        <div>
                          <p className="twofa-recom m-0">Recommended</p>
                          <p className=" auth-head m-0 mt-4">Passkey</p>
                          <p className="twofamodal-tag mt-4 m-0">
                            Instant Sign-in using Face ID, Touch ID or Device
                            passcode. No passwords, no OTPs.
                          </p>
                        </div>
                      </div>
                      <Button
                        className="twofa-setup"
                        onClick={handleEnablePasskey}
                        loading={loader}
                      >
                        Set Up
                      </Button>
                    </div>
                  )}
                  <div
                    className="setting-twofa-modal mb-12"
                    style={{ position: "relative" }}
                  >
                    <div className="twofamodal-subdiv">
                      <img src={Device} alt="authenticateapp" />
                      <div>
                        <p className=" auth-head m-0 mt-4">
                          Google Authenticator
                        </p>
                        <p className="twofamodal-tag mt-4 m-0">
                          Use the authenticator app for login code
                        </p>
                      </div>
                    </div>
                    <Button
                      className="twofa-setup-sms"
                      onClick={handleSetupTotp}
                    >
                      Set Up
                    </Button>
                  </div>
                  <div className="setting-twofa-modal">
                    <div className="twofamodal-subdiv ">
                      <img src={SMS} alt="sms" />
                      <div>
                        <p className="auth-head m-0">SMS Verification</p>
                        <p className="twofamodal-tag mt-4 m-0">
                          Receive a OTP via SMS
                        </p>
                      </div>
                    </div>
                    <Button
                      className="twofa-setup-sms"
                      onClick={handleTwoFaAuth}
                    >
                      Set Up
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* {setUpSMS === false && (
            <p className="sb-TwoFa-title mt-24 mb-24">{user?.mobilePhone}</p>
          )} */}
          {/* {(setUpSMS === false || setUpSMS === true) && (
            <p
              className={
                setUpSMS === true
                  ? "sb-twofa-link mt-12 mb-24"
                  : "sb-twofa-link mt-0 mb-24"
              }
            >
              To change your account information, contact us at{" "}
              <span>
                <Link to="mailto:sales@kilde.sg">sales@kilde.sg</Link>
              </span>
            </p>
          )} */}
          {setUpSMS?.phoneNumber !== undefined && (
            <div className="sb-otp-input-div mt-24 mb-24">
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
          )}
          {isTimerRunning && Object.keys(setUpSMS).length > 0 && (
            <div className="kd-resend">
              <p className="mt-0 mb-0">
                Resend code in{" "}
                <span id="timer">{isTimerRunning ? `(${time}s)` : ""}</span>{" "}
              </p>
            </div>
          )}
          {!isTimerRunning && setUpSMS?.phoneNumber !== undefined && (
            <p className="sb-twofa-link mb-0" onClick={handleTwoFaAuth}>
              <Link> Resend Code</Link>
            </p>
          )}

          <div className="sb-TwoFa-actions">
            {currentEnv === "DEV" && setUpSMS?.code && (
              <div>
                <p
                  style={{ textAlign: "right", color: "#ddd" }}
                  className="mt-0 mb-5"
                >
                  Authentication Code: {setUpSMS?.code}
                </p>
              </div>
            )}
            {(setUpSMS?.phoneNumber !== undefined ||
              setUpSMS === true ||
              totp === "completed") && (
              <ButtonDefault
                title={
                  setUpSMS?.phoneNumber !== undefined ? "Verify" : "Continue"
                }
                block={true}
                onClick={
                  setUpSMS?.phoneNumber !== undefined
                    ? handleEnableSMS
                    : handleContinue
                }
                loading={twoFaLoader}
              />
            )}

            <>
              {user?.secondFactorAuth === null &&
              setUpSMS === false &&
              totp !== "showqr" ? (
                <p
                  className="mt-20 twofa-dothislater cursor-pointer"
                  onClick={skipForNow}
                >
                  I’ll do this later
                </p>
              ) : null}
            </>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TwoFAModal;
