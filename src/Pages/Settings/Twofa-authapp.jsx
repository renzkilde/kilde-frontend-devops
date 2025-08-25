import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Content } from "antd/es/layout/layout";
import { Breadcrumb, Col, QRCode, Row, Input, message } from "antd";

import checkCircle from "../../Assets/Images/authenticator_check.svg";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import OtpInput from "react18-input-otp";
import { useLocation, useNavigate } from "react-router-dom";
import { enableTOTP, getUser, setupSms } from "../../Apis/UserApi";
import ROUTES from "../../Config/Routes";
import ReactLoading from "react-loading";
import { setUserDetails } from "../../Redux/Action/User";
import { useDispatch, useSelector } from "react-redux";
import {
  APP_STORE_LINKS,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../Utils/Reusables";

const TwofaAunthenticatorApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [secretKey, setSecretKey] = useState("");
  const [qrUrl, setQrURL] = useState("");
  const [otp, setOtp] = useState("");
  const [chnageUI, setChangeUI] = useState(false);
  const [tOTPLoader, setTOTPLoader] = useState(false);
  const [smsLoader, setSmsLoader] = useState(false);
  const [secretLoad, setSecretLoad] = useState();

  useEffect(() => {
    getUserDetails();
    setSecretLoad(true);
    if (location) {
      setSecretKey(location?.state?.totpRes?.secret);
      setQrURL(location?.state?.totpRes?.registrationURL);
    }
    setSecretLoad(false);
  }, [location]);

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        if (response?.secondFactorAuth === "TOTP") setChangeUI(true);
        setUserDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

      return null;
    }
  };

  const handleCopyValue = () => {
    const valueToCopy = secretKey;
    navigator.clipboard
      .writeText(valueToCopy)
      .then(() => {
        showMessageWithCloseIcon("Security key copied to clipboard!");
      })
      .catch((error) => {
        console.error("Security key copy failed:", error);
      });
  };

  const handleAuthentication = async () => {
    setTOTPLoader(true);
    if (otp !== "") {
      const requestBody = {
        totpToken: otp,
      };
      const response = await enableTOTP(requestBody);
      if (!response) {
        await getUserDetails();
        showMessageWithCloseIcon(
          "You've successfully enabled Two-Factor Authentication for your account."
        );
        setChangeUI(true);
        window?.dataLayer?.push({
          event: "authenticationTwoFactorConfirm",
          user_id: user?.number,
          register_method: user?.registrationType,
        });
        window.scrollTo(0, 0);
        setTOTPLoader(false);
      } else {
        setTOTPLoader(false);
      }
    } else {
      setTOTPLoader(false);
      showMessageWithCloseIconError("Please enter 6 digit OTP!");
    }
  };

  const handleConnect = async () => {
    setSmsLoader(true);
    await setupSms()
      .then((res) => {
        showMessageWithCloseIcon(
          "We've sent an OTP to your mobile number. Please check your messages."
        );
        navigate(ROUTES.TWO_FA_SMS, {
          state: { code: false, set: true, codeVal: res?.code },
        });
        setSmsLoader(false);
      })
      .catch(() => {
        setSmsLoader(false);
      });
  };

  const handleOpenLink = (url) => {
    window.open(url, "_blank");
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
                title: "Authenticator App",
              },
            ]}
          />
          <p className="setting-head">Authenticator app</p>

          {chnageUI === true ? (
            <Row className="mb-16">
              <Col
                xs={24}
                sm={24}
                md={20}
                lg={14}
                className="setting-twofa-div medium-tranch-col"
              >
                <Row className="align-center">
                  <div className="authenticator-app-success-sub-div">
                    <div>
                      <img
                        src={checkCircle}
                        alt="checkcircle"
                        className="authenticator-checkcircle"
                      />
                    </div>
                    <div>
                      <p className="add-doc-setting-text mt-0 mb-0">
                        Authenticator enabled
                      </p>
                      <p className="add-doc-setting-text mt-0 mb-0">
                        Currently paired with your Kilde account
                      </p>
                    </div>
                  </div>
                </Row>
                <Col className="mt-16">
                  <ButtonDefault
                    title="Switch to SMS"
                    onClick={handleConnect}
                    loading={smsLoader}
                  />
                </Col>
              </Col>
            </Row>
          ) : (
            <>
              {secretLoad === true ? (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    zIndex: 99,
                    transform: "translate(-37px, -33px)",
                  }}
                >
                  <ReactLoading
                    type="spin"
                    color="var(--kilde-blue)"
                    height={60}
                    width={60}
                  />
                </div>
              ) : (
                <>
                  <Row className="mb-16">
                    <Col
                      xs={24}
                      sm={24}
                      md={23}
                      lg={20}
                      xl={16}
                      className="settitng-totp"
                    >
                      <Row>
                        <div className="authenticator-app-sub-div">
                          <div>
                            <Col span={2}>
                              <div className="authenticator-app-number">
                                <p className="mt-5">1</p>
                              </div>
                            </Col>
                          </div>
                          <div>
                            <Col span={22}>
                              <Row>
                                <Col span={24}>
                                  <p className="mt-3 mb-16 auth-head">
                                    Install the Authenticator app on your device
                                  </p>
                                </Col>

                                <Col span={24}>
                                  <div className="authenticator-app-btn-div">
                                    {["iOS", "Android"].map((platform) => (
                                      <div
                                        className="auth-app-btn-div"
                                        key={platform}
                                      >
                                        <ButtonDefault
                                          title={platform}
                                          className="setting-custom-default-btn"
                                          style={{ width: "100%" }}
                                          onClick={() =>
                                            handleOpenLink(
                                              APP_STORE_LINKS[platform]
                                            )
                                          }
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </div>
                        </div>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mb-16">
                    <Col
                      xs={24}
                      sm={24}
                      md={23}
                      lg={20}
                      xl={16}
                      className="settitng-totp"
                    >
                      <Row>
                        <div className="authenticator-app-sub-div">
                          <div>
                            <div className="authenticator-app-number">
                              <p className="mt-5">2</p>
                            </div>
                          </div>
                          <div>
                            <p className="mt-3 mb-16 auth-head">
                              Scan the code with the Authenticator app Or copy
                              the setup key below to the Authenticator app
                              manually
                            </p>
                            <p className="add-doc-setting mt-0 mb-16">
                              Please write down or print a copy of Setup Key and
                              put in a safe place. If your phone gets lost,
                              stolen or erased, you will need this code to setup
                              Authenticator app. Do not share this code with
                              anyone.
                            </p>
                          </div>
                          <div className="sm-d-none">
                            <div className="sb-TwoFa-center">
                              {qrUrl ? (
                                <QRCode type="svg" value={qrUrl} size={100} />
                              ) : (
                                <p>Loading QR Code...</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </Row>
                      <Row className="scretkey-div">
                        <Col xs={24} sm={10}>
                          <input
                            placeholder={secretKey}
                            type="key"
                            className="secret-input"
                            readOnly
                          />
                        </Col>
                        <Col xs={24} sm={4}>
                          <ButtonDefault
                            title="Copy"
                            onClick={handleCopyValue}
                            style={{ width: "100%", height: "40px" }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={23}
                      lg={20}
                      xl={16}
                      className="settitng-totp"
                    >
                      <div className="authenticator-app-sub-div">
                        <div>
                          <div className="authenticator-app-number">
                            <p className="mt-5">3</p>
                          </div>
                        </div>
                        <div>
                          <p className="mt-3 mb-16 auth-head">
                            Enter 6-digit verification code from the
                            Authenticator app
                          </p>
                        </div>
                      </div>
                      <div className="authenticate-disp-div">
                        <div className="authenticate-otp-input-div">
                          <OtpInput
                            value={otp}
                            onChange={setOtp}
                            inputStyle={{
                              border: "1px solid #1A202C1A",
                              borderRadius: "12px",
                              width: "40px",
                              height: "40px",
                              fontSize: "18px",
                              fontWeight: "400",
                            }}
                            numInputs={6}
                            renderSeparator={<span></span>}
                            isInputNum={true}
                            inputProps={{
                              type: "number",
                              inputMode: "numeric",
                            }}
                            renderInput={(props) => (
                              <input
                                {...props}
                                type="number"
                                inputMode="numeric"
                              />
                            )}
                          />
                        </div>
                        <div>
                          <Col xs={24} span={8}>
                            <ButtonDefault
                              style={{ height: "40px", width: "100%" }}
                              title="Enable"
                              onClick={handleAuthentication}
                              loading={tOTPLoader}
                              className="enable-totp-btn"
                            />
                          </Col>
                        </div>
                      </div>
                      {/* <Row>
                        <div
                          className="authenticator-app-sub-div"
                          style={{ position: "relative", height: 90 }}
                        >
                          <div>
                            <div className="authenticator-app-number">
                              <p className="mt-5">3</p>
                            </div>
                          </div>
                          <div style={{ position: "absolute" }}>
                            <Row>
                              <Col xs={24} span={24}>
                                <p className="mt-3 mb-16 auth-head">
                                  Enter 6-digit verification code from the
                                  Authenticator app
                                </p>
                              </Col>
                              <div className="authenticator-app-sub-div">
                                <div className="authenticate-otp-input-div">
                                  <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    inputStyle={{
                                      border: "1px solid #1A202C1A",
                                      borderRadius: "12px",
                                      width: "40px",
                                      height: "40px",
                                      fontSize: "18px",
                                      fontWeight: "400",
                                    }}
                                    numInputs={6}
                                    renderSeparator={<span></span>}
                                    isInputNum={true}
                                    inputProps={{
                                      type: "number",
                                      inputMode: "numeric",
                                    }}
                                    renderInput={(props) => (
                                      <input
                                        {...props}
                                        type="number"
                                        inputMode="numeric"
                                      />
                                    )}
                                  />
                                </div>
                                <div style={{ width: "100%" }}>
                                  <Col xs={24} span={8}>
                                    <ButtonDefault
                                      style={{ height: "40px", width: "100%" }}
                                      title="Enable"
                                      onClick={handleAuthentication}
                                      loading={tOTPLoader}
                                      className="enable-totp-btn"
                                    />
                                  </Col>
                                </div>
                              </div>
                            </Row>
                          </div>
                        </div>
                      </Row> */}
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
        </Content>
      </DashboardLayout>
    </div>
  );
};

export default TwofaAunthenticatorApp;
