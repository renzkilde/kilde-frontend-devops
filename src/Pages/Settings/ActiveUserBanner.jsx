import React from "react";
// import bannerImage from "../../Assets/Images/SVGs/voting.svg";
import bannerImage from "../../Assets/Images/SVGs/annoucement.png";
// import closeIcon from "../../Assets/Images/closeIcon.svg";
import { useState } from "react";
// import { PopupButton } from "@typeform/embed-react";
import { useSelector } from "react-redux";
// import { Button } from "antd";
// import ROUTES from "../../Config/Routes";
// import { useNavigate } from "react-router-dom";
import { PopupButton } from "@typeform/embed-react";

const TwoFABanner = () => {
  // const navigate = useNavigate();
  const user = useSelector((state) => state?.user);

  const [show, setShow] = useState(true);

  // const handleNavigate = () => {
  //   window?.dataLayer?.push({
  //     event: "Stashfin_002_banner",
  //     user_id: user?.number,
  //   });
  //   navigate(`${ROUTES.TRANCH_INVEST}/99799a4b-78ea-43a1-8486-9aead4f4dff1`, {
  //     state: { key: "Stashfin" },
  //   });
  // };

  return (
    <div>
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
                  Share your thoughts with us — Atome, a leader in the "Buy Now
                  Pay Later" service.
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
                  Share your thoughts with us — Atome, a leader in the "Buy Now
                  Pay Later" service.
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
                {/* For the first time ever, <b>Stashfin</b> will offer an increased
                <b> 12.5% p.a.</b> return starting <b>Monday, 23 June</b> –
                available through <b>22 July</b>. */}
                We are exploring a deal with Atome Financial. Your opinion
                matters.
              </p>
            </div>
          </div>
          <PopupButton
            // onClick={handleNavigate}
            id="ypmAS6D6"
            hidden={{
              email: user?.email,
              name: user?.firstName + " " + user?.lastName,
              user_id: user?.number,
            }}
            className="typeform-share-link"
            size={80}
            onReady={() => console.log("Typeform is ready")}
          >
            Take the survey
          </PopupButton>
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
