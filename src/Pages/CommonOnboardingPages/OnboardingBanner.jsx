import React from "react";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import bannerimg from "../../Assets/Images/bannerimg.svg";
import "./style.css";

const OnboardingBanner = () => {
  const navigate = useNavigate();
  return (
    <div className="onboard-banner-div mb-16 w-100">
      <div className="sb-flex ">
        <img src={bannerimg} alt="bannerimg" style={{ marginRight: "16px" }} />
        <div className="banner-subdiv">
          <p className="mb-0 mt-0 banner-head">
            Discover your investment potential!
          </p>
          <p className="mt-8 mb-0 banner-desc">
            Explore available deals while completing onboarding.
          </p>
        </div>
      </div>
      <ButtonDefault
        title="Explore deals"
        onClick={() => navigate(ROUTES.TRANCH_LISTING)}
      />
    </div>
  );
};

export default OnboardingBanner;
