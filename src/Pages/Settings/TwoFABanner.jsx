import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import bannerImage from "../../Assets/Images/twofabanner.svg";
import ROUTES from "../../Config/Routes";
import closeIcon from "../../Assets/Images/closeIcon.svg";
import { useState } from "react";

const TwoFABanner = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(true);

  return (
    <div className="mb-24">
      {show ? (
        <div className="twofa-banner-div">
          <div className="twofa-subdiv">
            <div
              style={{ color: "var(--kilde-blue)" }}
              className="twofa-secondsubdiv"
            >
              <img
                src={bannerImage}
                alt="2fa-banner"
                style={{ marginRight: "12px" }}
              />
              {window.innerWidth <= 576 && (
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "24px",
                  }}
                  className="mb-0 mt-0"
                >
                  Secure Your Investments: 2FA Required
                </p>
              )}
            </div>
            <div className="twofa-thirdsubdiv">
              {window.innerWidth > 576 && (
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "24px",
                  }}
                  className="mb-0 mt-0"
                >
                  Secure your account to start investing
                </p>
              )}

              <p
                className="mt-8 mb-0"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "20px",
                }}
              >
                To begin investing, you’ll need to set up biometric login (like
                fingerprint or face ID) or two-factor authentication. It’s
                quick, secure, and required to protect your portfolio.
              </p>
            </div>
          </div>
          <ButtonDefault
            title="Protect your Account"
            onClick={() => navigate(ROUTES.TWO_FACTOR_AUTH)}
          />
          {/* <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              cursor: "pointer",
            }}
            onClick={() => setShow(false)}
          >
            <img src={closeIcon} alt="closeIcon" />
          </div> */}
        </div>
      ) : null}
    </div>
  );
};

export default TwoFABanner;
