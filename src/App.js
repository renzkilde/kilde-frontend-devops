import React, { useEffect } from "react";
import {
  Route,
  Routes,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import TwoFAPage from "./Pages/TwoFAPage/TwoFAPage";
import VerificationPage from "./Pages/VerificationPage/VerificationPage";
import KYCStepperIndividualPage from "./Pages/KYCStepperIndividualPage/KYCStepperIndividualPage";
import KYCStepperOrganizationPage from "./Pages/KYCStepperOrganizationPage/KYCStepperOrganizationPage";
import ROUTES from "./Config/Routes";
import { isAuthenticated } from "./Config/authService";
import EmailVerificationPage from "./Pages/EmailVerificationPage/EmailVerificationPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage/ForgotPasswordPage";
import EmailVerifiedPage from "./Pages/EmailVerificationPage/EmailVerifiedPage";
import VerifyPage from "./Pages/EmailVerificationPage/VerifyPage";
import SingpassRegisterPage from "./Pages/SingpassRegisterPage/SingpassRegisterPage";
import KildeAccreditedAccess from "./Pages/KildeAccreditedAccess/KildeAccreditedAccess";
import RejectedUser from "./Pages/KYCStepperIndividualPage/RejectedUser/RejectedUser";
import NotFoundPage from "../src/Pages/NotFound/NotFound.jsx";

import "./App.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "./index.css";
import GlobalVariabels from "./Utils/GlobalVariabels";
import SingpassLoader from "./Pages/SingpassRegisterPage/SingpassLoader";
import TranchListingPage from "./Pages/DashBoard/TranchListingPage/TranchListingPage";
import NewTrancheListing from "./Pages/DashBoard/TranchListingPage/NewTrancheListing.jsx";
import Borrower from "./Pages/DashBoard/Borrower/Borrower";
import Settings from "./Pages/Settings/Settings.jsx";
import ChangePassword from "./Pages/Settings/ChangePassword.jsx";
import AdditionalDocument from "./Pages/Settings/AdditionalDocument.jsx";
import TwoFactorAuth from "./Pages/Settings/TwoFactorAuth.jsx";
import TwofaSms from "./Pages/Settings/Twofa-SMS.jsx";
import TwofaAunthenticatorApp from "./Pages/Settings/Twofa-authapp.jsx";
import AccountStatement from "./Pages/DashBoard/AccountStatement/AccountStatement.jsx";
import Wallet from "./Pages/DashBoard/Wallet/wallet.jsx";
import Dashboard from "./Pages/DashBoard/Dashboard.jsx";
import CreateStrategyPage from "./Pages/CreateStrategyPage/CreateStrategyPage.jsx";
import EditStrategyPage from "./Pages/EditStratergyPage/EditStratergyPage.jsx";
import VeriffPage from "./Pages/VeriffPage/VeriffPage.jsx";
import { trackPage } from "./Utils/Analytics.js";
import { saveUTMUrlToCookie } from "./Utils/Helpers.js";
import { recordFeatures } from "./Apis/UserApi.js";
import HelpDeskPage from "./Pages/HelpDeskPage/HelpDeskPage.jsx";
import HotjarFeedback from "./Pages/HotjarFeedback.jsx";
import SetupPasskey from "./Pages/Settings/SetupPasskey.jsx";
import RegisterV2 from "./Pages/RegisterPage/Register_v2.jsx";
import RegisterEmail from "./Pages/RegisterPage/RegisterEmail.jsx";
import LandingPage from "./Utils/LandingPage.jsx";
import ReferralPage from "./Pages/ReferralPage/ReferralPage.jsx";
import YourInvestmentTerms from "./Pages/Settings/YourInvestmentTerms.jsx";
import SetupPasskeyNo2FA from "./Pages/SetupPasskeyNo2FA/SetupPasskeyNo2FA.jsx";
import SecurityPromptPage from "./Pages/SecurityPromptPage/SecurityPromptPage.jsx";
import AutoInvestment from "./Pages/DashBoard/Investment/AutoInvestment.jsx";

const saveURLToCookie = (url) => {
  document.cookie = `redirectTrancheUrl=${encodeURIComponent(url)}; path=/`;
};

const PrivateRoute = () => {
  if (!isAuthenticated()) {
    const currentURL = window.location.href;
    if (currentURL.includes("/tranche-invest/")) {
      let urlArr = currentURL?.split("/");
      let redirectRoute = `/${urlArr[3]}/${urlArr[4]}`;
      saveURLToCookie(redirectRoute);
    }
    return <Navigate to={ROUTES.LOGIN} />;
  }
  return <Outlet />;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const showFundTranches =
    typeof window !== "undefined" &&
    localStorage.getItem("showFundTranches") === "true";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    trackPage({ name: location.pathname, path: location.pathname }, location);
  }, [location]);

  useEffect(() => {
    if (user?.investorStatus === "REJECTED") {
      navigate(ROUTES.KILDE_REJECTED_USER);
    }
  }, [navigate, user]);

  useEffect(() => {
    saveUTMUrlToCookie();
  }, []);

  const currentUrl = window.location.href;
  if (currentUrl) {
    const urlSearchParams = new URLSearchParams(new URL(currentUrl).search);
    const code = urlSearchParams.get("code");
    if (code) {
      sessionStorage.setItem("sCode", code);
      window.location.href = ROUTES.SINGPASS_REGISTER;
    }
  }

  const currentVersion = GlobalVariabels.NODE_VERSION;
  const currentEnv = GlobalVariabels.NODE_ENV;

  const fetchRecordFeatures = async () => {
    try {
      const response = await recordFeatures();
      localStorage.setItem("recordTag", response?.fullStoryEnabled);
      localStorage.setItem("showFundTranches", response?.showFundTranches);
    } catch (error) {
      console.error("Error fetching record features:", error);
    }
  };

  useEffect(() => {
    const recordTag = localStorage.getItem("recordTag");
    const showFundTranches = localStorage.getItem("showFundTranches");

    if (!(recordTag && showFundTranches)) {
      fetchRecordFeatures();
    }
  }, []);

  return (
    <>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path="" element={<LandingPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.REGISTER_V2} element={<RegisterV2 />} />
        <Route path={ROUTES.REGISTER_V2_EMAIL} element={<RegisterEmail />} />
        <Route
          path={ROUTES.SINGPASS_REGISTER}
          element={<SingpassRegisterPage currentUrl={currentUrl} />}
        />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.VERIFY} element={<VerifyPage />} />
        <Route
          path={ROUTES.KILDE_ACCREDITED_USER}
          element={<KildeAccreditedAccess />}
        />
        <Route path={ROUTES.KILDE_REJECTED_USER} element={<RejectedUser />} />
        <Route path={ROUTES.CALLBACK} element={<SingpassLoader />} />
        <Route path={ROUTES.EMAIL_VERIFIED} element={<EmailVerifiedPage />} />

        {/* PRIVATE ROUTES */}
        <Route element={<PrivateRoute />}>
          <Route
            path={ROUTES.SECURITY_PROMPT}
            element={<SecurityPromptPage />}
          />
          <Route path={ROUTES.TWO_FA} element={<TwoFAPage />} />
          <Route
            path={ROUTES.EMAIL_VERIFICATION}
            element={<EmailVerificationPage />}
          />
          <Route
            path={ROUTES.SETUP_PASSKEY_NO2FA}
            element={<SetupPasskeyNo2FA />}
          />
          <Route path={ROUTES.VERIFICATION} element={<VerificationPage />} />
          <Route
            path={ROUTES.INDIVIDUAL_VERIFICATION}
            element={<KYCStepperIndividualPage />}
          />
          <Route
            path={ROUTES.ORGANIZATION_VERIFICATION}
            element={<KYCStepperOrganizationPage />}
          />

          {/* 🔁 Conditionally Render Route */}
          <Route
            path={ROUTES.TRANCH_LISTING}
            element={
              showFundTranches ? <NewTrancheListing /> : <TranchListingPage />
            }
          />

          <Route path={ROUTES.AUTO_INVEST} element={<AutoInvestment />} />
          <Route
            path={ROUTES.TRANCH_LISTING_NEW}
            element={<TranchListingPage />}
          />
          <Route
            path={`${ROUTES.TRANCH_INVEST}/:slug`}
            element={<Borrower />}
          />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.REFERRAL} element={<ReferralPage />} />
          <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword />} />
          <Route path={ROUTES.SETUP_PASSKEY} element={<SetupPasskey />} />
          <Route
            path={ROUTES.ADDITIONAL_DOCUMENT}
            element={<AdditionalDocument />}
          />
          <Route
            path={ROUTES.YOUR_INVESTMENT_TERMS}
            element={<YourInvestmentTerms />}
          />
          <Route path={ROUTES.TWO_FACTOR_AUTH} element={<TwoFactorAuth />} />
          <Route path={ROUTES.TWO_FA_SMS} element={<TwofaSms />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route
            path={ROUTES.ACCOUNT_STATEMENT}
            element={<AccountStatement />}
          />
          <Route path={ROUTES.WALLET} element={<Wallet />} />
          <Route
            path={ROUTES.TWO_FA_AUTHENTICATEAPP}
            element={<TwofaAunthenticatorApp />}
          />
          <Route
            path={ROUTES.CREATE_STRATEGY}
            element={<CreateStrategyPage />}
          />
          <Route
            path={`${ROUTES.EDIT_STRATEGY}/:slug`}
            element={<EditStrategyPage />}
          />
          <Route path={ROUTES.HELP_DESK} element={<HelpDeskPage />} />
        </Route>

        {/* 404 & test routes */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/test" element={<VeriffPage />} />
        <Route path="/hotjar-feedback" element={<HotjarFeedback />} />
      </Routes>

      {currentEnv === "DEV" && (
        <div className="kl-fixed-text" style={{ marginRight: 30 }}>
          <p style={{ textAlign: "right", color: "#ddd" }}>
            Dev Version: {currentVersion}
          </p>
        </div>
      )}
    </>
  );
}

export default App;
