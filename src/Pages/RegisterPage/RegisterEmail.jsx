import React, { useEffect, useRef, useState } from "react";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { Link, useNavigate } from "react-router-dom";
import { Col, Input, Row, Form, Button } from "antd";
import PhoneInput from "react-phone-input-2";
import {
  clearUserSession,
  updateAuthToken,
  validatePassword,
} from "../../Utils/Reusables";
import {
  generateUTMURLAndReferrer,
  get_ga_clientid,
} from "../../Utils/Helpers";
import { getUser, RegisterApi } from "../../Apis/UserApi";
import Cookies from "js-cookie";
import ROUTES from "../../Config/Routes";
import { trackEvent } from "../../Utils/Analytics";
import { PublicEventApi } from "../../Apis/PublicApi";
import InputDefault from "../../Components/InputDefault/InputDefault";
import Left_arrow from "../../Assets/Images/Icons/left_arrow.svg";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import RegisterTerms from "./RegisterTerms";
import { triggerResendEmail } from "../EmailVerificationPage/useEmailVerification";
import { trackRegisterMethod } from "../../Utils/vwoCustomEvents";
import AuthNewLayout from "../../Layouts/BlankHeaderLayout/AuthNewLayout";

const Register_v2 = () => {
  const hintRef = useRef(null);
  const navigate = useNavigate();
  const [hotjarUserId, setHotjarUserId] = useState("");
  const [loader, setLoader] = useState(false);
  const [noPass, setNoPass] = useState(false);
  const [mobileNumberClass, setMobileNumberClass] = useState("");
  const [countryCode, setCountryCode] = useState("sg");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    referralCode: Cookies.get("referral_code") || "",
  });
  const [validationErrors, setValidationErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    referralCode: false,
  });
  const [criteria, setCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [showHint, setShowHint] = useState(false);
  const [referralCodeValid, setReferralCodeValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

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

  const getHotjarUserId = () => {
    if (window?.hj && typeof window?.hj?.getUserId === "function") {
      const userId = window?.hj?.getUserId();
      return userId ? userId : null;
    }
    return null;
  };

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

  const handleBlur = () => {
    const number = formData?.mobileNumber.substring(countryCode?.length).trim();
    if (number !== "") {
      setMobileNumberClass("");
    } else {
      setMobileNumberClass("sb-phone-empty");
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
      let data;
      if (
        formData?.referralCode === null ||
        formData?.referralCode === undefined ||
        formData?.referralCode === ""
      ) {
        data = {
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
          httpReferrer:
            generateUTMURLAndReferrer(hotjarUserId)?.originalReferrer,
        };
      } else {
        data = {
          firstName: formData?.firstName,
          lastName: formData?.lastName,
          email: formData?.email,
          mobileNumber: formData?.mobileNumber,
          password: formData?.password,
          acceptTermsOfUse: true,
          acceptPrivacyPolicy: true,
          gaClientId: get_ga_clientid(),
          url: generateUTMURLAndReferrer(hotjarUserId)?.combinedURL,
          httpReferrer:
            generateUTMURLAndReferrer(hotjarUserId)?.originalReferrer,
          referralCode: formData?.referralCode,
        };
      }

      if (data && formData?.mobileNumber) {
        RegisterApi(data)
          .then(async (response) => {
            if (response?.token) {
              Cookies.remove("referral_code");
              updateAuthToken(response?.token);
              // Cookies.set("auth_inv_token", response?.token);
              setLoader(false);
              await triggerResendEmail();
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
  return (
    <AuthNewLayout>
      <div className="sb-onboarding-register-v2-form-container reg-v2 p-relative">
        <Button
          className="go-back-register-btn"
          onClick={() => (window.location.href = ROUTES.REGISTER_V2)}
        >
          <img src={Left_arrow} alt="left_arrow" />
          Back
        </Button>
        <div className="register-padd-container">
          <p className="kl-pi-title mb-28 mt-0">Sign up with Email</p>
        </div>

        <Form
          onFinish={HandleCreateUser}
          name="wrap"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
          className="register-padd-container"
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
                  rules={[{ required: true, message: "Last name is required" }]}
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
                              <CheckCircleOutlined style={{ color: "green" }} />
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
                  className={referralCodeValid === true ? "referral-error" : ""}
                >
                  <InputDefault
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
                    value={formData?.referralCode}
                  />
                </div>
              </Col>

              <Col className="gutter-row mt-10" md={24} sm={24} xs={24}>
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
          <Col className="gutter-row mb-16 mt-16" md={24} sm={24} xs={24}>
            <RegisterTerms />
          </Col>
          <div className="sb-forgot-new-here">
            <div className="kl-subtitle mt-0">
              Already have an account?
              <Link className="fp-link" to={ROUTES.LOGIN}>
                Login
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </AuthNewLayout>
  );
};

export default Register_v2;
