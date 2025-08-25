import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../../Layouts/DashboardLayout/DashboardLayout";
import FinishOnboarding from "../Investment/FinishOnboarding";
import NewInvestmentToggle from "./NewInvestmentToggle";
import NewManualInvestment from "./NewManualInvestment";
import "./newStyle.css";
import { useEffect } from "react";
import { getUser } from "../../../Apis/UserApi";
import { setUserDetails } from "../../../Redux/Action/User";
import { allowedUserIds } from "../../../Utils/Constant";
import ActiveUserBanner from "../../Settings/ActiveUserBanner";
import { setTranchFilter } from "../../../Redux/Action/Dashboard";
const NewTrancheListing = () => {
  const dispatch = useDispatch();
  const [showButtonActive, setShowButtonActive] = useState(true);
  const [showComponent, setShowComponent] = useState("all");
  const user = useSelector((state) => state.user);
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );

  useEffect(() => {
    if (showComponent === "all") {
      setTranchFilter({ data: { dealStatus: [] } }, dispatch);
    }
  }, [showComponent, dispatch]);

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
          <NewInvestmentToggle
            setShowComponent={setShowComponent}
            showComponent={showComponent}
          />
          <div>
            {/* {showComponent === "Manual Invest" ? ( */}
            <NewManualInvestment
              showButtonActive={showButtonActive}
              user={user}
              setShowButtonActive={setShowButtonActive}
              showComponent={showComponent}
              setShowComponent={setShowComponent}
            />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default NewTrancheListing;