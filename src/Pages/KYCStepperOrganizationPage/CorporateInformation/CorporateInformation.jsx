/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Spin, Col, Row } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import InputDefault from "../../../Components/InputDefault/InputDefault";
import PhoneInput from "react-phone-input-2";
import SelectDefault from "../../../Components/SelectDefault/SelectDefault";
import { checkStepStatus, getCountries } from "../../../Utils/Helpers";
import { useDispatch, useSelector } from "react-redux";
import { setCorporateInfoDetails } from "../../../Redux/Action/KycOrganization";
import { getCompanyInformation } from "../../../Apis/InvestorApi";

const CorporateInformation = () => {
  const dispatch = useDispatch();
  let isDisabled;
  const [getCororateInfoLoader, setGetCororateInfoLoader] = useState(false);
  const countryList = getCountries();
  const [mobileNumberClass, setMobileNumberClass] = useState("");
  const [countryCode, setCountryCode] = useState("sg");
  const corporateInformation = useSelector(
    (state) => state?.kycOrganization?.corporateInformation
  );
  const user = useSelector((state) => state.user);

  const validator = corporateInformation?.validator?.validator;
  const initialState = {
    companyName: "",
    companyRegistrationNumber: "",
    companyTaxResidenceCountry: "",
    companyAddress: "",
    zipCode: "",
    firstName: user?.firstName,
    lastName: user?.lastName,
    mobileNumber: user?.mobilePhone,
  };
  const [corporateInfo, setCorporateInfo] = useState(initialState);

  const [validationErrors, setValidationErrors] = useState({
    companyName: false,
    companyRegistrationNumber: false,
    companyTaxResidenceCountry: false,
    companyAddress: false,
    zipCode: false,
    firstName: false,
    lastName: false,
    mobileNo: false,
  });

  isDisabled =
    checkStepStatus(user?.waitingVerificationSteps, "COMPANY_INFORMATION") ===
    false
      ? true
      : false;

  const handleGetCompanyData = async () => {
    setGetCororateInfoLoader(true);
    try {
      let companyData = await getCompanyInformation();
      updateCompanyInfo(companyData);
      setGetCororateInfoLoader(false);
    } catch (error) {
      setGetCororateInfoLoader(false);
      console.error("Error fetching company data:", error);
    }
  };

  const updateCompanyInfo = (companyData) => {
    if (companyData) {
      isDisabled =
        checkStepStatus(
          user?.waitingVerificationSteps,
          "COMPANY_INFORMATION"
        ) === false
          ? true
          : false;
      setCorporateInfo({
        companyName: companyData?.companyName || "",
        companyRegistrationNumber: companyData?.companyRegistrationNumber || "",
        companyTaxResidenceCountry:
          companyData?.companyTaxResidenceCountry || "",
        companyAddress: companyData?.companyAddress || "",
        zipCode: companyData?.zipCode || "",
        firstName: user?.firstName,
        lastName: user?.lastName,
        mobileNumber: user?.mobilePhone,
      });
    }
  };

  useEffect(() => {
    if (user) {
      setCorporateInfo((prevState) => ({
        ...prevState,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobilePhone,
      }));
    }
  }, [user]);

  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (!initialFetchDone.current) {
      handleGetCompanyData();
      initialFetchDone.current = true;
    }
  }, [user]);

  const handlePhoneChange = async (value, country) => {
    setCountryCode(country.dialCode);
    const number = value.substring(country.dialCode.length).trim();
    const isValueValid = value.trim() === "";
    setCorporateInfo((prevAddress) => ({
      ...prevAddress,
      mobileNumber: "+" + value,
    }));

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      mobileNumber: isValueValid,
    }));

    setCorporateInfoDetails(
      {
        data: {
          ...corporateInfo,
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

  const handleBlur = () => {
    const number = corporateInfo.mobileNumber
      .substring(countryCode.length)
      .trim();
    if (number !== "") {
      setMobileNumberClass("");
    } else {
      setMobileNumberClass("sb-phone-empty");
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setCorporateInfo({ ...corporateInfo, [name]: value });
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() !== "",
    }));

    await setCorporateInfoDetails(
      {
        data: { ...corporateInfo, [name]: value },
        validator: validationErrors,
      },
      dispatch
    );
  };

  return (
    <div>
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: 50, color: "var(--kilde-blue)" }}
          />
        }
        spinning={getCororateInfoLoader}
      >
        <p className="sb-verification-title">Corporate Information</p>
        <div className="kl-pi-subdiv mt-24">
          <p className="kl-pi-subdivtitle">Corporate Basic Information</p>

          <Row gutter={16}>
            <Col className="gutter-row mb-16" md={24} sm={24} xs={24}>
              <label>Company Name</label>
              <InputDefault
                type="text"
                focusing={
                  validator
                    ? validator?.companyName
                    : validationErrors?.companyName
                }
                validationState={setValidationErrors}
                style={{ width: "100%" }}
                onChange={handleChange}
                name="companyName"
                required={true}
                errorMsg={"Enter companyName"}
                value={corporateInfo?.companyName}
                disabled={isDisabled}
                autoComplete="off"
              />
            </Col>
            <Col className="gutter-row mb-16" md={12} sm={24} xs={24}>
              <div>
                <label>Company Registration Number/ID</label>
                <InputDefault
                  type="text"
                  focusing={
                    validator
                      ? validator?.companyRegistrationNumber
                      : validationErrors?.companyRegistrationNumber
                  }
                  validationState={setValidationErrors}
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  name="companyRegistrationNumber"
                  required={true}
                  errorMsg={"Enter company Registration Number"}
                  value={corporateInfo?.companyRegistrationNumber}
                  disabled={isDisabled}
                  autoComplete="off"
                />
              </div>
            </Col>
            <Col className="gutter-row mb-16" md={12} sm={24} xs={24}>
              <label>Company Tax Residence</label>
              <SelectDefault
                validationState={
                  validator
                    ? validator?.companyTaxResidenceCountry
                    : validationErrors?.companyTaxResidenceCountry
                }
                placeholder="Select Country"
                value={corporateInfo?.companyTaxResidenceCountry}
                MyValue={corporateInfo?.companyTaxResidenceCountry}
                data={countryList}
                style={{ width: "100%", height: "auto" }}
                onChange={(value, key) => {
                  setCorporateInfo({
                    ...corporateInfo,
                    companyTaxResidenceCountry: key?.value,
                  });
                  setCorporateInfoDetails(
                    {
                      data: {
                        ...corporateInfo,
                        companyTaxResidenceCountry: key?.value,
                      },
                      validator: {
                        ...validationErrors,
                      },
                    },
                    dispatch
                  );
                }}
                required={true}
                errorMsg={"Please select a tax residence country."}
                disabled={isDisabled}
              />
            </Col>
            <Col className="gutter-row mb-16" md={24} sm={24} xs={24}>
              <label>Company Full Address</label>
              <InputDefault
                type="text"
                focusing={
                  validator
                    ? validator?.companyAddress
                    : validationErrors?.companyAddress
                }
                validationState={setValidationErrors}
                style={{ width: "100%" }}
                onChange={handleChange}
                name="companyAddress"
                required={true}
                errorMsg={"Enter company address"}
                value={corporateInfo?.companyAddress}
                disabled={isDisabled}
                autoComplete="off"
              />
            </Col>
            <Col className="gutter-row" md={12} sm={24} xs={24}>
              <div>
                <label>Postal Code/Zip Code</label>
                <InputDefault
                  type="number"
                  focusing={
                    validator ? validator?.zipCode : validationErrors?.zipCode
                  }
                  validationState={setValidationErrors}
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  name="zipCode"
                  required={true}
                  errorMsg={"Enter zip code"}
                  value={corporateInfo?.zipCode}
                  disabled={isDisabled}
                />
              </div>
            </Col>
            <Col md={24} sm={24} xs={24}>
              <p className="kl-pi-subdivtitle mt-40">Personal Info</p>
            </Col>
            <Col className="gutter-row mb-16" md={12} sm={24} xs={24}>
              <label>First Name</label>
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
                errorMsg={"Enter First Name"}
                value={corporateInfo?.firstName}
                disabled={
                  isDisabled === true
                    ? true
                    : user?.singpassUser === true
                    ? true
                    : false
                }
              />
            </Col>
            <Col className="gutter-row mb-16" md={12} sm={24} xs={24}>
              <div>
                <label>Last Name</label>
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
                  errorMsg={"Enter Last Name"}
                  value={corporateInfo?.lastName}
                  disabled={
                    isDisabled === true
                      ? true
                      : user?.singpassUser === true
                      ? true
                      : false
                  }
                />
              </div>
            </Col>
            <Col className="gutter-row" md={12} sm={24} xs={24}>
              <label>Mobile Number</label>
              <>
                <PhoneInput
                  className={`sb-phone-field ${mobileNumberClass}`}
                  country={countryCode}
                  value={corporateInfo.mobileNumber}
                  onChange={handlePhoneChange}
                  enableSearch
                  onBlur={handleBlur}
                />
                <span className="phone-error-msg">
                  {mobileNumberClass === "sb-phone-empty"
                    ? "Please enter mobile number"
                    : ""}
                </span>
              </>
            </Col>
            <Col className="gutter-row" md={12} sm={24} xs={24}>
              <div>
                <label>Email</label>
                <InputDefault
                  type="email"
                  style={{ width: "100%" }}
                  name="email"
                  value={user?.email}
                  disabled={true}
                />
              </div>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};

export default CorporateInformation;
