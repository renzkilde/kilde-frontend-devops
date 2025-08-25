/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Row, Col, DatePicker, notification } from "antd";

import InputDefault from "../../Components/InputDefault/InputDefault.jsx";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault.jsx";

import {
  RegisterSingpassApi,
  eventsApi,
  getSingPassUserData,
  getUser,
} from "../../Apis/UserApi.js";
import ROUTES from "../../Config/Routes.js";
import {
  formatAddress,
  formatCurrency,
  updateAuthToken,
  validatePassword,
} from "../../Utils/Reusables.js";

import SelectDefault from "../../Components/SelectDefault/SelectDefault.jsx";
import dayjs from "dayjs";
import {
  generateUTMURLAndReferrer,
  getCountries,
  get_ga_clientid,
} from "../../Utils/Helpers.js";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import "../RegisterPage/style.css";
import Cookies from "js-cookie";
import SingpassLoader from "./SingpassLoader.jsx";
import { trackEvent } from "../../Utils/Analytics.js";
import moment from "moment";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import "./style.css";
import RegisterTerms from "../RegisterPage/RegisterTerms.jsx";
import { triggerResendEmail } from "../EmailVerificationPage/useEmailVerification.js";
import { trackRegisterMethod } from "../../Utils/vwoCustomEvents.js";
import AuthNewLayout from "../../Layouts/BlankHeaderLayout/AuthNewLayout.jsx";

