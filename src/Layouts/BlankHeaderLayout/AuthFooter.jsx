/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "antd";
import { LOGO_LINK, PDF } from "../../Utils/Constant";
import KildeLogo from "../../Assets/Images/kilde-logo-white.svg";
import cookiepolicy from "../../Assets/Pdf/cookie policy.pdf";
import "./style.css";
import { Link } from "react-router-dom";
import Linkedin from "../../Assets/Images/linkedin.svg";
import Youtube from "../../Assets/Images/youtube.svg";
import X from "../../Assets/Images/x.svg";
import TermsOfUse from "../../Assets/Pdf/Terms of Use.pdf";

const AuthFooter = () => {
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

  return (
    <div>
      <div className="kd-authfooter-div">
        <div className="auth-footer">
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
          </div>
          <div>
            <div className="auth-footer-headers">
              <div className="links auth-footer-width ">
                <p
                  className="mt-0 cursor-pointer"
                  onClick={() => {
                    window.location.href = "https://www.kilde.sg/";
                  }}
                >
                  Individual
                </p>

                <p
                  onClick={() => {
                    window.location.href = "https://www.kilde.sg/familyoffice";
                  }}
                  className="cursor-pointer"
                >
                  Family Office
                </p>
                <p
                  onClick={() => {
                    window.open(
                      "https://mont.kilde.sg/",
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="cursor-pointer"
                >
                  Mont Kilde Fund ↗
                </p>
              </div>
              <div className="links auth-footer-width ">
                <p
                  className="mt-0 cursor-pointer"
                  onClick={() => {
                    window.location.href = "https://www.kilde.sg/statistics";
                  }}
                >
                  {" "}
                  Statistics
                </p>
                <p
                  className="mt-0 cursor-pointer"
                  onClick={() => {
                    window.location.href = "https://www.kilde.sg/borrowers";
                  }}
                >
                  Borrowers
                </p>
                <p
                  onClick={() => {
                    window.location.href = "https://www.kilde.sg/about";
                  }}
                  className="cursor-pointer"
                >
                  About
                </p>
              </div>
              <div className="links auth-footer-width">
                <p
                  onClick={() => {
                    window.location.href = "https://www.kilde.sg/how-it-works";
                  }}
                  className="mt-0 cursor-pointer"
                >
                  How it works
                </p>
                <p
                  className="mt-0 cursor-pointer"
                  onClick={() => {
                    window.location.href =
                      "https://www.kilde.sg/news-and-insights/insights";
                  }}
                >
                  {" "}
                  Insights
                </p>
                <p
                  className="mt-0 cursor-pointer"
                  onClick={() => {
                    window.location.href = "https://www.kilde.sg/faq";
                  }}
                >
                  FAQ
                </p>
                <p
                  className="mt-0 cursor-pointer"
                  onClick={() => {
                    window.location.href = "https://www.kilde.sg/glossary";
                  }}
                >
                  Glossary
                </p>
              </div>
              <div className="links auth-footer-width">
                <p
                  className="mt-0 cursor-pointer"
                  onClick={() => {
                    window.location.href = "https://www.kilde.sg/security";
                  }}
                >
                  Security
                </p>
                <p
                  className="mt-0 cursor-pointer"
                  onClick={() => {
                    window.location.href = "https://www.kilde.sg/contacts";
                  }}
                >
                  Contact
                </p>
                <p
                  onClick={() => {
                    window.location.href =
                      "https://www.kilde.sg/news-and-insights/in-the-press";
                  }}
                  className="cursor-pointer mb-0 mt-0"
                >
                  Press
                </p>
              </div>
            </div>
          </div>
          <div className="social cursor-pointer">
            <p className="mt-0">Social:</p>
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
        <div className="auth-footer-second-div">
          <div className="auth-footer-link">
            <div className="auth-footer-copyright">
              <span>© 2025 Kilde</span>
            </div>
            <div className="auth-footer-links">
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
              constitute an offer, invitation to invest, solicitation or advice
              on buying or selling financial instruments and other capital
              market products.
            </p>
          </Col>
        </Row>
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

export default AuthFooter;
