import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Divider, Form, Input, message } from "antd";
import InputDefault from "../../Components/InputDefault/InputDefault.jsx";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault.jsx";
import ROUTES from "../../Config/Routes.js";
import PasskeyIcon from "../../Assets/Images/SVGs/pass-key-login.svg";
import {
  GoogleLoginApiWithCode,
  LoginApi,
  getUser,
} from "../../Apis/UserApi.js";
import "./style.css";
import Cookies from "js-cookie";
import {
  getDeviceNamesFromPasskeys,
  getOSAndBrowser,
  getUserCurrentLocation,
  redirectAfterLoginAnd2FA,
  redirectToVue,
} from "../../Utils/Helpers.js";
import { PublicEventApi } from "../../Apis/PublicApi.js";
import {
  getLoginPassKeyChallenge,
  getPassKeyToggleStatus,
  getSystemId,
  loginPasskey,
  statusCheck,
} from "../../Apis/InvestorApi.js";
import { setStatusCheckResponse } from "../../Redux/Action/KycIndividual.js";
import { Redirection } from "./Redirection.jsx";
import { useGoogleLogin } from "@react-oauth/google";
import ButtonIcon from "../../Components/ButtonIcon/ButtonIcon.jsx";
import GoogleIcon from "../../Assets/Images/Icons/google_icon.svg";
import { identify, trackEvent } from "../../Utils/Analytics.js";
import {
  clearAllCookiesForDomain,
  clearUserSession,
  updateAuthToken,
} from "../../Utils/Reusables.js";
import { startAuthentication } from "@simplewebauthn/browser";
import { triggerResendInit } from "../TwoFAPage/TwoFATimer.js";
import { trackVwoEvents } from "../../Utils/vwoCustomEvents.js";
import AuthNewLayout from "../../Layouts/BlankHeaderLayout/AuthNewLayout.jsx";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [lastLoginMethod, setLastLoginMethod] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    email: false,
    password: false,
  });
  const [loader, setLoader] = useState(false);
  const [isPassKeyEnabled, setIsPassKeyEnabled] = useState();
  const [googleLoader, setGoogleLoader] = useState(false);
  const [passkeyLoader, setPasskeyLoader] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const isInStandaloneMode = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  useEffect(() => {
    const method = localStorage.getItem("lastLoginMethod");
    if (method) {
      setLastLoginMethod(method);
    }
  }, []);

  useEffect(() => {
    const tryAutoLogin = async () => {
      const raw = localStorage.getItem("availableDevices");
      if (!raw) return;

      // Safely split plain string
      const parsed = raw.split(",").map((item) => item.trim());

      // Pair every 2 entries
      const pairedDevices = [];
      for (let i = 0; i < parsed.length; i += 2) {
        if (parsed[i] && parsed[i + 1]) {
          pairedDevices.push(`${parsed[i]}, ${parsed[i + 1]}`);
        }
      }

      const currentDevice = await getOSAndBrowser(); // e.g., "Windows, Chrome"

      const matchFound = pairedDevices.some((deviceString) =>
        deviceString.startsWith(currentDevice)
      );

      if (matchFound) {
        JSON?.parse(localStorage?.getItem("hasPasskey")) &&
          handlePasskeyLogin();
      }
    };

    tryAutoLogin();
  }, []);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();

    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) &&
      /safari/.test(userAgent) &&
      !/chrome/.test(userAgent) &&
      !window.matchMedia("(display-mode: standalone)").matches;

    setIsIOS(isIOSDevice);
  }, []);

  useEffect(() => {
    if (isIOS && isInStandaloneMode()) {
      window?.dataLayer?.push({
        event: "pwa-installed",
        // user_id: user,
        platform: "ios",
      });
    }
  }, [isIOS]);

  useEffect(() => {
    getUserCurrentLocation();
  }, []);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
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

  useEffect(() => {
    getUserCurrentLocation();
  }, []);

  const getRpId = () => {
    const hostname = window.location.hostname;

    if (hostname === "localhost") return "localhost";
    if (hostname.endsWith(".kilde.com")) return "kilde.com";

    return hostname; // fallback for custom domains or staging
  };

  const handlePasskeyLogin = async () => {
    try {
      await getLoginPassKeyChallenge()
        .then(async (res) => {
          let options = {
            challenge: res?.challenge,
            rpId: getRpId(),
            timeout: res?.timeout,
            userVerification: res?.userVerification,
          };

          let storeChallenge = options?.challenge;

          const assertionResponse = await startAuthentication({
            ...options,
            mediation: "conditional",
          });

          await loginPasskey({
            signedChallenge: assertionResponse,
            challenge: storeChallenge,
          })
            .then((res) => {
              if (res?.status === 500) {
                return;
              }
              if (
                res?.error ===
                "Passkey not found for the investor. Invalid Request."
              ) {
                return;
              }
              let regtankStatus;

              updateAuthToken(res?.token);
              // Cookies.set("auth_inv_token", JSON.stringify(res?.token), {
              //   path: "/",
              //   sameSite: "Lax",
              //   ...(window.location.hostname.includes("kilde.sg") && {
              //     domain: ".kilde.sg",
              //   }),
              // });
              getUser()
                .then(async (profileResponse) => {
                  localStorage.setItem(
                    "registrationType",
                    profileResponse?.registrationType
                  );
                  window?.dataLayer?.push({
                    event: "login-form-success",
                    user_id: profileResponse?.number,
                    register_method: profileResponse?.registrationType,
                  });
                  trackVwoEvents(profileResponse);
                  identify(profileResponse);
                  localStorage.setItem(
                    "hasPasskey",
                    profileResponse?.passkeyEnabled
                  );
                  localStorage.setItem(
                    "availableDevices",
                    getDeviceNamesFromPasskeys(profileResponse?.passkeys)
                  );
                  localStorage.setItem("lastLoginMethod", "passkey");
                  Cookies.remove("user", { path: "/" });
                  Cookies.set("user", JSON.stringify(profileResponse), {
                    path: "/",
                    sameSite: "Lax",
                  });

                  if (profileResponse?.investorStatus === "REJECTED") {
                    setLoader(false);
                    return navigate(ROUTES.KILDE_REJECTED_USER);
                  }
                  if (
                    profileResponse?.vwoFeatures?.identityVerificationSystem
                      ?.idvSystemToUse === "regtank"
                  ) {
                    const getSystId = await getSystemId();

                    if (
                      getSystId?.systemId !== null &&
                      getSystId?.systemId !== undefined &&
                      Object.keys(getSystId)?.length > 0
                    ) {
                      regtankStatus = await statusCheck({
                        email: profileResponse?.email,
                        systemId: getSystId?.systemId,
                      });
                      setStatusCheckResponse(regtankStatus, dispatch);
                    }
                    Cookies.set("systemId", getSystId?.systemId);
                  }
                  if (
                    profileResponse?.vwoFeatures.redirectApp?.appToRedirect ===
                    "vue"
                  ) {
                    redirectToVue(
                      profileResponse?.vwoFeatures.redirectApp?.appToRedirect,
                      navigate
                    );
                    setLoader(false);
                  } else {
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
                })
                .catch((error) => {
                  console.log("profile err", error);
                  setLoader(false);
                });
            })
            .catch((err) => {
              console.log(err);
              message.error("Failed to login with Passkey");
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    clearAllCookiesForDomain(".kilde.sg");
    clearUserSession();
    setValidationErrors({
      email: true,
      password: true,
    });

    if (loginData?.email) {
      const requestBody = {
        email: loginData.email,
        password: loginData.password,
      };

      setLoader(true);

      LoginApi(requestBody)
        .then(async (response) => {
          let regtankStatus;
          if (response?.token) {
            trackEvent("Investor: logged in", { method: "email" });
            updateAuthToken(response?.token);
            localStorage.setItem("hasPasskey", response?.passkeyEnabled);
            localStorage.setItem(
              "availableDevices",
              getDeviceNamesFromPasskeys(response?.passkeys)
            );
            localStorage.setItem("lastLoginMethod", "email");
            // Cookies.set("auth_inv_token", JSON.stringify(response?.token), {
            //   path: "/",
            //   sameSite: "Lax",
            //   ...(window.location.hostname.includes("kilde.sg") && {
            //     domain: ".kilde.sg",
            //   }),
            // });
            PublicEventApi("loginAccount");
            if (response?.twoFactorAuthenticationRequired === true) {
              const twoFaData = await triggerResendInit();
              setLoader(false);

              if (twoFaData) {
                navigate(ROUTES.TWO_FA, {
                  state: {
                    type: twoFaData.type,
                    authenticationCode: twoFaData.authenticationCode,
                    mobilePhone: twoFaData.mobilePhone,
                  },
                });
              }
            } else {
              getUser()
                .then(async (profileResponse) => {
                  window?.dataLayer?.push({
                    event: "login-form-success",
                    user_id: profileResponse?.number,
                    register_method: profileResponse?.registrationType,
                  });
                  localStorage.setItem(
                    "registrationType",
                    profileResponse?.registrationType
                  );
                  identify(profileResponse);
                  const skipPromptRaw = localStorage.getItem("skip2FAPrompt");
                  let skip2FAPrompt = false;
                  try {
                    skip2FAPrompt = JSON.parse(skipPromptRaw);
                  } catch {
                    skip2FAPrompt = false;
                  }
                  trackVwoEvents(profileResponse);
                  const shouldPromptSecurity =
                    profileResponse?.investorStatus === "ACTIVE" &&
                    profileResponse?.secondFactorAuth === null &&
                    profileResponse?.passkeyEnabled === false &&
                    (profileResponse?.suppress2faPrompt === false ||
                      (profileResponse?.suppress2faPrompt === true &&
                        !skip2FAPrompt));
                  if (shouldPromptSecurity) {
                    return navigate(ROUTES.SECURITY_PROMPT);
                  } else {
                    Cookies.remove("user", { path: "/" });
                    Cookies.set("user", JSON.stringify(profileResponse), {
                      path: "/",
                      sameSite: "Lax",
                    });
                    if (profileResponse?.investorStatus === "REJECTED") {
                      setLoader(false);
                      return navigate(ROUTES.KILDE_REJECTED_USER);
                    }
                    if (
                      profileResponse?.vwoFeatures?.identityVerificationSystem
                        ?.idvSystemToUse === "regtank"
                    ) {
                      const getSystId = await getSystemId();

                      if (
                        getSystId?.systemId !== null &&
                        getSystId?.systemId !== undefined &&
                        Object.keys(getSystId)?.length > 0
                      ) {
                        regtankStatus = await statusCheck({
                          email: requestBody?.email,
                          systemId: getSystId?.systemId,
                        });
                        setStatusCheckResponse(regtankStatus, dispatch);
                      }
                      Cookies.set("systemId", getSystId?.systemId);
                    }
                    if (
                      profileResponse?.vwoFeatures.redirectApp
                        ?.appToRedirect === "vue"
                    ) {
                      redirectToVue(
                        profileResponse?.vwoFeatures.redirectApp?.appToRedirect,
                        navigate
                      );
                      setLoader(false);
                    } else {
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
                  }
                })
                .catch((error) => {
                  console.log("profile err", error);
                  setLoader(false);
                });
            }
          } else {
            setLoader(false);
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
          setLoader(false);
        });
    }
  };

  const googleLoginWithCode = useGoogleLogin({
    onSuccess: async ({ code }) => {
      GoogleLoginApiWithCode(code)
        .then(async (response) => {
          let regtankStatus;
          if (response?.token) {
            trackEvent("Investor: logged in", { method: "google" });

            updateAuthToken(response?.token);
            localStorage.setItem("hasPasskey", response?.passkeyEnabled);
            localStorage.setItem(
              "availableDevices",
              getDeviceNamesFromPasskeys(response?.passkeys)
            );
            localStorage.setItem("lastLoginMethod", "google");
            PublicEventApi("loginAccount");
            if (response?.twoFactorAuthenticationRequired === true) {
              const twoFaData = await triggerResendInit();
              setLoader(false);

              if (twoFaData) {
                navigate(ROUTES.TWO_FA, {
                  state: {
                    type: twoFaData.type,
                    authenticationCode: twoFaData.authenticationCode,
                    mobilePhone: twoFaData.mobilePhone,
                  },
                });
              }
            } else {
              await getUser()
                .then(async (profileResponse) => {
                  window?.dataLayer?.push({
                    event: "login-form-success",
                    user_id: profileResponse?.number,
                    register_method: profileResponse?.registrationType,
                  });
                  localStorage.setItem(
                    "registrationType",
                    profileResponse?.registrationType
                  );
                  const skipPromptRaw = localStorage.getItem("skip2FAPrompt");
                  let skip2FAPrompt = false;
                  try {
                    skip2FAPrompt = JSON.parse(skipPromptRaw);
                  } catch {
                    skip2FAPrompt = false;
                  }
                  trackVwoEvents(profileResponse);
                  const shouldPromptSecurity =
                    profileResponse?.secondFactorAuth === null &&
                    profileResponse?.passkeyEnabled === false &&
                    profileResponse?.investorStatus === "ACTIVE" &&
                    (profileResponse?.suppress2faPrompt === false ||
                      (profileResponse?.suppress2faPrompt === true &&
                        !skip2FAPrompt));

                  if (shouldPromptSecurity) {
                    return navigate(ROUTES.SECURITY_PROMPT);
                  } else {
                    Cookies.remove("user", { path: "/" });
                    Cookies.set("user", JSON.stringify(profileResponse), {
                      path: "/",
                      sameSite: "Lax",
                    });
                    if (profileResponse?.investorStatus === "REJECTED") {
                      setGoogleLoader(false);
                      return navigate(ROUTES.KILDE_REJECTED_USER);
                    }
                    if (
                      profileResponse?.vwoFeatures?.identityVerificationSystem
                        ?.idvSystemToUse === "regtank"
                    ) {
                      const getSystId = await getSystemId();
                      if (
                        getSystId?.systemId !== null &&
                        getSystId?.systemId !== undefined &&
                        Object.keys(getSystId)?.length > 0
                      ) {
                        regtankStatus = await statusCheck({
                          email: profileResponse?.email,
                          systemId: getSystId?.systemId,
                        });
                        setStatusCheckResponse(regtankStatus, dispatch);
                      }
                      Cookies.set("systemId", getSystId?.systemId);
                    }
                    if (
                      profileResponse?.vwoFeatures.redirectApp
                        ?.appToRedirect === "vue"
                    ) {
                      redirectToVue(
                        profileResponse?.vwoFeatures.redirectApp?.appToRedirect,
                        navigate
                      );
                      setGoogleLoader(false);
                    } else {
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
                        await Redirection(
                          setGoogleLoader,
                          profileResponse,
                          regtankStatus,
                          dispatch,
                          navigate,
                          profileResponse?.vwoFeatures?.redirectApp
                        );
                      }
                    }
                  }
                })
                .catch((error) => {
                  console.log("profile err", error);
                  setGoogleLoader(false);
                });
            }
          } else {
            setGoogleLoader(false);
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
          setGoogleLoader(false);
        });
    },
    flow: "auth-code",
  });

  return (
    <>
      <AuthNewLayout>
        <div className="kilde-onboarding-form-container reg-v2-p">
          <div className="onboarding-container">
            <div className="authentication-form">
              <div className="flex-column-8">
                <p className="kl-pi-title m-0">Welcome back!</p>
                <p className="kl-auth-subtitle m-0">
                  Login to your Kilde account
                </p>
              </div>
              <div>
                <Form
                  onFinish={handleLogin}
                  name="wrap"
                  labelCol={{ flex: "110px" }}
                  labelAlign="left"
                  labelWrap
                  wrapperCol={{ flex: 1 }}
                  colon={false}
                >
                  <div className="sb-login-form-div">
                    <div
                      className="last-used-wrapper"
                      style={{ position: "relative" }}
                    >
                      <InputDefault
                        placeholder="Email"
                        type="email"
                        onChange={handleChange}
                        name="email"
                        required={true}
                        focusing={validationErrors?.email}
                        validationState={setValidationErrors}
                        errorMsg={"Email is Required"}
                        autoComplete="username webauthn"
                      />
                      {lastLoginMethod === "email" && (
                        <span className="last-used-inline">Last login</span>
                      )}
                    </div>

                    <div className="flex-column-4">
                      <Input.Password
                        name="password"
                        placeholder="Password"
                        type="password"
                        style={{
                          height: 40,
                          borderRadius: "12px",
                          border:
                            "1px solid var(--black-10, rgba(26, 32, 44, 0.10))",
                        }}
                        onChange={handleChange}
                        required={true}
                        focusing={validationErrors?.password.toString()}
                        errormsg={"Password is Required"}
                      />
                      <div className="sb-text-align-end">
                        <Link className="kl-link " to={ROUTES.FORGOT_PASSWORD}>
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    <div>
                      <ButtonDefault
                        title="Continue"
                        loading={loader}
                        style={{ width: "100%" }}
                        id="btn-continue-login"
                      />
                    </div>
                  </div>
                </Form>
              </div>

              <div>
                <Divider plain className="m-0 onboarding-divider">
                  <p> Or </p>
                </Divider>
              </div>
              <div className="sb-login-form-div">
                <div className="last-used-wrapper">
                  <ButtonIcon
                    title="Sign in with Google"
                    icon={<img src={GoogleIcon} alt="google_icon" />}
                    loading={googleLoader}
                    className={`google-btn ${
                      lastLoginMethod === "google" ? "last-used-button" : ""
                    }`}
                    onClick={googleLoginWithCode}
                    id="btn-google-login"
                  />
                  {lastLoginMethod === "google" && (
                    <span className="last-used-inline">Last login</span>
                  )}
                </div>
                {isPassKeyEnabled && (
                  <div>
                    <div className="last-used-wrapper">
                      <ButtonIcon
                        title="Sign in with Passkey"
                        icon={<img src={PasskeyIcon} alt="icon" />}
                        loading={passkeyLoader}
                        className={`google-btn ${
                          lastLoginMethod === "passkey"
                            ? "last-used-button"
                            : ""
                        }`}
                        id="btn-passkey-login"
                        onClick={handlePasskeyLogin}
                      />
                      {lastLoginMethod === "passkey" && (
                        <span className="last-used-inline">Last login</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <p className="kl-subtitle m-0 register-redirect-link">
                  Don't have an account?{" "}
                  <Link
                    className="fp-link"
                    to={ROUTES.REGISTER}
                    id="link-create-account"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </AuthNewLayout>
    </>
  );
};

export default LoginPage;
