import React from "react";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { handleFinish } from "../../../Utils/Reusables";
import TwoFABanner from "../../Settings/TwoFABanner";
import BankInfoBanner from "./BankInfoBanner";
import { allowedUserIds } from "../../../Utils/Constant";

const FinishOnboarding = () => {
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();

  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );

  return (
    <>
      {(user?.verificationState === "MANUAL_REVIEW" ||
        user?.verificationState === "COMPLETED") &&
      user?.secondFactorAuth === null &&
      user?.twoFaCheckEnabled === true ? (
        allowedUserIds.includes(user?.number) &&
        user?.secondFactorAuth !== null ? null : (
          <TwoFABanner />
        )
      ) : user?.investorStatus !== "ACTIVE" &&
        (user?.investorType === "INDIVIDUAL" ||
          user?.investorType === "COMPANY") ? (
        <div className="finish-onboard-div mb-24">
          <div style={{ color: "var(--kilde-blue)" }}>
            <p style={{ fontSize: 18, fontWeight: 600 }} className="mb-0 mt-0">
              {(user?.verificationState === "" ||
                user?.verificationState === null ||
                user?.verificationState === "WAITING_INVESTOR_DATA") &&
              user?.investorStatus !== "ACTIVE"
                ? user?.investorType === "INDIVIDUAL"
                  ? "Welcome to Kilde!"
                  : "Your Kilde Corporate Account is Created!"
                : null}
            </p>
            {user?.verificationState === "MANUAL_REVIEW" &&
            user?.investorStatus !== "ACTIVE" ? (
              user?.investorType === "INDIVIDUAL" ? (
                <p
                  style={{ fontSize: 18, fontWeight: 600 }}
                  className="mb-0 mt-0"
                >
                  Your account is under manual review!
                </p>
              ) : (
                <p
                  style={{ fontSize: 18, fontWeight: 600 }}
                  className="mb-0 mt-0"
                >
                  Your Kilde Corporate Account is Created!
                </p>
              )
            ) : null}

            <p
              className="mt-8 mb-0"
              style={{ fontSize: "14px", lineHeight: "20px" }}
            >
              {(user?.verificationState === "" ||
                user?.verificationState === null ||
                user?.verificationState === "WAITING_INVESTOR_DATA") &&
              user?.investorStatus !== "ACTIVE"
                ? user?.investorType === "INDIVIDUAL"
                  ? "To access our full range of investment opportunities, please complete the onboarding process."
                  : "Explore our platform while our sales team contacts you to complete your KYB and onboarding process. Deposits, investments & withdrawals after activation."
                : user?.investorType === "INDIVIDUAL"
                ? "Your account is under manual review. It will take 2-3 working days before it can be activated. Please explore opportunities in the meantime."
                : user?.investorStatus !== "ACTIVE"
                ? "Explore our platform while our sales team contacts you to complete your KYB and onboarding process. Deposits, investments & withdrawals after activation."
                : ""}
            </p>
          </div>
          {(user?.verificationState === "" ||
            user?.verificationState === null ||
            user?.verificationState === "WAITING_INVESTOR_DATA") &&
          user?.investorStatus !== "ACTIVE" ? (
            <ButtonDefault
              title="Finish Onboarding"
              onClick={() => handleFinish(user, navigate)}
            />
          ) : null}
        </div>
      ) : user?.investorStatus === "ACTIVE" && accountNo?.length <= 0 ? (
        <BankInfoBanner />
      ) : null}
    </>
  );
};

export default FinishOnboarding;
