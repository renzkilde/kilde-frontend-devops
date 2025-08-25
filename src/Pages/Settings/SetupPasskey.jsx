import React, { useEffect, useState } from "react";
import { Breadcrumb, Col, Modal, Row, Skeleton, message } from "antd";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Content } from "antd/es/layout/layout";
import { startRegistration } from "@simplewebauthn/browser";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import ROUTES from "../../Config/Routes";
import {
  getPassKeyChallenge,
  getPassKeyToggleStatus,
  registerPasskey,
} from "../../Apis/InvestorApi";
import {
  authenticateCode,
  authenticateCodeNon2FA,
  deletePasskey,
  editPasskey,
  enableSMS2FA,
  getUser,
  sendVerificationCode,
  sendVerificationCode2FA,
  updateMobileNo,
} from "../../Apis/UserApi";
import SMSIcon from "../../Assets/Images/SVGs/ChatText.svg";
import "./style.css";
import TwoFAComponent from "../TwoFAPage/TwoFAContent";
import {
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../Utils/Reusables";
import PasskeyIcon from "../../Assets/Images/SVGs/passkey-vec.svg";
import PasskeyEdit from "../../Assets/Images/SVGs/passkey-edit.svg";
import PasskeyDelete from "../../Assets/Images/SVGs/passkey-delete.svg";
import moment from "moment/moment";
import Sms2FaIcon from "../../Assets/Images/SVGs/smsicon.svg";
import PhoneInput from "react-phone-input-2";
import InputDefault from "../../Components/InputDefault/InputDefault";
import { setUserDetails } from "../../Redux/Action/User";
import { useDispatch } from "react-redux";
import {
  extractOSAndBrowser,
  getDeviceNamesFromPasskeys,
  getOSAndBrowser,
} from "../../Utils/Helpers";

const SetupPasskey = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({});
  const [code, setCode] = useState("");
  const [smsModal, setSmsModal] = useState(false);
  const [smsAuth, setSmsAuth] = useState(false);
  const [secFactorAuth, setSecFactorAuth] = useState("");
  const [isPasskeyListLoading, setIsPasskeyListLoading] = useState(true);
  const [enterMobile, setEnterMobile] = useState(false);
  const [countryCode, setCountryCode] = useState("sg");
  const [newMobile, setNewMobile] = useState("");
  const [showEditPasskeyModal, setShowEditPasskeyModal] = useState(false);
  const [newPasskeyName, setNewPasskeyName] = useState("");
  const [selectedPasskey, setSelectedPasskey] = useState({});
  const [passketEditLoader, setPassketEditLoader] = useState(false);
  const [showDeletePasskeyModal, setShowDeletePasskeyModal] = useState(false);
  const [removePasskey, setRemovePasskey] = useState(false);

  const fetchUserData = () => {
    getUser()
      .then((res) => {
        setEmail(res?.email);
        setUser(res);
        setUserDetails(res, dispatch);
        setSecFactorAuth(res?.secondFactorAuth);
        localStorage.setItem("hasPasskey", res?.passkeyEnabled);
        localStorage.setItem(
          "availableDevices",
          getDeviceNamesFromPasskeys(res?.passkeys)
        );
        setTimeout(() => {
          setIsPasskeyListLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!secFactorAuth || !email || !user) {
      fetchUserData();
      setSecFactorAuth(user?.secondFactorAuth);
    }
  }, [secFactorAuth]);

  useEffect(() => {
    getPassKeyToggleStatus()
      .then((res) => {
        if (res?.passkeyFeatureEnabled === false) {
          message.warning("Passkey feature is not available at the moment.");
          navigate(ROUTES.SETTINGS);
        }
      })
      .catch((err) => {
        message.error(
          "Couldn't verify if Passkey login is available. Try again."
        );
        console.log(err);
        navigate(ROUTES.SETTINGS);
      });
  }, [navigate]);

  const handlePasskeyRegistration = async () => {
    try {
      const res = await getPassKeyChallenge();
      const attestationResponse = await startRegistration(res);
      const updatedReponse = { ...attestationResponse, email };

      const registerRes = await registerPasskey(updatedReponse);
      message.success(registerRes?.message);
      await fetchUserData();
      if (user?.secondFactorAuth === null) {
        await enableSMS2FA();
      }

      setSmsModal(false);
      setLoader(false);
      fetchUserData();
    } catch (err) {
      setLoader(false);
      setSmsModal(false);
      if (err.name === "AbortError" || err.name === "NotAllowedError") {
        message.info("Passkey setup was canceled.");
      } else {
        console.error("Error during passkey registration:", err);
        message.error("Something went wrong.. Please try again.");
      }
    }
  };

  const sendVerification = async () => {
    try {
      const res = await sendVerificationCode();
      if (res?.length === 0) {
        showMessageWithCloseIconError("Something went wrong, Try again!");
      } else {
        setSecFactorAuth(res?.secondFactorAuth);
        setCode(res?.verificationCode);
        setLoader(false);

        showMessageWithCloseIcon(
          res?.type === "TOTP"
            ? "Please check your authentication app for the current one-time password"
            : "We've sent an OTP to your mobile number. Please check your messages."
        );
      }
    } catch (err) {
      console.error("2FA API error:", err);
      setLoader(false);
    }
  };

  const sendVerificatioNon2Fa = async () => {
    try {
      const res = await sendVerificationCode2FA();
      setSecFactorAuth(res?.secondFactorAuth);
      setCode(res?.verificationCode);
      setSmsModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnablePasskey = async () => {
    setLoader(true);
    if (user?.registrationType === "GOOGLE" && user?.mobilePhone === "") {
      setEnterMobile(true);
      setSmsModal(true);
      setLoader(false);
      return;
    }

    try {
      if (user?.secondFactorAuth === null) {
        setSmsAuth(false);
        setSmsModal(true);
        sendVerificatioNon2Fa();
      } else if (user?.secondFactorAuth === "SMS") {
        setSmsAuth(true);
        setSmsModal(true);
        sendVerification();
      } else if (user?.secondFactorAuth === "TOTP") {
        setSmsAuth(true);
        setSmsModal(true);
        sendVerification();
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  const handleInit = () => sendVerificationCode();

  const handleAuthentication = async (otp) => {
    setLoader(true);
    if (otp !== "") {
      const requestBody = {
        code: otp,
      };
      const response = await authenticateCode(requestBody);
      if (!response) {
        message.success("Verified successfully");
        setLoader(false);
        setSmsModal(false);
        handlePasskeyRegistration();
      } else {
        setLoader(false);
      }
    }
  };

  const handleNon2fAVerify = async (otp) => {
    setLoader(true);
    if (otp !== "") {
      const requestBody = {
        verificationCode: otp,
      };
      const response = await authenticateCodeNon2FA(requestBody);
      if (!response) {
        message.success("Verified successfully");
        setLoader(false);
        setSmsModal(false);
        handlePasskeyRegistration();
      } else {
        setLoader(false);
      }
    }
  };

  const handleAddNewMobile = async () => {
    try {
      await updateMobileNo({ mobileNumber: "+" + newMobile })
        .then(() => {
          setEnterMobile(false);
          sendVerificatioNon2Fa();
        })
        .catch((error) => {
          message.error("Failed to update mobile number. Try again.");
          console.error("Error updating mobile number:", error);
        });
    } catch (err) {
      console.error("Failed to update mobile number:", err);
      message.error("Failed to save mobile number. Try again.");
    }
  };

  const editPasskeyFun = () => {
    if (!newPasskeyName) {
      return message.warning("Please enter a name for your passkey.");
    }
    setPassketEditLoader(true);
    editPasskey({
      passkeyId: selectedPasskey?.id,
      passkeyName: newPasskeyName,
    })
      .then((res) => {
        setPassketEditLoader(false);
        message.success("Passkey renamed successfully.");
        setShowEditPasskeyModal(false);
        fetchUserData();
      })
      .catch((err) => {
        setPassketEditLoader(false);
        message.error("Failed to rename passkey. Try again.");
        console.error("Error editing passkey:", err);
        setShowEditPasskeyModal(false);
      });
  };

  const handleDeletePasskey = async (passkeyId) => {
    deletePasskey(selectedPasskey?.id)
      .then((res) => {
        message.success("Passkey deleted successfully.");
        setShowDeletePasskeyModal(false);
        fetchUserData();
        setSmsAuth(false);
        setSmsModal(false);
        setRemovePasskey(false);
      })
      .catch((err) => {
        message.error("Failed to delete passkey. Try again.");
        console.error("Error deleting passkey:", err);
        setShowDeletePasskeyModal(false);
      });
  };

  const handleTwoFAAuthenticate = (otp) => {
    if (removePasskey) {
      handleDeletePasskey(selectedPasskey?.id);
    } else if (smsAuth) {
      handleAuthentication(otp);
    } else {
      handleNon2fAVerify(otp);
    }
  };

  return (
    <div>
      <DashboardLayout>
        <Content className="setting-page-div">
          <Breadcrumb>
            <Breadcrumb.Item
              onClick={() => navigate(ROUTES.SETTINGS)}
              className="cursor-pointer"
            >
              Personal Settings
            </Breadcrumb.Item>
            <Breadcrumb.Item>Passkey</Breadcrumb.Item>
          </Breadcrumb>
          <p className="setting-head">Passkey</p>

          <Row>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={14}
              className="setting-twofa-div medium-tranch-col"
            >
              <Row>
                <Col>
                  <b style={{ fontSize: 16 }}>
                    Add a passkey for an effortless and secured login
                  </b>{" "}
                  <br />
                  <p>
                    Log in with just your fingerprint, Face ID, or device
                    passcode — no passwords, no OTPs. Passkeys keep your account
                    protected with the highest level of security.
                  </p>
                </Col>
              </Row>

              {user?.passkeyEnabled && (
                <div className="passkey-container">
                  {user?.passkeys?.length > 0 && <h4>Your passkeys</h4>}
                  {isPasskeyListLoading ? (
                    <Skeleton active />
                  ) : user?.passkeys?.length > 0 ? (
                    user.passkeys.map((ele, i) => (
                      <div
                        key={i}
                        className="added-passkey-container"
                        style={{ marginBottom: "12px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                        >
                          <div>
                            <img
                              src={PasskeyIcon}
                              alt="Passkey Icon"
                              className="passkey-icon"
                            />
                          </div>
                          <div className="passkey-details">
                            <h5>{ele?.passkeyName}</h5>
                            {ele?.device && (
                              <p>Device: {extractOSAndBrowser(ele?.device)}</p>
                            )}
                            <p>
                              Created:{" "}
                              {moment(ele?.passkeyCreatedDate).format(
                                "MMM DD, YYYY"
                              )}
                            </p>
                            <p>
                              Last used:{" "}
                              {ele?.passkeyLastUsed === null ||
                              ele?.passkeyLastUsed === ""
                                ? "Never"
                                : moment(ele?.passkeyLastUsed).format(
                                    "MMM DD, YYYY, h:mm A"
                                  )}
                            </p>
                          </div>
                        </div>
                        <div className="passkey-actions">
                          <img
                            src={PasskeyEdit}
                            alt="Edit Passkey"
                            className="passkey-edit-icon"
                            onClick={() => {
                              setSelectedPasskey(ele);
                              setShowEditPasskeyModal(true);
                              setNewPasskeyName(ele?.passkeyName);
                            }}
                          />
                          <img
                            src={PasskeyDelete}
                            alt="Delete Passkey"
                            className="passkey-delete-icon"
                            onClick={() => {
                              setShowDeletePasskeyModal(true);
                              setSelectedPasskey(ele);
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : null}
                </div>
              )}

              <div className="mt-16">
                <ButtonDefault
                  title="Add a passkey"
                  onClick={handleEnablePasskey}
                  loading={loader}
                />
              </div>
            </Col>
          </Row>
        </Content>

        <Modal
          title=""
          closable={{ "aria-label": "Custom Close Button" }}
          open={showDeletePasskeyModal}
          footer={null}
          onCancel={() => setShowDeletePasskeyModal(false)}
        >
          <div className="psky-container-delete">
            <h3>Are you sure you want to remove this passkey?</h3>
            <p>
              Removing it means this device will no longer be trusted for login
              or verification on Kilde
            </p>
            <ButtonDefault
              title="Remove"
              block
              onClick={() => {
                setSmsAuth(false);
                setSmsModal(true);
                sendVerificatioNon2Fa();
                setRemovePasskey(true);
                setShowDeletePasskeyModal(false);
                // handleDeletePasskey(selectedPasskey?.id);
              }}
              style={{ marginTop: 14 }}
            />
          </div>
        </Modal>

        <Modal
          title=""
          closable={{ "aria-label": "Custom Close Button" }}
          open={showEditPasskeyModal}
          footer={null}
          onCancel={() => setShowEditPasskeyModal(false)}
        >
          <div style={{ padding: "10px 40px 40px 40px" }}>
            <h3>Rename {selectedPasskey?.passkeyName}</h3>
            <label className="psky-label">Passkey Name</label>
            <InputDefault
              placeholder="Enter new passkey name"
              type="text"
              name="passkeyName"
              value={newPasskeyName}
              onChange={(e) => setNewPasskeyName(e.target.value)}
              required={true}
              errorMsg={"Email is Required"}
              autoComplete="username webauthn"
            />
            <ButtonDefault
              title="Save"
              block
              onClick={editPasskeyFun}
              style={{ marginTop: 14 }}
              loading={passketEditLoader}
            />
          </div>
        </Modal>
        <Modal
          title=""
          closable={{ "aria-label": "Custom Close Button" }}
          open={smsModal}
          footer={null}
          // onOk={handleOk}
          onCancel={() => setSmsModal(false)}
        >
          {enterMobile ? (
            <div className="psky-container">
              <div className="psky-icon-box">
                <img src={Sms2FaIcon} alt="icon" />
              </div>
              <h2 className="psky-heading">Verify your phone number</h2>
              <p className="psky-subtitle">
                Enter your phone number to receive a <br /> verification code.
              </p>
              <div className="psky-input-wrapper">
                <PhoneInput
                  name="mobileNumber"
                  className="sb-phone-field"
                  country={countryCode}
                  value={newMobile}
                  onChange={(value, country) => {
                    setNewMobile(value);
                    setCountryCode(country.countryCode);
                  }}
                  enableSearch
                />
              </div>
              <ButtonDefault
                title="Continue"
                style={{ width: "100%" }}
                onClick={handleAddNewMobile}
              />
            </div>
          ) : (
            <TwoFAComponent
              onInit={
                !smsAuth ? () => sendVerificatioNon2Fa() : () => handleInit()
              }
              onAuthenticate={
                removePasskey
                  ? (selectedPasskey) =>
                      handleDeletePasskey(selectedPasskey?.id)
                  : smsAuth
                  ? (otp) => handleAuthentication(otp)
                  : (otp) => handleNon2fAVerify(otp)
              }
              secFactorAuth={secFactorAuth}
              loader={loader}
              codes={code}
              mobileNo={user?.mobilePhone}
              usedIn={"AddressChange"}
              // icon={FAConfirmIcom}
              showFooter={true}
              changeContent={false}
              user={user}
              clearOtp={false}
            />
          )}
        </Modal>
      </DashboardLayout>
    </div>
  );
};

export default SetupPasskey;
