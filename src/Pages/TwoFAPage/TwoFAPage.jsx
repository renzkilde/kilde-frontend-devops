import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import DeviceMobile from "../../Assets/Images/SVGs/2fa-confirm.svg";
import ROUTES from "../../Config/Routes.js";
import { getUser, twoFaAuth } from "../../Apis/UserApi.js";
import TotpIcon from "../../Assets/Images/SVGs/totp-setup-icon-new.svg";

import "./style.css";
import Cookies from "js-cookie";
import AuthLayout from "../../Layouts/BlankHeaderLayout/AuthLayout.jsx";
import OtpInput from "react18-input-otp";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault.jsx";
import {
  getDeviceNamesFromPasskeys,
  getOSAndBrowser,
  redirectAfterLoginAnd2FA,
  redirectToVue,
} from "../../Utils/Helpers.js";
import GlobalVariabels from "../../Utils/GlobalVariabels.js";
import {
  getPassKeyToggleStatus,
  getSystemId,
  statusCheck,
} from "../../Apis/InvestorApi.js";
import { setStatusCheckResponse } from "../../Redux/Action/KycIndividual.js";
import { Redirection } from "../LoginPage/Redirection.jsx";
import {
  convertMaskedFormat,
  showMessageWithCloseIconError,
  updateAuthToken,
  useWindowWidth,
} from "../../Utils/Reusables.js";
import { identify } from "../../Utils/Analytics.js";
import { GetBankAccountApi } from "../../Apis/WalletApi.js";
import { setAccountDetails } from "../../Redux/Action/Wallet.js";
import JivoChat from "../../Layouts/BlankHeaderLayout/JivoChat.js";
import { useInitVerification } from "./TwoFATimer.js"; // <== Import your hook here
import { Button, message } from "antd";
import { Link } from "react-router-dom";

const TwoFAPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { type, authenticationCode, mobilePhone } = location.state || {};

  const { handleResendInit, loader, setLoader, seconds, buttonDisabled } =
    useInitVerification();

  const windowWidth = useWindowWidth();
  const user = useSelector((state) => state.user);
  const [otp, setOtp] = useState("");
  const [code, setCode] = useState(authenticationCode || "");
  const [secFactorAuth, setSecFactorAuth] = useState(type || "");
  const [mobile, setMobile] = useState(mobilePhone || "");
  const [isPassKeyEnabled, setIsPassKeyEnabled] = useState(false);

  let currentEnv = GlobalVariabels.NODE_ENV;

  useEffect(() => {
    getPassKeyToggleStatus()
      .then((res) => {
        setIsPassKeyEnabled(res?.passkeyFeatureEnabled);
      })
      .catch((err) => {
        message.error(
          "Couldn't verify if Passkey login is available. Try again."
        );
        console.error(err);
        setIsPassKeyEnabled(false);
      });
  }, []);

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secondsPart = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secondsPart}`;
  };

  const handleResend = async () => {
    const res = await handleResendInit();
    if (res) {
      setSecFactorAuth(res.type);
      setCode(res.authenticationCode);
      setMobile(res.mobilePhone);
    }
  };

  const getBankAccountNo = async () => {
    try {
      const response = await GetBankAccountApi();
      if (response) {
        setAccountDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching bank account number data:", error);
      return null;
    }
  };

  const handleAuthentication = async () => {
    setLoader(true);

    if (otp !== "") {
      const requestBody = { code: otp };
      const response = await twoFaAuth(requestBody);

      if (response?.token) {
        updateAuthToken(response?.token);
        // Cookies.set("auth_inv_token", response.token);

        try {
          const profileResponse = await getUser();

          window?.dataLayer?.push({
            event: "login-form-success",
            user_id: profileResponse?.number,
            register_method: profileResponse?.registrationType,
          });

          identify(profileResponse);
          localStorage.setItem("hasPasskey", profileResponse?.passkeyEnabled);
          localStorage.setItem(
            "availableDevices",
            getDeviceNamesFromPasskeys(profileResponse?.passkeys)
          );
          Cookies.remove("user", { path: "/" });
          Cookies.set("user", JSON.stringify(profileResponse), {
            path: "/",
            sameSite: "Lax",
          });

          // ✅ New conditional block for redirection
          if (profileResponse?.investorStatus === "ACTIVE") {
            const skipPromptRaw = localStorage.getItem("skip2FAPrompt");
            let skip2FAPrompt = false;
            try {
              skip2FAPrompt = JSON.parse(skipPromptRaw);
            } catch {
              skip2FAPrompt = false;
            }

            const has2FA =
              profileResponse?.secondFactorAuth === "SMS" ||
              profileResponse?.secondFactorAuth === "TOTP";
            const hasPasskey = profileResponse?.passkeyEnabled;

            // Redirect to SECURITY_PROMPT
            if (
              !has2FA &&
              !hasPasskey &&
              isPassKeyEnabled === true &&
              (profileResponse?.suppress2faPrompt === false ||
                (profileResponse?.suppress2faPrompt === true && !skip2FAPrompt))
            ) {
              return navigate(ROUTES.SECURITY_PROMPT);
            }

            const allowedDevices = profileResponse?.passkeys?.map(
              (p) => p.device
            );

            const currentDevice = await getOSAndBrowser();
            const isDeviceMatched = allowedDevices?.includes(currentDevice);

            if (
              (profileResponse?.suppress2faPrompt === false ||
                (profileResponse?.suppress2faPrompt === true &&
                  !skip2FAPrompt)) &&
              !isDeviceMatched
            ) {
              return navigate(ROUTES.SETUP_PASSKEY_NO2FA);
            } else if (
              has2FA &&
              !hasPasskey &&
              (profileResponse?.suppress2faPrompt === false ||
                (profileResponse?.suppress2faPrompt === true && !skip2FAPrompt))
            ) {
              return navigate(ROUTES.SETUP_PASSKEY_NO2FA);
            }
          }

          if (profileResponse?.investorStatus === "REJECTED") {
            return navigate(ROUTES.KILDE_REJECTED_USER);
          }

          let regtankStatus;

          if (
            profileResponse?.vwoFeatures?.identityVerificationSystem
              ?.idvSystemToUse === "regtank"
          ) {
            const getSystId = await getSystemId();
            if (getSystId?.systemId) {
              regtankStatus = await statusCheck({
                email: profileResponse?.email,
                systemId: getSystId.systemId,
              });
              setStatusCheckResponse(regtankStatus, dispatch);
              Cookies.set("systemId", getSystId.systemId);
            }
          }

          if (
            profileResponse?.vwoFeatures?.redirectApp?.appToRedirect === "vue"
          ) {
            redirectToVue(
              profileResponse?.vwoFeatures?.redirectApp?.appToRedirect,
              navigate
            );
            setLoader(false);
          } else {
            await getBankAccountNo();
            const cookies = document.cookie
              .split("; ")
              .reduce((acc, cookie) => {
                const [name, value] = cookie.split("=");
                acc[name] = value;
                return acc;
              }, {});

            const redirectUrl = cookies.redirectTrancheUrl;

            if (redirectUrl) {
              return redirectAfterLoginAnd2FA(navigate);
            } else {
              Redirection(
                setLoader,
                profileResponse,
                regtankStatus,
                dispatch,
                navigate,
                profileResponse?.vwoFeatures?.redirectApp
              );
            }
          }
        } catch (error) {
          console.log("profile err", error);
          setLoader(false);
        }
      } else {
        setLoader(false);
      }
    } else {
      setLoader(false);
      showMessageWithCloseIconError("Please enter OTP!");
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

  useEffect(() => {
    if (otp.length === 6) {
      handleAuthentication();
    }
  }, [otp]);

  return (
    <AuthLayout>
      <div className="sb-onboarding-form-container">
        <div className="sb-flex-column-item-center mb-28">
          {secFactorAuth === "TOTP" ? (
            <img src={TotpIcon} alt="totp" className="kl-mobile" />
          ) : (
            <img src={DeviceMobile} alt="sms" className="kl-mobile" />
          )}
        </div>
        <div>
          <p className="kl-title m-0">Two-Factor Authentication</p>
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
        </div>

        <div className="sb-otp-input-div mb-28">
          <OtpInput
            value={otp}
            onChange={(value) => setOtp(value)}
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

        {secFactorAuth === "SMS" && seconds > 0 && (
          <div className="kd-resend">
            <p className="mb-16">
              Resend code in <span id="timer">{formatTime(seconds)}</span>{" "}
            </p>
          </div>
        )}

        {secFactorAuth === "SMS" && seconds === 0 && (
          <p className="sb-twofa-link mb-16">
            <Button
              loading={loader}
              onClick={handleResend}
              disabled={buttonDisabled}
              className="resend-code"
            >
              Resend Code
            </Button>
          </p>
        )}

        <div className="sb-TwoFa-actions m-0">
          {secFactorAuth === "SMS" && currentEnv === "DEV" && (
            <p style={{ textAlign: "right", color: "#ddd", margin: 0 }}>
              Authentication Code: {code}
            </p>
          )}

          <ButtonDefault
            title="Verify"
            block={true}
            loading={loader}
            onClick={handleAuthentication}
            style={{ marginTop: "12px" }}
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
      <JivoChat user={user} />
    </AuthLayout>
  );
};

export default TwoFAPage;
