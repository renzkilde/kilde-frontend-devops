/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import ReactLoading from "react-loading";
import { useEffect } from "react";
import "./style.css";
import {
  authenticateCodeNon2FA,
  enableSMS,
  enableSMS2FA,
  enableTOTP,
  getUser,
  sendVerificationCode,
  sendVerificationCode2FA,
  setupSms,
  setupTotp,
  updateMobileNo,
  verifyEmail,
} from "../../Apis/UserApi";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../../Layouts/BlankHeaderLayout/AuthLayout";
import shieldIcon from "../../Assets/Images/SVGs/passkey-setup-2fa-prompt.svg";
import Cookies from "js-cookie";
import { setUserDetails } from "../../Redux/Action/User";
import Sms2FaIcon from "../../Assets/Images/SVGs/smsicon.svg";
import { PublicEventApi } from "../../Apis/PublicApi";
import paskeyIcon from "../../Assets/Images/SVGs/passkeyicon.svg";
import authenticatoricon from "../../Assets/Images/SVGs/authenticatoricon.svg";
import smsIcon from "../../Assets/Images/SVGs/smsicon.svg";
import PasskeyDoneIcon from "../../Assets/Images/SVGs/passkey-setup-done.svg";
import { Button, Col, Divider, message, Modal, QRCode } from "antd";
import {
  getPassKeyChallenge,
  getPassKeyToggleStatus,
  getSystemId,
  registerPasskey,
  statusCheck,
  suppress2faPrompt,
} from "../../Apis/InvestorApi";
import SMSIcon from "../../Assets/Images/SVGs/ChatText.svg";
import { startRegistration } from "@simplewebauthn/browser";
import {
  APP_STORE_LINKS,
  convertMaskedFormat,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
  updateAuthToken,
} from "../../Utils/Reusables";
import totpSetupIcon from "../../Assets/Images/SVGs/totp-setup-icon.svg";
import OtpInput from "react18-input-otp";
import GlobalVariabels from "../../Utils/GlobalVariabels";
import TwoFAComponent from "../TwoFAPage/TwoFAContent";
// import { useSnackbar } from "react-simple-snackbar";
import PhoneInput from "react-phone-input-2";
import setupSmsIcon from "../../Assets/Images/SVGs/sms-setup-icon.svg";
import { Redirection } from "../LoginPage/Redirection";
import {
  getDeviceNamesFromPasskeys,
  getOSAndBrowser,
} from "../../Utils/Helpers";
import { set } from "date-fns";

