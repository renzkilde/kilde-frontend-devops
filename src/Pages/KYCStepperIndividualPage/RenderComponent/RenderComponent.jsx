import InvestorVerification from "../InvestorVerification/InvestorVerification";
import IdentifyProof from "../IdentifyProof/IdentifyProof";
import LivenessPage from "../LivenessPage/LivenessPage";
import PersonalInfo from "../PersonalInfo/PersonalInfo";
import Documents from "../Documents/Documents";
import EntityDocuments from "../../KYCStepperOrganizationPage/EntityDocuments/EntityDocuments";
import { useSelector } from "react-redux";
import { checkStepStatus } from "../../../Utils/Helpers";
import ThankYou from "../ThankYou/ThankYou";
import SubmissionSuccess from "../LivenessPage/SubmissionSuccess";
import { RedirectionToVeriff } from "../../../Utils/RedirectionToVeriff";
import VeriffPage from "../../VeriffPage/VeriffPage";

export const RenderComponent = ({ current, showIdv }) => {
  const user = useSelector((state) => state.user);
  const regtankStatus = useSelector(
    (state) => state?.kycIndividual?.livenessCheck
  );
  const livenessCheck = useSelector(
    (state) => state?.kycIndividual?.identityResponse
  );

  switch (current) {
    case 0:
      return <InvestorVerification />;
    case 1:
      if (user?.singpassUser === true) {
        return <EntityDocuments />;
      } else {
        return <PersonalInfo />;
      }
    case 2:
      if (
        RedirectionToVeriff(user) === true &&
        checkStepStatus(
          user?.waitingVerificationSteps,
          "IDENTITY_VERIFICATION"
        ) === true
      ) {
        return <VeriffPage />;
      } else if (
        RedirectionToVeriff(user) === true &&
        checkStepStatus(
          user?.waitingVerificationSteps,
          "IDENTITY_VERIFICATION"
        ) === true
      ) {
        return <SubmissionSuccess />;
      } else if (showIdv === "showIdv") {
        return <IdentifyProof />;
      } else if (
        checkStepStatus(
          user?.waitingVerificationSteps,
          "IDENTITY_VERIFICATION"
        ) === false ||
        [
          "LIVENESS_PASSED",
          "WAIT_FOR_APPROVAL",
          "Score Generated",
          "COMPLETED",
          "APPROVED",
          "REJECTED",
        ].includes(regtankStatus?.status) ||
        (regtankStatus?.status === null &&
          regtankStatus?.livenessCheckInfo?.verifyStatus ===
            "LIVENESS_PASSED") ||
        regtankStatus?.note === "exceed liveness total limit"
      ) {
        return <SubmissionSuccess />;
      } else if (regtankStatus?.status === "EMAIL_SENT") {
        if (RedirectionToVeriff(user) === true) {
          return <VeriffPage />;
        } else {
          return <IdentifyProof type="EMAIL_SENT" />;
        }
      } else if (
        ["RESUBMISSION", "EXPIRED", "ID_UPLOADED_FAILED"].includes(
          regtankStatus?.status
        )
      ) {
        if (RedirectionToVeriff(user) === true) {
          return <VeriffPage />;
        } else {
          return <IdentifyProof />;
        }
      } else if (
        (livenessCheck?.systemId !== "" &&
          livenessCheck?.systemId !== undefined) ||
        regtankStatus?.status === "ID_UPLOADED" ||
        regtankStatus?.errorCode === "ERROR_VIDEO_FACE_NOT_FOUND" ||
        regtankStatus?.status === "LIVENESS_FAILED"
      ) {
        return <LivenessPage />;
      } else {
        if (RedirectionToVeriff(user) === true) {
          return <VeriffPage />;
        } else {
          return <IdentifyProof />;
        }
      }

    case 3:
      return <Documents />;
    case 4:
      return <EntityDocuments />;
    case 5:
      return <ThankYou />;
    default:
  }
};
