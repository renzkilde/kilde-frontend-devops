import InvestorVerification from "../InvestorVerification/InvestorVerification";
import ThankYou from "../ThankYou/ThankYou";
import CorporateInformation from "../../KYCStepperOrganizationPage/CorporateInformation/CorporateInformation";

export const KybRenderComponent = (current) => {
  switch (current.current) {
    case 0:
      return <InvestorVerification />;

    case 1:
      return <CorporateInformation />;

    case 2:
      return <ThankYou />;
    default:
  }
};
