import React, { useEffect, useState } from "react";
import "./footerStyle.css";
import { Link } from "react-router-dom";
import KildeLogo from "../../Assets/Images/kilde-logo-white.svg";

import { Col, Divider, Modal, Row } from "antd";
import { LOGO_LINK, PDF, TRUST_PILOT } from "../../Utils/Constant";
import cookiepolicy from "../../Assets/Pdf/cookie policy.pdf";
import "./style.css";
import { useSelector } from "react-redux";
import JivoChat from "./JivoChat";
import TermsOfUse from "../../Assets/Pdf/Terms of Use.pdf";
import TrustPilotWidget from "./TrustPilotWidget";

const Footer = () => {
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const user = useSelector((state) => state?.user);

  const openPdfModal = () => {
    setPdfModalVisible(true);
  };

  const closePdfModal = () => {
    setPdfModalVisible(false);
  };

  useEffect(() => {
    // Load Typeform script
    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Load Elfsight widget script
    const elfsightScript = document.createElement("script");
    elfsightScript.src = "https://static.elfsight.com/platform/platform.js";
    elfsightScript.setAttribute("data-use-service-core", "");
    elfsightScript.defer = true;
    document.body.appendChild(elfsightScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(elfsightScript);
    };
  }, []);

  return (
    <div className="kd-footer-div">
      <div className="footer-container">
        <div className="first-div kd-footer-sub-logo-sb">
          <div>
            <Link to={LOGO_LINK}>
              <img src={KildeLogo} alt="kildelogo" className="footer-logo" />
            </Link>
          </div>
          <div className="dashboard-footer-tablet-link">
            <div>
              <a href={TermsOfUse}>Qualification Guidelines for Individuals</a>
            </div>
            <div>
              <a href={TermsOfUse}>Terms of Use</a>
            </div>
            <div>
              <Link
                to={cookiepolicy}
                onClick={(e) => {
                  e.preventDefault();
                  // openPdfModal();
                }}
              >
                Cookie Policy
              </Link>
            </div>
            <div>
              <Link to={PDF.PRIVACY_POLICY}>Privacy Policy</Link>
            </div>
            <div>
              <Link to={PDF.COMPLAINT_POLICY}>Complaints policy</Link>
            </div>
          </div>
          {/* end tablet */}
          <div className="policy-m-hide">
            <div className="media-footer">
              <div className="dashboard-footer-link">
                <div>
                  <a href={TermsOfUse}>
                    Qualification Guidelines for Individuals
                  </a>
                </div>
                <div>
                  <a href={TermsOfUse}>Terms of Use</a>
                </div>
                <div>
                  <Link
                    to={cookiepolicy}
                    onClick={(e) => {
                      e.preventDefault();
                      // openPdfModal();
                    }}
                  >
                    Cookie Policy
                  </Link>
                </div>
                <div>
                  <Link to={PDF.PRIVACY_POLICY}>Privacy Policy</Link>
                </div>
                <div>
                  <Link to={PDF.COMPLAINT_POLICY}>Complaints policy</Link>
                </div>
              </div>

              <div className="dashboard-footer-bottom-media-link hide-tablate-address">
                <div className="footer-with-border">
                  <p className="footer-title m-0">
                    20 McCallum Street #19-01, Tokio Marine Centre, Singapore,
                    069046
                  </p>
                </div>
                <div className="footer-with-border">
                  <p className="footer-title m-0">
                    <a href="tel:+65 695 077 68"> +65 695 077 68</a>
                  </p>
                </div>
                <div className="footer-with-border">
                  <p className="footer-title m-0">
                    <a href="mailto:sales@kilde.sg">sales@kilde.sg</a>
                  </p>
                </div>
                <div className="footer-with-border year-link">
                  <div className="footer-title m-0">
                    <p className="mt-4 mb-16">© 2025 Kilde</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sec-div kd-footer-sub">
          <div className="review-footer-main-div media-review">
            <div className="trust-pilot-main-div">
              <TrustPilotWidget />
              <div className="mb-10">
                <Link to={TRUST_PILOT} className="review-text" target="_blank">
                  Give Us a Review on Trustpilot
                </Link>
              </div>
            </div>
            <div
              className="elfsight-app-2f6b8286-747b-4aeb-b5d5-e917446b3b0c"
              data-elfsight-app-lazy
            ></div>
          </div>
          {/* show only into mobile device */}
          <div className="dashboard-footer-media-link">
            <div>
              <a href={TermsOfUse}>Qualification Guidelines for Individuals</a>
            </div>
            <div>
              <a href={TermsOfUse}>Terms of Use</a>
            </div>
            <div>
              <Link
                to={cookiepolicy}
                onClick={(e) => {
                  e.preventDefault();
                  openPdfModal();
                }}
              >
                Cookie Policy
              </Link>
            </div>
            <div>
              <Link to={PDF.PRIVACY_POLICY}>Privacy Policy</Link>
            </div>
            <div>
              <Link to={PDF.COMPLAINT_POLICY}>Complaints policy</Link>
            </div>
          </div>
          {/* end div */}
          <div className="address-l-hide">
            <div className="footer-child-link-div">
              <div className="dashboard-footer-bottom-link">
                <div className="footer-with-border">
                  <p className="footer-title m-0">
                    20 McCallum Street #19-01, Tokio Marine Centre, Singapore,
                    069046
                  </p>
                </div>
                <div className="footer-with-border">
                  <p className="footer-title m-0">
                    <a href="tel:+65 695 077 68"> +65 695 077 68</a>
                  </p>
                </div>
                <div className="footer-with-border">
                  <p className="footer-title m-0">
                    <a href="mailto:sales@kilde.sg">sales@kilde.sg</a>
                  </p>
                </div>
              </div>
              <div>
                <p className="footer-main-title m-0">© 2025 Kilde</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-footer-address-link media-a-class">
        <div className="footer-with-border">
          <p className="footer-title m-0">
            20 McCallum Street #19-01, Tokio Marine Centre, Singapore, 069046
          </p>
        </div>
        <div className="footer-with-border">
          <p className="footer-title m-0">
            <a href="tel:+65 695 077 68"> +65 695 077 68</a>
          </p>
        </div>
        <div className="footer-with-border">
          <p className="footer-title m-0">
            <a href="mailto:sales@kilde.sg">sales@kilde.sg</a>
          </p>
        </div>
      </div>
      <div className="footer-with-border dashboard-footer-address-link">
        <div className="footer-title m-0">
          <p className="mt-28 mb-16">© 2025 Kilde</p>
        </div>
      </div>
      <div className="footer-divider-div">
        <Divider plain />
      </div>
      <Row className="kd-footer-sub-bottom">
        <Col xs={24} sm={24} md={20} lg={15}>
          <p className="footer-botton-title m-0">
            Disclaimer: KILDE PTE LTD is incorporated in Singapore under the
            registration no. 201929587K and holds a Capital Markets Services
            licence (CMS101016) issued by the Monetary Authority of Singapore to
            deal in capital markets products under the Securities and Futures
            Act (Cap. 289) and an Exempted Financial Advisor License under the
            Financial Adviser Act. The information on this website is intended
            for “institutional investors” and “accredited investors”, in
            accordance with the Securities and Futures Act (Cap. 289) of
            Singapore. Information provided on this website does not constitute
            an offer, invitation to invest, solicitation or advice on buying or
            selling financial instruments and other capital market products.
          </p>
        </Col>
      </Row>
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
      <JivoChat user={user} />
    </div>
  );
};

export default Footer;
