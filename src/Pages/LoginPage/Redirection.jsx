import { setUserDetails } from "../../Redux/Action/User";
import ROUTES from "../../Config/Routes";
import { checkStepStatus, redirectToVue } from "../../Utils/Helpers";
import { setCurrentSate } from "../../Redux/Action/common";
import { triggerResendEmail } from "../EmailVerificationPage/useEmailVerification";

export async function Redirection(
  setLoader,
  profileResponse,
  regtankStatus,
  dispatch,
  navigate,
  redirectApp
) {
  if (profileResponse?.singpassUser === false) {
    if (profileResponse?.investorStatus === "ACTIVE") {
      redirectToVue(redirectApp?.appToRedirect,  navigate);
      setLoader(false);
    } else if (profileResponse?.registrationStep === "EMAIL_VERIFICATION") {
      setUserDetails(profileResponse, dispatch);
      await triggerResendEmail();
      navigate(ROUTES.EMAIL_VERIFICATION);
    } else if (
      profileResponse?.investorType === "INDIVIDUAL" &&
      profileResponse?.waitingVerificationSteps?.length === 0 &&
      profileResponse?.verificationState === "MANUAL_REVIEW"
    ) {
      redirectToVue(redirectApp?.appToRedirect, navigate);
    } else if (
      (profileResponse?.registrationStep === "COMPLETED" &&
        profileResponse?.investorStatus === "VERIFICATION" &&
        profileResponse?.waitingVerificationSteps?.length === 0 &&
        profileResponse?.verificationState === "") ||
      profileResponse?.verificationState === null
    ) {
      navigate(ROUTES.VERIFICATION);
    } else if (
      profileResponse?.registrationStep === "COMPLETED" &&
      profileResponse?.investorStatus === "VERIFICATION" &&
      profileResponse?.waitingVerificationSteps?.length > 0 &&
      profileResponse?.verificationState === "WAITING_INVESTOR_DATA"
    ) {
      if (profileResponse?.investorType === "INDIVIDUAL") {
        if (
          checkStepStatus(
            profileResponse?.waitingVerificationSteps,
            "QUESTIONNAIRE"
          ) === false &&
          checkStepStatus(
            profileResponse?.waitingVerificationSteps,
            "PERSONAL_DETAILS"
          ) === true
        ) {
          setCurrentSate(1, dispatch);
        } else if (
          checkStepStatus(
            profileResponse?.waitingVerificationSteps,
            "PERSONAL_DETAILS"
          ) === false &&
          ([
            "LIVENESS_FAILED",
            "RESUBMISSION",
            "EMAIL_SENT",
            "ID_UPLOADED_FAILED",
          ].includes(regtankStatus?.status) ||
            (checkStepStatus(
              profileResponse?.waitingVerificationSteps,
              "IDENTITY_VERIFICATION"
            ) === true &&
              regtankStatus?.status === undefined))
        ) {
          setCurrentSate(2, dispatch);
        } else if (
          (["COMPLETED", "APPROVED"].includes(regtankStatus?.status) ||
            checkStepStatus(
              profileResponse?.waitingVerificationSteps,
              "IDENTITY_VERIFICATION"
            ) === false) &&
          checkStepStatus(
            profileResponse?.waitingVerificationSteps,
            "DOCUMENTS"
          ) === true
        ) {
          setCurrentSate(3, dispatch);
        } else if (
          checkStepStatus(
            profileResponse?.waitingVerificationSteps,
            "DOCUMENTS"
          ) === false &&
          checkStepStatus(
            profileResponse?.waitingVerificationSteps,
            "PROOF_OF_ACCREDITATION"
          ) === true
        ) {
          setCurrentSate(4, dispatch);
        } else if (
          checkStepStatus(
            profileResponse?.waitingVerificationSteps,
            "PROOF_OF_ACCREDITATION"
          ) === false
        ) {
          if (
            [
              "LIVENESS_FAILED",
              "REJECTED",
              "RESUBMISSION",
              "EMAIL_SENT",
              "ID_UPLOADED_FAILED",
            ].includes(regtankStatus?.status)
          ) {
            setCurrentSate(2, dispatch);
          } else if (
            checkStepStatus(
              profileResponse?.waitingVerificationSteps,
              "DOCUMENTS"
            ) === true
          ) {
            setCurrentSate(3, dispatch);
          } else if (
            [
              ("LIVENESS_PASSED",
              "APPROVED",
              "WAIT_FOR_APPROVAL",
              "Score Generated",
              "COMPLETED"),
            ].includes(regtankStatus?.status) &&
            checkStepStatus(
              profileResponse?.waitingVerificationSteps,
              "DOCUMENTS"
            ) === false
          ) {
            setCurrentSate(5, dispatch);
          }
        }

        navigate(ROUTES.INDIVIDUAL_VERIFICATION);
      } else {
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
        setCurrentSate(1, dispatch);
      }
    } else if (
      profileResponse?.waitingVerificationSteps?.length > 0 &&
      checkStepStatus(
        profileResponse?.waitingVerificationSteps,
        "QUESTIONNAIRE"
      ) === false
    ) {
      if (profileResponse?.investorType === "INDIVIDUAL") {
        navigate(ROUTES.INDIVIDUAL_VERIFICATION);
      } else {
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
      }
    } else if (profileResponse?.verificationState === "MANUAL_REVIEW") {
      if (profileResponse?.investorType === "INDIVIDUAL") {
        navigate(ROUTES.INDIVIDUAL_VERIFICATION);
        setCurrentSate(5, dispatch);
      } else {
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
        setCurrentSate(2, dispatch);
      }
    } else if (profileResponse?.verificationState === "COMPLETED") {
      if (profileResponse?.investorType === "INDIVIDUAL") {
        redirectToVue(redirectApp?.appToRedirect, navigate);
      } else {
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
        setCurrentSate(2, dispatch);
      }
    }
  } else if (profileResponse?.singpassUser === true) {
    if (profileResponse?.investorStatus === "ACTIVE") {
      navigate(ROUTES.DASHBOARD);
      setLoader(false);
    } else if (profileResponse?.registrationStep === "EMAIL_VERIFICATION") {
      setUserDetails(profileResponse, dispatch);
      await triggerResendEmail();
      navigate(ROUTES.EMAIL_VERIFICATION);
    } else if (
      profileResponse?.investorStatus === "VERIFICATION" &&
      profileResponse?.registrationStep === "COMPLETED" &&
      profileResponse?.waitingVerificationSteps?.length > 0 &&
      profileResponse?.verificationState === "WAITING_INVESTOR_DATA"
    ) {
      if (profileResponse?.investorType === "INDIVIDUAL") {
        navigate(ROUTES.INDIVIDUAL_VERIFICATION);
        setCurrentSate(1, dispatch);
      } else {
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
        setCurrentSate(1, dispatch);
      }
    } else if (
      profileResponse?.waitingVerificationSteps?.length > 0 &&
      checkStepStatus(
        profileResponse?.waitingVerificationSteps,
        "QUESTIONNAIRE"
      ) === true
    ) {
      navigate(ROUTES.VERIFICATION);
      setLoader(false);
    } else if (
      checkStepStatus(
        profileResponse?.waitingVerificationSteps,
        "QUESTIONNAIRE"
      ) === false &&
      checkStepStatus(
        profileResponse?.waitingVerificationSteps,
        "PROOF_OF_ACCREDITATION"
      ) === true
    ) {
      setCurrentSate(4, dispatch);
      navigate(ROUTES.INDIVIDUAL_VERIFICATION);
      setLoader(false);
    } else if (
      profileResponse?.waitingVerificationSteps?.length === 0 &&
      profileResponse?.verificationState === "MANUAL_REVIEW"
    ) {
      if (profileResponse?.investorType === "INDIVIDUAL") {
        redirectToVue(redirectApp?.appToRedirect, navigate);
      } else {
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
        setCurrentSate(2, dispatch);
        setLoader(false);
      }
    } else if (
      profileResponse?.registrationStep === "COMPLETED" &&
      profileResponse?.waitingVerificationSteps?.length === 0 &&
      (profileResponse?.verificationState === "" ||
        profileResponse?.verificationState === null)
    ) {
      navigate(ROUTES.VERIFICATION);
      setLoader(false);
    } else {
      redirectToVue(redirectApp?.appToRedirect, navigate);
      setLoader(false);
    }
  } else if (
    profileResponse?.registrationStep === "COMPLETED" &&
    profileResponse?.waitingVerificationSteps?.length === 0
  ) {
    redirectToVue(redirectApp?.appToRedirect, navigate);
    setLoader(false);
  }
}