const SingpassRegisterPage = () => {
  const navigate = useNavigate();
  const [singPassUser, setSingPassUser] = useState();
  const singPassCode = sessionStorage.getItem("sCode");
  const [countryCode, setCountryCode] = useState("sg");
  const [mobileNumberClass, setMobileNumberClass] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [criteria, setCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

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

  const countryList = getCountries();

  useEffect(() => {
    const requestBody = {
      authCode: singPassCode,
      sid: Cookies.get("sid"),
    };
    if (singPassCode && Cookies.get("sid")) {
      getSingPassUserData(requestBody)
        .then((userData) => {
          if (userData?.status === true) {
            setSingPassUser(userData?.data?.data_json);
            sessionStorage.setItem("singPassId", userData?.data?.id);
          } else {
            Cookies.remove("singpass_config");
            Cookies.remove("sid");
            navigate(ROUTES.REGISTER);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.log("sid not found");
      navigate(ROUTES.REGISTER);
      notification.error({
        message: "Error",
        description:
          "Something went wrong, Please check your input and try again.",
      });
    }
  }, [singPassCode]);

  const [formData, setFormData] = useState({
    firstName: "",
    marriedName: "",
    sex: "Male",
    dob: null,
    nricFin: "",
    countryOfBirth: "",
    nationality: "",
    residentialStatus: "",
    passType: "",
    passExDate: "",
    registeredAddress: "",
    assemleIncome: "",
    phoneNumber: "",
    email: "",
    password: "",
    cPassword: "",
    referralCode: Cookies.get("referral_code") || "",
  });

  useEffect(() => {
    if (singPassUser !== undefined) {
      setCountryCode(singPassUser?.mobileno?.areacode?.value);
      setFormData({
        ...formData,
        firstName: singPassUser?.name?.value,
        marriedName: singPassUser?.marriedname?.value,
        sex: singPassUser?.sex?.desc,
        dob: singPassUser?.dob?.value
          ? new Date(singPassUser?.dob?.value)
          : null,
        nricFin: singPassUser?.uinfin?.value,
        countryOfBirth: singPassUser?.birthcountry?.desc,
        nationality: singPassUser?.nationality?.desc,
        residentialStatus: singPassUser?.residentialstatus?.desc,
        passType: singPassUser?.passtype?.desc,
        passExDate: singPassUser?.passexpirydate?.value
          ? new Date(singPassUser?.passexpirydate?.value)
          : null,
        registeredAddress: formatAddress(singPassUser?.regadd),
        assemleIncome: singPassUser?.["noa-basic"]?.amount?.value,
        phoneNumber:
          "+" +
          singPassUser?.mobileno?.areacode?.value +
          singPassUser?.mobileno?.nbr?.value,
        email: singPassUser?.email?.value,
      });
    }
  }, [singPassUser]);

  const [validationErrors, setValidationErrors] = useState({
    firstName: false,
    marriedName: false,
    sex: false,
    dob: false,
    nricFin: false,
    countryOfBirth: false,
    nationality: false,
    passExDate: false,
    registeredAddress: false,
    assemleIncome: false,
    phoneNumber: false,
    email: false,
    password: false,
    cPassword: false,
    referralCode: false,
  });
  const [loader, setLoader] = useState(false);
  const [noPass, setNoPass] = useState(false);
  const [hotjarUserId, setHotjarUserId] = useState("");
  const [referralCodeValid, setReferralCodeValid] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const handlePhoneChange = async (value, country) => {
    setCountryCode(country.dialCode);
    const number = value.substring(country.dialCode.length).trim();

    const isValueValid = value.trim() === "";
    setFormData((prevAddress) => ({
      ...prevAddress,
      phoneNumber: "+" + value,
    }));

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      phoneNumber: isValueValid,
    }));

    if (number !== "") {
      setMobileNumberClass("");
    } else {
      setMobileNumberClass("sb-phone-empty");
    }
  };

  const handleBlur = () => {
    const number = formData.phoneNumber.substring(countryCode.length).trim();
    if (number !== "") {
      setMobileNumberClass("");
    } else {
      setMobileNumberClass("sb-phone-empty");
    }
  };

  const getHotjarUserId = () => {
    // Make sure Hotjar has initialized
    if (window?.hj && typeof window?.hj?.getUserId === "function") {
      const userId = window?.hj?.getUserId();
      return userId ? userId : null; // Check if userId exists
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
    if (validationErrors?.phoneNumber === true) {
      setMobileNumberClass("sb-phone-empty");
    }
    if (formData?.phoneNumber) {
      setMobileNumberClass("");
    }
  }, [validationErrors?.phoneNumber]);

  const HandleCreateUser = async () => {
    setLoader(true);
    setValidationErrors({
      email: true,
      password: true,
      cPassword: true,
    });

    // if (checked === false) {
    //   setCheckErr(true);
    //   setLoader(false);
    // }

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
          myInfoReference: Cookies.get("sid"),
          email: formData?.email,
          mobilePhone: formData?.phoneNumber,
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
          myInfoReference: Cookies.get("sid"),
          email: formData?.email,
          mobilePhone: formData?.phoneNumber,
          password: formData?.password,
          passwordRepeat: formData?.password,
          acceptTermsOfUse: true,
          acceptPrivacyPolicy: true,
          gaClientId: get_ga_clientid(),
          url: generateUTMURLAndReferrer(hotjarUserId)?.combinedURL,
          httpReferrer:
            generateUTMURLAndReferrer(hotjarUserId)?.originalReferrer,
          referralCode: formData?.referralCode,
        };
      }
      RegisterSingpassApi(data)
        .then(async (response) => {
          if (response?.token) {
            Cookies.remove("referral_code");
            updateAuthToken(response?.token);
            setLoader(false);
            await triggerResendEmail();
            navigate(ROUTES.EMAIL_VERIFICATION);
            getUser().then(async (profileResponse) => {
              trackRegisterMethod(profileResponse);
              trackEvent("Investor: registered", {
                user_id: profileResponse?.number,
              });
              window?.dataLayer?.push({
                event: "singpass-success",
                user_id: profileResponse?.number,
                register_method: profileResponse?.registrationType,
              });
            });
            const eventData = {
              gaClientId: get_ga_clientid(),
              action: "potentialInvestor",
              category: "registration",
            };
            eventsApi(eventData);
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
          console.error("Error during Singpass Register:", error);
          setLoader(false);
        });
    }
  };

  const isDisabled = singPassUser === undefined ? false : true;

  const handleChangeDateOfBirth = async (date, dateString) => {
    const isoDate = date
      ? moment(dateString, "DD/MM/YYYY").utc(true).toISOString()
      : null;

    setFormData({
      ...formData,
      dob: isoDate,
    });
  };

  return (
    <AuthNewLayout>
      {singPassUser !== undefined ? (
        <div className="sb-onboarding-form-container">
          <h2 className="sb-text-align-start m-0 fw-600">
            Create account with Singpass
          </h2>
          <h3 className="sb-text-align-start fw-600">Information</h3>
          <div className="sb-login-form sb-text-align-start">
            <Row gutter={16}>
              <Col
                className="gutter-row mb-10"
                xs={{ span: 24 }}
                md={{ span: 12 }}
              >
                <div>
                  <label>Name</label>
                  <InputDefault
                    disabled={isDisabled}
                    value={formData?.firstName}
                    name="firstName"
                    type="input"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.firstName}
                    onChange={({ target }) =>
                      setFormData({ ...formData, firstName: target.value })
                    }
                    required={true}
                    errorMsg={"First name is required"}
                  />
                </div>
              </Col>
              <Col
                className="gutter-row mb-10"
                xs={{ span: 24 }}
                md={{ span: 12 }}
              >
                <div>
                  <label>Married name</label>
                  <InputDefault
                    disabled={isDisabled}
                    value={formData?.marriedName}
                    name="marriedName"
                    type="input"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.marriedName}
                    onChange={({ target }) =>
                      setFormData({ ...formData, marriedName: target.value })
                    }
                  />
                </div>
              </Col>
              <Col
                className="gutter-row mb-10"
                xs={{ span: 12 }}
                md={{ span: 8 }}
              >
                <div>
                  <label>Sex</label>
                  <SelectDefault
                    disabled={isDisabled}
                    value={formData?.sex}
                    defaultValue={formData?.sex}
                    validationState={validationErrors?.sex}
                    MyValue={formData?.sex}
                    data={[
                      { key: "MALE", value: "MALE" },
                      { key: "FEMALE", value: "FEMALE" },
                    ]}
                    onChange={(value, key) => {
                      setFormData({ ...formData, sex: key?.value });
                    }}
                  />
                </div>
              </Col>
              <Col
                className="gutter-row mb-10"
                xs={{ span: 12 }}
                md={{ span: 8 }}
              >
                <div>
                  <label>Date of birth</label>
                  <DatePicker
                    disabled={isDisabled}
                    style={{ width: "100%" }}
                    className="sb-input singpass-datepicker"
                    focusing={validationErrors?.dob}
                    validationState={setValidationErrors}
                    onChange={handleChangeDateOfBirth}
                    name="dob"
                    value={formData?.dob ? dayjs(formData.dob) : null}
                    disabledDate={disabledDate}
                    format="DD/MM/YYYY"
                    placeholder=""
                  />
                </div>
              </Col>
              <Col
                className="gutter-row mb-10"
                xs={{ span: 12 }}
                md={{ span: 8 }}
              >
                <div>
                  <label>NRIC/FIN</label>
                  <InputDefault
                    disabled={isDisabled}
                    value={formData?.nricFin}
                    name="nricFin"
                    type="input"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.nricFin}
                    onChange={({ target }) =>
                      setFormData({ ...formData, nricFin: target.value })
                    }
                    required={true}
                    errorMsg={"nricFin is required"}
                  />
                </div>
              </Col>
              <Col
                className="gutter-row mb-10"
                xs={{ span: 12 }}
                md={{ span: 8 }}
              >
                <div>
                  <label>Birth country</label>
                  <SelectDefault
                    disabled={isDisabled}
                    defaultValue={formData?.countryOfBirth}
                    validationState={validationErrors?.countryOfBirth}
                    MyValue={formData?.countryOfBirth}
                    data={countryList}
                    onChange={(value, key) => {
                      setFormData({
                        ...formData,
                        countryOfBirth: key?.value,
                      });
                    }}
                    value={formData?.countryOfBirth}
                  />
                </div>
              </Col>
              <Col
                className="gutter-row mb-10"
                xs={{ span: 12 }}
                md={{ span: 8 }}
              >
                <div>
                  <label>Nationality</label>
                  <SelectDefault
                    disabled={isDisabled}
                    value={formData?.nationality}
                    defaultValue={formData?.nationality}
                    validationState={validationErrors?.nationality}
                    MyValue={formData?.nationality}
                    data={countryList}
                    onChange={(value, key) => {
                      setFormData({
                        ...formData,
                        nationality: key?.value,
                      });
                    }}
                    required={true}
                    errorMsg={"Select Nationality"}
                  />
                </div>
              </Col>
              <Col
                className="gutter-row mb-10"
                xs={{ span: 12 }}
                md={{ span: 8 }}
              >
                <div>
                  <label>Residential status</label>
                  <InputDefault
                    disabled={isDisabled}
                    name="residentialStatus"
                    value={formData?.residentialStatus}
                    type="input"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.residentialStatus}
                    onChange={({ target }) =>
                      setFormData({
                        ...formData,
                        residentialStatus: target.value,
                      })
                    }
                    required={true}
                    errorMsg={"residentialStatus is required"}
                  />
                </div>
              </Col>
              <Col
                className="gutter-row mb-10"
                md={{ span: 12 }}
                xs={{ span: 24 }}
              >
                <div>
                  <label>Pass type</label>
                  <InputDefault
                    disabled={isDisabled}
                    name="passType"
                    value={formData?.passType}
                    type="input"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.passType}
                    onChange={({ target }) =>
                      setFormData({ ...formData, passType: target.value })
                    }
                    required={true}
                    errorMsg={"passType is required"}
                  />
                </div>
              </Col>
              <Col
                className="gutter-row mb-10"
                md={{ span: 12 }}
                xs={{ span: 24 }}
              >
                <div>
                  <label>Pass expiration date</label>
                  <DatePicker
                    disabled={true}
                    style={{ width: "100%" }}
                    className="sb-input singpass-datepicker"
                    focusing={validationErrors?.passExDate}
                    validationState={setValidationErrors}
                    name="passExDate"
                    value={
                      formData?.passExDate ? dayjs(formData.passExDate) : null
                    }
                    disabledDate={disabledDate}
                    format="DD/MM/YYYY"
                    placeholder=""
                  />
                </div>
              </Col>
              <Col className="gutter-row mb-10" span={24}>
                <div>
                  <label>Registered address</label>
                  <InputDefault
                    disabled={isDisabled}
                    value={formData?.registeredAddress}
                    name="registeredAddress"
                    type="input"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.registeredAddress}
                    onChange={({ target }) =>
                      setFormData({
                        ...formData,
                        registeredAddress: target.value,
                      })
                    }
                    required={true}
                    errorMsg={"registeredAddress is required"}
                  />
                </div>
              </Col>
              <Col className="gutter-row mb-10" span={24}>
                <div>
                  <label>IRAS assessable income (Latest year)</label>
                  <InputDefault
                    disabled={isDisabled}
                    value={
                      formData?.assemleIncome
                        ? formatCurrency("", formData?.assemleIncome)
                        : ""
                    }
                    name="assemleIncome"
                    type="input"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.assemleIncome}
                    onChange={({ target }) =>
                      setFormData({
                        ...formData,
                        assemleIncome: target.value,
                      })
                    }
                    required={true}
                    errorMsg={"assessable Income is required"}
                  />
                </div>
              </Col>
              <Col className="gutter-row mb-10" span={24}>
                {formData?.phoneNumber ? (
                  <>
                    <label>Mobile number</label>
                    <PhoneInput
                      className={`sb-phone-field ${mobileNumberClass}`}
                      value={formData && formData?.phoneNumber}
                      onChange={handlePhoneChange}
                    />
                  </>
                ) : (
                  <div>
                    <label>Mobile number</label>
                    <PhoneInput
                      className={`sb-phone-field ${mobileNumberClass}`}
                      placeholder="+91 12345-67890"
                      country={countryCode && countryCode}
                      value={formData && formData?.phoneNumber}
                      onChange={handlePhoneChange}
                      enableSearch
                      onBlur={handleBlur}
                    />
                    <span className="phone-error-msg">
                      {mobileNumberClass === "sb-phone-empty"
                        ? "Please enter mobile number"
                        : ""}
                    </span>
                  </div>
                )}
              </Col>
              <Col className="gutter-row mb-10" span={24}>
                <div className={emailValid === true ? "referral-error" : ""}>
                  <label>Email</label>
                  <InputDefault
                    value={formData?.email}
                    name="email"
                    placeholder="Enter Email"
                    type="input"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.email}
                    onChange={({ target }) => {
                      setFormData({ ...formData, email: target.value });
                      setEmailValid(false);
                    }}
                    required={true}
                    errorMsg={"email is required"}
                  />
                </div>
              </Col>
              <Col className="gutter-row mb-10" span={24}>
                <div ref={hintRef}>
                  <label>Password</label>
                  <Input.Password
                    name="password"
                    placeholder="Password"
                    style={{ height: 40, borderRadius: "12px" }}
                    type="password"
                    onFocus={() => setShowHint(true)}
                    onChange={handlePasswordChange}
                    status={noPass && "error"}
                    required={true}
                  />
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
                      {/* <p style={{ marginBottom: "4px", fontWeight: 500 }}>
                                              Password must include:
                                            </p> */}
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
                  {/* <Progress percent={strength} size="small" showInfo={false} />
                  <div className="sb-text-align-start mb-16">
                    <small style={{ fontSize: 10, color: "#999" }}>
                      Use at least 10 characters, including 1 uppercase, 1 lower
                      case, 1 special character, and 1 number
                    </small>
                  </div> */}
                  {/* {noPass && (
                    <label
                      className="error-msg"
                      style={{
                        display: "block",
                        marginTop: "-8px",
                        marginBottom: 12,
                      }}
                    >
                      Use at least 10 characters, including 1 uppercase, 1 lower
                      case, 1 special character, and 1 number
                    </label>
                  )} */}
                </div>
              </Col>
              {/* <Col className="gutter-row" span={12}>
                <div>
                  <Input.Password
                    name="password"
                    placeholder="Confirm Password"
                    type="password"
                    style={{ height: 40, borderRadius: "12px" }}
                    validationState={setValidationErrors}
                    focusing={validationErrors?.cPassword}
                    onChange={({ target }) => {
                      setCPassErr(false);
                      setFormData({ ...formData, cPassword: target.value });
                      if (target.value !== formData?.password) {
                        setCPassErr(true);
                        setValidationErrors({
                          ...validationErrors,
                          cPassword: false,
                        });
                      }
                    }}
                    status={cPassErr && "error"}
                    onBlur={() => {
                      setCPassErr(false);
                      if (formData?.password !== formData?.password) {
                        setCPassErr(true);
                      }
                    }}
                    required={true}
                  />
                  {cPassErr && (
                    <label
                      className="error-msg"
                      style={{ display: "block", marginTop: "1px" }}
                    >
                      Passwords don't match!
                    </label>
                  )}
                </div>
              </Col> */}
              <Col className="gutter-row mb-10" span={24}>
                <div className={referralCodeValid === true && "referral-error"}>
                  <label>Referral code</label>
                  <InputDefault
                    name="ReferralCode"
                    placeholder="Referral code (optional)"
                    type="input"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.referralCode}
                    onChange={({ target }) => {
                      setFormData({ ...formData, referralCode: target.value });
                      setReferralCodeValid(false);
                    }}
                    value={formData?.referralCode}
                    required={false}
                  />
                </div>
              </Col>
              <Col className="gutter-row mb-10 sb-text-align-start" span={24}>
                <RegisterTerms />
              </Col>
            </Row>
          </div>
          <div>
            <div className="mb-20 mt-10">
              <ButtonDefault
                title="Create account"
                onClick={HandleCreateUser}
                loading={loader}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <p>
                Already have an account?
                <Link
                  to={ROUTES.LOGIN}
                  className="cursor-pointer text-decoration-none   ml-5"
                  style={{ color: "var(--kilde-blue)" }}
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <SingpassLoader />
      )}
    </AuthNewLayout>
  );
};

export default SingpassRegisterPage;
