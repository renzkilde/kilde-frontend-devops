import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Divider, Button, notification, Spin } from "antd";

import GlobalConfig from "../../Utils/GlobalVariabels.js";
import {
  GoogleRegisterApi,
  generateSignpassCode,
  getSignPassConfig,
  getUser,
} from "../../Apis/UserApi.js";
import ROUTES from "../../Config/Routes.js";
import { updateAuthToken } from "../../Utils/Reusables.js";

import SingpassLogo from "../../Assets/Images/singpass.svg";
import GoogleIcon from "../../Assets/Images/Icons/google_icon.svg";
import EmailLogin from "../../Assets/Images/emailLogin.svg";
// import AppleIcon from "../../Assets/Images/Icons/apple_icon.svg";

import "./style.css";
import Cookies from "js-cookie";
import {
  generateUTMURLAndReferrer,
  get_ga_clientid,
  getUserCurrentLocation,
} from "../../Utils/Helpers.js";
import { PublicEventApi } from "../../Apis/PublicApi.js";
import ButtonIcon from "../../Components/ButtonIcon/ButtonIcon.jsx";
import { useGoogleLogin } from "@react-oauth/google";
import GlobalVariabels from "../../Utils/GlobalVariabels.js";
import { identify, trackEvent } from "../../Utils/Analytics.js";
import { LoadingOutlined } from "@ant-design/icons";
import RegisterV2Terms from "./RegisterV2Terms.jsx";
import { trackRegisterMethod } from "../../Utils/vwoCustomEvents.js";
import AuthNewLayout from "../../Layouts/BlankHeaderLayout/AuthNewLayout.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [hotjarUserId, setHotjarUserId] = useState("");
  const [googleLoader, setGoogleLoader] = useState(false);

  const [singPassLoader, setSingPassLoader] = useState(false);
  const [referralCodeValidModal, setReferralCodeValidModal] = useState(false);
  // const [referralModal, setReferralModal] = useState(false);
  const [googleRequestBody, setGoogleRequestBody] = useState();
  const [finalGoogleLoader, setFinalGoogleLoader] = useState(false);
  const [formData, setFormData] = useState({
    referralCode: Cookies.get("referral_code") || "",
  });
  const [validationErrors, setValidationErrors] = useState({
    referralCode: false,
  });

  useEffect(() => {
    const codeFromUrl = searchParams.get("referral");
    if (codeFromUrl) {
      Cookies.set("referral_code", codeFromUrl);
      setFormData((prev) => ({ ...prev, referralCode: codeFromUrl }));
    }
  }, [searchParams]);

  useEffect(() => {
    getUserCurrentLocation();
  }, []);

  useEffect(() => {
    const getSingPass = async () => {
      await getSignPassConfig()
        .then((respose) => {
          const jsonString = JSON.stringify(respose);
          Cookies.set("singpass_config", jsonString);
        })
        .catch((err) => {
          console.log("singpass_config", err);
        });
    };
    getSingPass();
  }, []);

  const getHotjarUserId = () => {
    if (window?.hj && typeof window?.hj?.getUserId === "function") {
      const userId = window?.hj?.getUserId();
      return userId ? userId : null;
    }
    return null;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const hotjarId = getHotjarUserId();
      if (hotjarId) {
        setHotjarUserId(hotjarId);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSingPass = async () => {
    setSingPassLoader(true);
    let singpassGetConfig = Cookies.get("singpass_config");
    if (singpassGetConfig) {
      const singpassConfigration = decodeURIComponent(singpassGetConfig);
      const singpassConfig = JSON.parse(singpassConfigration);
      if (
        singpassConfig?.clientId &&
        singpassConfig?.purposeId &&
        singpassConfig?.redirectUrl &&
        singpassConfig?.scope
      ) {
        setSingPassLoader(true);
        await generateSignpassCode()
          .then((response) => {
            Cookies.set("singpass_code", response?.codeChallenge);
            Cookies.set("sid", response?.sid);
            window.location.href = `${GlobalConfig?.SINGPASS_REDIRECT_URL}?client_id=${singpassConfig?.clientId}&code_challenge=${response?.codeChallenge}&code_challenge_method=${GlobalConfig?.SINGPASS_CODE_CC_METHOD}&purpose_id=${singpassConfig?.purposeId}&redirect_uri=${singpassConfig?.redirectUrl}&response_type=${GlobalConfig?.SINGPASS_RESPONSE_TYPE}&scope=${singpassConfig?.scope}`;
            PublicEventApi("regSingPass");
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              type: "error",
              message: "Oops! Something happened.",
              description:
                "We're on it! If this continues, please contact support at sales@kilde.sg.",
            });
            setSingPassLoader(false);
          });
      }
    } else {
      setSingPassLoader(false);
      console.log("singpass_config not found");
      notification.error({
        type: "error",
        message: "Oops! Something happened.",
        description:
          "We're on it! If this continues, please contact support at sales@kilde.sg.",
      });
    }
  };

  // const handleGoogle = async (data) => {
  //   if (data) {
  //     setReferralModal(true);
  //   }
  //   setGoogleLoader(false);
  //   let requestBody = {
  //     gaClientId: get_ga_clientid(),
  //     acceptPrivacyPolicy: true,
  //     acceptTermsOfUse: true,
  //     email: data?.email,
  //     firstName: data?.given_name,
  //     lastName: data?.family_name,
  //     url: generateUTMURLAndReferrer(hotjarUserId)?.combinedURL,
  //     httpReferrer: generateUTMURLAndReferrer(hotjarUserId)?.originalReferrer,
  //   };
  //   setGoogleRequestBody(requestBody);
  // };

  // const finalGoogleApi = () => {
  //   setFinalGoogleLoader(true);
  //   let requestBody;
  //   if (
  //     formData?.referralCode === null ||
  //     formData?.referralCode === undefined ||
  //     formData?.referralCode === ""
  //   ) {
  //     requestBody = googleRequestBody;
  //   } else {
  //     requestBody = {
  //       ...googleRequestBody,
  //       referralCode: formData?.referralCode,
  //     };
  //   }
  //   GoogleRegisterApi(requestBody)
  //     .then(async (response) => {
  //       setFinalGoogleLoader(false);
  //       if (response?.token) {
  //         Cookies.remove("referral_code");
  //         identify({
  //           email: googleRequestBody?.email,
  //         });
  //         updateAuthToken(response?.token);
  //         // Cookies.set("auth_inv_token", response?.token);
  //         getUser().then(async (profileResponse) => {
  //           trackEvent("Investor: registered", {
  //             user_id: profileResponse?.number,
  //           });
  //           Cookies.remove("user", { path: "/" });
  //           Cookies.set("user", JSON.stringify(profileResponse), {
  //             path: "/",
  //             sameSite: "Lax",
  //           });
  //           window?.dataLayer?.push({
  //             event: "google-success",
  //             user_id: profileResponse?.number,
  //           });
  //         });
  //         setGoogleRequestBody("");
  //         setGoogleLoader(false);
  //         setFormData({
  //           ...formData,
  //           referralCode: "",
  //         });
  //         navigate(ROUTES.EMAIL_VERIFIED);
  //       } else {
  //         if (Object.values(response?.fieldErrors).length > 0) {
  //           if (!Cookies.get("referral_code")) {
  //             setFormData({
  //               ...formData,
  //               referralCode: "",
  //             });
  //           }
  //           setGoogleLoader(false);
  //           setReferralModal(false);
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error during registration:", error);
  //       setGoogleLoader(false);
  //     });
  // };

  const handleGoogle = async (data) => {
    if (!data) return;

    setGoogleLoader(false);
    setFinalGoogleLoader(true);

    const requestBody = {
      gaClientId: get_ga_clientid(),
      acceptPrivacyPolicy: true,
      acceptTermsOfUse: true,
      email: data?.email,
      firstName: data?.given_name,
      lastName: data?.family_name,
      url: generateUTMURLAndReferrer(hotjarUserId)?.combinedURL,
      httpReferrer: generateUTMURLAndReferrer(hotjarUserId)?.originalReferrer,
    };

    setGoogleRequestBody(requestBody);
    finalGoogleApi(requestBody);
  };

  const finalGoogleApi = (baseRequestBody) => {
    setFinalGoogleLoader(true);

    const requestBody = formData?.referralCode
      ? { ...baseRequestBody, referralCode: formData.referralCode }
      : baseRequestBody;

    GoogleRegisterApi(requestBody)
      .then(async (response) => {
        setFinalGoogleLoader(false);

        if (response?.token) {
          identify({ email: baseRequestBody.email });
          updateAuthToken(response.token);

          const profileResponse = await getUser();

          trackEvent("Investor: registered", {
            user_id: profileResponse?.number,
          });

          trackRegisterMethod(profileResponse);

          Cookies.set("user", JSON.stringify(profileResponse), {
            path: "/",
            sameSite: "Lax",
          });

          localStorage.setItem(
            "registrationType",
            profileResponse?.registrationType
          );

          window?.dataLayer?.push({
            event: "google-success",
            user_id: profileResponse?.number,
            register_method: profileResponse?.registrationType,
          });

          resetGoogleFormState();
          navigate(ROUTES.VERIFICATION);
        } else if (
          response?.fieldErrors &&
          Object.keys(response.fieldErrors).length > 0
        ) {
          if (!Cookies.get("referral_code")) {
            setFormData((prev) => ({ ...prev, referralCode: "" }));
          }
          setGoogleLoader(false);
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setGoogleLoader(false);
      });
  };

  const resetGoogleFormState = () => {
    setGoogleRequestBody("");
    setGoogleLoader(false);
    setGoogleLoader(false);
    setFormData((prev) => ({ ...prev, referralCode: "" }));
  };

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      const { access_token } = credentialResponse;

      try {
        const userInfoResponse = await fetch(
          GlobalVariabels.GOOGLE_USERINFO_URI,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          handleGoogle(userInfo);
        } else {
          console.error(
            "Failed to fetch user information:",
            userInfoResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    },
  });

  return (
    <>
      <AuthNewLayout>
        <div className="register-v2-container">
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 50, color: "var(--kilde-blue)" }}
              />
            }
            spinning={singPassLoader}
          >
            <div className="register-v2-onboarding-container">
              <div className="authentication-form">
                <div className="register-v2-header-title">
                  <p className="kl-pi-title mb-0 mt-0">Welcome to Kilde!</p>
                  <p className="m-0 register-v2-sub-title">
                    Kilde products are intended for accredited, professional and
                    institutional investors.
                  </p>
                </div>
                <div className="register-v2-singpassbutton-container ">
                  <Button
                    className="register-v2-btn-singpass"
                    loading={singPassLoader}
                    onClick={handleSingPass}
                    id="btn-singpass-signup-v2"
                  >
                    <p className="mb-0 singpass-text">Sign up with </p>
                    <img src={SingpassLogo} alt="singpass_logo" />
                  </Button>

                  <p className="mt-0 mb-0 rv2-singpass-sub-text">
                    We suggest Singaporeans use Singpass.{" "}
                    <span
                      className="cursor-pointer"
                      style={{ color: "var(--kilde-blue)" }}
                      onClick={() =>
                        window.open(
                          "https://www.singpass.gov.sg/main/individuals/",
                          "_blank"
                        )
                      }
                    >
                      Find out more
                    </span>
                  </p>
                </div>
                <div>
                  <Divider plain className="m-0 onboarding-divider">
                    <p style={{ color: "#ababab" }}> Or </p>
                  </Divider>
                </div>
                <div className="register-v2-btn-container ">
                  <ButtonIcon
                    title="Sign up with Email"
                    icon={<img src={EmailLogin} alt="email_icon" />}
                    className="google-btn"
                    onClick={() => navigate(ROUTES.REGISTER_V2_EMAIL)}
                    id="btn-email-signup-v2"
                  />

                  <ButtonIcon
                    title="Sign up with Google"
                    icon={<img src={GoogleIcon} alt="google_icon" />}
                    loading={googleLoader}
                    className="google-btn"
                    onClick={() => login()}
                    id="btn-google-signup-v2"
                  />
                </div>
                <div>
                  <RegisterV2Terms />
                </div>
                <div>
                  <div className="kl-subtitle mt-0 mb-0">
                    Already have an account?{" "}
                    <Link className="v2-link " to={ROUTES.LOGIN}>
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </AuthNewLayout>
    </>
  );
};

export default SignUp;
