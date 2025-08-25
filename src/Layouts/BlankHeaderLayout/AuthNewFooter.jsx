/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from "react";
import { Col, Menu, Modal, Row } from "antd";
import {
  COMPANY,
  INSIGHTS,
  INVESTOR_CATEGORY,
  LOGO_LINK,
  PDF,
  PLATFORM,
  WHY_KILDE,
} from "../../Utils/Constant";
import KildeLogo from "../../Assets/Images/kilde-logo-white.svg";
import cookiepolicy from "../../Assets/Pdf/cookie policy.pdf";
import "./style.css";
import { Link } from "react-router-dom";
import Linkedin from "../../Assets/Images/linkedin.svg";
import Youtube from "../../Assets/Images/youtube.svg";
import X from "../../Assets/Images/x.svg";
import TermsOfUse from "../../Assets/Pdf/Terms of Use.pdf";

import right_white from "../../Assets/Images/SVGs/CaretRight_white.svg";
import down_white from "../../Assets/Images/SVGs/CaretDown_white.svg";
import { footerMenuItems } from "../../Utils/Reusables";

const AuthNewFooter = () => {
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const closePdfModal = () => {
    setPdfModalVisible(false);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
  };

  return (
    <div>
      <div className="kd-new-authfooter-div">
        <div className="auth-new-footer">
          <div className="new-footer-grid">
            {footerMenuItems.map((section) => (
              <div key={section.key} className="footer-column">
                <h4 className="footer-title">{section.label}</h4>
                <ul className="footer-links">
                  {section.children.map((child) => (
                    <li key={child.key}>
                      {child.type === "link" ? (
                        <Link to={child.link} className="footer-link">
                          {child.label}
                        </Link>
                      ) : child.type === "external" ? (
                        <a
                          href={child.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="footer-link"
                        >
                          {child.label}
                        </a>
                      ) : (
                        <a
                          href={child.link}
                          className="footer-link"
                          onClick={() => setPdfModalVisible(true)}
                        >
                          {child.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="auth-new-footer-drawer-content-div">
            <Menu
              className="footer-menu-div"
              onClick={handleMenuClick}
              defaultOpenKeys={["sub1"]}
              mode="inline"
              items={footerMenuItems}
              expandIcon={({ isOpen }) =>
                isOpen ? (
                  <img src={down_white} alt="down_white" />
                ) : (
                  <img src={right_white} alt="right_white" />
                )
              }
            />
          </div>
        </div>
        <div className="auth-sub-new-footer">
          <div className="auth-new-footer-subdiv">
            <div className="logo auth-logo">
              <Link to={LOGO_LINK}>
                <img
                  src={KildeLogo}
                  alt="kildelogo"
                  style={{ width: "120px", height: "40px" }}
                />
              </Link>
            </div>
            <div>
              <div className="social-icons-div">
                <img
                  className="cursor-pointer"
                  alt="linkedin"
                  src={Linkedin}
                  onClick={() => {
                    window.location.href =
                      "https://www.linkedin.com/company/kilde-financial-technologies/";
                  }}
                ></img>
                <img
                  className="cursor-pointer"
                  alt="x"
                  src={X}
                  onClick={() => {
                    window.location.href = "https://twitter.com/KILDE_FinTech";
                  }}
                ></img>
                <img
                  className="cursor-pointer"
                  alt="x"
                  src={Youtube}
                  onClick={() => {
                    window.location.href = "https://www.youtube.com/@Kilde_SG";
                  }}
                ></img>
              </div>
            </div>
          </div>
          <div className="auth-new-footer-second-div">
            <div className="new-footer-sub-link-div">
              <div className="auth-footer-copyright">
                <span>© 2025 Kilde</span>
              </div>
              <div className="auth-new-footer-links">
                <div>
                  <a href={TermsOfUse}>Terms of Use</a>
                </div>
                <div>
                  <a href="https://www.kilde.sg/cookies">Cookie Policy</a>
                </div>
                <div>
                  <Link to={PDF.COMPLAINT_POLICY}>Complaints policy</Link>
                </div>
                <div>
                  <Link to={PDF.PRIVACY_POLICY}>Privacy Policy</Link>
                </div>
                <div>
                  <a href="https://www.kilde.sg/disclaimers ">Disclaimer</a>
                </div>
              </div>
              <div className="footer-design" style={{ textAlign: "right" }}>
                <a style={{ textAlign: "right" }} href="https://taptap.studio/">
                  Design & Development
                </a>
              </div>
            </div>
            <div className="auth-new-mobile-footer-links">
              <div>
                <a href={TermsOfUse}>Terms of Use</a>
              </div>
              <div>
                <a href="https://www.kilde.sg/cookies">Cookie Policy</a>
              </div>
              <div>
                <Link to={PDF.COMPLAINT_POLICY}>Complaints policy</Link>
              </div>
              <div>
                <Link to={PDF.PRIVACY_POLICY}>Privacy Policy</Link>
              </div>
              <div>
                <a href="https://www.kilde.sg/disclaimers ">Disclaimer</a>
              </div>
            </div>
          </div>
          <Row>
            <Col xs={24} sm={24} md={20} lg={15}>
              <p className="auth-footer-botton-title  m-0">
                Disclaimer: KILDE PTE LTD is incorporated in Singapore under the
                registration no. 201929587K and holds a{" "}
                <a href="https://eservices.mas.gov.sg/fid/institution/detail/236644-KILDE-PTE-LTD">
                  Capital Markets Services licence (CMS101016){" "}
                </a>{" "}
                issued by the Monetary Authority of Singapore to deal in capital
                markets products under the Securities and Futures Act (Cap. 289)
                and an Exempted Financial Advisor License under the Financial
                Adviser Act. The information on this website is intended for
                “institutional investors” and “accredited investors”, in
                accordance with the Securities and Futures Act (Cap. 289) of
                Singapore. Information provided on this website does not
                constitute an offer, invitation to invest, solicitation or
                advice on buying or selling financial instruments and other
                capital market products.
              </p>
            </Col>
          </Row>
        </div>
      </div>
      <Modal
        className="sb-pdf-modal"
        centered
        open={pdfModalVisible}
        onCancel={closePdfModal}
        width={1000}
        footer={null}
      >
        <iframe
          className="mt-20"
          src={cookiepolicy}
          width="100%"
          height="500px"
          title="PDF Viewer"
        />
      </Modal>
    </div>
  );
};

export default AuthNewFooter;
