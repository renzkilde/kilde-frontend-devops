/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import InputDefault from "../../../Components/InputDefault/InputDefault";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import {
  setPersonalData,
  setPersonalInfoDetails,
} from "../../../Redux/Action/KycIndividual";
import "./style.css";
import SelectDefault from "../../../Components/SelectDefault/SelectDefault";
import { Checkbox, Col, DatePicker, Row, Spin } from "antd";
import { checkStepStatus, getCountries } from "../../../Utils/Helpers";
import dayjs from "dayjs";
import "../../CommonOnboardingPages/KildePages/CommonKDPageStyle.css";
import { ExclamationCircleFilled, LoadingOutlined } from "@ant-design/icons";
import {
  getCountryWithholdingTax,
  getPersonalInfo,
} from "../../../Apis/InvestorApi";
import moment from "moment/moment";
import { setUserDetails } from "../../../Redux/Action/User";
import { getUser } from "../../../Apis/UserApi";
import EligibleTaxBenefit from "./EligibleTaxBenefit";

const PersonalInfo = () => {
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState("sg");
  const [mobileNumberClass, setMobileNumberClass] = useState("");
  const countryList = getCountries();
  const [userData, setUserData] = useState();
  const [getPersonalLoader, setGetPersonalLoader] = useState(false);
  const [whtResponse, setWhtResponse] = useState();
  let isDisabled;

  const personalInformation = useSelector(
    (state) => state?.kycIndividual?.personalInfo
  );
  const validator = personalInformation?.validator?.validator;

  const user = useSelector((state) => state.user);

  const initialState = {
    firstName: userData?.firstName
      ? userData?.firstName
      : user?.firstName || "",
    lastName: userData?.lastName ? userData?.lastName : user?.lastName || "",
    mobileNumber:
      userData?.mobileNumber !== undefined
        ? userData?.mobileNumber
        : user?.mobilePhone || "",
    gender: "",
    dateOfBirth: null,
    countryOfBirth: "",
    signupReferralCode: Cookies.get("referral_code") || "",
    houseNumber: "",
    residenceAddressStreet: "",
    residenceAddressCountry: "",
    residenceAddressCity: "",
    residenceAddressPostalCode: "",
    taxResidenceCountry: "",
    taxIdentificationNumber: "",
    countryOfCitizenship: "",
    singaporeNricNumber: "",
    passportNumber: "",
    passportExpiryDate: null,
    taxResidenceCountrySame: false,
    singaporePermanentResident: false,
  };

  const [personalInfo, setPersonalInfo] = useState(initialState);

  useEffect(() => {
    setGetPersonalLoader(true);
  }, []);

  useEffect(() => {
    setPersonalInfo({
      ...personalInfo,
      mobileNumber:
        personalInformation?.data?.mobileNumber || user?.mobilePhone,
    });
  }, [personalInformation?.data]);

  useEffect(() => {
    getUserDetails().then((response) => {
      if (
        checkStepStatus(
          response?.waitingVerificationSteps,
          "PERSONAL_DETAILS"
        ) === false
      ) {
        getPersonalData();
      }
    });
  }, []);

  const getUserDetails = async () => {
    setGetPersonalLoader(true);
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        setPersonalInfo({
          ...personalInfo,
          firstName: response?.firstName,
          lastName: response?.lastName,
          mobileNumber: response?.mobilePhone,
        });

        setGetPersonalLoader(false);
        return response;
      }
    } catch (error) {
      console.error("Error fetching personal details data:", error);
      setGetPersonalLoader(false);
      return null;
    }
  };

  const getPersonalData = async () => {
    setGetPersonalLoader(true);
    try {
      let personalData = await getPersonalInfo();
      setPersonalData(personalData, dispatch);
      setUserData(personalData);
      updatePersonalInfo(personalData);
      setGetPersonalLoader(false);
    } catch (error) {
      setGetPersonalLoader(false);
      console.error("Error fetching personal data:", error);
    }
  };

  const handleChangeDateOfBirth = async (date, dateString) => {
    const isoDate = date
      ? moment(dateString, "DD/MM/YYYY").utc(true).toISOString()
      : null;

    setPersonalInfo({
      ...personalInfo,
      dateOfBirth: isoDate,
    });
    setPersonalInfoDetails(
      {
        data: {
          ...personalInfo,
          dateOfBirth: isoDate,
        },
        validator: {
          ...validationErrors,
        },
      },
      dispatch
    );
  };

  const handleChangeExpiryDate = async (date, dateString) => {
    const isoDate = date
      ? moment(dateString, "DD/MM/YYYY").utc(true).toISOString()
      : null;
    setPersonalInfo({
      ...personalInfo,
      passportExpiryDate: isoDate,
    });
    setPersonalInfoDetails(
      {
        data: {
          ...personalInfo,
          passportExpiryDate: isoDate,
        },
        validator: {
          ...validationErrors,
        },
      },
      dispatch
    );
  };

  const updatePersonalInfo = (userData) => {
    if (userData) {
      setMobileNumberClass("");
      isDisabled =
        checkStepStatus(user?.waitingVerificationSteps, "PERSONAL_DETAILS") ===
        false
          ? true
          : false;
      setPersonalInfo({
        firstName: userData?.firstName ? userData?.firstName : "",
        lastName: userData?.lastName || "",
        mobileNumber: userData?.mobileNumber || "",
        gender: userData?.gender || "",
        dateOfBirth: userData?.dateOfBirth
          ? new Date(userData.dateOfBirth)
          : null,
        countryOfBirth: userData?.countryOfBirth || "",
        signupReferralCode: userData?.signupReferralCode
          ? userData?.signupReferralCode
          : Cookies.get("referral_code") || "",
        houseNumber: userData?.houseNumber || "",
        residenceAddressStreet: userData?.residenceAddressStreet || "",
        residenceAddressCountry: userData?.residenceAddressCountry || "",
        residenceAddressCity: userData?.residenceAddressCity || "",
        residenceAddressPostalCode: userData?.residenceAddressPostalCode || "",
        taxResidenceCountry: userData?.taxResidenceCountry || "",
        taxIdentificationNumber: userData?.taxIdentificationNumber || "",
        countryOfCitizenship: userData?.countryOfCitizenship || "",
        singaporeNricNumber: userData?.singaporeNricNumber || "",
        passportNumber: userData?.passportNumber || "",
        passportExpiryDate: userData?.passportExpiryDate
          ? new Date(userData?.passportExpiryDate)
          : null,
        taxResidenceCountrySame: userData?.taxResidenceCountrySame || false,
        singaporePermanentResident:
          userData?.singaporePermanentResident || false,
      });
    }
  };

  const [validationErrors, setValidationErrors] = useState({
    firstName: false,
    lastName: false,
    mobileNumber: false,
    gender: false,
    dateOfBirth: false,
    countryOfBirth: false,
    house: false,
    residenceAddressStreet: false,
    country: false,
    residenceAddressCity: false,
    residenceAddressPostalCode: false,
    taxResidenceCountry: false,
    taxIdentificationNumber: false,
    countryOfCitizenship: false,
    singaporeNricNumber: false,
    passportNumber: false,
    passportExpiryDate: false,
  });

  const handleCheck = (value) => {
    setPersonalInfo((prevInfo) => ({
      ...prevInfo,
      taxResidenceCountrySame: value ? true : false,
    }));
    setPersonalInfoDetails(
      {
        data: {
          ...personalInfo,
          taxResidenceCountrySame: value ? true : false,
        },
        validator: {
          ...validationErrors,
        },
      },
      dispatch
    );
  };

  const handleCheckNationality = (value) => {
    setPersonalInfo((prevInfo) => ({
      ...prevInfo,
      singaporePermanentResident: value ? true : false,
    }));
    setPersonalInfoDetails(
      {
        data: {
          ...personalInfo,
          singaporePermanentResident: value ? true : false,
        },
        validator: {
          ...validationErrors,
        },
      },
      dispatch
    );
  };

  const handlePhoneChange = async (value, country) => {
    setCountryCode(country.dialCode);
    const number = value.substring(country.dialCode.length).trim();
    const isValueValid = value.trim() === "";
    setPersonalInfo((prevAddress) => ({
      ...prevAddress,
      mobileNumber: "+" + value,
    }));

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      mobileNumber: isValueValid,
    }));

    setPersonalInfoDetails(
      {
        data: {
          ...personalInfo,
          mobileNumber: "+" + value,
        },
        validator: {
          ...validationErrors,
          mobileNumber: isValueValid,
        },
      },
      dispatch
    );
    if (number !== "") {
      setMobileNumberClass("");
    } else {
      setMobileNumberClass("sb-phone-empty");
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedPersonalInfo = { ...personalInfo, [name]: value };
    const updatedValidationErrors = {
      ...validationErrors,
      [name]: value.trim() !== "",
    };

    setPersonalInfo(updatedPersonalInfo);
    setValidationErrors(updatedValidationErrors);

    setPersonalInfoDetails(
      { data: updatedPersonalInfo, validator: updatedValidationErrors },
      dispatch
    );
  };

  const handleBlur = () => {
    const number = personalInfo.mobileNumber
      .substring(countryCode.length)
      .trim();
    if (number !== "") {
      setMobileNumberClass("");
    } else {
      setMobileNumberClass("sb-phone-empty");
    }
  };

  useEffect(() => {
    if (validator?.mobileNumber === true) {
      setMobileNumberClass("sb-phone-empty");
    }
    if (personalInfo?.mobileNumber) {
      setMobileNumberClass("");
    }
  }, [validator?.mobileNumber]);

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  isDisabled =
    checkStepStatus(user?.waitingVerificationSteps, "PERSONAL_DETAILS") ===
    false
      ? true
      : false;

  const handleGetWHTTax = async (country) => {
    try {
      const res = await getCountryWithholdingTax(country);
      if (res) {
        setWhtResponse(res?.whtRate);
      }
    } catch (error) {
      console.error(
        "Error fetching withholding tax for country:",
        country,
        error
      );
    }
  };

  return (
    <div>
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: 50, color: "var(--kilde-blue)" }}
          />
        }
        spinning={getPersonalLoader}
      >
        <p className="sb-verification-title">Complete Personal Details</p>
        <div className="sb-pinfo-subhead mb-24">
          <ExclamationCircleFilled className="kd-pinfo-icon" />
          <p className="sb-onboarding-subtitle m-0">
            Please enter your personal details exactly as they appear on your
            identity documents.
          </p>
        </div>
        <div className="kl-pi-subdiv">
          <p className="kl-pi-subdivtitle">Personal Information</p>

          <Row gutter={16}>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label>First name</label>
              <InputDefault
                type="text"
                focusing={
                  validator ? validator?.firstName : validationErrors?.firstName
                }
                validationState={setValidationErrors}
                style={{ width: "100%" }}
                onChange={handleChange}
                name="firstName"
                required={true}
                errorMsg={"Enter first name"}
                value={personalInfo?.firstName}
                disabled={isDisabled}
              />
            </Col>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <div>
                <label>Last name</label>
                <InputDefault
                  type="text"
                  focusing={
                    validator ? validator?.lastName : validationErrors?.lastName
                  }
                  validationState={setValidationErrors}
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  name="lastName"
                  required={true}
                  errorMsg={"Enter last name"}
                  value={personalInfo?.lastName}
                  disabled={isDisabled}
                />
              </div>
            </Col>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label>Mobile number</label>
              <>
                <PhoneInput
                  className={`sb-phone-field ${mobileNumberClass}`}
                  country={countryCode}
                  value={personalInfo.mobileNumber}
                  onChange={handlePhoneChange}
                  enableSearch
                  onBlur={handleBlur}
                  disabled={isDisabled}
                />
                <span className="phone-error-msg">
                  {mobileNumberClass === "sb-phone-empty"
                    ? "Please enter mobile number"
                    : ""}
                </span>
              </>
            </Col>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label>Gender</label>
              <SelectDefault
                validationState={
                  validator ? validator?.gender : validationErrors?.gender
                }
                placeholder="Select a gender"
                value={personalInfo?.gender}
                MyValue={personalInfo?.gender}
                data={[
                  { key: "MALE", value: "Male" },
                  { key: "FEMALE", value: "Female" },
                ]}
                style={{ width: "100%", height: "auto" }}
                onChange={(value, key) => {
                  setPersonalInfo({ ...personalInfo, gender: key?.value });
                  setPersonalInfoDetails(
                    {
                      data: {
                        ...personalInfo,
                        gender: key?.value,
                      },
                      validator: {
                        ...validationErrors,
                      },
                    },
                    dispatch
                  );
                }}
                required={true}
                errorMsg={"Please select a gender."}
                disabled={isDisabled}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label>Date of birth</label>

              <DatePicker
                className="kl-datepicker"
                focusing={
                  validator?.dateOfBirth
                    ? validator?.dateOfBirth
                    : validationErrors?.dateOfBirth
                }
                validationState={setValidationErrors}
                placeholder="DD/MM/YYYY"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                onChange={handleChangeDateOfBirth}
                name="dateOfBirth"
                required={true}
                errorMsg={"Enter Date of birth"}
                disabled={isDisabled}
                disabledDate={disabledDate}
                value={
                  personalInfo?.dateOfBirth
                    ? dayjs(personalInfo.dateOfBirth)
                    : null
                }
              />
            </Col>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label>Country of birth</label>

              <SelectDefault
                validationState={
                  validator
                    ? validator?.countryOfBirth
                    : validationErrors?.countryOfBirth
                }
                data={countryList}
                value={personalInfo?.countryOfBirth}
                MyValue={personalInfo?.countryOfBirth}
                placeholder="Select a country"
                style={{ width: "100%", height: "auto" }}
                onChange={(value, key) => {
                  setPersonalInfo((prevState) => ({
                    ...prevState,
                    countryOfBirth: key?.value,
                  }));
                  setPersonalInfoDetails(
                    {
                      data: {
                        ...personalInfo,
                        countryOfBirth: key?.value,
                      },
                      validator: {
                        ...validationErrors,
                      },
                    },
                    dispatch
                  );
                }}
                required={true}
                errorMsg={"Enter country of birth"}
                disabled={isDisabled}
              />
            </Col>
            {user?.registrationType === "GOOGLE" ? (
              <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
                <label>Referral code (optional)</label>
                <InputDefault
                  type="text"
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  name="signupReferralCode"
                  value={personalInfo?.signupReferralCode || ""}
                  disabled={isDisabled}
                />
              </Col>
            ) : null}
          </Row>
          <p className="kl-pi-subdivtitle" style={{ marginTop: "30px" }}>
            Residential Address
          </p>
          <Row gutter={16}>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label>Country</label>

              <SelectDefault
                defaultValue={personalInfo?.residenceAddressCountry}
                validationState={
                  validator
                    ? validator?.residenceAddressCountry
                    : validationErrors?.residenceAddressCountry
                }
                MyValue={personalInfo?.residenceAddressCountry}
                value={personalInfo?.residenceAddressCountry}
                disabled={isDisabled}
                placeholder="Select a country"
                data={countryList}
                style={{ width: "100%", height: "auto" }}
                onChange={(value, key) => {
                  setPersonalInfo({
                    ...personalInfo,
                    residenceAddressCountry: key?.value,
                  });
                  setPersonalInfoDetails(
                    {
                      data: {
                        ...personalInfo,
                        residenceAddressCountry: key?.value,
                      },
                      validator: {
                        ...validationErrors,
                      },
                    },
                    dispatch
                  );
                }}
                required={true}
                errorMsg={"Please select a country"}
              />
            </Col>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label>City</label>
              <InputDefault
                focusing={
                  validator?.residenceAddressCity
                    ? validator?.residenceAddressCity
                    : validationErrors?.residenceAddressCity
                }
                validationState={setValidationErrors}
                style={{ width: "100%" }}
                onChange={handleChange}
                name="residenceAddressCity"
                required={true}
                errorMsg={"Enter city"}
                value={personalInfo?.residenceAddressCity}
                disabled={isDisabled}
              />
            </Col>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label>Street</label>
              <InputDefault
                focusing={
                  validator
                    ? validator?.residenceAddressStreet
                    : validationErrors?.residenceAddressStreet
                }
                validationState={setValidationErrors}
                style={{ width: "100%" }}
                onChange={handleChange}
                name="residenceAddressStreet"
                required={true}
                errorMsg={"Enter street address"}
                value={personalInfo?.residenceAddressStreet}
                disabled={isDisabled}
              />
            </Col>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label>House or unit number</label>
              <InputDefault
                focusing={
                  validator?.houseNumber
                    ? validator?.houseNumber
                    : validationErrors?.houseNumber
                }
                validationState={setValidationErrors}
                style={{ width: "100%" }}
                onChange={handleChange}
                name="houseNumber"
                required={true}
                errorMsg={"Enter additional info"}
                value={personalInfo?.houseNumber}
                disabled={isDisabled}
              />
            </Col>
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label>Postal code / Zip code</label>
              <InputDefault
                focusing={
                  validator?.residenceAddressPostalCode
                    ? validator?.residenceAddressPostalCode
                    : validationErrors?.residenceAddressPostalCode
                }
                validationState={setValidationErrors}
                style={{ width: "100%" }}
                onChange={handleChange}
                name="residenceAddressPostalCode"
                required={true}
                errorMsg={"Enter postal `code or ZIP Code"}
                value={personalInfo?.residenceAddressPostalCode}
                disabled={isDisabled}
              />
            </Col>
          </Row>
          <Row>
            <Checkbox
              className="checkbox-kilde"
              checked={personalInfo?.taxResidenceCountrySame}
              onChange={(e) => handleCheck(e.target.checked)}
              key="last"
              disabled={isDisabled}
            >
              <p
                style={{
                  fontWeight: 400,
                  fontSize: 14,
                  color: "#1A202C",
                }}
              >
                My tax residence country is the same as residence country
              </p>
            </Checkbox>
          </Row>
          <Row gutter={16}>
            {personalInfo?.taxResidenceCountrySame === false && (
              <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
                <label className="sb-flex-align-center">
                  Tax residence country
                </label>
                <SelectDefault
                  defaultValue={personalInfo?.taxResidenceCountry}
                  validationState={
                    validator
                      ? validator?.taxResidenceCountry
                      : validationErrors?.taxResidenceCountry
                  }
                  MyValue={personalInfo?.taxResidenceCountry}
                  value={personalInfo?.taxResidenceCountry}
                  data={countryList}
                  placeholder="Select a country"
                  style={{ width: "100%", height: "auto" }}
                  onChange={(value, key) => {
                    // handleGetWHTTax(key?.value);
                    setPersonalInfo({
                      ...personalInfo,
                      taxResidenceCountry: key?.value,
                    });
                    setPersonalInfoDetails(
                      {
                        data: {
                          ...personalInfo,
                          taxResidenceCountry: key?.value,
                        },
                        validator: {
                          ...validationErrors,
                        },
                      },
                      dispatch
                    );
                  }}
                  required={true}
                  errorMsg={"Enter tax residence country"}
                  disabled={isDisabled}
                />
              </Col>
            )}
            <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
              <label className="sb-flex-align-center">
                Tax identity number (optional)
              </label>
              <InputDefault
                focusing={
                  validator
                    ? validator?.taxIdentificationNumber
                    : validationErrors?.taxIdentificationNumber
                }
                validationState={setValidationErrors}
                style={{ width: "100%" }}
                onChange={handleChange}
                name="taxIdentificationNumber"
                value={personalInfo?.taxIdentificationNumber}
                disabled={isDisabled}
                // required={true}
                errorMsg={"Enter Tax identity number"}
              />
            </Col>
          </Row>
          {personalInfo?.taxResidenceCountry !== "SG" && whtResponse < 15 ? (
            <Row className="mt-6 mb-16">
              <EligibleTaxBenefit />
            </Row>
          ) : null}

          <Row gutter={16}>
            <Col className="gutter-row" md={12} sm={24} xs={24}>
              <label>Nationality </label>

              <SelectDefault
                defaultValue={personalInfo?.countryOfCitizenship}
                validationState={
                  validator
                    ? validator?.countryOfCitizenship
                    : validationErrors?.countryOfCitizenship
                }
                MyValue={personalInfo?.countryOfCitizenship}
                value={personalInfo?.countryOfCitizenship}
                data={countryList}
                placeholder="Select a country"
                style={{ width: "100%", height: "auto" }}
                onChange={(value, key) => {
                  setPersonalInfo({
                    ...personalInfo,
                    countryOfCitizenship: key?.value,
                  });
                  setPersonalInfoDetails(
                    {
                      data: {
                        ...personalInfo,
                        countryOfCitizenship: key?.value,
                      },
                      validator: {
                        ...validationErrors,
                      },
                    },
                    dispatch
                  );
                }}
                errorMsg={"Select a nationality"}
                disabled={isDisabled}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row mb-16" md={12} sm={24} xs={24}>
              <Checkbox
                className="checkbox-kilde"
                checked={personalInfo?.singaporePermanentResident}
                onChange={(e) => handleCheckNationality(e.target.checked)}
                key="last"
                style={{
                  fontWeight: 400,
                  fontSize: 14,
                  marginTop: 16,
                  color: "#1A202C",
                }}
                disabled={isDisabled}
              >
                I am a Singapore resident
              </Checkbox>
            </Col>
          </Row>
          <Row gutter={16}>
            {personalInfo?.singaporePermanentResident === true && (
              <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
                <label className="sb-flex-align-center">
                  Singapore national card ID (NRIC/FIN) number{" "}
                </label>
                <InputDefault
                  focusing={
                    validator
                      ? validator?.singaporeNricNumber
                      : validationErrors?.singaporeNricNumber
                  }
                  validationState={setValidationErrors}
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  name="singaporeNricNumber"
                  required={true}
                  errorMsg={"Enter NRIC/FIN number"}
                  value={personalInfo?.singaporeNricNumber}
                  disabled={isDisabled}
                  autoComplete="off"
                />
              </Col>
            )}
            {personalInfo?.singaporePermanentResident === false && (
              <>
                <Col className="gutter-row mb-10" md={12} sm={24} xs={24}>
                  <label>Passport number</label>
                  <InputDefault
                    focusing={
                      validator
                        ? validator?.passportNumber
                        : validationErrors?.passportNumber
                    }
                    validationState={setValidationErrors}
                    placeholder="JXXXXXXX."
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      setPersonalInfo({
                        ...personalInfo,
                        passportNumber: e.target.value,
                      });
                      setPersonalInfoDetails(
                        {
                          data: {
                            ...personalInfo,
                            passportNumber: e.target.value,
                          },
                          validator: {
                            ...validationErrors,
                          },
                        },
                        dispatch
                      );
                    }}
                    name="passportNumber"
                    required={true}
                    errorMsg={"Enter passport number"}
                    value={personalInfo?.passportNumber}
                    disabled={isDisabled}
                    autoComplete="off"
                  />
                </Col>
                <Col className="gutter-row " md={12} sm={24} xs={24}>
                  <label>Passport expiry date</label>
                  <DatePicker
                    className="kl-datepicker"
                    format="DD/MM/YYYY"
                    focusing={
                      validator
                        ? validator?.passportExpiryDate
                        : validationErrors?.passportExpiryDate
                    }
                    validationState={setValidationErrors}
                    placeholder="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    onChange={handleChangeExpiryDate}
                    name="passportExpiryDate"
                    required={true}
                    errorMsg={"Enter passport expiry date"}
                    value={
                      personalInfo?.passportExpiryDate
                        ? dayjs(personalInfo.passportExpiryDate)
                        : null
                    }
                    disabled={isDisabled}
                  />
                </Col>
              </>
            )}
          </Row>
        </div>
      </Spin>
    </div>
  );
};

export default PersonalInfo;
