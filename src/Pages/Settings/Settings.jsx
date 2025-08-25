import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Button, Col, Layout, message, Modal, Row } from "antd";
import "./style.css";
import Arrow from "../../Assets/Images/arrow.svg";
import InputDefault from "../../Components/InputDefault/InputDefault";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import { checkStepStatus, getCountries } from "../../Utils/Helpers";
import { setCurrentSate } from "../../Redux/Action/common";

import {
  getNoteOfAcceptance,
  getUser,
  recordFeatures,
} from "../../Apis/UserApi";
import { setUserDetails } from "../../Redux/Action/User";
import AdditionalDoc from "../../Assets/Images/IconSetDoc.svg";
import LockGreen from "../../Assets/Images/SVGs/Lock-Green.svg";
import LockBlue from "../../Assets/Images/SVGs/Lock-Blue.svg";

import TwoFADisable from "../../Assets/Images/SVGs/Shield.svg";
import CopyIcon from "../../Assets/Images/SVGs/Copy.svg";
import PasskeyIcon from "../../Assets/Images/SVGs/Key.svg";
import changePW from "../../Assets/Images/SVGs/Lock.svg";
import viewOB from "../../Assets/Images/viewOB.svg";
import edit from "../../Assets/Images/edit_icon.svg";
import {
  getPassKeyToggleStatus,
  getPersonalInfo,
} from "../../Apis/InvestorApi";
import { getCountryNameByCode } from "../../Utils/Reusables";
import EditAddress from "./EditAddress";
import review from "../../Assets/Images/underreview.svg";
import twofaFilled from "../../Assets/Images/twofa-filled.svg";
import XCircle from "../../Assets/Images/SVGs/XCircle.svg";
import DynamicCheckCircle from "../../Assets/Images/SVGs/DynamicCheckCircle";
import CheckCircle from "../../Assets/Images/SVGs/CheckCircle.svg";
import DynamicLockIcon from "../../Assets/Images/SVGs/DynamicLockIcon";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";

