import React, { useEffect, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Content } from "antd/es/layout/layout";
import { Col, message, Row, Form } from "antd";
import InputDefault from "../../Components/InputDefault/InputDefault";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import Copy_icon from "../../Assets/Images/SVGs/Copy.svg";
import Coin_icon from "../../Assets/Images/SVGs/coin_blue.svg";
import Copy_white_icon from "../../Assets/Images/SVGs/Copy_white.svg";
import Facebook_icon from "../../Assets/Images/SVGs/Facebook_white.svg";
import Linkedin_icon from "../../Assets/Images/SVGs/Linkedin_white.svg";
import mail_icon from "../../Assets/Images/SVGs/mail_white.svg";
import messenger_icon from "../../Assets/Images/SVGs/Messenger_white.svg";
import telegram_icon from "../../Assets/Images/SVGs/Telegram_white.svg";
import whatsapp_icon from "../../Assets/Images/SVGs/Whatsapp_white.svg";
import Referral_icon from "../../Assets/Images/SVGs/referral_icon.svg";
import ReferralShareButtons from "./SocialReferral";

import "./style.css";
import ReferralWork from "./ReferralWork";
import { setUserDetails } from "../../Redux/Action/User";
import { getUser } from "../../Apis/UserApi";
import { useDispatch, useSelector } from "react-redux";
import ROUTES from "../../Config/Routes";
import ReferralInfo from "./ReferralInfo";

const ReferralPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [openMailLoading, setOpenMailLoading] = useState(false);
  const [emailErrors, setEmailErrors] = useState(false);
  const [email, setEmail] = React.useState("");

  const getUserDetails = React.useCallback(async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }, [dispatch]);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  const handleCopy = (code, text) => {
    navigator.clipboard.writeText(code);
    message.success(`${text} copied to clipboard!`);
  };

  const handleInviteClick = () => {
    if (!email) {
      setEmailErrors(true);
      message.error("Please enter a valid email address");
      return;
    }

    setOpenMailLoading(true);

    try {
      const to = email;
      const referralCode = user?.refferalCode || "UOLU";
      const registerUrl = `${window.location.origin}${ROUTES.REGISTER}?referral=${referralCode}&utm_medium=ref-program&utm_campaign=${user?.number}`;

      const subject = encodeURIComponent(
        "Get 3 Months of Management Fees Free – Join Kilde with My Referral Code!"
      );
      const body = encodeURIComponent(
        `Hi ${
          user?.firstName + " " + user?.lastName
        },\n\nI’ve been using Kilde – a platform that makes investing smarter and easier – and I thought you’d love it too.\n\n🎁 Sign up with my referral code and enjoy 3 months with no management fees!\nIt’s a great way to explore the platform and keep more of your returns.\n\n👉Referral Code: ${referralCode}\n👉Sign up here: ${registerUrl}\n\nLet me know if you have any questions. Happy to help you get started!\n\nCheers,\n ${
          user?.firstName + " " + user?.lastName
        }.`
      );

      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      setTimeout(() => {
        setOpenMailLoading(false);
      }, 5000);
    } catch (err) {
      console.error("Error generating email:", err);
      message.error("Something went wrong while preparing the email.");
      setOpenMailLoading(false);
    }
  };

  return (
    <div>
      <DashboardLayout>
        <Content className="setting-page-div">
          <p className="referaal-inv-typ-head">
            Exclusively for activated users.
          </p>
          <p className="mt-0 mb-12 referral-head">
            Earn SGD 200. Your Friends Enjoy 3 Months with 0% Platform Fees
          </p>
          <p className="referral-sub-head mt-0 mb-24">
            Refer your network to Kilde and receive SGD 200 for each successful
            referral.
          </p>
          <Row className="w-100">
            <ReferralInfo />
          </Row>
          <Row
            gutter={[0, 16]}
            style={{ display: "flex", alignItems: "stretch" }}
          >
            <Col
              xs={24}
              sm={24}
              md={14}
              lg={14}
              className="gutter-row normal-padd-right w-100"
              style={{
                display: "flex",
                flexDirection: window.innerWidth >= 768 ? "column" : "row",
                flex: window.innerWidth >= 768 ? 1 : "initial",
              }}
            >
              <div className="referral-information-div" style={{ flex: 1 }}>
                {/* <div className="referral-code-div mb-40">
                  <div>
                    <p className="mt-0 tranch-head mb-8">Your Referral Code</p>
                    <div className="d-flex gap-4 justify-center align-center">
                      <div>
                        <p className="step-title m-0"> {user?.refferalCode}</p>
                      </div>
                      <div>
                        <img
                          src={Copy_icon}
                          alt="copy"
                          className="cursor-pointer"
                          onClick={() =>
                            handleCopy(user?.refferalCode, "Referral Code")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                <p className="mt-0 tranch-head mb-8">
                  Share Your Referral Link
                </p>
                <p className="mt-0 mb-20 referral-sub-text">
                  Copy and send the referral link or share it on your social
                  media
                </p>
                <div className="d-flex gap-8">
                  <InputDefault
                    type="text"
                    style={{ width: "100%" }}
                    name="Referral Link"
                    required={true}
                    value={`${window.location.origin}${ROUTES.REGISTER}?referral=${user?.refferalCode}`}
                    disabled={true}
                  />
                  <ButtonDefault
                    title={<img src={Copy_white_icon} alt="copy" />}
                    onClick={() =>
                      handleCopy(
                        `${window.location.origin}${ROUTES.REGISTER}?referral=${user?.refferalCode}&utm_medium=ref-program&utm_campaign=${user?.number}`,
                        "Referral Link"
                      )
                    }
                    style={{ width: "auto", padding: "8px" }}
                  />
                  <ReferralShareButtons user={user} />
                </div>
                <p className="mt-40 tranch-head mb-20">
                  Invite Your Friend via Email
                </p>
                <Form
                  onFinish={handleInviteClick}
                  name="wrap"
                  labelCol={{ flex: "110px" }}
                  labelAlign="left"
                  labelWrap
                  wrapperCol={{ flex: 1 }}
                  colon={false}
                >
                  <div className="d-flex gap-8">
                    <InputDefault
                      placeholder="Email"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      value={email}
                      required={true}
                      focusing={emailErrors}
                      validationState={setEmailErrors}
                      errorMsg={"Email is Required"}
                      autoComplete="username webauthn"
                    />
                    <ButtonDefault
                      title="Invite"
                      style={{ width: "auto" }}
                      loading={openMailLoading}
                    />
                  </div>
                </Form>
              </div>
            </Col>
            {/* <Col
              xs={24}
              sm={24}
              md={10}
              lg={10}
              className="gutter-row referral-information-div"
            >
              <p className="mt-0 tranch-head mb-20">Your Referral Details</p>
              <Row className="cursor-pointer mb-16">
                <Col xs={12} lg={12}>
                  <p className="mb-5 mt-0 referral-tag">
                    Total friends invited
                  </p>
                </Col>
                <Col xs={12} lg={12}>
                  <p className="mb-5 mt-0 referral-tag fw-600 sb-text-align-end">
                    {user?.referralCount || 0}
                  </p>
                </Col>
              </Row>
              <div className="reward-section">
                <img src={Coin_icon} alt="coin_icon" className="mb-8" />
                <p className="earn-value mb-4 mt-0">$0.00</p>
                <p className="referral-tag m-0">Your Total Earned Reward</p>
              </div>
            </Col> */}

            <Col
              xs={24}
              sm={24}
              md={10}
              lg={10}
              className="gutter-row referral-information-div"
            >
              <div className="referral-right-wrapper">
                <p className="mt-0 tranch-head mb-20">Your Referral Details</p>
                <Row className="cursor-pointer mb-20">
                  <Col xs={12} lg={12}>
                    <p className="mb-5 mt-0 referral-tag">
                      Total friends invited
                    </p>
                  </Col>
                  <Col xs={12} lg={12}>
                    <p className="mb-5 mt-0 referral-tag fw-600 sb-text-align-end">
                      {user?.referralCount || 0}
                    </p>
                  </Col>
                </Row>

                {/* <div className="reward-section">
                  <img src={Coin_icon} alt="coin_icon" className="mb-8" />
                  <p className="earn-value mb-4 mt-0">$0.00</p>
                  <p className="referral-tag m-0">Your Total Earned Reward</p>
                </div> */}

                <div className="referral-code-div">
                  <div>
                    <p className="mt-0 step-title mb-8">Your Referral Code</p>
                    <div className="d-flex gap-4 justify-center align-center">
                      <div>
                        <p className=" tranch-head m-0">
                          {" "}
                          {user?.refferalCode}
                        </p>
                      </div>
                      <div>
                        <img
                          src={Copy_icon}
                          alt="copy"
                          className="cursor-pointer"
                          onClick={() =>
                            handleCopy(user?.refferalCode, "Referral Code")
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <ReferralWork />
        </Content>
      </DashboardLayout>
    </div>
  );
};

export default ReferralPage;
