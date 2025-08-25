import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Content } from "antd/es/layout/layout";
import { Breadcrumb, Col, Form, Row, message } from "antd";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import InputDefault from "../../Components/InputDefault/InputDefault";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  enableSMS,
  getUser,
  setupSms,
  setupTotp,
  updateMobileNo,
} from "../../Apis/UserApi";
import GlobalVariabels from "../../Utils/GlobalVariabels";
import ROUTES from "../../Config/Routes";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import { setUserDetails } from "../../Redux/Action/User";
import {
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../Utils/Reusables";

const TwofaSms = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [set, setState] = useState(false);
  const [code, setCode] = useState(false);
  const [codeVal, setCodeVal] = useState();
  const [smsLoader, setSmsLoader] = useState(false);
  const [tOtpLoader, setTotpLoader] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobileNumberClass, setMobileNumberClass] = useState("");
  const [countryCode, setCountryCode] = useState("sg");
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    mobileNumber: false,
  });

  let currentEnv = GlobalVariabels.NODE_ENV;

  useEffect(() => {
    if (location?.state !== null) {
      setCode(location?.state?.code);
      setState(location?.state?.set);
      setCodeVal(location?.state?.codeVal);
    }
  }, [location]);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        if (response?.secondFactorAuth === "SMS") {
          setCode(true);
          setState(true);
        }
        setUserDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const handleConnect = async () => {
    setSmsLoader(true);
    await setupSms()
      .then((res) => {
        showMessageWithCloseIcon(
          "We've sent an OTP to your mobile number. Please check your messages."
        );
        setCodeVal(res?.code);
        setState(true);
        setSmsLoader(false);
      })
      .catch(() => {
        setSmsLoader(false);
      });
  };

  const handleCode = async () => {
    setSmsLoader(true);
    if (otp !== "") {
      const requestBody = {
        smsToken: otp,
      };
      const response = await enableSMS(requestBody);
      if (!response) {
        showMessageWithCloseIcon(
          "You've successfully enabled Two-Factor Authentication for your account."
        );
        setCode(true);
        window?.dataLayer?.push({
          event: "authenticationTwoFactorConfirm",
          user_id: user?.number,
          register_method: user?.registrationType,
        });
        setSmsLoader(false);
        getUserDetails();
      } else {
        setSmsLoader(false);
      }
    } else {
      setSmsLoader(false);
      showMessageWithCloseIconError("Please enter OTP!");
    }
  };

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSetupTotp = async () => {
    setTotpLoader(true);
    await setupTotp()
      .then((res) => {
        if (res) {
          navigate(ROUTES.TWO_FA_AUTHENTICATEAPP, { state: { totpRes: res } });
          setTotpLoader(false);
        }
      })
      .catch(() => {
        setTotpLoader(false);
      });
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

  const handleUpdateMobile = async () => {
    setLoader(true);
    if (!formData?.mobileNumber) {
      setLoader(false);
      setMobileNumberClass("sb-phone-empty");
    } else {
      setValidationErrors({
        mobileNumber: true,
      });
      updateMobileNo(formData)
        .then(async (response) => {
          if (Object.keys(response)?.length > 0) {
            if (response === "Mobile phone number has been set successfully.") {
              getUserDetails();
              showMessageWithCloseIcon("Mobile number successfully updated!");
              await handleConnect();
              setLoader(false);
            } else {
              showMessageWithCloseIconError(
                "Something went wrong, Please try again!"
              );
              setLoader(false);
            }
          } else {
            showMessageWithCloseIconError("Please enter valid mobile number!");
            setLoader(false);
          }
        })
        .catch((error) => {
          setLoader(false);
          showMessageWithCloseIconError(
            error || "Something went wrong, Please try again!"
          );
        });
    }
  };

  return (
    <div>
      <DashboardLayout>
        <Content className="setting-page-div">
          <Breadcrumb
            separator=" / "
            items={[
              {
                title: (
                  <span
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    style={{ cursor: "pointer" }}
                  >
                    Personal Settings
                  </span>
                ),
              },
              {
                title: (
                  <span
                    onClick={() => navigate(ROUTES.TWO_FACTOR_AUTH)}
                    style={{ cursor: "pointer" }}
                  >
                    Account security
                  </span>
                ),
              },
              {
                title: "SMS",
              },
            ]}
          />
          <p className="setting-head">SMS</p>

          {set === false ? (
            <Row gutter={16}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={10}
                className="gutter-row setting-twofa-div medium-tranch-col"
              >
                {(user?.mobilePhone === "" ||
                  user?.mobilePhone === null ||
                  user?.mobilePhone === undefined) &&
                user?.registrationType === "GOOGLE" ? (
                  <>
                    <p className="mt-0 wallet-sub-head mb-20">
                      Update your Mobile Number!
                    </p>
                    <Form
                      onFinish={handleUpdateMobile}
                      name="wrap"
                      labelCol={{ flex: "110px" }}
                      labelAlign="left"
                      labelWrap
                      wrapperCol={{ flex: 1 }}
                      colon={false}
                    >
                      <Row gutter={16}>
                        <Col
                          className="gutter-row mb-15 sb-text-align-start"
                          md={24}
                          sm={24}
                          xs={24}
                        >
                          <PhoneInput
                            className={`sb-phone-field ${mobileNumberClass}`}
                            country={countryCode}
                            value={formData.mobileNumber}
                            onChange={handlePhoneChange}
                            enableSearch
                            onBlur={handleBlur}
                          />
                          <span className="phone-error-msg">
                            {mobileNumberClass === "sb-phone-empty"
                              ? "Please enter mobile number"
                              : ""}
                          </span>
                        </Col>
                        <Col>
                          <ButtonDefault title="Update" loading={loader} />
                        </Col>
                      </Row>
                    </Form>
                  </>
                ) : (
                  <>
                    <p className="mt-0 mb-16 auth-head">
                      Receive an SMS message with a one-time code for login
                    </p>
                    <ButtonDefault
                      title="Connect"
                      onClick={handleConnect}
                      loading={smsLoader}
                    />
                  </>
                )}
              </Col>
            </Row>
          ) : null}

          {set === true && code === false ? (
            <Row gutter={16}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={10}
                className="gutter-row setting-twofa-div medium-tranch-col"
              >
                <p className="mt-0 mb-16 auth-head">
                  Receive an SMS message with a one-time code for login
                </p>
                <p className="card-info-tag mt-0 mb-20">
                  {`We have sent an SMS with one time password to your mobile number `}
                  <span className="fw-700">{user?.mobilePhone}</span>
                  {`. Please confirm changes by entering received code from SMS.`}
                </p>
                {currentEnv === "DEV" && (
                  <div className="mt-10 mb-10">
                    <p
                      className="fp-link cursor-pointer"
                      style={{ display: "inline" }}
                    >
                      Code: {codeVal}{" "}
                    </p>
                    <p style={{ color: "#ddd", display: "inline" }}>
                      (For testing purpose)
                    </p>
                  </div>
                )}
                <div style={{ display: "flex", gap: 20 }}>
                  <InputDefault
                    onChange={handleChange}
                    placeholder={"SMS Code"}
                    name="smsCode"
                    required={true}
                    errorMsg={"Enter OTP"}
                    autoComplete="off"
                  />
                  <ButtonDefault
                    title="Confirm"
                    onClick={handleCode}
                    style={{ height: 40 }}
                    loading={smsLoader}
                  />
                </div>
              </Col>
            </Row>
          ) : null}

          {code === true ? (
            <Row gutter={16}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={10}
                className="gutter-row setting-twofa-div medium-tranch-col"
              >
                <p className="mt-0 mb-16 auth-head">Everything is connected</p>
                <p className="card-info-tag mt-0 mb-16">
                  Messages will come here <b>{user?.mobilePhone}</b>
                </p>

                <div className="setting-acc-info-div">
                  <p>
                    To change your phone number contact us at{" "}
                    <span>
                      <Link to="mailto:sales@kilde.sg">sales@kilde.sg</Link>
                    </span>
                  </p>
                </div>
                <div className="mt-15">
                  <ButtonDefault
                    title="Switch to TOTP"
                    onClick={handleSetupTotp}
                    loading={tOtpLoader}
                  />
                </div>
              </Col>
            </Row>
          ) : null}
        </Content>
      </DashboardLayout>
    </div>
  );
};

export default TwofaSms;