const SecurityPromptPage = () => {
  const [loader, setLoader] = useState(false);
  const [skipLoader, setSkipLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [email, setEmail] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [time, setTime] = useState(59);
  const [setUpSMS, setSetUpSMS] = useState(false);
  const [tOtpLoader, setTotpLoader] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [totp, setTotp] = useState(false);
  const [qrUrl, setQrURL] = useState("");
  const [tOTPLoader, setTOTPLoader] = useState(false);
  const [otp, setOtp] = useState("");
  const [twoFaLoader, setTwoFaLoader] = useState(false);
  const [smsModal, setSmsModal] = useState(false);
  const [smsAuth, setSmsAuth] = useState(false);
  const [code, setCode] = useState("");
  const [secFactorAuth, setSecFactorAuth] = useState("");
  // const [openSnackbar, closeSnackbar] = useSnackbar();
  const [methodStarted, setMethodStarted] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [isPassKeyEnabled, setIsPassKeyEnabled] = useState(false);
  const [enterMobile, setEnterMobile] = useState(false);
  const [countryCode, setCountryCode] = useState("sg");
  const [newMobile, setNewMobile] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [passkeyDone, setPasskeyDone] = useState(false);
  const [totpModalVisible, setTotpModalVisible] = useState(false);
  const [smsSetupModalVisible, setSmsSetupModalVisible] = useState(false);
  const [twoFaDone, setTwoFaDone] = useState(false);
  const [isSetupSMS, setIsSetupSMS] = useState(null);

  let currentEnv = GlobalVariabels.NODE_ENV;
  const user = useSelector((state) => state?.user);

  const getUserDetails = async () => {
    const response = await getUser();
    if (response) {
      setUserDetails(response, dispatch);
      setEmail(response?.email);
      localStorage.setItem("hasPasskey", response?.passkeyEnabled);
      localStorage.setItem(
        "availableDevices",
        getDeviceNamesFromPasskeys(response?.passkeys)
      );
    } else {
      console.error("Error fetching user data:");
    }
  };

  useEffect(() => {
    getUserDetails();
    // openSnackbar("✅ Your email has been Verified!");
  }, []);

  const handleSetupPasskey = () => {
    setLoader(true);
    window?.dataLayer?.push({
      event: "security-prompt-passkey-setup",
      user_id: user?.number,
      register_method: user?.registrationType,
    });
    if (user?.registrationType === "GOOGLE" && user?.mobilePhone === "") {
      setEnterMobile(true);
      setSmsModal(true);
      setLoader(false);
      return;
    }
    try {
      if (user?.secondFactorAuth === null) {
        setSmsAuth(false);
        setSmsModal(true);
        sendVerificatioNon2Fa();
        setSecFactorAuth("SMS");
      } else if (user?.secondFactorAuth === "SMS") {
        setSmsAuth(true);
        setSmsModal(true);
        sendVerification();
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  const sendVerification = async () => {
    try {
      const res = await sendVerificationCode();
      if (res?.length === 0) {
        showMessageWithCloseIconError("Something went wrong, Try again!");
      } else {
        console.log(res, "res in sendVerification");
        setSecFactorAuth(res?.secondFactorAuth);
        setCode(res?.verificationCode);
        setLoader(false);

        showMessageWithCloseIcon(
          res?.secondFactorAuth === "TOTP"
            ? "Please check your authentication app for the current one-time password"
            : "We've sent an OTP to your mobile number. Please check your messages."
        );
      }
    } catch (err) {
      console.error("2FA API error:", err);
      setLoader(false);
    }
  };

  const sendVerificatioNon2Fa = async () => {
    try {
      const res = await sendVerificationCode2FA();
      setSecFactorAuth(user?.secondFactorAuth);
      setCode(res?.verificationCode);
      setSmsModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInit = () => sendVerificationCode();

  const handlePasskeyRegistration = async () => {
    setLoader(true);
    setTwoFaDone(false);
    try {
      const res = await getPassKeyChallenge();
      const attestationResponse = await startRegistration(res);

      const updatedResponse = {
        ...attestationResponse,
        email,
      };

      const registerRes = await registerPasskey(updatedResponse);
      message.success(registerRes?.message);

      if (user?.secondFactorAuth === null) {
        try {
          await enableSMS2FA();
          window?.dataLayer?.push({
            event: "security-prompt-sms-2fa-enabled",
            user_id: user?.number,
            register_method: user?.registrationType,
          });
        } catch (err) {
          console.error("Error enabling SMS 2FA:", err);
          // Optional: show error if SMS enabling fails
        }
      }

      setPasskeyDone(true);
    } catch (err) {
      if (err.name === "AbortError" || err.name === "NotAllowedError") {
        message.info("Passkey setup was canceled.");
      } else {
        console.error("Error during passkey registration:", err);
        message.error("Something went wrong.. Please try again.");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleNon2fAVerify = async (otp) => {
    setLoader(true);
    if (otp !== "") {
      const requestBody = {
        verificationCode: otp,
      };
      const response = await authenticateCodeNon2FA(requestBody);
      if (!response) {
        message.success("Verified successfully");
        setTwoFaDone(true);
        setIsSetupSMS(true);
        setLoader(false);
        setSmsModal(false);
        if (isGoogleUser) {
          await getUserDetails();
          await enableSMS2FA();
          window?.dataLayer?.push({
            event: "security-prompt-2fa-enabled-google-user",
            user_id: user?.number,
            register_method: user?.registrationType,
          });
          setSmsAuth(false);
          setMethodStarted(true);
        } else {
          handlePasskeyRegistration();
        }
      } else {
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    Cookies.set("verificationToken", token);
    if (Cookies.get("verificationToken") !== "null") {
      verifyEmail({
        verificationToken: Cookies.get("verificationToken"),
      })
        .then((verifyEmailResponse) => {
          if (verifyEmailResponse?.token) {
            updateAuthToken(verifyEmailResponse?.token);
            // Cookies.set("auth_inv_token", verifyEmailResponse?.token);
            getUserDetails();
            setLoader(false);
            // PublicEventApi("emailConfirm");
            // if (user && Object.keys(user).length > 0) {
            //   window?.dataLayer?.push({
            //     event: "email-verify-success",
            //     user_id: user?.number,
            //   });
            // }
          }
        })
        .catch((error) => {
          console.log("verify email", error);
          setLoader(false);
        });
    }
  }, []);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      window?.dataLayer?.push({
        event: "security-prompt-shown",
        user_id: user?.number,
        register_method: user?.registrationType,
      });
    }
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
              window?.dataLayer?.push({
                event: "security-prompt-passkey-enabled",
                user_id: user?.number,
                register_method: user?.registrationType,
              });
            })
            .catch((err) => {
              console.log(err);
              if (err.name === "AbortError" || err.name === "NotAllowedError") {
                message.info("Passkey setup was canceled.");
                window?.dataLayer?.push({
                  event: "security-prompt-passkey-cancelled",
                  user_id: user?.number,
                  register_method: user?.registrationType,
                });
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
            window?.dataLayer?.push({
              event: "security-prompt-passkey-cancelled",
              user_id: user?.number,
              register_method: user?.registrationType,
            });
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

  const handleSetupTotp = async () => {
    setTotpLoader(true);
    // setMethodStarted(true);
    await setupTotp()
      .then((res) => {
        if (res) {
          window?.dataLayer?.push({
            event: "security-prompt-totp-setup",
            user_id: user?.number,
            register_method: user?.registrationType,
          });
          setSecretKey(res?.secret);
          // setTotp("showqr");
          setQrURL(res?.registrationURL);
          setTotpLoader(false);
          setTotpModalVisible(true);
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
          event: "security-prompt-2fa-confirm",
          user_id: user?.number,
          register_method: user?.registrationType,
        });
        window.scrollTo(0, 0);
        setTOTPLoader(false);
        setTotpModalVisible(false);
        setTwoFaDone(true);
        setIsSetupSMS(false);
      } else {
        setTOTPLoader(false);
      }
    } else {
      setTOTPLoader(false);
      showMessageWithCloseIconError("Please enter 6 digit OTP!");
    }
  };

  const handleTwoFaAuth = async () => {
    if (user?.registrationType === "GOOGLE" && user?.mobilePhone === "") {
      setEnterMobile(true);
      setSmsModal(true);
      setLoader(false);
      setIsGoogleUser(true);
      return;
    } else {
      setTwoFaLoader(true);
      setMethodStarted(true);
      await setupSms()
        .then((res) => {
          showMessageWithCloseIcon(
            "We've sent an OTP to your mobile number. Please check your messages."
          );
          window?.dataLayer?.push({
            event: "security-prompt-click-sms2fa",
            user_id: user?.number,
            register_method: user?.registrationType,
          });
          setIsTimerRunning(true);
          setTime(59);
          setSetUpSMS(res);
          setSmsSetupModalVisible(true);
          setTwoFaLoader(false);
          setIsSetupSMS(false);
        })
        .catch(() => {
          setTwoFaLoader(false);
        });
    }
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
        setSmsSetupModalVisible(false);
        setIsSetupSMS(true);
        setTwoFaDone(true);
      } else {
        setTwoFaLoader(false);
      }
    } else {
      setTwoFaLoader(false);
      showMessageWithCloseIconError("Please enter OTP!");
    }
  };

  const handleContinue = async () => {
    const getSystId = await getSystemId();
    let regtankStatus;
    if (
      getSystId?.systemId !== null &&
      getSystId?.systemId !== undefined &&
      Object.keys(getSystId)?.length > 0
    ) {
      regtankStatus = await statusCheck({
        email: user?.email,
        systemId: getSystId?.systemId,
      });
    }
    Redirection(
      setLoader,
      user,
      regtankStatus,
      dispatch,
      navigate,
      user?.vwoFeatures?.redirectApp
    );
  };

  const skipForNow = async () => {
    try {
      setSkipLoader(true);
      localStorage.setItem("skip2FAPrompt", "true");
      await suppress2faPrompt({ suppress2faPrompt: true });

      window?.dataLayer?.push({
        event: "security-prompt-skipped",
        user_id: user?.number,
        register_method: user?.registrationType,
      });

      const systemInfo = await getSystemId();

      let regtankStatus = null;
      if (systemInfo?.systemId) {
        regtankStatus = await statusCheck({
          email: user?.email,
          systemId: systemInfo.systemId,
        });
      }

      Redirection(
        setLoader,
        user,
        regtankStatus,
        dispatch,
        navigate,
        user?.vwoFeatures?.redirectApp
      );
    } catch (err) {
      console.error("Error while skipping 2FA prompt:", err);
      message.error("Unable to skip security step. Please try again.");
      setSkipLoader(false);
    }
  };

  const handleOpenLink = (url) => {
    window.open(url, "_blank");
  };

  useEffect(() => {
    let timer;
    if (isTimerRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, time]);

  const handleCopyValue = () => {
    const valueToCopy = secretKey;
    navigator.clipboard
      .writeText(valueToCopy)
      .then(() => {
        showMessageWithCloseIcon("Security key copied to clipboard!");
      })
      .catch((error) => {
        console.error("Security key copy failed:", error);
      });
  };

  useEffect(() => {
    getPassKeyToggleStatus()
      .then((res) => {
        setIsPassKeyEnabled(res?.passkeyFeatureEnabled);
      })
      .catch((err) => {
        message.error(
          "Couldn't verify if Passkey login is available. Try again."
        );
        console.log(err);
        setIsPassKeyEnabled(false);
      });
  }, []);

  const handleAddNewMobile = async () => {
    try {
      await updateMobileNo({ mobileNumber: "+" + newMobile })
        .then(() => {
          setEnterMobile(false);
          setSetUpSMS({ phoneNumber: "+" + newMobile }); // 👈 update this line
          setIsTimerRunning(true); // 👈 starts the countdown
          setTime(59); // 👈 resets the timer
          sendVerificatioNon2Fa();
        })
        .catch((error) => {
          message.error("Failed to update mobile number. Try again.");
          console.error("Error updating mobile number:", error);
        });
    } catch (err) {
      console.error("Failed to update mobile number:", err);
      message.error("Failed to save mobile number. Try again.");
    }
  };

  const handleRedirection = async () => {
    setPasskeyDone(false);
    const getSystId = await getSystemId();
    let regtankStatus;
    if (
      getSystId?.systemId !== null &&
      getSystId?.systemId !== undefined &&
      Object.keys(getSystId)?.length > 0
    ) {
      regtankStatus = await statusCheck({
        email: user?.email,
        systemId: getSystId?.systemId,
      });
    }
    Redirection(
      setLoader,
      user,
      regtankStatus,
      dispatch,
      navigate,
      user?.vwoFeatures?.redirectApp
    );
  };

  return (
    <AuthLayout>
      <div
        className="sb-onboarding-form-container"
        style={{ padding: "80px 135px" }}
      >
        <div className="sb-flex-column-item-center mb-15">
          <img src={shieldIcon} alt="checkcircle" className="kl-checkcircle" />
        </div>

        <div className="">
          <p className="kl-title m-0">
            Do you want to log in easier next time with your fingerprint or Face
            ID?
          </p>
        </div>

        {isPassKeyEnabled && (
          <>
            <div>
              <div className="twofaoption-container">
                {/* <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <img src={paskeyIcon} alt="passkey" />
                  <h2>Passkey</h2>
                  <div className="recommended-option">
                    <span>Recommended</span>
                  </div>
                </div> */}
                <p
                  className="passkey-instruct-p"
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: 14,
                  }}
                >
                  <span>
                    Set up hassle-free login with your fingerprint, Face ID or
                    passcode on this device.
                    <br />{" "}
                  </span>
                  {/* Log in to Kilde with Face ID, fingerprint or your device
                  passcode.
                  <br />
                  <br />
                  We'll quickly verify your phone number to add a backup, just
                  in case you ever lose your Passkey. */}
                </p>
                <ButtonDefault
                  title="Yes, I want quicker login"
                  onClick={handleSetupPasskey}
                  loading={loader}
                  style={{ width: "100%", marginTop: 10 }}
                />
                <Button
                  onClick={skipForNow}
                  loading={skipLoader}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    borderRadius: 12,
                  }}
                  type="default"
                >
                  No, maybe later
                </Button>
              </div>
            </div>
            {/* <Divider plain style={{ margin: 0 }}>
              <p style={{ color: "#ababab" }}> Or use another method </p>
            </Divider> */}
          </>
        )}

        {/* <div>
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
                <img alt="authenticateapp" />
                <div>
                  <p className="twofa-recom m-0">Recommended</p>
                  <p className=" auth-head m-0 mt-4">Passkey</p>
                  <p className="twofamodal-tag mt-4 m-0">
                    Instant Sign-in using Face ID, Touch ID or Device passcode.
                    No passwords, no OTPs.
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
              <img src={authenticatoricon} alt="authenticateapp" />
              <div style={{ textAlign: "left", marginTop: "-5px" }}>
                <p className=" auth-head m-0 mt-4">Google Authenticator</p>
                <p className="twofamodal-tag mt-4 m-0">
                  Use the authenticator app for login code
                </p>
              </div>
            </div>
            <Button className="twofa-setup-sms" onClick={handleSetupTotp}>
              Set Up
            </Button>
          </div>
          <div className="setting-twofa-modal">
            <div className="twofamodal-subdiv ">
              <img src={smsIcon} alt="sms" />
              <div style={{ textAlign: "left", marginTop: "-2px" }}>
                <p className="auth-head m-0">SMS Verification</p>
                <p className="twofamodal-tag mt-4 m-0">Receive a OTP via SMS</p>
              </div>
            </div>
            <Button className="twofa-setup-sms" onClick={handleTwoFaAuth}>
              Set Up
            </Button>
          </div>
          <p
            className="mt-20 twofa-dothislater cursor-pointer"
            onClick={skipForNow}
          >
            I'll do this later
          </p>
        </div> */}
      </div>
      <Modal
        title=""
        closable={{ "aria-label": "Custom Close Button" }}
        open={smsModal}
        footer={null}
        // onOk={handleOk}
        onCancel={() => setSmsModal(false)}
      >
        {enterMobile ? (
          <div className="psky-container">
            <img src={setupSmsIcon} alt="icon" />

            <h2 className="psky-heading">Verify your phone number</h2>
            <p className="psky-subtitle">
              Enter your phone number to receive a <br /> verification code.
            </p>
            <div className="psky-input-wrapper">
              <PhoneInput
                name="mobileNumber"
                className="sb-phone-field"
                country={countryCode}
                value={newMobile}
                onChange={(value, country) => {
                  setNewMobile(value);
                  setCountryCode(country.countryCode);
                }}
                enableSearch
              />
            </div>
            <ButtonDefault
              title="Continue"
              style={{ width: "100%" }}
              onClick={handleAddNewMobile}
            />
          </div>
        ) : (
          <TwoFAComponent
            onInit={!smsAuth ? sendVerificatioNon2Fa : handleInit}
            onAuthenticate={
              !smsAuth ? handleNon2fAVerify : handleAuthentication
            }
            secFactorAuth={secFactorAuth || "SMS"}
            loader={loader}
            codes={code}
            mobileNo={user?.mobilePhone}
            usedIn={"AddressChange"}
            icon={setupSmsIcon}
            showFooter={true}
            changeContent={false}
            changeStyle={true}
            clearOtp={false}
          />
        )}
      </Modal>

      <Modal
        open={passkeyDone}
        // onCancel={() => setSmsModal(false)}
        closable={false}
        footer={null}
      >
        <div className="passkey-done-container">
          <img src={PasskeyDoneIcon} alt="passkey-done" />
          <h3>Passkey set up successfully!</h3>
          <p>
            You’re all set—next time you log in or need to verify your identity,
            just use your passkey.
          </p>
          <ButtonDefault
            style={{ width: "100%" }}
            onClick={handleRedirection}
            title="Done"
          />
        </div>
      </Modal>

      <Modal
        title=""
        closable={{ "aria-label": "Custom Close Button" }}
        open={totpModalVisible}
        footer={null}
        onCancel={() => setTotpModalVisible(false)}
        centered
      >
        <div style={{ padding: 40 }}>
          <div className="sb-flex-column-item-center mb-10">
            <img
              src={totpSetupIcon}
              alt="checkcircle"
              className="kl-checkcircle"
            />
          </div>
          <div className="mb-10">
            <p className="kl-title m-0">Set up Authenticator App</p>
          </div>
          <p className="sb-TwoFa-subtitle m-0 mb-24">
            Sign in more securely with authenticator app. Setting up of
            authenticator app takes less than a minute.
          </p>
          <div>
            <div>
              <p className="auth-head-new">
                1. Install the <b>Authenticator app</b> on your device
              </p>
              <div className="authenticator-app-btn-div">
                {["iOS", "Android"].map((platform) => (
                  <div className="auth-app-btn-div" key={platform}>
                    <ButtonDefault
                      title={platform}
                      className="setting-custom-default-btn"
                      style={{ width: "100%" }}
                      onClick={() => handleOpenLink(APP_STORE_LINKS[platform])}
                    />
                  </div>
                ))}
              </div>
              <p className="auth-head-new">
                2. Scan QR code with the <b>Authenticator app</b> or copy the{" "}
                <b>code</b> to Authenticator app manually
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  textAlign: "left",
                }}
              >
                Copy the setup key below to the Authenticator app manually
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  placeholder={secretKey}
                  type="text"
                  className="secret-input"
                  readOnly
                  style={{ flex: 3, height: 40 }}
                />
                <ButtonDefault
                  title="Copy"
                  onClick={handleCopyValue}
                  style={{ flex: 1, height: 40 }}
                />
              </div>
            </div>

            <div className="sb-TwoFa-center">
              {qrUrl ? (
                <QRCode type="svg" value={qrUrl} size={150} />
              ) : (
                <p>Loading QR Code...</p>
              )}
            </div>
            <p className="auth-head-new">
              3. Enter the current one time password for your Google
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
                title="Verify"
                onClick={handleAuthentication}
                loading={tOTPLoader}
                block={true}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* SMS Setup Modal */}
      <Modal
        title=""
        closable={{ "aria-label": "Custom Close Button" }}
        open={smsSetupModalVisible}
        footer={null}
        onCancel={() => setSmsSetupModalVisible(false)}
      >
        <div style={{ padding: 40 }}>
          <div className="sb-flex-column-item-center mb-20">
            <img
              src={setupSmsIcon}
              alt="checkcircle"
              className="kl-checkcircle"
            />
          </div>
          <div className="mb-10">
            <p className="kl-title m-0">Two-Factor Authentication</p>
          </div>
          <p className="kl-subtitle mt-8 mb-28">
            Enter the verification code we send to{" "}
            {convertMaskedFormat(user?.mobilePhone)}
            <br />
            via sms text or WhatsApp
          </p>

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
              <Link>Resend Code</Link>
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
              title="Verify"
              onClick={handleEnableSMS}
              loading={twoFaLoader}
              block={true}
            />
          </div>
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
        </div>
      </Modal>

      <Modal
        open={twoFaDone}
        // onCancel={() => setSmsModal(false)}
        closable={false}
        footer={null}
      >
        <div className="passkey-done-container">
          <img src={PasskeyDoneIcon} alt="passkey-done" />
          {isSetupSMS ? (
            <h3>2FA Setup Completed</h3>
          ) : (
            <h3>Your Authenticator App was successfully set up</h3>
          )}
          {isSetupSMS ? (
            <p>
              Your account is more secure. You will receive a verification code
              via SMS to your number <b>{user?.mobilePhone}</b> for every login.
            </p>
          ) : (
            <p>
              You're all set! Next time you need to verify your identity, just
              open the authenticator app.
            </p>
          )}

          <ButtonDefault
            style={{ width: "100%" }}
            onClick={() => {
              setTwoFaDone(false);
              setIsSetupSMS(null);
              handleContinue();
            }}
            title="Done"
          />
        </div>
      </Modal>
    </AuthLayout>
  );
};

export default SecurityPromptPage;
