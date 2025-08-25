import React, { useEffect, useState } from "react";
import { Button } from "antd";
import idvimage from "../../Assets/Images/verifficon.svg";
import numberone from "../../Assets/Images/NumberSquareOne.svg";
import numbertwo from "../../Assets/Images/Numbersquretwo.svg";

import "./style.css";
import { fetchVeriffURL } from "../../Apis/Veriff";
import { useSelector } from "react-redux";

const VeriffPage = () => {
  const [redirectURL, setRedirectURL] = useState("");
  const user = useSelector((state) => state.user);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchVeriffURL()
      .then((res) => {
        setRedirectURL(res?.redirectURL);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <p className="sb-verification-title">Verify Your Identity</p>

      <p className="mt-0 head-userId w-50 ">Let’s get you verified.</p>

      <div
        className="identify-proof-mainDiv mt-40"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="veriff-main-div">
          <img src={idvimage} alt="idv" />
          <p className="idv-text">Let’s get you verified</p>
          <div className="second-div-idv">
            <img src={numberone} alt="idv" />{" "}
            <p className="idv-subtext">
              Upload a valid photo ID (passport, ID, or driver’s license)
            </p>
          </div>
          <div className="second-div-idv">
            <img src={numbertwo} alt="idv" />
            <p className="idv-subtext">
              Just a quick Facial ID for confirmation
            </p>
          </div>
          <a
            href={redirectURL}
            style={{ textDecoration: "none", width: "100%" }}
          >
            <Button
              className="idv-button"
              block={true}
              onClick={() => {
                window?.dataLayer?.push({
                  event: "registerdocs",
                  user_id: user?.number,
                  register_method: user?.registrationType,
                });
              }}
            >
              Start Verification
            </Button>
          </a>
          <p className="veriff-p">
            Your data is encrypted and handled securely in line with privacy
            regulations. These steps help keep your account and our platform
            safe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VeriffPage;
