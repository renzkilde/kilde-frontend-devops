import { Col, Divider } from "antd";
import Info_blue from "../../../Assets/Images/SVGs/Info_blue.svg";
import Info_Yellow from "../../../Assets/Images/SVGs/info_yellow.svg";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../Config/Routes";

const EligibleTaxBenefit = () => {
  const navigate = useNavigate();
  const handleNavigatetoFaq = () => {
    navigate(ROUTES.HELP_DESK, {
      state: { tab: 7 },
    });
  };
  return (
    <Col className="gutter-row eligible-tax-div" md={24} sm={24} xs={24}>
      <div>
        <p className="kl-link mt-0 d-flex eligible-tag gap-4 mb-4">
          <img src={Info_blue} alt="Info_blue" /> Congratulations – You May Be
          Eligible for a Tax Benefit!
        </p>
        <p className="mt-0 mb-16 eligible-tax-text">
          Based on your selected tax residency, you may qualify for a reduced
          withholding tax rate of 5% on your investment income.
        </p>
        <p className="mt-0 mb-16 eligible-tax-text">
          To enjoy this benefit, simply submit a valid Certificate of Tax
          Residency (COR) after completing your onboarding.
        </p>
        <p className="mt-0 mb-0 eligible-tax-text">
          Until a COR is submitted and verified, the standard 15% withholding
          tax will apply in accordance with regulatory guidelines.{" "}
          <span className="learn-more-link" onClick={handleNavigatetoFaq}>
            Learn how to submit a COR and where to get it{" "}
          </span>
          .
        </p>
      </div>
      <Divider className="m-0" />
      <div>
        <p className="kl-link-yellow mt-0 d-flex eligible-tag gap-4 mb-4">
          <img src={Info_Yellow} alt="Info_Yellow" /> A new COR will be required
          at the beginning of each year to maintain your reduced rate
        </p>
        <p className="mt-0 mb-0 eligible-tax-text">
          We'll send you a reminder in January to guide you through the
          submission process.
        </p>
      </div>
    </Col>
  );
};

export default EligibleTaxBenefit;
