import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Content } from "antd/es/layout/layout";
import ReactLoading from "react-loading";
import { Breadcrumb, Button, Divider, Spin, message } from "antd";
import SMS from "../../Assets/Images/twofaps.svg";
import Device from "../../Assets/Images/twofaga.svg";

import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import { getUser, setupSms, setupTotp } from "../../Apis/UserApi";
import { useDispatch, useSelector } from "react-redux";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import twofa_SMS from "../../Assets/Images/twofasms.svg";
import twofa_TOTP from "../../Assets/Images/totp.svg";
import { setUserDetails } from "../../Redux/Action/User";
import { LoadingOutlined } from "@ant-design/icons";
import { showMessageWithCloseIcon } from "../../Utils/Reusables";
import PasskeyIcon from "../../Assets/Images/SVGs/passkey-icon-round.svg";
import { getPassKeyToggleStatus } from "../../Apis/InvestorApi";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tOtpLoader, setTotpLoader] = useState(false);
  const user = useSelector((state) => state.user);
  const [smsLoader, setSmsLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);

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

  useEffect(() => {
    setPageLoader(true);
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        setPageLoader(false);
        return response;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setPageLoader(false);
      return null;
    }
  };

  useEffect(() => {
    getPassKeyToggleStatus()
      .then((res) => {
        if (res?.passkeyFeatureEnabled === true) {
          setShowPasskey(true);
        } else {
          setShowPasskey(false);
        }
      })
      .catch((err) => {
        message.error(
          err,
          "Couldn't verify if Passkey login is available. Try again."
        );
      });
  }, [navigate]);

  return (
    <div>
      <DashboardLayout>
        <Spin
          indicator={
            <LoadingOutlined
              style={{ fontSize: 50, color: "var(--kilde-blue)" }}
            />
          }
          spinning={pageLoader}
        >
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
                      Account Security
                    </span>
                  ),
                },
              ]}
            />
            {showPasskey && (
              <div>
                <p className="setting-head mb-0">Passkeys</p>
                <p className="mb-24 setting-page-sub-div">
                  Add a Passkey for effortless, secure login. <br />
                  Sign in with just your fingerprint, face ID, or device
                  passcode no passwords, no OTPs. Passkeys keep your account
                  protected with the highest level of security.
                </p>
                <div className="twofa-main">
                  <div
                    class="setting-twofa twofa-margin"
                    style={{ position: "relative" }}
                  >
                    <div class="twofa-second-div">
                      <img
                        alt="authenticateapp"
                        style={{ width: 48, height: 48, marginBottom: 16 }}
                        src={PasskeyIcon}
                      />
                      <p class=" auth-head m-0">Passkey</p>
                      <p class="twofa-tag">
                        Use finger print, face ID, or device passcode <br /> for
                        effortless, secure login
                      </p>
                    </div>
                    <Button
                      className="twofa-setup-button"
                      onClick={() => navigate(ROUTES.SETUP_PASSKEY)}
                    >
                      Set Up
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {user?.secondFactorAuth === null ? (
              <>
                <p className="setting-head mb-0">Two-factor Authentication</p>

                <p className="mt-10 mb-24 setting-page-sub-div">
                  Two-factor authentication adds an extra layer of security to
                  prevent unauthorised access to your account. Don't wait –
                  activate it today to protect your investments!
                </p>
              </>
            ) : (
              <p className="setting-head mb-24">Two-factor Authentication</p>
            )}

            {user?.secondFactorAuth === "SMS" ? (
              <div className="twofa-maindiv">
                <div style={{ display: "flex", gap: "16px" }}>
                  <img
                    src={twofa_SMS}
                    alt="sms"
                    style={{
                      marginBottom: "15px",
                    }}
                  />
                  <div>
                    <p className="twofa-sms-p mb-8">
                      You are using <b>SMS</b> services to receive one-time
                      passwords for your account security.
                    </p>
                    <p className="twofa-sms-no">
                      Messages are sent to: <b>{user?.mobilePhone}</b>
                    </p>
                    <div className="setting-acc-info-div">
                      <p className="mb-0">
                        To change your phone number contact us at{" "}
                        <span>
                          <Link to="mailto:sales@kilde.sg">sales@kilde.sg</Link>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="sb-text-align ">
                  <p className="twofa-sms-no mt-0 mb-16">
                    Alternatively, you can use the {""}
                    <b>Google authenticator app </b> on your mobile device.
                  </p>
                  <ButtonDefault
                    title="Switch to Authenticator app"
                    onClick={handleSetupTotp}
                    loading={tOtpLoader}
                  />
                  {/* <div className="twofa-whatisit">
                      <p className="mt-4">what is it?</p>
                    </div> */}
                </div>
              </div>
            ) : user?.secondFactorAuth === "TOTP" ? (
              <div className="twofa-maindiv">
                <div style={{ display: "flex", gap: "16px" }}>
                  <img src={twofa_TOTP} alt="sms" />
                  <div>
                    <p className="twofa-sms-p">
                      You are using <b>Google authenticator app </b> to generate
                      one-time password for your accont security.
                    </p>
                  </div>
                </div>
                <Divider />
                <div className="sb-text-align ">
                  <p className="twofa-sms-no mt-0 mb-16">
                    Alternatively, you can use <b>SMS</b> on your mobile device
                    to generate time based one-time passwords.
                  </p>
                  <ButtonDefault
                    title="Switch to SMS"
                    onClick={handleConnect}
                    loading={smsLoader}
                    className="mb-4"
                  />
                  {/* <div className="twofa-whatisit">
                      <p className="mt-4">what is it?</p>
                    </div> */}
                </div>
              </div>
            ) : (
              <>
                <div className="twofa-main">
                  <div
                    className="setting-twofa twofa-margin"
                    style={{ position: "relative" }}
                  >
                    {" "}
                    {tOtpLoader === true && (
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
                    )}
                    <div className="twofa-second-div">
                      <img
                        src={Device}
                        alt="authenticateapp"
                        style={{ width: 48, height: 48, marginBottom: "16px" }}
                      />
                      <p className=" auth-head m-0">Authenticator app</p>
                      <p className="twofa-tag">
                        Use the Google Authenticator app on your mobile device
                        to generate a one-time password for login
                      </p>
                    </div>
                    <Button
                      className="twofa-setup-button"
                      onClick={handleSetupTotp}
                    >
                      Set Up
                    </Button>
                    {/* <div className="twofa-whatisit">
                      <p className="mt-4">what is it?</p>
                    </div> */}
                  </div>
                  <div className="setting-twofa ">
                    <div className="twofa-second-div">
                      <img
                        src={SMS}
                        alt="sms"
                        style={{ width: 48, height: 48, marginBottom: "16px" }}
                      />

                      <p className="auth-head m-0">SMS</p>
                      <p className="twofa-tag ">
                        Receive an SMS message
                        <br />
                        with a one-time code for login
                      </p>
                    </div>
                    <Button
                      className="twofa-setup-button"
                      onClick={() => navigate(ROUTES.TWO_FA_SMS)}
                    >
                      Set Up
                    </Button>
                    {/* <div className="twofa-whatisit">
                      <p className="mt-4">what is it?</p>
                    </div> */}
                  </div>
                </div>
              </>
            )}
          </Content>
        </Spin>
      </DashboardLayout>
    </div>
  );
};

export default TwoFactorAuth;
