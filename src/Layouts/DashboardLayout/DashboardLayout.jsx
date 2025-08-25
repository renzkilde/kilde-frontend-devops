/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Menu,
  message,
  Modal,
  Select,
  Space,
  Tooltip,
} from "antd";

import Cookies from "js-cookie";
import PasskeyDoneIcon from "../../Assets/Images/SVGs/passkey-setup-done.svg";
import Earn_Reward from "../../Assets/Images/SVGs/Earn_reward.svg";

import ROUTES from "../../Config/Routes";
import Footer from "../BlankHeaderLayout/Footer";

import { useDispatch, useSelector } from "react-redux";

import Book_Icon from "../../Assets/Images/book_icon.svg";
// import HelpDesk from "../../Assets/Images/help-desk.svg";
// import HelpDeskBlack from "../../Assets/Images/help-desk-black.svg";
import Logo from "../../Assets/Images/logo.svg";
import User_frame from "../../Assets/Images/Icons/Dashboard/user_frame.svg";
import Logout_red_icon from "../../Assets/Images/Icons/logout_red_icon.svg";
import Toggle_Icon from "../../Assets/Images/Icons/Dashboard/toggle_icon.svg";
import Wallet_Icon from "../../Assets/Images/Icons/Dashboard/wallet_icon.svg";
import Down_arrow from "../../Assets/Images/Icons/Dashboard/down_arrow.svg";
import Profile_setting_icon from "../../Assets/Images/profile_setting_icon.svg";
import Help_Desk from "../../Assets/Images/SVGs/help_desk.svg";
// import Refferal_icon from "../../Assets/Images/SVGs/referral_icon.svg";
// import Onboarding from "../../Assets/Images/Icons/onboarding.svg";
// import Dashboard from "../../Assets/Images/Icons/dashboard.svg";
// import Invest from "../../Assets/Images/Icons/invest.svg";
// import AccountStatement from "../../Assets/Images/Icons/accountStatement.svg";
// import wallet from "../../Assets/Images/Icons/wallet.svg";
import MenuCloseIcon from "../../Assets/Images/menu-close.svg";
// import icontwofa from "../../Assets/Images/IconSettwofa.svg";
import LockOpenIcon from "../../Assets/Images/SVGs/LockOpen-White.svg";
import Sms2FaIcon from "../../Assets/Images/SVGs/smsicon.svg";
import PhoneInput from "react-phone-input-2";
import "./style.css";
import {
  checkStepStatus,
  getDeviceNamesFromPasskeys,
  // getOSAndBrowser,
} from "../../Utils/Helpers";
import {
  clearAllCookiesForDomain,
  clearUserSession,
  removeFundAndRecordTag,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
  useWindowWidth,
} from "../../Utils/Reusables";
import ProductTour from "../../Pages/ProductTour/ProductTour";
import Notification from "./Notification";
import { GetBankAccountApi } from "../../Apis/WalletApi";
import { setAccountDetails } from "../../Redux/Action/Wallet";
import { setUserDetails } from "../../Redux/Action/User";
import {
  authenticateCode,
  authenticateCodeNon2FA,
  enableSMS2FA,
  getUser,
  recordFeatures,
  sendVerificationCode,
  sendVerificationCode2FA,
  updateMobileNo,
} from "../../Apis/UserApi";
import BottomSheetInstall from "../../PWA/BottomSheetInstall";
import {
  getPassKeyChallenge,
  getPassKeyToggleStatus,
  registerPasskey,
} from "../../Apis/InvestorApi";
import { startRegistration } from "@simplewebauthn/browser";
import TwoFAComponent from "../../Pages/TwoFAPage/TwoFAContent";
// import SMSIcon from "../../Assets/Images/SVGs/ChatText.svg";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { selectedCurrencyState } from "../../Redux/Action/common";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const windowWidth = useWindowWidth();
  const userRedux = useSelector((state) => state.user);
  const currencyCode = useSelector((state) => state?.common?.currency);
  const [open, setOpen] = useState(false);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [secFactorAuth, setSecFactorAuth] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [smsAuth, setSmsAuth] = useState(false);
  const [smsModal, setSmsModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPWA, setShowPWA] = useState(false);
  const [enterMobile, setEnterMobile] = useState(false);
  const [passkeyDone, setPasskeyDone] = useState(false);
  const [isPassKeyEnabled, setIsPassKeyEnabled] = useState(false);
  const [countryCode, setCountryCode] = useState("sg");
  const [newMobile, setNewMobile] = useState("");
  const [code, setCode] = useState("");
  const token = Cookies.get("auth_inv_token");
  const location = useLocation();
  const pathname = location.pathname;
  const firstSlashIndex = pathname.indexOf("/");
  const routeName = pathname.substring(firstSlashIndex + 1);
  const [currencyVal, setCurrencyVal] = useState(currencyCode);
  const getUserDetail = Cookies.get("user");
  const stringyUser =
    getUserDetail === undefined ? null : JSON.parse(getUserDetail);
  const user = Object.keys(userRedux).length !== 0 ? userRedux : stringyUser;
  const currency = useSelector(
    (state) => state?.dashboards?.DashboardData?.currencyCode
  );
  const [drawerWidth, setDrawerWidth] = useState("378px");

  const accounts = useSelector((state) => state?.wallet?.bankAccount);

  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 768);
  const showFundTranches = localStorage.getItem("showFundTranches") === "true";

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef(null);
  const ref9 = useRef(null);
  const ref10 = useRef(null);
  const ref11 = useRef(null);
  const ref12 = useRef(null);

  // const InvestMenuItems = [
  //   {
  //     key: "0",
  //     label: (
  //       <Link
  //         to={ROUTES.TRANCH_LISTING}
  //         rel="noreferrer"
  //         className={
  //           location.pathname === ROUTES.TRANCH_LISTING ? "title-active" : ""
  //         }
  //       >
  //         Manual Invest
  //       </Link>
  //     ),
  //   },
  //   {
  //     key: "1",
  //     label: (
  //       <Link
  //         to={ROUTES.AUTO_INVEST}
  //         rel="noreferrer"
  //         className={
  //           location.pathname === ROUTES.AUTO_INVEST ? "title-active" : ""
  //         }
  //       >
  //         Auto Invest
  //       </Link>
  //     ),
  //   },
  // ];

  useEffect(() => {
    const updateDrawerWidth = () => {
      if (windowWidth < 576) {
        setDrawerWidth("320px");
      } else {
        setDrawerWidth("80%");
      }
    };
    updateDrawerWidth();
  }, [windowWidth]);

  useEffect(() => {
    getPassKeyToggleStatus()
      .then((res) => {
        setIsPassKeyEnabled(res?.passkeyFeatureEnabled);
      })
      .catch((err) => {
        message.error(
          "Couldn't verify if Passkey login is available. Try again."
        );
        console.error(err);
        setIsPassKeyEnabled(false);
      });
  }, []);

  useEffect(() => {
    setUserInfo(user);
  }, [user, userRedux]);

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
    if (
      user?.hasSeenProductTour === false &&
      user?.productTourEnabled === true
    ) {
      if (windowWidth < 768) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [user, windowWidth]);

  useEffect(() => {
    if (currencyCode && currencyCode !== currencyVal) {
      setCurrencyVal(currencyCode);
    }
  }, [currencyCode]);

  const setCurrencyValue = () => {
    const findCurrencyAccount = (accounts, currencyCode) => {
      return accounts.find((account) => account.currencyCode === currencyCode);
    };

    let account;

    if (userRedux && Object.keys(userRedux).length !== 0) {
      account = findCurrencyAccount(userRedux.accounts, currency);
    } else if (user?.accounts?.length > 0) {
      account = findCurrencyAccount(user.accounts, currency);
    }

    if (account) {
      setCurrencyVal(account.currencyCode);
    } else {
      setCurrencyVal(null);
    }
  };

  useEffect(() => {
    if (!currencyCode) {
      setCurrencyValue();
    }
  }, [userRedux, user, currency, currencyCode]);

  useEffect(() => {
    if (
      (Array.isArray(accounts) && accounts.length === 0) ||
      (typeof accounts === "object" &&
        accounts !== null &&
        Object.keys(accounts).length === 0)
    ) {
      getBankAccountNo();
    }
  }, [accounts]);

  const getBankAccountNo = async () => {
    try {
      const response = await GetBankAccountApi();
      if (response) {
        setAccountDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching bank account number:", error);
      return null;
    }
  };

  const handleChange = (value) => {
    setCurrencyVal(value);
    selectedCurrencyState(value, dispatch);
  };

  const showDrawer = () => {
    setUserDrawerOpen(false);
    setOpen(!open);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showUserDrawer = () => {
    setOpen(false);
    setUserDrawerOpen(!userDrawerOpen);
  };

  const handleLogout = async () => {
    try {
      removeFundAndRecordTag();
      clearAllCookiesForDomain(".kilde.sg");
      clearUserSession();
      Cookies.set("previouslyLoggedIn", true);

      setTimeout(() => {
        window.location.href = ROUTES.LOGIN;
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleInit = () => sendVerificationCode();

  const handlePasskeyRegistration = async () => {
    setLoader(true);

    try {
      const res = await getPassKeyChallenge();
      const publicKeyCredentialCreationOptions = res;

      const attestationResponse = await startRegistration(
        publicKeyCredentialCreationOptions
      );
      const updatedResponse = {
        ...attestationResponse,
        email: userRedux?.email,
      };

      const registerRes = await registerPasskey(updatedResponse);
      message.success(registerRes?.message);
      await getUser().then((res) => {
        setUserInfo(res);
        localStorage.setItem("hasPasskey", res?.passkeyEnabled);
        localStorage.setItem(
          "availableDevices",
          getDeviceNamesFromPasskeys(res?.passkeys)
        );
      });
      if (userRedux?.secondFactorAuth === null) {
        try {
          await enableSMS2FA();
        } catch (err) {
          console.error("Error enabling SMS 2FA:", err);
        }
      }

      setPasskeyDone(true);
    } catch (err) {
      if (err.name === "AbortError" || err.name === "NotAllowedError") {
        message.info("Passkey setup was canceled.");
      } else {
        console.error("Error during passkey registration:", err);
        message.error("Something went wrong.. Please try again.");
      }
    } finally {
      setLoader(false);
    }
  };

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

  const sendVerification = async () => {
    try {
      const res = await sendVerificationCode();

      if (res?.length === 0) {
        showMessageWithCloseIconError("Something went wrong, Try again!");
      } else {
        setSecFactorAuth(res?.type);
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
      setSecFactorAuth("SMS");
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
      } else if (
        user?.secondFactorAuth === "SMS" ||
        user?.secondFactorAuth === "TOTP"
      ) {
        setSmsAuth(true);
        setSmsModal(true);
        sendVerification();
      }
    } catch (error) {
      console.error("Error enabling passkey:", error);
    } finally {
      setLoader(false);
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

  const items = [];

  if (
    userInfo?.secondFactorAuth === null &&
    userInfo?.passkeyEnabled === false
  ) {
    items.push({
      label: (
        <div className="twofa-div">
          <div style={{ display: "flex" }}>
            <div>
              <img
                src={LockOpenIcon}
                alt="twofa"
                style={{ marginRight: "8px" }}
              />
            </div>
            <div>
              <p className="twafa-p m-0">
                <strong>Your account security is low</strong>
                <p style={{ marginTop: 3 }} className="twafa-p m-0">
                  Set up Face ID or Fingerprint for quick and secure login.
                  Protect your account with biometric login.
                </p>
              </p>
              <Button
                onClick={handleEnablePasskey}
                className="button-twofa"
                style={{
                  marginTop: 10,
                  border: "1px solid #ddd",
                }}
              >
                Protect your account
              </Button>
            </div>
          </div>
        </div>
      ),
      key: "0",
    });
  } else if (
    userInfo?.secondFactorAuth === "SMS" &&
    userInfo?.passkeyEnabled === false &&
    isPassKeyEnabled === true
  ) {
    items.push({
      label: (
        <div className="twofa-div-medium">
          <div style={{ display: "flex" }}>
            <div>
              <img
                src={LockOpenIcon}
                alt="twofa"
                style={{ marginRight: "8px" }}
              />
            </div>
            <div>
              <p className="twafa-p m-0">
                <strong>Your account is moderately protected</strong>
                <p style={{ marginTop: 3 }} className="twafa-p m-0">
                  Add a passkey (Face ID, fingerprint, or device password) for
                  stronger account protection.
                </p>
              </p>
              <Button
                onClick={handleEnablePasskey}
                className="button-twofa"
                style={{
                  marginTop: 10,
                  border: "1px solid #ddd",
                  color: "#E6A750",
                }}
              >
                Add Passkey
              </Button>
            </div>
          </div>
        </div>
      ),
      key: "0",
    });
  } else if (
    userInfo?.secondFactorAuth === "TOTP" &&
    userInfo?.passkeyEnabled === false &&
    isPassKeyEnabled === true
  ) {
    items.push({
      label: (
        <div className="twofa-div-medium">
          <div style={{ display: "flex" }}>
            <div>
              <img
                src={LockOpenIcon}
                alt="twofa"
                style={{ marginRight: "8px" }}
              />
            </div>
            <div>
              <p className="twafa-p m-0">
                <strong>Your account is moderately protected</strong>
                <p style={{ marginTop: 3 }} className="twafa-p m-0">
                  Add a passkey (Face ID, fingerprint, or device password) for
                  stronger account protection.
                </p>
              </p>
              <Button
                onClick={handleEnablePasskey}
                className="button-twofa"
                style={{
                  marginTop: 10,
                  border: "1px solid #ddd",
                  color: "#E6A750",
                }}
              >
                Add Passkey
              </Button>
            </div>
          </div>
        </div>
      ),
      key: "0",
    });
  } else if (
    userInfo?.secondFactorAuth === null &&
    userInfo?.passkeyEnabled === true
  ) {
    items.push({
      label: (
        <div className="twofa-div-strong">
          <div style={{ display: "flex" }}>
            <div>
              <img
                src={LockOpenIcon}
                alt="twofa"
                style={{ marginRight: "8px" }}
              />
            </div>
            <div>
              <p className="twafa-p m-0">
                <strong>Your account is strongly protected</strong>
                <p style={{ marginTop: 3 }} className="twafa-p m-0">
                  You’re using Passkey login. For full security, enable a backup
                  2FA method.
                </p>
              </p>
              <Button
                onClick={() => navigate(ROUTES.TWO_FACTOR_AUTH)}
                className="button-twofa"
                style={{
                  marginTop: 10,
                  border: "1px solid #ddd",
                  color: "#67B89B",
                }}
              >
                Add backup 2FA
              </Button>
            </div>
          </div>
        </div>
      ),
      key: "0",
    });
  }

  items.push(
    {
      label: (
        <div className="sb-justify-center-item-center">
          <p className="mt-0 mb-4 user-name-dropdown p-capitalize">
            {user?.firstName + " " + user?.lastName}
          </p>
          <Button
            className={` investor-status-button ${
              user?.investorStatus === "ACTIVE"
                ? "investor-status-button-active"
                : user?.verificationState === "MANUAL_REVIEW"
                ? "investor-status-button-under-review"
                : "investor-status-button-notactive"
            }`}
          >
            {user?.investorStatus === "ACTIVE"
              ? "Verified"
              : user?.verificationState === "MANUAL_REVIEW"
              ? "Under review"
              : "Not verified"}
          </Button>
        </div>
      ),
      className: "user-dropdown-list",
      key: "1",
    },
    {
      label: (
        <Link to={ROUTES.SETTINGS} className="user-dropdown-link">
          <img
            src={Profile_setting_icon}
            alt="setting_icon"
            style={{ marginRight: "4px" }}
          />
          Personal Settings
        </Link>
      ),
      key: "2",
    }
  );

  if (showFundTranches) {
    items.push({
      label: (
        <Link to={ROUTES.HELP_DESK} className="user-dropdown-link">
          <img
            src={Help_Desk}
            alt="setting_icon"
            style={{ marginRight: "4px" }}
          />
          Help Center
        </Link>
      ),
      key: "3",
    });
  }

  items.push({
    label: (
      <div onClick={handleLogout} className="logout-div">
        <img src={Logout_red_icon} alt="logout-img" /> Logout
      </div>
    ),
    key: "4",
  });

  const condition =
    checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
      false &&
    (user?.verificationState === "" ||
      user?.verificationState === null ||
      user?.verificationState === "WAITING_INVESTOR_DATA" ||
      user?.verificationState === "MANUAL_REVIEW") &&
    user?.investorStatus !== "ACTIVE";

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      return null || error;
    }
  };

  const handleDropdownVisibleChange = async (open) => {
    if (open) {
      await getUserDetails();
    }
  };

  // const Investitems = [
  //   {
  //     key: "sub1",
  //     label: "Investments",
  //     children: [
  //       { key: "1", label: "Manual Invest" },
  //       { key: "2", label: "Auto Invest" },
  //     ],
  //   },
  // ];

  // const handleInvestMenuClick = ({ key }) => {
  //   if (key === "1") {
  //     navigate(ROUTES.TRANCH_LISTING);
  //   } else if (key === "2") {
  //     navigate(ROUTES.AUTO_INVEST);
  //   }
  //   onClose();
  // };

  return (
    <div className="p-relative">
      <div className="dashboard-layout-div">
        <div
          className="kilde-dashboard-header"
          style={{
            backgroundColor: userDrawerOpen ? "#F8F7F2" : "#ffffff",
          }}
        >
          <div className="dashboard-main-logo">
            <Link
              to={
                user?.verificationState === "MANUAL_REVIEW" ||
                user?.verificationState === "COMPLETED"
                  ? ROUTES.DASHBOARD
                  : user?.investorType === "COMPANY"
                  ? ROUTES.ORGANIZATION_VERIFICATION
                  : ROUTES.INDIVIDUAL_VERIFICATION
              }
            >
              <img src={Logo} alt="logo" className="sb-logo" />
            </Link>
          </div>
          <div className="dashboard-link-div">
            <div className="dashboard-header-link">
              {condition && (
                <Col className="with-border">
                  <Link
                    ref={ref1}
                    to={
                      user?.investorType === "INDIVIDUAL"
                        ? ROUTES.INDIVIDUAL_VERIFICATION
                        : ROUTES.ORGANIZATION_VERIFICATION
                    }
                    className={
                      "/" + routeName === ROUTES.INDIVIDUAL_VERIFICATION ||
                      "/" + routeName === ROUTES.VERIFICATION ||
                      "/" + routeName === ROUTES.ORGANIZATION_VERIFICATION
                        ? "title-active"
                        : null
                    }
                  >
                    Onboarding
                  </Link>
                </Col>
              )}

              <Col style={{ paddingLeft: condition ? 20 : 0 }}>
                <Link
                  ref={ref4}
                  to={ROUTES.DASHBOARD}
                  className={routeName === "dashboard" ? "title-active" : null}
                >
                  Dashboard
                </Link>
              </Col>
              <Col ref={ref3}>
                {!showFundTranches ? (
                  <Link
                    className={
                      routeName === "tranche-listing" ? "title-active" : null
                    }
                    to={ROUTES.TRANCH_LISTING}
                  >
                    Investments
                  </Link>
                ) : (
                  <div className="dashboard-header-link">
                    <Link
                      className={
                        routeName === "tranche-listing" ? "title-active" : null
                      }
                      to={ROUTES.TRANCH_LISTING}
                    >
                      Investments
                    </Link>
                    <Link
                      className={
                        routeName === "auto-invest" ? "title-active" : null
                      }
                      to={ROUTES.AUTO_INVEST}
                    >
                      Auto-investments
                    </Link>
                  </div>
                )}
              </Col>
              <Col>
                <Link
                  ref={ref5}
                  className={
                    routeName === "account-statement" ? "title-active" : null
                  }
                  to={ROUTES.ACCOUNT_STATEMENT}
                >
                  Account Statement
                </Link>
              </Col>
              <Col>
                <Link
                  ref={ref2}
                  className={routeName === "wallet" ? "title-active" : null}
                  to={ROUTES.WALLET}
                >
                  Wallet
                </Link>
              </Col>
              {user?.investorStatus === "ACTIVE" ? (
                <Col className="Earn-reward-col">
                  <img src={Earn_Reward} alt="" />
                  <Link
                    ref={ref2}
                    className={routeName === "referral" ? "title-active" : null}
                    to={ROUTES.REFERRAL}
                  >
                    Earn Reward
                  </Link>
                </Col>
              ) : null}
            </div>
            {token &&
              token !== "undefined" &&
              window.location.pathname !== ROUTES.LOGIN &&
              window.location.pathname !== ROUTES.REGISTER &&
              window.location.pathname !== ROUTES.SINGPASS_REGISTER &&
              window.location.pathname !== ROUTES.TWO_FA && (
                <div className="dashboard-logo">
                  <div
                    className="amount-selectBox"
                    style={{ position: "relative" }}
                  >
                    <img
                      src={Wallet_Icon}
                      alt="wallet_icon"
                      className="wallet-img"
                    />
                    <Select
                      suffixIcon={<img src={Down_arrow} alt="arr" />}
                      value={currencyVal}
                      style={{
                        width: 120,
                      }}
                      onDropdownVisibleChange={handleDropdownVisibleChange}
                      onChange={handleChange}
                      options={
                        user?.accounts?.length > 0 &&
                        user?.accounts?.map((currency) => ({
                          value: currency.currencyCode,
                          label: `${
                            currency.currencySymbol
                          } ${currency.balance?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`,
                        }))
                      }
                    />
                  </div>
                  {!showFundTranches ? (
                    <Tooltip title="Help desk">
                      <div
                        style={{ color: "#1a202c" }}
                        className="cursor-pointer help-desk-icon"
                        onClick={() => navigate(ROUTES.HELP_DESK)}
                      >
                        <img
                          src={
                            routeName === "help-desk" ? Book_Icon : Book_Icon
                          }
                          alt="help-desk"
                        />
                      </div>
                    </Tooltip>
                  ) : null}

                  {isWideScreen ? (
                    <Tooltip title="Notifications">
                      <div className="desktop-notication-img">
                        <Notification />
                      </div>
                    </Tooltip>
                  ) : null}

                  {!isWideScreen ? (
                    <Tooltip title="Notifications">
                      <div className="cursor-pointer notificatioon-img">
                        <Notification />
                      </div>
                    </Tooltip>
                  ) : null}

                  <div
                    style={{ color: "#1a202c" }}
                    className="cursor-pointer hide-user-img"
                  >
                    <Button
                      className={
                        userDrawerOpen ? "user-btn p-0" : "user-normal-btn p-0"
                      }
                      onClick={showUserDrawer}
                    >
                      <img src={User_frame} alt="user_icon" />
                    </Button>
                  </div>

                  <div className="dashbard-blankheader-actions" ref={ref6}>
                    <Dropdown
                      suffixIcon={<img src={Down_arrow} alt="arr" />}
                      menu={{
                        items,
                        className: "user-dropdown",
                      }}
                      trigger={["click"]}
                      className="p-relative"
                    >
                      <div onClick={(e) => e.preventDefault()}>
                        <Space>
                          <p className="cursor-pointer p-capitalize m-0 fw-600">
                            {user?.firstName + " " + user?.lastName}
                          </p>
                          <div className="p-absolute dropdown-header-arrow ">
                            <img
                              src={Down_arrow}
                              alt="arr"
                              className="mb-8 ml-4"
                            />
                          </div>
                        </Space>
                        <p className="mb-0 mt-5 user-id-tag cursor-pointer">
                          {`User ID: ${user?.number}`}{" "}
                        </p>
                      </div>
                    </Dropdown>
                  </div>
                  <div className="dashbard-blankheader-toggle cursor-pointer">
                    <Button onClick={showDrawer} className="toggle-btn">
                      <img src={Toggle_Icon} alt="toggle_icon" />
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </div>

        <div>{children}</div>
      </div>
      <Drawer
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        key="right-drawer"
        className="drawer tab-drawer auth-drawer"
        // style={{ padding: "0px 20px" }}
        width={drawerWidth}
      >
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--kilde-blue)",
            padding: "8px 20px",
          }}
        >
          <div className="dashboard-main-logo">
            <div>
              <Link to="https://kilde.sg/">
                <img src={Logo} alt="logo" className="sb-logo" />
              </Link>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{ color: "#1a202c" }}
              className="cursor-pointer hide-user-img d-flex gap-4"
              ref={ref12}
            >
              {!showFundTranches ? (
                <Tooltip title="Help desk">
                  <div
                    style={{ color: "#1a202c" }}
                    className="cursor-pointer help-desk-icon-device"
                    onClick={() => {
                      navigate(ROUTES.HELP_DESK);
                      onClose();
                    }}
                  >
                    <img src={Book_Icon} alt="help-desk" />
                  </div>
                </Tooltip>
              ) : null}

              <Button
                className={
                  userDrawerOpen ? "user-btn p-0" : "user-normal-btn p-0"
                }
                onClick={showUserDrawer}
              >
                <img src={User_frame} alt="user_icon" />
              </Button>
            </div>

            <div
              style={{ color: "#1a202c" }}
              className="cursor-pointer hide-user-img"
            >
              <Button
                className={
                  userDrawerOpen ? "user-btn p-0" : "user-normal-btn p-0"
                }
                onClick={onClose}
              >
                <img src={MenuCloseIcon} alt="user_icon" />
              </Button>
            </div>
          </div>
        </div>
        <div className="auth-drawe-sec-div">
          {user?.investorStatus === "ACTIVE" ? (
            <div className="Earn-reward-col">
              <img src={Earn_Reward} alt="" />
              <Link
                ref={ref2}
                className={routeName === "referral" ? "title-active" : null}
                to={ROUTES.REFERRAL}
              >
                Earn Reward
              </Link>
            </div>
          ) : null}
          {condition && (
            <div className="mb-20" ref={ref7}>
              <Link
                to={
                  user?.investorType === "INDIVIDUAL"
                    ? ROUTES.INDIVIDUAL_VERIFICATION
                    : ROUTES.ORGANIZATION_VERIFICATION
                }
                onClick={onClose}
                className={
                  "/" + routeName === ROUTES.INDIVIDUAL_VERIFICATION ||
                  "/" + routeName === ROUTES.VERIFICATION ||
                  "/" + routeName === ROUTES.ORGANIZATION_VERIFICATION
                    ? "title-active"
                    : null
                }
                ref={ref7}
              >
                {/* <img src={Onboarding} alt="onboarding" />{" "} */}
                <span>Onboarding</span>
              </Link>
            </div>
          )}
          <div className="drawer-divider-div">
            <Divider plain />
          </div>
          <div className="mb-20">
            <Link
              to={ROUTES.DASHBOARD}
              className={routeName === "dashboard" ? "title-active" : null}
              ref={ref10}
              onClick={onClose}
            >
              {/* <img src={Dashboard} alt="dashboard" /> */}
              <span>Dashboard</span>
            </Link>
          </div>
          <div className="mb-20" ref={ref9}>
            {!showFundTranches ? (
              <Link
                className={
                  routeName === "tranche-listing" ? "title-active" : null
                }
                to={ROUTES.TRANCH_LISTING}
                onClick={onClose}
              >
                <span>Investments</span>
              </Link>
            ) : (
              <div>
                <Link
                  className={
                    routeName === "tranche-listing"
                      ? "title-active mb-20"
                      : "mb-20"
                  }
                  to={ROUTES.TRANCH_LISTING}
                >
                  Investments
                </Link>
                <Link
                  className={
                    routeName === "auto-invest" ? "title-active mb-20" : "mb-20"
                  }
                  to={ROUTES.AUTO_INVEST}
                >
                  Auto-investments
                </Link>
              </div>
            )}
          </div>
          <div className="mb-20">
            <Link
              className={
                routeName === "account-statement" ? "title-active" : null
              }
              onClick={onClose}
              to={ROUTES.ACCOUNT_STATEMENT}
              ref={ref11}
            >
              {/* <img src={AccountStatement} alt="accountStatement" /> */}
              <span>Account Statement</span>
            </Link>
          </div>
          <div className="mb-20" ref={ref8}>
            <Link
              className={routeName === "wallet" ? "title-active" : null}
              to={ROUTES.WALLET}
              ref={ref8}
              onClick={onClose}
            >
              {/* <img src={wallet} alt="wallet" /> */}
              <span>Wallet</span>
            </Link>
          </div>
        </div>
      </Drawer>

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
            onInit={!smsAuth ? sendVerificatioNon2Fa : handleInit}
            onAuthenticate={
              !smsAuth ? handleNon2fAVerify : handleAuthentication
            }
            secFactorAuth={secFactorAuth}
            loader={loader}
            codes={code}
            mobileNo={user?.mobilePhone}
            usedIn={"AddressChange"}
            // icon={Sms2FaIcon}
            showFooter={true}
            changeContent={true}
            clearOtp={false}
          />
        )}
      </Modal>

      <Modal
        open={passkeyDone}
        // onCancel={() => setSmsModal(false)}
        closable={false}
        footer={null}
      >
        <div className="passkey-done-container">
          <img src={PasskeyDoneIcon} alt="passkey-done" />
          <h3>Passkey set up successfully!</h3>
          <p>
            You’re all set—next time you log in or need to verify your identity,
            just use your passkey.
          </p>
          <ButtonDefault
            style={{ width: "100%" }}
            onClick={() => {
              setPasskeyDone(false);
            }}
            title="Done"
          />
        </div>
      </Modal>

      <Modal
        className="user-drawer-modal"
        open={userDrawerOpen}
        onCancel={() => setUserDrawerOpen(false)}
        maskClosable="true"
        closable="false"
        closeIcon={null}
        footer={null}
        width={340}
        maskStyle={{ backgroundColor: "transparent" }}
      >
        <div className="user-btn-div ">
          {userInfo?.secondFactorAuth === null &&
          userInfo?.passkeyEnabled === false ? (
            <div className="twofa-div">
              <div style={{ display: "flex" }}>
                <div>
                  <img
                    src={LockOpenIcon}
                    alt="twofa"
                    style={{ marginRight: "8px" }}
                  />
                </div>
                <div>
                  <p className="twafa-p m-0">
                    <strong>Your account security is low</strong>
                  </p>
                  <p style={{ marginTop: 3 }} className="twafa-p m-0">
                    Set up Face ID or Fingerprint for quick and secure login.
                    Protect your account with biometric login.
                  </p>
                  <Button
                    onClick={handleEnablePasskey}
                    className="button-twofa"
                    style={{ marginTop: 10, border: "1px solid #ddd" }}
                  >
                    Protect your account
                  </Button>
                </div>
              </div>
            </div>
          ) : userInfo?.secondFactorAuth === "SMS" &&
            userInfo?.passkeyEnabled === false &&
            isPassKeyEnabled === true ? (
            <div className="twofa-div-medium">
              <div style={{ display: "flex" }}>
                <div>
                  <img
                    src={LockOpenIcon}
                    alt="twofa"
                    style={{ marginRight: "8px" }}
                  />
                </div>
                <div>
                  <p className="twafa-p m-0">
                    <strong>Your account is moderately protected</strong>
                  </p>
                  <p style={{ marginTop: 3 }} className="twafa-p m-0">
                    Add a passkey (Face ID, fingerprint, or device password) for
                    stronger account protection.
                  </p>
                  <Button
                    onClick={handleEnablePasskey}
                    className="button-twofa"
                    style={{
                      marginTop: 10,
                      border: "1px solid #ddd",
                      color: "#E6A750",
                    }}
                  >
                    Add Passkey
                  </Button>
                </div>
              </div>
            </div>
          ) : userInfo?.secondFactorAuth === "TOTP" &&
            userInfo?.passkeyEnabled === false &&
            isPassKeyEnabled === true ? (
            <div className="twofa-div-medium">
              <div style={{ display: "flex" }}>
                <div>
                  <img
                    src={LockOpenIcon}
                    alt="twofa"
                    style={{ marginRight: "8px" }}
                  />
                </div>
                <div>
                  <p className="twafa-p m-0">
                    <strong>Your account is moderately protected</strong>
                  </p>
                  <p style={{ marginTop: 3 }} className="twafa-p m-0">
                    Add a passkey (Face ID, fingerprint, or device password) for
                    stronger account protection.
                  </p>
                  <Button
                    onClick={handleEnablePasskey}
                    className="button-twofa"
                    style={{
                      marginTop: 10,
                      border: "1px solid #ddd",
                      color: "#E6A750",
                    }}
                  >
                    Add Passkey
                  </Button>
                </div>
              </div>
            </div>
          ) : userInfo?.secondFactorAuth === null &&
            userInfo?.passkeyEnabled === true ? (
            <div className="twofa-div-strong">
              <div style={{ display: "flex" }}>
                <div>
                  <img
                    src={LockOpenIcon}
                    alt="twofa"
                    style={{ marginRight: "8px" }}
                  />
                </div>
                <div>
                  <p className="twafa-p m-0">
                    <strong>Your account is strongly protected</strong>
                  </p>
                  <p style={{ marginTop: 3 }} className="twafa-p m-0">
                    You’re using Passkey login. For full security, enable a
                    backup 2FA method.
                  </p>
                  <Button
                    onClick={() => navigate(ROUTES.TWO_FACTOR_AUTH)}
                    className="button-twofa"
                    style={{
                      marginTop: 10,
                      border: "1px solid #ddd",
                      color: "#67B89B",
                    }}
                  >
                    Add backup 2FA
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ marginBottom: "20px" }}>
            <div className="sb-justify-center-item-center">
              <p className="mt-0 mb-4 user-name-dropdown p-capitalize">
                {" "}
                {user?.firstName + " " + user?.lastName}
              </p>
              <Button
                className={` investor-status-button ${
                  user?.investorStatus === "ACTIVE"
                    ? "investor-status-button-active"
                    : user?.verificationState === "MANUAL_REVIEW"
                    ? "investor-status-button-under-review"
                    : "investor-status-button-notactive"
                }`}
              >
                {" "}
                {user?.investorStatus === "ACTIVE"
                  ? "Verified"
                  : user?.verificationState === "MANUAL_REVIEW"
                  ? "Under review"
                  : "Not verified"}
              </Button>
            </div>
            <p className="m-0 user-dropdown-name">{user?.email}</p>
            <p className="m-0 user-dropdown-name">
              {`User ID: ${user?.number}`}{" "}
            </p>
          </div>

          <div className="mt-20">
            <Link to={ROUTES.SETTINGS} className="profile-seeting-link">
              <img
                src={Profile_setting_icon}
                alt="setting_icon"
                style={{ marginRight: "4px" }}
              />
              Personal Settings
            </Link>
          </div>
          <div onClick={handleLogout} className="mt-20 logout-div">
            <img src={Logout_red_icon} alt="logout-img" /> Logout
          </div>
        </div>
      </Modal>

      <Modal
        className="user-drawer-modal"
        open={notificationOpen}
        onCancel={() => setNotificationOpen(false)}
        maskClosable="true"
        closable="false"
        closeIcon={null}
        footer={null}
        width={340}
        maskStyle={{ backgroundColor: "transparent" }}
      >
        <div className="user-btn-div ">
          {userInfo?.secondFactorAuth === null &&
          userInfo?.passkeyEnabled === false ? (
            <div className="twofa-div">
              <div style={{ display: "flex" }}>
                <div>
                  <img
                    src={LockOpenIcon}
                    alt="twofa"
                    style={{ marginRight: "8px" }}
                  />
                </div>
                <div>
                  <p className="twafa-p m-0">
                    <strong>Your account security is low</strong>
                  </p>
                  <p style={{ marginTop: 3 }} className="twafa-p m-0">
                    Set up Face ID or Fingerprint for quick and secure login.
                    Protect your account with biometric login.
                  </p>
                  <Button
                    onClick={handleEnablePasskey}
                    className="button-twofa"
                    style={{ marginTop: 10, border: "1px solid #ddd" }}
                  >
                    Protect your account
                  </Button>
                </div>
              </div>
            </div>
          ) : userInfo?.secondFactorAuth === "SMS" &&
            userInfo?.passkeyEnabled === false &&
            isPassKeyEnabled === true ? (
            <div className="twofa-div-medium">
              <div style={{ display: "flex" }}>
                <div>
                  <img
                    src={LockOpenIcon}
                    alt="twofa"
                    style={{ marginRight: "8px" }}
                  />
                </div>
                <div>
                  <p className="twafa-p m-0">
                    <strong>Your account is moderately protected</strong>
                  </p>
                  <p style={{ marginTop: 3 }} className="twafa-p m-0">
                    Add a passkey (Face ID, fingerprint, or device password) for
                    stronger account protection.
                  </p>
                  <Button
                    onClick={handleEnablePasskey}
                    className="button-twofa"
                    style={{
                      marginTop: 10,
                      border: "1px solid #ddd",
                      color: "#E6A750",
                    }}
                  >
                    Add Passkey
                  </Button>
                </div>
              </div>
            </div>
          ) : userInfo?.secondFactorAuth === "TOTP" &&
            userInfo?.passkeyEnabled === false &&
            isPassKeyEnabled === true ? (
            <div className="twofa-div-medium">
              <div style={{ display: "flex" }}>
                <div>
                  <img
                    src={LockOpenIcon}
                    alt="twofa"
                    style={{ marginRight: "8px" }}
                  />
                </div>
                <div>
                  <p className="twafa-p m-0">
                    <strong>Your account is moderately protected</strong>
                  </p>
                  <p style={{ marginTop: 3 }} className="twafa-p m-0">
                    Add a passkey (Face ID, fingerprint, or device password) for
                    stronger account protection.
                  </p>
                  <Button
                    onClick={handleEnablePasskey}
                    className="button-twofa"
                    style={{
                      marginTop: 10,
                      border: "1px solid #ddd",
                      color: "#E6A750",
                    }}
                  >
                    Add Passkey
                  </Button>
                </div>
              </div>
            </div>
          ) : userInfo?.secondFactorAuth === null &&
            userInfo?.passkeyEnabled === true ? (
            <div className="twofa-div-strong">
              <div style={{ display: "flex" }}>
                <div>
                  <img
                    src={LockOpenIcon}
                    alt="twofa"
                    style={{ marginRight: "8px" }}
                  />
                </div>
                <div>
                  <p className="twafa-p m-0">
                    <strong>Your account is strongly protected</strong>
                  </p>
                  <p style={{ marginTop: 3 }} className="twafa-p m-0">
                    You’re using Passkey login. For full security, enable a
                    backup 2FA method.
                  </p>
                  <Button
                    onClick={() => navigate(ROUTES.TWO_FACTOR_AUTH)}
                    className="button-twofa"
                    style={{
                      marginTop: 10,
                      border: "1px solid #ddd",
                      color: "#67B89B",
                    }}
                  >
                    Add backup 2FA
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ marginBottom: "20px" }}>
            <div className="sb-justify-center-item-center">
              <p className="mt-0 mb-4 user-name-dropdown p-capitalize">
                {" "}
                {user?.firstName + " " + user?.lastName}
              </p>
              <Button
                className={` investor-status-button ${
                  user?.investorStatus === "ACTIVE"
                    ? "investor-status-button-active"
                    : user?.investorStatus === "MANUAL_REVIEW"
                    ? "investor-status-button-under-review"
                    : "investor-status-button-notactive"
                }`}
              >
                {" "}
                {user?.investorStatus === "ACTIVE"
                  ? "Verified"
                  : user?.investorStatus === "MANUAL_REVIEW"
                  ? "Under review"
                  : "Not verified"}
              </Button>
            </div>
            <p className="m-0 user-dropdown-name">{user?.email}</p>
            <p className="m-0 user-dropdown-name">
              {`User ID: ${user?.number}`}{" "}
            </p>
          </div>

          <div className="mt-20">
            <Link to={ROUTES.SETTINGS} className="profile-seeting-link">
              <img
                src={Profile_setting_icon}
                alt="setting_icon"
                style={{ marginRight: "4px" }}
              />
              Personal Settings
            </Link>
          </div>
          <div onClick={handleLogout} className="mt-20 logout-div">
            <img src={Logout_red_icon} alt="logout-img" /> Logout
          </div>
        </div>
      </Modal>
      {user?.hasSeenProductTour === false &&
        user?.productTourEnabled === true && (
          <ProductTour
            ref1={isWideScreen ? ref1 : ref7}
            ref2={isWideScreen ? ref2 : ref8}
            ref3={isWideScreen ? ref3 : ref9}
            ref4={isWideScreen ? ref4 : ref10}
            ref5={isWideScreen ? ref5 : ref11}
            ref6={isWideScreen ? ref6 : ref12}
          />
        )}
      <Footer />
      {showPWA && pathname === "/dashboard" && (
        <BottomSheetInstall user={user?.number} />
      )}
    </div>
  );
};

export default DashboardLayout;
