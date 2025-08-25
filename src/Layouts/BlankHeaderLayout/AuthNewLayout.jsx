import React, { useEffect, useState } from "react";
import Logo from "../../Assets/Images/logo.svg";
import Right_arrow from "../../Assets/Images/Icons/right_arrow.svg";
import New_auth_down_arrow from "../../Assets/Images/SVGs/down_new_auth_arrow.svg";
import right_black from "../../Assets/Images/SVGs/right_black.svg";
import down_black from "../../Assets/Images/Icons/down_black.svg";
import authDrawer from "../../Assets/Images/authDrawer.svg";
import MenuCloseIcon from "../../Assets/Images/menu-close.svg";

import StepperRightHeader from "../../Pages/VerificationPage/StepperRightHeader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  COMPANY,
  INSIGHTS,
  INVESTOR_CATEGORY,
  LOGO_LINK,
  menuLabels,
  PLATFORM,
  WHY_KILDE,
} from "../../Utils/Constant";
import { Button, Drawer, Dropdown, Menu, Modal } from "antd";
import ROUTES from "../../Config/Routes";
import NavDropdown from "./NavDropdown";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import ButtonIcon from "../../Components/ButtonIcon/ButtonIcon.jsx";
import AuthNewFooter from "./AuthNewFooter.jsx";

