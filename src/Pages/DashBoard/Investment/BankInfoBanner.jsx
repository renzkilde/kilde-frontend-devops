import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import ROUTES from "../../../Config/Routes";
import closeIcon from "../../../Assets/Images/closeIcon.svg";
import { useState } from "react";
import { setBankInfoModal } from "../../../Redux/Action/Wallet";
import { useDispatch } from "react-redux";

const BankInfoBanner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [show, setShow] = useState(true);

  const handleNavigate = () => {
    setBankInfoModal(true, dispatch);
    navigate(ROUTES.WALLET);
  };

  return (
    <div className="mb-24">
      {show ? (
        <div className="twofa-banner-div">
          <div className="twofa-subdiv">
            <div
              style={{ color: "var(--kilde-blue)" }}
              className="twofa-secondsubdiv"
            >
              {window.innerWidth <= 576 && (
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "24px",
                  }}
                  className="mb-0 mt-0"
                >
                  Bank information are required.
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
                  Bank information are required.
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
                Please provide your banking information to make a deposit and
                start investing.
              </p>
            </div>
          </div>
          <ButtonDefault
            title=" Add Banking Information"
            onClick={handleNavigate}
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

export default BankInfoBanner;
