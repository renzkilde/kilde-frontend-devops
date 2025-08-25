import React, { useState } from "react";
import Logo from "../../Assets/Images/logo.svg";

import Logo_white from "../../Assets/Images/kilde-logo-white.svg";
import Right_arrow from "../../Assets/Images/Icons/right_arrow.svg";
import Down_arrow from "../../Assets/Images/Icons/down_black_arrow.svg";
import authDrawer from "../../Assets/Images/authDrawer.svg";
import authDrawer_Close_Icon from "../../Assets/Images/auth_close_icon.svg";
import right_black_arrow from "../../Assets/Images/Icons/right_black_arrow.svg";

import StepperRightHeader from "../../Pages/VerificationPage/StepperRightHeader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LOGO_LINK } from "../../Utils/Constant";
import { Button, Col, Drawer, Dropdown, Menu, Space } from "antd";
import ROUTES from "../../Config/Routes";
import AuthFooter from "./AuthFooter";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const firstSlashIndex = pathname.indexOf("/");
  const routeName = pathname.substring(firstSlashIndex + 1);

  const InvestorMenuItems = [
    {
      key: "0",
      label: (
        <a href="https://www.kilde.sg" rel="noreferrer">
          Individual
        </a>
      ),
    },
    {
      key: "1",
      label: (
        <a href="https://www.kilde.sg/familyoffice" rel="noreferrer">
          Family Office
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a href="https://mont.kilde.sg/" rel="noreferrer" target="_blank">
          Mont Kilde Fund ↗
        </a>
      ),
    },
  ];

  const aboutMenuItems = [
    {
      key: "0",
      label: (
        <a href="https://www.kilde.sg/about" rel="noreferrer">
          About Kilde
        </a>
      ),
    },
    {
      key: "1",
      label: (
        <a href="https://www.kilde.sg/how-it-works" rel="noreferrer">
          How it works
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a href="https://www.kilde.sg/team" rel="noreferrer">
          Our Team
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a href="https://www.kilde.sg/faq" rel="noreferrer">
          FAQ
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a href=" https://www.kilde.sg/glossary" rel="noreferrer">
          Glossary
        </a>
      ),
    },
  ];

  const InsightsMenuItems = [
    {
      key: "0",
      label: (
        <a
          href="https://www.kilde.sg/news-and-insights/insights"
          rel="noreferrer"
        >
          Our Insights
        </a>
      ),
    },
    {
      key: "1",
      label: (
        <a
          href="https://www.kilde.sg/news-and-insights/basics-of-investing"
          rel="noreferrer"
        >
          Basics of Investing
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          href="https://www.kilde.sg/news-and-insights/reviews-comparisons"
          rel="noreferrer"
        >
          Reviews & Comparisons
        </a>
      ),
    },
    {
      key: "3", // Fixed duplicate key issue
      label: (
        <a
          href="https://www.kilde.sg/news-and-insights/in-the-press"
          rel="noreferrer"
        >
          Kilde in the News
        </a>
      ),
    },
  ];

  const menuItems = [
    {
      key: "investors",
      label: "Investors",
      children: [
        {
          key: "individual",
          label: "Individual",
          href: "https://www.kilde.sg",
        },
        {
          key: "family-office",
          label: "Family Office",
          href: "https://www.kilde.sg/familyoffice",
        },
        {
          key: "mont-kilde-fund",
          label: "Mont Kilde Fund ↗",
          href: "https://mont.kilde.sg/",
          target: "_blank",
        },
      ],
    },
    {
      key: "borrowers",
      label: "Borrowers",
      href: "https://www.kilde.sg/borrowers",
    },
    {
      key: "about",
      label: "About",
      children: [
        {
          key: "about-kilde",
          label: "About Kilde",
          href: "https://www.kilde.sg/about",
        },
        {
          key: "how-it-woks",
          label: "How it works",
          href: "https://www.kilde.sg/how-it-works",
        },
        {
          key: "our-team",
          label: "Our Team",
          href: "https://www.kilde.sg/team",
        },
        {
          key: "faq",
          label: "FAQ",
          href: "https://www.kilde.sg/faq",
        },
        {
          key: "glossary",
          label: "Glossary",
          href: "https://www.kilde.sg/glossary",
        },
      ],
    },
    {
      key: "insights",
      label: "Insights",
      children: [
        {
          key: "our-insights",
          label: "Our insights",
          href: "https://www.kilde.sg/news-and-insights/insights",
        },
        {
          key: "basics-of-investing",
          label: "Basics of investing",
          href: "https://www.kilde.sg/news-and-insights/basics-of-investing",
        },
        {
          key: "reviews-comparisons",
          label: "Reviews & comparisons",
          href: "https://www.kilde.sg/news-and-insights/reviews-comparisons",
        },
        {
          key: "kilde-in-the-news",
          label: "Kilde in the news",
          href: "https://www.kilde.sg/news-and-insights/in-the-press",
        },
      ],
    },
    {
      key: "statistics",
      label: "Statistics",
      href: "https://www.kilde.sg/statistics",
    },
  ];

  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <Menu.SubMenu
            key={item.key}
            title={item.label}
            className="auth-submenu"
          >
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      if (item.href) {
        return (
          <Menu.Item key={item.key}>
            <a href={item.href} rel="noreferrer" target={item.target}>
              {item.label}
            </a>
          </Menu.Item>
        );
      }
      return <Menu.Item key={item.key}>{item.label}</Menu.Item>;
    });
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
                      <Col className="custom-dropdown-col">
                        <Dropdown
                          className="cursor-pointer"
                          menu={{
                            className: "auth-dropdown",
                            items: InvestorMenuItems,
                          }}
                          trigger={["click"]}
                          placement="bottom"
                        >
                          <span className="main-anchor">
                            <Space>
                              Investors
                              <img src={Down_arrow} alt="arr" />
                            </Space>
                          </span>
                        </Dropdown>
                      </Col>

                      <Col>
                        <Link
                          className="auth-tab"
                          to="https://www.kilde.sg/borrowers"
                        >
                          Borrowers
                        </Link>
                      </Col>

                      <Col className="custom-dropdown-col">
                        <Dropdown
                          className="cursor-pointer"
                          menu={{
                            className: "auth-dropdown",
                            items: aboutMenuItems,
                          }}
                          trigger={["click"]}
                          placement="bottom"
                        >
                          <span className="main-anchor">
                            <Space>
                              About
                              <img src={Down_arrow} alt="arr" />
                            </Space>
                          </span>
                        </Dropdown>
                      </Col>

                      <Col className="custom-dropdown-col">
                        <Dropdown
                          className="cursor-pointer"
                          menu={{
                            className: "auth-dropdown",
                            items: InsightsMenuItems,
                          }}
                          trigger={["click"]}
                          placement="bottom"
                        >
                          <span className="main-anchor">
                            <Space>
                              Insights
                              <img src={Down_arrow} alt="arr" />
                            </Space>
                          </span>
                        </Dropdown>
                      </Col>

                      <Col>
                        <Link
                          className="auth-tab"
                          to="https://www.kilde.sg/statistics"
                        >
                          Statistics
                        </Link>
                      </Col>
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

          <AuthFooter />
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
        className="drawer tab-drawer auth-main-drawer"
        style={{ padding: "0px 20px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: 70,
          }}
        >
          <div className="dashboard-main-logo">
            <div>
              <Link to="https://kilde.sg/">
                <img src={Logo_white} alt="logo" className="auth-drawer-logo" />
              </Link>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{ color: "#1a202c" }}
              className="cursor-pointer hide-user-img"
            >
              <Button
                className="auth-drawer-close-btn"
                onClick={() => {
                  setDrawerVisible(!drawerVisible);
                }}
              >
                <img src={authDrawer_Close_Icon} alt="user_icon" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-15">
          <Menu
            className="auth-drawer-menu-list"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["investors"]}
            mode="inline"
            theme="dark"
          >
            {renderMenuItems(menuItems)}
            {routeName === "register" ? (
              <Button
                className="auth-responsive-login-btn"
                onClick={() => {
                  navigate(ROUTES.LOGIN);
                  setDrawerVisible(!drawerVisible);
                }}
              >
                Log in <img src={right_black_arrow} alt="right_black_arrow" />
              </Button>
            ) : (
              <Button
                className="auth-responsive-login-btn"
                style={{ marginTop: 20 }}
                onClick={() => {
                  navigate(ROUTES.REGISTER);
                  setDrawerVisible(!drawerVisible);
                }}
              >
                Join us <img src={right_black_arrow} alt="right_black_arrow" />
              </Button>
            )}
          </Menu>
        </div>
      </Drawer>
    </div>
  );
};

export default AuthLayout;
