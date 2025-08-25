/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import DashboardLayout from "../../../Layouts/DashboardLayout/DashboardLayout";
import InvestmentToggle from "../Investment/InvestmentToggle";
import ManualInvestment from "../Investment/ManualInvestment";
import AutoInvestment from "../Investment/AutoInvestment";

import buttonActive from "../../../Assets/Images/ButtonActive.svg";
import frame from "../../../Assets/Images/Frame.svg";
import frameActive from "../../../Assets/Images/FrameActive.svg";
import button from "../../../Assets/Images/Button.svg";

import "./style.css";
import FinishOnboarding from "../Investment/FinishOnboarding";
import ActiveUserBanner from "../../Settings/ActiveUserBanner";

import { useDispatch, useSelector } from "react-redux";
import FinishOnboardingModal from "../../../Layouts/DashboardLayout/FinishOnboardingModal";
import { useLocation } from "react-router-dom";
import { setUserDetails } from "../../../Redux/Action/User";
import { getUser } from "../../../Apis/UserApi";
import { allowedUserIds } from "../../../Utils/Constant";
import { useWindowWidth } from "../../../Utils/Reusables";

const TranchListingPage = () => {
  const dispatch = useDispatch();
  const windowWidth = useWindowWidth();
  const [showButtonActive, setShowButtonActive] = useState(true);
  const [showComponent, setShowComponent] = useState("Manual Invest");
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (location.state && location.state.showComponent) {
      setShowComponent(location.state.showComponent);
    }
  }, [location.state]);

  const handleToggle = (e) => {
    setShowComponent(e?.target?.textContent);
  };

  const handleButtonToggle = () => {
    setShowButtonActive((prevShowButtonActive) => !prevShowButtonActive);
  };

  return (
    <div>
      <DashboardLayout>
        <div className="trance-listing-main-div">
          {user?.investorStatus !== "ACTIVE" ||
          (user?.investorStatus === "ACTIVE" && accountNo?.length <= 0) ||
          (user?.secondFactorAuth === null &&
            user?.twoFaCheckEnabled === true) ? (
            <FinishOnboarding />
          ) : null}
          {allowedUserIds.includes(user?.number) ? <ActiveUserBanner /> : null}
          <InvestmentToggle
            handleToggle={handleToggle}
            showComponent={showComponent}
            setShowComponent={setShowComponent}
            showButtonActive={showButtonActive}
            setShowButtonActive={setShowButtonActive}
          />
          <div>
            {showComponent === "Manual Invest" ? (
              <ManualInvestment
                showButtonActive={showButtonActive}
                user={user}
              />
            ) : (
              <>
                {windowWidth <= 768 ? (
                  <div className="dashboard-head-div mt-24 mb-8">
                    <div>
                      <p className="m-0 tranch-head">
                        Your Auto-investment Strategies
                      </p>
                    </div>
                    <div className="currency-btn-div">
                      {showButtonActive ? (
                        <div
                          className="invest-button cursor-pointer"
                          onClick={handleButtonToggle}
                        >
                          <img src={buttonActive} alt="button" />
                          <img src={frame} alt="button" />
                        </div>
                      ) : (
                        <div
                          className="invest-button cursor-pointer"
                          value="passive"
                          onClick={handleButtonToggle}
                        >
                          <img src={button} alt="button" />
                          <img src={frameActive} alt="button" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
                <AutoInvestment
                  showButtonActive={showButtonActive}
                  showLayout={false}
                />
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
      <FinishOnboardingModal
        title="Invest"
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default TranchListingPage;
