import React from "react";
import { Row, Col } from "antd";
import PromoBanner from "./PromoBanner";
// import stashfin from "../../Assets/Images/SVGs/stashfin.svg";
// import Monedo from "../../Assets/Images/SVGs/modedo_logo.png";
// import Bull from "../../Assets/Images/SVGs/bull_logo.png";
// import ROUTES from "../../Config/Routes";
// import { useNavigate } from "react-router-dom";

const PromoSection = ({ user }) => {
  // const navigate = useNavigate();
  const getResponsiveSpan = () => {
    switch (promoList.length) {
      case 1:
        return { xs: 24, sm: 24, md: 24, lg: 24 };
      case 2:
        return { xs: 24, sm: 12, md: 12, lg: 12 };
      case 3:
        return { xs: 24, sm: 12, md: 12, lg: 8 };
      default:
        return { xs: 24, sm: 12, md: 8, lg: 6 };
    }
  };

  const promoList = [
    // {
    //   brand: "BullCapital",
    //   title: "Deal Promo!",
    //   description: `<p>For a limited time only, <b>Bull Capital</b> will offer an increased rate of <b>13% p.a.</b> return.</p>`,
    //   dateRange: "21 Jul – 07 Aug 2025",
    //   logo: Bull,
    //   currency: "SGD",
    //   onLearnMore: () => {
    //     window?.dataLayer.push({
    //       event: "banner_click",
    //       content_id: "BullCapital004",
    //       user_id: user?.number,
    //     });
    //     navigate(
    //       `${ROUTES.TRANCH_INVEST}/2ae5a4d8-67bd-4b42-9d75-592443cd600c`,
    //       {
    //         state: { key: "BullCapital" },
    //       }
    //     );
    //   },
    // },
  ];

  const colSpan = getResponsiveSpan();

  return (
    <Row gutter={[16, 16]} justify="start" className="w-100 mb-20">
      {promoList.length > 0 &&
        promoList.map((promo, index) => (
          <Col key={index} {...colSpan} className="w-100">
            <PromoBanner {...promo} promoLength={promoList.length} />
          </Col>
        ))}
    </Row>
  );
};

export default PromoSection;
