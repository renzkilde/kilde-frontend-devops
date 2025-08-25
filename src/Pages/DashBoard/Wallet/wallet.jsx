import React, { useEffect, useRef, useState } from "react";
import FinishOnboardingModal from "../../../Layouts/DashboardLayout/FinishOnboardingModal";
import DashboardLayout from "../../../Layouts/DashboardLayout/DashboardLayout";
import Balance from "./Balance";
import "./Style.css";
import { Col, Row, Tabs } from "antd";
import Deposit from "./Deposit";
import AddBank from "./AddBank";
import Withdraw from "./Withdraw";
import { getUser } from "../../../Apis/UserApi";
import { setUserDetails } from "../../../Redux/Action/User";
import { useDispatch, useSelector } from "react-redux";
import CurrencyExchange from "./CurrencyExchange";
import FinishOnboarding from "../Investment/FinishOnboarding";
import ActiveUserBanner from "../../Settings/ActiveUserBanner";
import { useLocation, useNavigate } from "react-router-dom";
import qrcode from "../../../Assets/Images/paynowqr.svg";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import { allowedUserIds, REQUEST_METHODS } from "../../../Utils/Constant";
import { apiHandlerWithResponseType } from "../../../Utils/Helpers";
import API_ROUTES from "../../../Config/ApiRoutes";

const Wallet = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tabSectionRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  const [tabKey, setTabKey] = useState(
    localStorage.getItem("activeTabKey") || "1"
  );

  const user = useSelector((state) => state.user);
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );

  useEffect(() => {
    if (location?.state?.tabKey) {
      setTabKey(location.state.tabKey);
      localStorage.setItem("activeTabKey", location.state.tabKey);

      // Scroll to tab section if scroll is true
      if (location?.state?.scroll === true && tabSectionRef.current) {
        setTimeout(() => {
          tabSectionRef.current.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }

      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, tabKey: undefined, scroll: undefined },
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    getUserDetails();
    getQR();
  }, []);

  const getUserDetails = async () => {
    const response = await getUser();
    if (response) {
      setUserDetails(response, dispatch);
      return response;
    }
  };

  const getQR = async () => {
    try {
      const response = await apiHandlerWithResponseType(
        REQUEST_METHODS.GET,
        API_ROUTES.WALLET.GET_QR,
        {},
        "blob"
      );

      const blob = response?.data;
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
    } catch (err) {
      console.error("Failed to fetch image blob:", err);
    }
  };

  const onChange = (key) => {
    setTabKey(key);
    localStorage.setItem("activeTabKey", key);
  };

  const handleDeposit = (data) => {
    setShow(data);
  };

  const items = [
    {
      key: "1",
      label: "Deposit",
      children: <Deposit sendData={handleDeposit} />,
    },
    {
      key: "2",
      label: "Withdrawal",
      children: <Withdraw tabKey={tabKey} />,
    },
    {
      key: "3",
      label: "Currency Exchange",
      children: <CurrencyExchange />,
    },
  ];

  // const handleDownload = () => {
  //   const imageUrl = imageSrc;
  //   const link = document.createElement("a");
  //   link.href = imageUrl;
  //   link.download = "paynow.png";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownload = () => {
    if (!imageSrc) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Open image in new tab for manual download
      window.open(imageSrc, "_blank");
    } else {
      // Trigger download for desktop
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = "paynow.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DashboardLayout>
      <div className="wallet-maindiv">
        {user?.investorStatus !== "ACTIVE" ||
        (user?.investorStatus === "ACTIVE" && accountNo?.length <= 0) ||
        (user?.secondFactorAuth === null &&
          user?.twoFaCheckEnabled === true) ? (
          <FinishOnboarding />
        ) : null}
        {allowedUserIds.includes(user?.number) ? <ActiveUserBanner /> : null}
        <p className="mt-0 mb-24 setting-head">Wallet</p>
        <Row className="mt-24 media-borrower-b-row">
          <Balance />
        </Row>
        <Row className="mt-16 media-borrower-b-row">
          <AddBank />
        </Row>
        <div className="scanner-div" ref={tabSectionRef}>
          <Col
            className="gutter-row mt-40"
            xl={17}
            lg={18}
            md={22}
            sm={24}
            xs={24}
          >
            <Tabs
              activeKey={tabKey}
              items={items}
              onChange={onChange}
              className="wallet-tab"
            />
          </Col>
          <div className="qr-maindiv">
            {tabKey === "1" && show === "PayNow" && (
              <div className="qrdiv">
                {imageSrc ? (
                  <img src={imageSrc} alt="Dynamic" className="qr-image" />
                ) : (
                  <p>Loading image...</p>
                )}
                <ButtonDefault title="Save image" onClick={handleDownload} />
              </div>
            )}
          </div>
        </div>
      </div>
      <FinishOnboardingModal
        title="Wallet"
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </DashboardLayout>
  );
};

export default Wallet;
