import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import checkCircle from "../../../Assets/Images/CheckCircle.svg";
import { redirectToVue } from "../../../Utils/Helpers";
import ROUTES from "../../../Config/Routes";

const CorporateThankYou = () => {
  const navigate = useNavigate();
  const getUser = Cookies.get("user");
  const user = JSON.parse(getUser);
  const handleExplore = () => {
    if (user?.vwoFeatures.redirectApp?.appToRedirect === "vue") {
      redirectToVue(user?.vwoFeatures.redirectApp?.appToRedirect, navigate);
    } else {
      navigate(ROUTES.TRANCH_LISTING);
    }
  };
  return (
    <div className="thankyou-mainDiv mt-40">
      <div className="kd-thankyou">
        <img src={checkCircle} alt="CheckCircle" />
        <div className="sub-thankyou-div">
          <p className="sb-verification-title mt-5 mb-10">
            Thank you for setting up your corporate investor account!
          </p>
          <p className="fw-600 mt-0 p-capitalize">
            Dear {user?.firstName + " " + user?.lastName},
          </p>
          <p className="kl-subtitle mt-0">
            We're delighted to have created your corporate account with Kilde.
            Our sales team will be in touch soon to guide you through the next
            steps in the onboarding process.
          </p>
          <p className="kl-subtitle mt-0">
            In the meantime, explore our platform, and reach out to{" "}
            <a href="mailto:sales@kilde.sg" className="fp-link">
              sales@kilde.sg
            </a>{" "}
            if you have any questions.
          </p>
          <p className="kl-subtitle mt-0">
            We look forward to working with you.
          </p>
          <div style={{ marginTop: 40 }}>
            <ButtonDefault
              title="Explore deals"
              onClick={handleExplore}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateThankYou;
