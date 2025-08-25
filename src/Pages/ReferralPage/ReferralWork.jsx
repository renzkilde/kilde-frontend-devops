import { Row, Col } from "antd";
import shareIcon from "../../Assets/Images/SVGs/NumberSquareOne.svg";
import onboardFriend from "../../Assets/Images/SVGs/NumberSquareTwo.svg";
import ReceiveBonus from "../../Assets/Images/SVGs/NumberSquareThree.svg";
import "./style.css";
import ReferralVideo from "./ReferralVideo";

const HowItWorks = () => {
  const steps = [
    {
      title: "Invite your friends",
      description:
        "Share your unique referral code with friends who qualify as Accredited or Expert Investors.",
      icon: shareIcon,
      bgColor: "#e6f4ff",
    },
    {
      title: "They get rewarded",
      description: (
        <div>
          <p className="m-0">
            Your friend gets 3 months of 0% platform fees once their account is
            activated.
          </p>
        </div>
      ),
      icon: onboardFriend,
      bgColor: "#e6faef",
    },
    {
      title: "You get rewarded",
      description: (
        <div>
          <p className="m-0">
            Earn SGD 200 when your friend invests SGD 10,000+ within 30 days of
            activation.
          </p>
        </div>
      ),
      icon: ReceiveBonus,
      bgColor: "#fff9e6",
    },
  ];

  return (
    <div className="how-it-works-wrapper">
      <p className="mt-0 tranch-head mb-20">How It Works</p>

      <Row gutter={[16, 16]}>
        {steps.map((step, index) => (
          <Col xs={24} sm={24} md={8} key={index}>
            <div
              className="how-it-works-card"
              style={{ backgroundColor: step.bgColor }}
            >
              <div>
                <img src={step.icon} alt={step.title} className="step-icon" />
              </div>
              <div>
                <p className="step-title fw-600 m-0">{step.title}</p>
                <p className="referral-tag mt-4 mb-0">{step.description}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <ReferralVideo />
    </div>
  );
};

export default HowItWorks;
