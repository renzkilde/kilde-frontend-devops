/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import ReactLoading from "react-loading";
import { useEffect } from "react";

import {
  authenticateCodeNon2FA,
  enableSMS,
  enableTOTP,
  getUser,
  sendVerificationCode,
  sendVerificationCode2FA,
  setupSms,
  setupTotp,
  verifyEmail,
} from "../../Apis/UserApi";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../../Layouts/BlankHeaderLayout/AuthLayout";
import shieldIcon from "../../Assets/Images/SVGs/passkey-setup-2fa-prompt.svg";
import Cookies from "js-cookie";
import { setUserDetails } from "../../Redux/Action/User";
import { PublicEventApi } from "../../Apis/PublicApi";
import paskeyIcon from "../../Assets/Images/SVGs/passkeyicon.svg";
import authenticatoricon from "../../Assets/Images/SVGs/authenticatoricon.svg";
import smsIcon from "../../Assets/Images/SVGs/smsicon.svg";
import { Button, Divider, message, Modal, QRCode } from "antd";
import {
  getPassKeyChallenge,
  getSystemId,
  registerPasskey,
  statusCheck,
  suppress2faPrompt,
} from "../../Apis/InvestorApi";
import { startRegistration } from "@simplewebauthn/browser";
import {
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
  updateAuthToken,
} from "../../Utils/Reusables";
import OtpInput from "react18-input-otp";
import GlobalVariabels from "../../Utils/GlobalVariabels";
import TwoFAComponent from "../TwoFAPage/TwoFAContent";
import { setUser } from "@sentry/react";
import PasskeyDoneIcon from "../../Assets/Images/SVGs/passkey-setup-done.svg";
import "./style.css";
import { Redirection } from "../LoginPage/Redirection";
import {
  getDeviceNamesFromPasskeys,
  getOSAndBrowser,
} from "../../Utils/Helpers";

const SetupPasskeyNo2FA = () => {
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
  const [passkeyDone, setPasskeyDone] = useState(false);

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
  }, []);

  const handleEmailVerified = () => {
    setLoader(true);
    try {
      if (user?.secondFactorAuth === null) {
        setSmsAuth(false);
        setSmsModal(true);
        sendVerificatioNon2Fa();
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
        setSecFactorAuth(res?.type);
        setCode(res?.verificationCode);
        setLoader(false);

        showMessageWithCloseIcon(
          res?.type === "TOTP"
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
      setCode(res?.verificationCode);
      setSmsModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInit = () => sendVerificationCode();

  const handleNon2fAVerify = async (otp) => {
    setLoader(true);
    if (otp !== "") {
      const requestBody = {
        verificationCode: otp,
      };
      const response = await authenticateCodeNon2FA(requestBody);
      if (!response) {
        message.success("Verified successfully");
        setLoader(false);
        setSmsModal(false);
        handlePasskeyRegistration();
      } else {
        setLoader(false);
      }
    }
  };

  const handlePasskeyRegistration = async () => {
    try {
      setLoader(true);
      const publicKeyCredentialCreationOptions = await getPassKeyChallenge();
      const attestationResponse = await publicKeyCredentialCreationOptions;

      const updatedResponse = {
        ...attestationResponse,
        email,
      };
      const registerResponse = await registerPasskey(updatedResponse);

      message.success(registerResponse?.message);
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
      console.error("Error during passkey registration:", err);

      if (err.name === "AbortError" || err.name === "NotAllowedError") {
        message.info("Passkey setup was canceled.");
      } else {
        message.error("Something went wrong.. Please try again.");
      }
    } finally {
      setLoader(false);
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
            getUserDetails();
            setLoader(false);
            PublicEventApi("emailConfirm");
          }
        })
        .catch((error) => {
          console.log("verify email", error);
          setLoader(false);
        });
    }
  }, []);

  // useEffect(() => {
  //   if (user && Object.keys(user).length > 0) {
  //     window?.dataLayer?.push({
  //       event: "email-verify-success",
  //       user_id: user?.number,
  //     });
  //   }
  // }, [user]);

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
              setPasskeyDone(true);
            })
            .catch((err) => {
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

  // useEffect(() => {
  //   handleEnablePasskey();
  // }, []);

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
      message.error("Failed to skip security step. Please try again.");
      setSkipLoader(false);
    }
  };

  const handleRedirection = async () => {
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
              style={{ display: "block", textAlign: "center", fontSize: 14 }}
            >
              Set up hassle-free login with your fingerprint, Face ID or
              passcode on this device.
            </p>
            <ButtonDefault
              title="Yes, I want quicker login"
              onClick={handleEnablePasskey}
              loading={loader}
              style={{ width: "100%" }}
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
        {/* <p
          className="mt-20 twofa-dothislater cursor-pointer"
          onClick={skipForNow}
        >
          I'll do this later
        </p> */}
      </div>
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
    </AuthLayout>
  );
};

export default SetupPasskeyNo2FA;