const { Content } = Layout;
const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [address, setAddress] = useState();
  const navigate = useNavigate();
  const countryList = getCountries();
  const [editAddress, setEditAdress] = useState(false);
  const [isPassKeyEnabled, setIsPassKeyEnabled] = useState();
  const [twofa, setTwofa] = useState(false);
  const [showPWA, setShowPWA] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [responses, setResponses] = useState([]);

  const handleCopy = (text, copyText) => {
    navigator.clipboard.writeText(copyText);
    message.success(`${text} copied to clipboard!`, 1);
  };

  useEffect(() => {
    getUserDetails();
    getPersonalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPassKeyToggleStatus()
      .then((res) => {
        setIsPassKeyEnabled(res?.passkeyFeatureEnabled);
      })
      .catch((err) => {
        message.error(
          "Couldn't verify if Passkey login is available. Try again."
        );
        console.log(err);
        setIsPassKeyEnabled(false);
      });
  }, []);

  useEffect(() => {
    recordFeatures()
      .then((res) => {
        setShowPWA(res?.showPWAPopup);
      })
      .catch((err) => {
        console.error(err, "Failed to fetch system features");
      });
  }, []);

  useEffect(() => {
    getYourInvestmentTerm("AUTO_INVEST_NOTE_OF_ACCEPTANCE");
    getYourInvestmentTerm("NOTE_OF_ACCEPTANCE");
  }, []);

  const getYourInvestmentTerm = async (data) => {
    try {
      const response = await getNoteOfAcceptance(data);
      if (response && Array.isArray(response)) {
        setResponses((prev) => [...prev, ...response]);
      } else {
        console.warn("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to fetch note of acceptance:", error);
    }
  };

  const getPersonalData = async () => {
    try {
      let personalData = await getPersonalInfo();

      setAddress(personalData);
    } catch (error) {
      console.error("Error fetching personal data:", error);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const handleViewOnboarding = () => {
    if (
      checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") === false
    ) {
      if (user?.investorType === "INDIVIDUAL") {
        navigate(ROUTES.INDIVIDUAL_VERIFICATION);
      } else {
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
        setCurrentSate(2, dispatch);
      }
    } else {
      navigate(ROUTES.VERIFICATION);
    }
  };

  const handleEditAddress = () => {
    if (user?.secondFactorAuth === null) {
      setTwofa(true);
    } else {
      setEditAdress(true);
    }
  };

  const handleCloseEditAddress = () => {
    setEditAdress(false);
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent auto-showing the install prompt
      setInstallPrompt(e); // Save the event for later
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return (
    <div>
      <DashboardLayout>
        <Content className="setting-page-div">
          <p className="mt-0 setting-head">Personal Settings</p>

          <Row
            gutter={window.innerWidth >= 768 ? 16 : 0}
            style={{ display: "flex", alignItems: "stretch" }}
          >
            <Col
              xs={24}
              sm={24}
              md={14}
              lg={14}
              className="gutter-row normal-padd-right"
              style={{
                display: "flex",
                flexDirection: window.innerWidth >= 768 ? "column" : "row",
                flex: window.innerWidth >= 768 ? 1 : "initial",
              }}
            >
              <div className="infomation-profile-div" style={{ flex: 1 }}>
                <p className="mt-0 tranch-head mb-20">Account Information</p>
                <Row gutter={16} style={{ flex: 1 }}>
                  <Col className="gutter-row mb-16" md={12} sm={24} xs={24}>
                    <label>First name</label>
                    <InputDefault
                      type="text"
                      style={{ width: "100%" }}
                      name="firstName"
                      required={true}
                      errorMsg={"Enter first name"}
                      value={user?.firstName}
                      disabled={true}
                    />
                  </Col>
                  <Col className="gutter-row mb-16" md={12} sm={24} xs={24}>
                    <div>
                      <label>Last name</label>
                      <InputDefault
                        type="text"
                        style={{ width: "100%" }}
                        name="lastName"
                        required={true}
                        errorMsg={"Enter last name"}
                        value={user?.lastName}
                        disabled={true}
                      />
                    </div>
                  </Col>
                  <Col className="gutter-row mb-16" md={12} sm={24} xs={24}>
                    <label>Mobile number</label>
                    <PhoneInput
                      className="sb-phone-field"
                      value={user?.mobilePhone}
                      enableSearch
                      disabled={true}
                      placeholder=""
                    />
                  </Col>
                  <Col className="gutter-row mb-16" md={12} sm={24} xs={24}>
                    <div>
                      <label>Email</label>
                      <InputDefault
                        type="text"
                        style={{ width: "100%" }}
                        name="Email"
                        required={true}
                        value={user?.email}
                        disabled={true}
                      />
                    </div>
                  </Col>
                  {!checkStepStatus(
                    user?.waitingVerificationSteps,
                    "PERSONAL_DETAILS"
                  ) &&
                    user?.investorStatus === "ACTIVE" &&
                    user?.secondFactorAuth !== null && (
                      <>
                        <Col
                          className="gutter-row mb-16"
                          md={24}
                          sm={24}
                          xs={24}
                        >
                          <div>
                            <label>Address</label>
                            <InputDefault
                              className="pr-25"
                              type="text"
                              style={{ width: "100%" }}
                              name="address"
                              required={true}
                              value={[
                                address?.houseNumber,
                                address?.residenceAddressStreet,
                                address?.residenceAddressCity,
                                getCountryNameByCode(
                                  countryList,
                                  address?.residenceAddressCountry
                                ),
                                address?.residenceAddressPostalCode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                              disabled={user?.updatedDetailStatus === "PENDING"}
                            />
                            <img
                              src={edit}
                              alt="edit"
                              style={{
                                position: "absolute",
                                top: "67%",
                                right: "16px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                              }}
                              onClick={handleEditAddress}
                              className={
                                user?.updatedDetailStatus === "PENDING"
                                  ? "p-none "
                                  : "cursor-pointer"
                              }
                            />
                          </div>
                        </Col>
                        {user?.updatedDetailStatus === "PENDING" && (
                          <Col
                            className="gutter-row mb-16"
                            md={24}
                            sm={24}
                            xs={24}
                          >
                            <div className="edit-address-status">
                              <img src={review} alt="review" />
                              <p className="edit-address-text">
                                Your new address under review
                              </p>
                            </div>
                          </Col>
                        )}
                      </>
                    )}
                  <Col className="gutter-row mb-16" md={12} sm={24} xs={24}>
                    <div>
                      <label>Account number</label>
                      <p className="copy-btn-tag">
                        {user?.number}{" "}
                        <button
                          className="copy-button"
                          onClick={() =>
                            handleCopy("Account number", user?.number)
                          }
                        >
                          <img src={CopyIcon} alt="copy_icon" />
                        </button>
                      </p>
                    </div>
                  </Col>
                  {user?.investorStatus === "ACTIVE" && (
                    <Col className="gutter-row" md={12} sm={24} xs={24}>
                      <div>
                        <label>Referral code</label>

                        <p className="copy-btn-tag">
                          {user?.refferalCode}{" "}
                          <button
                            className="copy-button"
                            onClick={() =>
                              handleCopy("Referral code", user?.refferalCode)
                            }
                          >
                            <img src={CopyIcon} alt="copy_icon" />
                          </button>
                        </p>
                      </div>
                    </Col>
                  )}
                </Row>

                <div className="setting-acc-info-div">
                  <p className="mb-0">
                    To change your account information, contact us at{" "}
                    <span>
                      <Link to="mailto:sales@kilde.sg">sales@kilde.sg</Link>
                    </span>
                  </p>
                </div>
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={10}
              lg={10}
              className="gutter-row"
              style={{
                display: "flex",
                flexDirection: window.innerWidth >= 768 ? "column" : "row",
                flex: 1,
              }}
            >
              <Row
                gutter={window.innerWidth >= 576 ? 16 : 0}
                style={{ flex: 1, justifyContent: "space-around" }}
              >
                <Col
                  className="gutter-row infomation-profile-div"
                  md={24}
                  sm={11}
                  xs={24}
                >
                  <p
                    className="mt-0 tranch-head mb-16"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    Security
                    {user?.passkeyEnabled === false &&
                    user?.secondFactorAuth === null ? (
                      // Low security
                      <div
                        style={{
                          marginLeft: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <DynamicLockIcon color="#FF4747" />
                        <span className="low-theme">Low</span>
                      </div>
                    ) : user?.passkeyEnabled === false &&
                      user?.secondFactorAuth === "SMS" ? (
                      // Medium security
                      <div
                        style={{
                          marginLeft: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <DynamicLockIcon color="#E6A750" />
                        <span className="medium-theme">Medium</span>
                      </div>
                    ) : user?.passkeyEnabled === false &&
                      user?.secondFactorAuth === "TOTP" ? (
                      // Medium security
                      <div
                        style={{
                          marginLeft: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <DynamicLockIcon color="#E6A750" />
                        <span className="medium-theme">Medium</span>
                      </div>
                    ) : user?.passkeyEnabled === true &&
                      user?.secondFactorAuth === "SMS" ? (
                      // Medium security
                      <div
                        style={{
                          marginLeft: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <img src={LockBlue} alt="lock" />
                        <span
                          className="low-theme"
                          style={{ color: "#22B5E9" }}
                        >
                          High
                        </span>
                      </div>
                    ) : user?.passkeyEnabled === true &&
                      user?.secondFactorAuth === null ? (
                      // Strong security (Passkey only)
                      <div
                        style={{
                          marginLeft: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <img src={LockGreen} alt="lock" />
                        <span
                          className="low-theme"
                          style={{ color: "#67B89B" }}
                        >
                          Strong
                        </span>
                      </div>
                    ) : user?.passkeyEnabled === true &&
                      user?.secondFactorAuth === "TOTP" ? (
                      // High security (Passkey + TOTP)
                      <div
                        style={{
                          marginLeft: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <img src={LockBlue} alt="lock" />
                        <span
                          className="low-theme"
                          style={{ color: "#22B5E9" }}
                        >
                          High
                        </span>
                      </div>
                    ) : null}
                  </p>
                  {isPassKeyEnabled && (
                    <Button
                      className="setting-btn"
                      onClick={() => navigate(ROUTES.SETUP_PASSKEY)}
                    >
                      <img src={PasskeyIcon} alt="passkey" />
                      Passkey{" "}
                      {!user?.passkeyEnabled ? (
                        <div className="badge-round">
                          <img src={XCircle} alt="x" />
                          <p>Set up now</p>
                        </div>
                      ) : (
                        <div className="active-badge-round">
                          <DynamicCheckCircle color="#4AA785" />
                          <p>Active</p>
                        </div>
                      )}
                      <img src={Arrow} alt="arrow" />
                    </Button>
                  )}
                  <div>
                    <Button
                      className="setting-btn"
                      onClick={() => navigate(ROUTES.TWO_FACTOR_AUTH)}
                    >
                      <img src={TwoFADisable} alt="2FA" />
                      Two-factor auth
                      {user?.secondFactorAuth === null ? (
                        <div className="badge-round">
                          <img src={XCircle} alt="x" />
                          <p>Set up now</p>
                        </div>
                      ) : user?.secondFactorAuth === "SMS" ? (
                        <div className="badge-round-medium">
                          <DynamicCheckCircle color="#E6A750" />
                          <p>SMS</p>
                        </div>
                      ) : user?.secondFactorAuth === "TOTP" ? (
                        <div className="badge-round-strong  ">
                          <DynamicCheckCircle color="#4AA785" />
                          <p>Authenticator</p>
                        </div>
                      ) : null}
                      <img src={Arrow} alt="arrow" />
                    </Button>
                  </div>

                  {user?.registrationType !== "GOOGLE" && (
                    <Button
                      className="setting-btn"
                      onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
                    >
                      <img src={changePW} alt="changePW" />
                      Change password
                      <img src={Arrow} alt="arrow" />
                    </Button>
                  )}
                </Col>
                <Col
                  className="gutter-row infomation-profile-div"
                  md={24}
                  sm={11}
                  xs={24}
                >
                  <p className="mt-0 tranch-head mb-16">Other</p>
                  {responses && Object.keys(responses).length > 0 && (
                    <Button
                      className="setting-btn"
                      onClick={() =>
                        navigate(ROUTES.YOUR_INVESTMENT_TERMS, {
                          state: { noteOfAcceptance: responses },
                        })
                      }
                    >
                      <img src={AdditionalDoc} alt="document" />
                      Note of acceptance
                      <img src={Arrow} alt="arrow" />
                    </Button>
                  )}
                  <Button
                    className="setting-btn"
                    onClick={() => navigate(ROUTES.ADDITIONAL_DOCUMENT)}
                  >
                    <img src={AdditionalDoc} alt="document" />
                    Additional documents
                    <img src={Arrow} alt="arrow" />
                  </Button>
                  {showPWA && installPrompt && (
                    <Button
                      className="setting-btn"
                      onClick={() => {
                        installPrompt.prompt();
                        installPrompt.userChoice.then((choiceResult) => {
                          if (choiceResult.outcome === "accepted") {
                            console.log("User accepted the install prompt");
                          } else {
                            console.log("User dismissed the install prompt");
                          }
                          setInstallPrompt(null); // Clear the prompt
                        });
                      }}
                    >
                      <i
                        style={{ paddingRight: 4 }}
                        className="bx bx-download"
                      ></i>
                      Install Kilde App
                      <img src={Arrow} alt="arrow" />
                    </Button>
                  )}
                  {user?.investorStatus === "ACTIVE" &&
                    user?.newUser === true && (
                      <Button
                        className="setting-btn"
                        onClick={handleViewOnboarding}
                      >
                        <img src={viewOB} alt="onboarding" />
                        View onboarding
                        <img src={Arrow} alt="arrow" />
                      </Button>
                    )}
                </Col>
              </Row>
            </Col>
          </Row>

          <Modal
            open={twofa}
            footer={null}
            onCancel={() => setTwofa(false)}
            maskClosable={false}
            closable={true}
            width={464}
            className="editAddress-twofa"
          >
            <div className="editAddress">
              <img
                src={twofaFilled}
                alt="twofaFilled"
                style={{ width: "48px", height: "48px" }}
              ></img>
              <p className="sb-TwoFa-title m-12">Please set up 2FA first</p>
              <p className="editAddress-twofa-subtext mb-24 mt-0">
                For your account security, 2FA is required to make changes to
                your personal information. Please set up 2FA first.
              </p>
              <ButtonDefault
                title={"Set Up"}
                style={{ width: "100%" }}
                onClick={() => navigate(ROUTES.TWO_FACTOR_AUTH)}
              />
              <Button
                block={true}
                onClick={() => setTwofa(false)}
                className="kd-2fa-dothislater"
              >
                I’ll do this later
              </Button>
            </div>
          </Modal>
          {editAddress && <EditAddress onClose={handleCloseEditAddress} />}
        </Content>
      </DashboardLayout>
    </div>
  );
};

export default Settings;