const AuthNewLayout = ({ children }) => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const firstSlashIndex = pathname.indexOf("/");
  const routeName = pathname.substring(firstSlashIndex + 1);
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openResponsive, setOpenResponsive] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const YOUTUBE_URL = "https://www.youtube.com/embed/EuNPk8rzFb4";
  useEffect(() => {
    if (openResponsive) {
      setVideoUrl(`${YOUTUBE_URL}?autoplay=1`);
    } else {
      setVideoUrl("");
    }
  }, [openResponsive]);

  const menuItems = [
    {
      key: "investors",
      label: "Investors",
      children: [
        { key: "individual", label: "Individual Investors" },
        { key: "family", label: "Family Office" },
        { key: "fund", label: "Mont Kilde Fund ↗" },
      ],
    },
    {
      key: "why-kilde",
      label: "Why Kilde",
      children: [
        { key: "stats", label: "Statistics" },
        { key: "security", label: "Security" },
        {
          key: "benefits",
          label: "Investing Benefits",
          children: [
            { key: "beat", label: "Beat Inflation" },
            { key: "income", label: "Monthly Passive Income" },
            { key: "put_cash", label: "Put Idle Cash to Work" },
            { key: "returns", label: "Smoothen Portfolio Returns" },
            { key: "impact", label: "Make an Impact on Lives" },
          ],
        },
        {
          key: "compare",
          label: "Compare Kilde",
          children: [
            { key: "endowus", label: "Kilde vs Endowus" },
            { key: "syfe", label: "Kilde vs Syfe" },
            { key: "chocolate", label: "Kilde vs Chocolate Finance" },
            { key: "stashaway", label: "Kilde vs StashAway" },
          ],
        },
      ],
    },
    {
      key: "platform",
      label: "Platform",
      children: [
        { key: "how", label: "How it works" },
        { key: "faq", label: "FAQ" },
        { key: "glossary", label: "Glossary" },
        { key: "borrowers", label: "For Borrowers" },
      ],
    },
    {
      key: "company",
      label: "Company",
      children: [
        { key: "about", label: "About Kilde" },
        { key: "team", label: "Our Team" },
        { key: "contact", label: "Contact Us" },
      ],
    },
    {
      key: "insights",
      label: "Insights",
      children: [
        {
          key: "knowledge",
          label: "Grow Your Knowledge",
          children: [
            { key: "basics", label: "Basics of Investing" },
            { key: "news", label: "Reviews & Comparisons" },
          ],
        },
        {
          key: "media",
          label: "Media & Updates",
          children: [
            { key: "insights", label: "Our Insights" },
            { key: "press", label: "Kilde in the Press" },
            { key: "video", label: "Video Hub" },
          ],
        },
      ],
    },
  ];

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "individual":
        window.location.href = INVESTOR_CATEGORY.INDIVIDUAL;
        break;
      case "family":
        window.location.href = INVESTOR_CATEGORY.FAMILY_OFFICE;
        break;
      case "fund":
        window.location.href = INVESTOR_CATEGORY.MONT_KILDE_FUND;
        break;
      case "stats":
        window.location.href = WHY_KILDE.STATISTICS;
        break;
      case "security":
        window.location.href = WHY_KILDE.SECURITY;
        break;
      case "beat":
        window.location.href = WHY_KILDE.BEAT_INFLATION;
        break;

      case "income":
        window.location.href = WHY_KILDE.MONTHLY_INCOME;
        break;
      case "put_cash":
        window.location.href = WHY_KILDE.PUT_IDLE_MONEY_TO_WORK;
        break;
      case "returns":
        window.location.href = WHY_KILDE.PORTFOLIO_RETURN;
        break;
      case "impact":
        window.location.href = WHY_KILDE.IMPACT_ON_LIVES;
        break;
      case "endowus":
        window.location.href = WHY_KILDE.COMPARE_KILDE;
        break;
      case "syfe":
        window.location.href = WHY_KILDE.KILDE_VS_SYFE;
        break;
      case "chocolate":
        window.location.href = WHY_KILDE.KILDE_VS_CHOCOLATE;
        break;
      case "stashaway":
        window.location.href = WHY_KILDE.KILDE_VS_STASHAWAY;
        break;
      case "how":
        window.location.href = PLATFORM.HOW_WORK;
        break;
      case "faq":
        window.location.href = PLATFORM.FAQ;
        break;
      case "glossary":
        window.location.href = PLATFORM.GLOSSARY;
        break;
      case "borrowers":
        window.location.href = PLATFORM.FOR_BORROWER;
        break;
      case "about":
        window.location.href = COMPANY.ABOUT;
        break;
      case "team":
        window.location.href = COMPANY.TEAM;
        break;
      case "contact":
        window.location.href = COMPANY.CONTACT;
        break;
      case "basics":
        window.location.href = INSIGHTS.BASIC_INVESTING;
        break;
      case "news":
        window.location.href = INSIGHTS.REVIEW;
        break;
      case "insights":
        window.location.href = INSIGHTS.INSIGHT;
        break;
      case "press":
        window.location.href = INSIGHTS.KILDE_PRESS;
        break;
      case "video":
        window.location.href = INSIGHTS.VIDEO_HUB;
        break;
      default:
        break;
    }
    onClose();
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const menuMap = {
    invest: <NavDropdown type="invest" />,
    whyKilde: <NavDropdown type="whyKilde" />,
    platform: (
      <NavDropdown
        type="platform"
        openResponsive={openResponsive}
        setOpenResponsive={setOpenResponsive}
      />
    ),
    company: <NavDropdown type="company" />,
    insights: <NavDropdown type="insights" />,
  };

  return (
    <div>
      <div className="auth-div">
        <div className="layout-div auth-sub-div">
          <div className="sb-logo-container">
            <div className="logoutheader-div">
              <div className="start">
                <Link
                  to={
                    routeName === "forgot-password"
                      ? ROUTES.FORGOT_PASSWORD
                      : routeName === "email-verification"
                      ? ROUTES.EMAIL_VERIFICATION
                      : routeName === "2fa"
                      ? ROUTES.TWO_FA
                      : LOGO_LINK
                  }
                >
                  <img src={Logo} alt="logo" className="kd-logo" />
                </Link>
              </div>
              {window.location.pathname !== ROUTES.EMAIL_VERIFICATION &&
              window.location.pathname !== ROUTES.EMAIL_VERIFIED &&
              window.location.pathname !== ROUTES.SETUP_PASSKEY_NO2FA &&
              window.location.pathname !== ROUTES.SECURITY_PROMPT &&
              window.location.pathname !== ROUTES.TWO_FA ? (
                <>
                  <div className="auth-link-division">
                    <div className="auth-header-link">
                      {[
                        "invest",
                        "whyKilde",
                        "platform",
                        "company",
                        "insights",
                      ].map((key) => (
                        <Dropdown
                          key={key}
                          overlay={
                            <div className="custom-dropdown-wrapper">
                              {menuMap[key]}
                            </div>
                          }
                          trigger={["hover"]}
                          placement="bottomCenter"
                          overlayClassName="custom-overlay"
                          onOpenChange={(open) => {
                            setIsOpen(open);
                            if (open) setActiveMenu(key);
                          }}
                        >
                          <span
                            className={`new-auth-header-link cursor-pointer ${
                              isOpen && activeMenu === key ? "active" : ""
                            }`}
                          >
                            {menuLabels[key]}
                            <img
                              src={New_auth_down_arrow}
                              alt="down_arrow"
                              className={`dropdown-arrow ${
                                isOpen && activeMenu === key ? "rotate" : ""
                              }`}
                            />
                          </span>
                        </Dropdown>
                      ))}

                      <div className="nav__bg--grad" />
                    </div>
                  </div>
                  <div className="end auth-header-btn-div">
                    {routeName !== "rejected-thankyou" ? (
                      routeName === "register" ? (
                        <Button
                          className="auth-layout-login-btn"
                          onClick={() => navigate(ROUTES.LOGIN)}
                        >
                          Log in
                          <img
                            src={Right_arrow}
                            alt="right_arrow"
                            className="ml-5"
                          />
                        </Button>
                      ) : (
                        <Button
                          className="auth-layout-login-btn"
                          onClick={() => navigate(ROUTES.REGISTER)}
                        >
                          Join us
                          <img
                            src={Right_arrow}
                            alt="right_arrow"
                            className="ml-5"
                          />
                        </Button>
                      )
                    ) : null}

                    <div className="auth-drawer-btn">
                      <Button
                        className="auth-layout-signup-btn"
                        onClick={() => {
                          setDrawerVisible(!drawerVisible);
                        }}
                      >
                        <img src={authDrawer} alt="authDrawer" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : null}
              {window.location.pathname !== ROUTES.FORGOT_PASSWORD && (
                <div className="stepper-right-head">
                  <StepperRightHeader />
                </div>
              )}
            </div>
          </div>

          <div className="kl-child-container kl-auth-child-container">
            {children}
          </div>

          <AuthNewFooter />
        </div>
      </div>

      <Drawer
        placement="right"
        closable={false}
        onClose={() => {
          setDrawerVisible(!drawerVisible);
        }}
        open={drawerVisible}
        key="right-drawer"
        className="drawer tab-drawer auth-new-main-drawer"
        style={{ padding: "0px 20px" }}
      >
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "56px",
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
              className="cursor-pointer hide-user-img"
            >
              <Button
                className={
                  drawerVisible ? "user-btn p-0" : "user-normal-btn p-0"
                }
                onClick={onClose}
              >
                <img src={MenuCloseIcon} alt="user_icon" />
              </Button>
            </div>
          </div>
        </div>
        <div className="auth-new-footer-drawer-content-div">
          <Menu
            className="invest-menu-div new-header-menu"
            onClick={handleMenuClick}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={menuItems}
            expandIcon={({ isOpen }) =>
              isOpen ? (
                <img src={down_black} alt="down_white" />
              ) : (
                <img src={right_black} alt="right_white" />
              )
            }
          />
          <div className="flex-column-10">
            <ButtonDefault
              title="Join us"
              style={{ width: "100%" }}
              onClick={() => {
                navigate(ROUTES.REGISTER);
              }}
            />
            <ButtonIcon
              title="Log in"
              className="google-btn"
              onClick={() => {
                navigate(ROUTES.LOGIN);
              }}
            />
          </div>
        </div>
      </Drawer>
      {openResponsive && (
        <Modal
          title="Watch Video"
          centered
          open={openResponsive}
          onCancel={() => {
            setOpenResponsive(false);
            setVideoUrl("");
          }}
          footer={null}
          width="60%"
        >
          <div
            style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
          >
            {openResponsive && videoUrl && (
              <iframe
                key={videoUrl}
                src={videoUrl}
                title="Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                }}
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AuthNewLayout;
