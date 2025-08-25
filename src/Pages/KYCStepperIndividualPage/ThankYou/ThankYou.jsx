import React, { useEffect } from "react";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import checkCircle from "../../../Assets/Images/CheckCircle.svg";
import "./style.css";
import { redirectToVue } from "../../../Utils/Helpers";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../Config/Routes";
import { trackVwoEvents } from "../../../Utils/vwoCustomEvents";

const ThankYou = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    trackVwoEvents(user, "MANUAL_REVIEW");
    window?.dataLayer?.push({
      event: "submitForManualReview",
      user_id: user?.number,
      register_method: user?.registrationType,
    });
  }, [user]);
  const handleExplore = () => {
    if (user?.vwoFeatures.redirectApp?.appToRedirect === "vue") {
      redirectToVue(user?.vwoFeatures.redirectApp?.appToRedirect, navigate);
      trackVwoEvents(user, "MANUAL_REVIEW");
    } else {
      navigate(ROUTES.TRANCH_LISTING);
      trackVwoEvents(user, "MANUAL_REVIEW");
    }
  };
  return (
    <div className="thankyou-mainDiv mt-40">
      <div className="kd-thankyou">
        <img
          src={checkCircle}
          alt="CheckCircle"
          style={{ marginBottom: "40px" }}
        />
        <div className="sub-thankyou-div">
          <p className="sb-verification-title m-0">
            Congratulations! Your verification is complete.
          </p>
          <p className="kl-subtitle mt-16">
            Our team is reviewing your documents, which may take 2-3 business
            days. Once approved, you can start investing.
          </p>
          <p className="kl-subtitle mt-0">
            Explore our investment opportunities while our team is reviewing
            your documents. For your security, please activate two-factor
            authentication.
          </p>
          <div style={{ marginTop: 40 }}>
            <ButtonDefault
              title="Explore Investment Opportunities"
              onClick={handleExplore}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
