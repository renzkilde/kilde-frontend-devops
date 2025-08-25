import InvestorVerification from "../../KYCStepperIndividualPage/InvestorVerification/InvestorVerification";
import CorporateInformation from "../CorporateInformation/CorporateInformation";
import CorporateThankYou from "../CorporateThankYou.jsx/CorporateThankYou";

export const RenderOrganizationComponent = (current) => {
  switch (current.current) {
    case 0:
      return <InvestorVerification />;
    case 1:
      return <CorporateInformation />;
    case 2:
      return <CorporateThankYou />;
    default:
      return null;
  }
};
