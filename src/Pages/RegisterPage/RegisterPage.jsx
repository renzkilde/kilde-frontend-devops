import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Form, Row, Col, Divider, Button, notification } from "antd";
import Cookies from "js-cookie";
import ReactLoading from "react-loading";
import PhoneInput from "react-phone-input-2";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { useSearchParams } from "react-router-dom";

import InputDefault from "../../Components/InputDefault/InputDefault.jsx";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault.jsx";
import ButtonIcon from "../../Components/ButtonIcon/ButtonIcon.jsx";

import GlobalConfig from "../../Utils/GlobalVariabels.js";
import { trackRegisterMethod } from "../../Utils/vwoCustomEvents.js";
import {
  clearUserSession,
  updateAuthToken,
  validatePassword,
} from "../../Utils/Reusables.js";
import {
  generateUTMURLAndReferrer,
  get_ga_clientid,
  getUserCurrentLocation,
} from "../../Utils/Helpers.js";
import GlobalVariabels from "../../Utils/GlobalVariabels.js";
import { identify, trackEvent } from "../../Utils/Analytics.js";

import {
  GoogleRegisterApi,
  RegisterApi,
  generateSignpassCode,
  getSignPassConfig,
  getUser,
} from "../../Apis/UserApi.js";
import { PublicEventApi } from "../../Apis/PublicApi.js";

import ROUTES from "../../Config/Routes.js";

import SingpassLogo from "../../Assets/Images/singpass.svg";
import GoogleIcon from "../../Assets/Images/Icons/google_icon.svg";

import AuthLayout from "../../Layouts/BlankHeaderLayout/AuthLayout.jsx";

import RegisterTerms from "./RegisterTerms.jsx";
import { triggerResendEmail } from "../EmailVerificationPage/useEmailVerification";

