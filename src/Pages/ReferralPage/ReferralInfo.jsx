import { Button, Col, Row } from "antd";
import Identify_tickmark from "../../Assets/Images/identify_tickmark.svg";
import Shield_blue from "../../Assets/Images/SVGs/Shield_blue.svg";
import Kilde_Referral_Program from "../../Assets/Pdf/Referral Program Changes T&Cs.pdf";

const ReferralInfo = () => {
  return (
    <Col
      xs={24}
      sm={24}
      md={24}
      lg={24}
      className="referral-information-div w-100"
    >
      <Row gutter={[16, 16]} justify="space-between">
        {/* What You Get */}
        <Col xs={24} md={12}>
          <div className="benefit-box">
            <p className="mt-0 tranch-head mb-20">What You Get</p>
            {/* <p>
              <CheckCircleOutlined className="icon" />
              <strong>SGD 200 cash bonus</strong> for every friend who invests
              at least <strong>SGD 10,000 within 30 days</strong>
            </p> */}
            <div className="referral-notes-tag">
              <div>
                <img
                  src={Identify_tickmark}
                  alt="identify_tickmark"
                  className="mt-4"
                />
              </div>
              <div>
                <strong>SGD 200 cash bonus</strong> for every friend who invests
                at least <strong>SGD 10,000 within 30 days</strong>
              </div>
            </div>
            {/* <p>
              <CheckCircleOutlined className="icon" />
              <strong>No limit</strong> on the number of referrals you can make
            </p> */}
            <div className="referral-notes-tag">
              <div>
                <img
                  src={Identify_tickmark}
                  alt="identify_tickmark"
                  className="mt-4"
                />
              </div>
              <div>
                <strong>No limit</strong> on the number of referrals you can
                make
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="benefit-box">
            <p className="mt-0 tranch-head mb-20">What Your Friend Gets</p>
            <div className="sb-flex-align-center">
              <div className="referral-notes-tag">
                <div>
                  <img
                    src={Identify_tickmark}
                    alt="identify_tickmark"
                    className="mt-4"
                  />
                </div>
                <div>
                  <strong>0.5% platform fee waiver</strong> for the first{" "}
                  <strong>3 months</strong> after investing.
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <div className="info-box">
        <div className="referral-notes-tag info-text">
          <div>
            <img src={Shield_blue} alt="Shield_blue" className="mt-4" />
          </div>
          <div>
            With clear eligibility terms, an intuitive dashboard, this program
            offers a secure and rewarding experience for both you and your
            friends. For more information read our full Terms and Conditions.
          </div>
        </div>
        <div className="w-100 sb-text-align-end">
          <Button
            type="default"
            className="terms-btn"
            onClick={() => window.open(Kilde_Referral_Program, "_blank")}
          >
            Read Terms and Conditions
          </Button>
        </div>
      </div>
    </Col>
  );
};

export default ReferralInfo;