import "./style.css";
import AuthNewLayout from "../../Layouts/BlankHeaderLayout/AuthNewLayout.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [hotjarUserId, setHotjarUserId] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    referralCode: Cookies.get("referral_code") || "",
  });
  const [mobileNumberClass, setMobileNumberClass] = useState("");
  const [countryCode, setCountryCode] = useState("sg");
  const [validationErrors, setValidationErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    referralCode: false,
  });
  const [loader, setLoader] = useState(false);
  const [noPass, setNoPass] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [criteria, setCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [googleLoader, setGoogleLoader] = useState(false);
  const [singPassLoader, setSingPassLoader] = useState(false);
  const [referralCodeValid, setReferralCodeValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [googleRequestBody, setGoogleRequestBody] = useState();
  const [finalGoogleLoader, setFinalGoogleLoader] = useState(false);

  useEffect(() => {
    const codeFromUrl = searchParams.get("referral");
    if (codeFromUrl) {
      Cookies.set("referral_code", codeFromUrl);
      setFormData((prev) => ({ ...prev, referralCode: codeFromUrl }));
    }
  }, [searchParams]);

  const validatePasswordCustom = (password) => {
    return {
      length: password.length >= 10,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
    const updatedCriteria = validatePasswordCustom(value);
    setCriteria(updatedCriteria);
    setNoPass(!Object.values(updatedCriteria).every(Boolean));
  };

  const hintRef = useRef(null);

  const handleClickOutside = (e) => {
    if (hintRef.current && !hintRef.current.contains(e.target)) {
      setShowHint(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
          console.error("singpass_config", err);
        });
    };
    getSingPass();
  }, []);

  const getHotjarUserId = () => {
    // Make sure Hotjar has initialized
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

  useEffect(() => {
    getUserCurrentLocation();
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
            console.error(error);
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
      console.error("singpass_config not found");
      notification.error({
        type: "error",
        message: "Oops! Something happened.",
        description:
          "We're on it! If this continues, please contact support at sales@kilde.sg.",
      });
    }
  };

  const HandleCreateUser = async () => {
    clearUserSession();
    setLoader(true);
    setValidationErrors({
      email: true,
      firstName: true,
      lastName: true,
    });

    if (!formData?.password || !validatePassword(formData?.password)) {
      setLoader(false);
      return setNoPass(true);
    }

    if (formData?.email) {
      const isReferralCodePresent = !!formData?.referralCode;

      const data = {
        firstName: formData?.firstName,
        lastName: formData?.lastName,
        email: formData?.email,
        mobileNumber: formData?.mobileNumber,
        password: formData?.password,
        passwordRepeat: formData?.password,
        acceptTermsOfUse: true,
        acceptPrivacyPolicy: true,
        gaClientId: get_ga_clientid(),
        url: generateUTMURLAndReferrer(hotjarUserId)?.combinedURL,
        httpReferrer: generateUTMURLAndReferrer(hotjarUserId)?.originalReferrer,
        ...(isReferralCodePresent && { referralCode: formData?.referralCode }),
      };

      if (data && formData?.mobileNumber) {
        RegisterApi(data)
          .then(async (response) => {
            if (response?.token) {
              updateAuthToken(response?.token);
              setLoader(false);
              await triggerResendEmail();
              Cookies.remove("referral_code");
              navigate(ROUTES.EMAIL_VERIFICATION);
              getUser().then(async (profileResponse) => {
                trackRegisterMethod(profileResponse);
                trackEvent("Investor: registered", {
                  user_id: profileResponse?.number,
                });
                localStorage.setItem(
                  "registrationType",
                  profileResponse?.registrationType
                );
                window?.dataLayer?.push({
                  event: "registration-form-success",
                  user_id: profileResponse?.number,
                  register_method: profileResponse?.registrationType,
                });
              });
              PublicEventApi("personalData");
            } else {
              if (Object.values(response?.fieldErrors).length > 0) {
                setLoader(false);
                if (
                  response?.fieldErrors?.referralCode !== undefined &&
                  response?.fieldErrors?.email !== undefined
                ) {
                  setReferralCodeValid(true);
                  setEmailValid(true);
                }
                if (response?.fieldErrors?.referralCode) {
                  setReferralCodeValid(true);
                } else if (response?.fieldErrors?.email) {
                  setEmailValid(true);
                }
              }
            }
          })
          .catch((error) => {
            console.error("Error during registration:", error);
            setLoader(false);
          });
      } else {
        setLoader(false);
        setMobileNumberClass("sb-phone-empty");
      }
    }
  };

  const handleBlur = () => {
    const number = formData?.mobileNumber.substring(countryCode?.length).trim();
    if (number !== "") {
      setMobileNumberClass("");
    } else {
      setMobileNumberClass("sb-phone-empty");
    }
  };

  const handlePhoneChange = async (value, country) => {
    setCountryCode(country.dialCode);
    const number = value.substring(country.dialCode?.length).trim();
    const isValueValid = value.trim() === "";
    setFormData((prevAddress) => ({
      ...prevAddress,
      mobileNumber: "+" + value,
    }));

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      mobileNumber: isValueValid,
    }));

    setFormData({
      ...formData,
      mobileNumber: "+" + value,
    });
    if (number !== "") {
      setMobileNumberClass("");
    } else {
      setMobileNumberClass("sb-phone-empty");
    }
  };

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

          Cookies.set("user", JSON.stringify(profileResponse), {
            path: "/",
            sameSite: "Lax",
          });
          trackRegisterMethod(profileResponse);
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
          setLoader(false);
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setGoogleLoader(false);
        setLoader(false);
      });
  };

  const resetGoogleFormState = () => {
    setGoogleRequestBody("");
    setGoogleLoader(false);
    setLoader(false);
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
        {singPassLoader && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              zIndex: 99,
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

        <div className="sb-onboarding-register-form-container">
          <div className="register-padd-container mt-50">
            <p className="kl-pi-title mb-10 mt-0">Welcome!</p>
            <p className="kl-subtitle m-0">Let’s create an account for you.</p>
          </div>

          <div className="register-btn-div">
            <p className="mt-5 mb-16 sb-pi-singpass-subtitle">
              Kilde products are intended for accredited, professional and
              institutional investors.
            </p>

            <div className="register-padd-container">
              <Button
                className="btn-singpass"
                loading={singPassLoader}
                onClick={handleSingPass}
                id="btn-singpass-signup"
              >
                <p className="mb-5 singpass-text">Sign up with </p>
                <img src={SingpassLogo} alt="singpass_logo" />
              </Button>
            </div>

            <p className="mt-5 mb-16 singpass-sub-text">
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
            <div className="register-padd-container">
              <div className="sb-flex-column-item-center mt-20 w-100 login-div">
                <ButtonIcon
                  title="Sign up with Google"
                  icon={<img src={GoogleIcon} alt="google_icon" />}
                  loading={googleLoader}
                  className="google-btn"
                  onClick={() => login()}
                  id="btn-google-signup"
                />
              </div>
            </div>
          </div>
          <div
            className="sb-login-actions register-padd-container"
            style={{ gap: 4 }}
          >
            <Divider plain>
              <p style={{ color: "#ababab" }}> Or with Email </p>
            </Divider>
          </div>
          <div className="register-padd-container mb-50">
            <Form
              onFinish={HandleCreateUser}
              name="wrap"
              labelCol={{ flex: "110px" }}
              labelAlign="left"
              labelWrap
              wrapperCol={{ flex: 1 }}
              colon={false}
            >
              <div className="sb-login-form">
                <Row gutter={16}>
                  <Col className="gutter-row " md={12} sm={12} xs={24}>
                    <Form.Item
                      name="firstName"
                      rules={[
                        { required: true, message: "First name is required" },
                      ]}
                      className="mb-16"
                    >
                      <InputDefault
                        name="firstName"
                        placeholder="First name"
                        onChange={({ target }) =>
                          setFormData({ ...formData, firstName: target.value })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row " md={12} sm={12} xs={24}>
                    <Form.Item
                      name="lastName"
                      rules={[
                        { required: true, message: "Last name is required" },
                      ]}
                      className="mb-16"
                    >
                      <InputDefault
                        name="lastName"
                        placeholder="Last name"
                        onChange={({ target }) =>
                          setFormData({ ...formData, lastName: target.value })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row " md={24} sm={24} xs={24}>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Email is required" },
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                      className="mb-16"
                    >
                      <InputDefault
                        name="email"
                        placeholder="Email"
                        onChange={({ target }) => {
                          setFormData({ ...formData, email: target.value });
                          setEmailValid(false);
                        }}
                        id="email"
                        className={emailValid === true ? "referral-error" : ""}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    className="gutter-row  sb-text-align-start"
                    md={24}
                    sm={24}
                    xs={24}
                  >
                    <Form.Item
                      name="mobileNumber"
                      rules={[
                        {
                          required: true,
                          message: "Mobile number is required",
                        },
                      ]}
                      className="mb-16"
                    >
                      <PhoneInput
                        name="mobileNumber"
                        className={`sb-phone-field ${mobileNumberClass}`}
                        country={countryCode}
                        value={formData.mobileNumber}
                        onChange={handlePhoneChange}
                        enableSearch
                        onBlur={handleBlur}
                      />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" md={24} sm={24} xs={24}>
                    <div style={{ marginBottom: 12 }} ref={hintRef}>
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            validator: (_, value) =>
                              value && value.length >= 10
                                ? Promise.resolve()
                                : Promise.reject("Password is required"),
                          },
                        ]}
                        style={{ marginBottom: "0px" }}
                      >
                        <Input.Password
                          name="password"
                          placeholder="Password"
                          style={{ height: 40, borderRadius: "12px" }}
                          onFocus={() => setShowHint(true)}
                          onChange={handlePasswordChange}
                          status={noPass ? "error" : ""}
                          id="password"
                        />
                      </Form.Item>

                      {showHint && (
                        <div
                          className={`password-hint ${showHint ? "show" : ""}`}
                          style={{
                            padding: "10px",
                            background: "#f9f9f9",
                            borderRadius: "8px",
                            marginTop: "8px",
                            fontSize: "12px",
                            display: showHint ? "block" : "none",
                          }}
                        >
                          <ul
                            style={{
                              paddingLeft: "16px",
                              listStyle: "none",
                              textAlign: "left",
                              fontWeight: 500,
                            }}
                          >
                            {[
                              { key: "length", text: "At least 10 characters" },
                              {
                                key: "lowercase",
                                text: "At least one lowercase letter",
                              },
                              {
                                key: "uppercase",
                                text: "At least one uppercase letter",
                              },
                              {
                                key: "number",
                                text: "At least one numeric character",
                              },
                              {
                                key: "special",
                                text: "At least one special character",
                              },
                            ].map(({ key, text }) => (
                              <li
                                key={key}
                                style={{
                                  color: criteria[key] ? "green" : "#939393",
                                }}
                              >
                                {criteria[key] ? (
                                  <CheckCircleOutlined
                                    style={{ color: "green" }}
                                  />
                                ) : (
                                  <CloseCircleOutlined
                                    style={{ color: "#939393" }}
                                  />
                                )}{" "}
                                {text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col
                    className="gutter-row mb-16"
                    md={24}
                    sm={24}
                    xs={24}
                    style={{ marginTop: 4 }}
                  >
                    <div
                      className={
                        referralCodeValid === true ? "referral-error" : ""
                      }
                    >
                      <InputDefault
                        value={formData?.referralCode}
                        name="ReferralCode"
                        placeholder="Referral code (optional)"
                        type="text"
                        validationState={setValidationErrors}
                        focusing={validationErrors?.referralCode}
                        onChange={({ target }) => {
                          setFormData({
                            ...formData,
                            referralCode: target.value,
                          });
                          setReferralCodeValid(false);
                        }}
                        required={false}
                      />
                    </div>
                  </Col>
                  <Col
                    className="gutter-row mb-16"
                    md={24}
                    sm={24}
                    xs={24}
                    style={{ textAlign: "start" }}
                  >
                    <RegisterTerms />
                  </Col>

                  <Col
                    className="gutter-row mb-0 mt-10"
                    md={24}
                    sm={24}
                    xs={24}
                  >
                    <Form.Item className="mb-0">
                      <ButtonDefault
                        title="Create account"
                        loading={loader}
                        style={{ width: "100%" }}
                        block={true}
                        id="btn-create-account"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Form>
            <div className="sb-forgot-new-here">
              <div className="kl-subtitle mt-0 mb-50">
                Already have an account?
                <Link className="fp-link" to={ROUTES.LOGIN}>
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AuthNewLayout>
    </>
  );
};

export default SignUp;
