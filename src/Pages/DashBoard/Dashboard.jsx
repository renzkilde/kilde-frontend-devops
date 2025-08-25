/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Col, Layout, Row, Spin, Tabs } from "antd";

import buttonActive from "../../Assets/Images/ButtonActive.svg";
import frame from "../../Assets/Images/Frame.svg";
import frameActive from "../../Assets/Images/FrameActive.svg";
import button from "../../Assets/Images/Button.svg";

import { DashboardApi } from "../../Apis/DashboardApi";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import TotalAssetsCard from "./TotalAssetsCard/TotalAssetsCard";
import EarnedCard from "./EarnedCard/EarnedCard";
import NetAverageProfitCard from "./NetAverageProfitCard/NetAverageProfitCard";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { setDasboardData } from "../../Redux/Action/Dashboards";
import { LoadingOutlined } from "@ant-design/icons";
import InvestmentCard from "./InvestmentCard/InvestmentCard";
import DashboardInvestment from "./DashboardInvestment/DashboardInvestment";
import FinishOnboarding from "./Investment/FinishOnboarding";
import { getUser } from "../../Apis/UserApi";
import { setUserDetails } from "../../Redux/Action/User";
import UpgradeKildePopup from "./UpgradeKildePopup";
import { selectedCurrencyState } from "../../Redux/Action/common";
import ActiveUserBanner from "../Settings/ActiveUserBanner";
import { allowedUserIds } from "../../Utils/Constant";
import {
  getMaxOutstandingCurrency,
  useWindowWidth,
} from "../../Utils/Reusables";
const { Content } = Layout;

const Dashboard = () => {
  const dispatch = useDispatch();
  const windowWidth = useWindowWidth();
  const [showButtonActive, setShowButtonActive] = useState(true);
  const user = useSelector((state) => state?.user);
  const [checked, setChecked] = useState(false);
  const currencyCodeRedux = useSelector((state) => state?.common?.currency);
  const [currencyCode, setCurrencyCode] = useState(() => {
    return currencyCodeRedux || "USD";
  });
  const [DashboardLoader, setDashboardLoader] = useState(false);
  const [upgradeKildeModal, setUpgradeKildeModal] = useState(true);
  const [tabKey, setTabKey] = useState(
    localStorage.getItem("activeTabKey") || "1"
  );
  const [reservedtotalItem, setReservedTotalItem] = useState();

  useEffect(() => {
    localStorage.setItem("activeTabKey", tabKey);
  }, [tabKey]);

  const dashboardData = useSelector(
    (state) => state?.dashboards?.DashboardData?.dashboardRes
  );

  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );

  const handleButtonToggle = () => {
    setShowButtonActive((prevShowButtonActive) => !prevShowButtonActive);
  };

  useEffect(() => {
    if (reservedtotalItem === 0) {
      setTabKey("1");
      localStorage.setItem("activeTabKey", "1");
    }
  }, [reservedtotalItem]);

  useEffect(() => {
    handleDashboarApi();
  }, [currencyCode]);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
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
  };

  const handleDashboarApi = () => {
    setDashboardLoader(true);
    const requestBody = {
      currencyCode: currencyCode,
    };
    DashboardApi(requestBody).then(async (data) => {
      setDasboardData(data, dispatch);
      setDashboardLoader(false);
    });
  };

  useEffect(() => {
    if (
      (localStorage.getItem("currencyCode") === null ||
        getMaxOutstandingCurrency(user.accounts) !==
          localStorage.getItem("currencyCode")) &&
      user?.accounts?.length > 0
    ) {
      const maxCurrency = getMaxOutstandingCurrency(user.accounts);
      localStorage.setItem("currencyCode", maxCurrency);
      setCurrencyCode(maxCurrency);
      selectedCurrencyState(maxCurrency, dispatch);
    } else if (currencyCode) {
      selectedCurrencyState(currencyCode, dispatch);
    }
  }, [user, currencyCode]);

  useEffect(() => {
    if (
      currencyCodeRedux &&
      localStorage.getItem("currencyCode") !== null &&
      currencyCodeRedux !== currencyCode
    ) {
      setCurrencyCode(currencyCodeRedux);
    }
  }, [currencyCodeRedux]);

  const items = [
    {
      key: "1",
      label: "Investments",
      children: "",
    },
    ...(reservedtotalItem > 0
      ? [
          {
            key: "2",
            label: "Reserved Investments",
            children: "",
          },
        ]
      : []),
  ];
  return (
    <div>
      <DashboardLayout>
        <Spin
          className="dashboard-spinner"
          indicator={
            <LoadingOutlined
              style={{ fontSize: 50, color: "var(--kilde-blue)" }}
            />
          }
          spinning={DashboardLoader}
        >
          <Content className="dashboard-page-div">
            {user?.investorStatus !== "ACTIVE" ||
            (user?.investorStatus === "ACTIVE" && accountNo?.length <= 0) ||
            (user?.secondFactorAuth === null &&
              user?.twoFaCheckEnabled === true) ? (
              <FinishOnboarding />
            ) : null}
            {allowedUserIds.includes(user?.number) ? (
              <ActiveUserBanner />
            ) : null}
            <div className="dashboard-head-div">
              <div>
                <h2 className="m-0 borrower-company-title">Overview</h2>
              </div>
              <div className="currency-btn-div">
                <Button
                  onClick={() => setCurrencyCode("USD")}
                  className={
                    currencyCode === "USD"
                      ? "dashboard-currency-active-btn"
                      : "dashboard-currency-btn"
                  }
                >
                  USD
                </Button>
                <Button
                  onClick={() => setCurrencyCode("SGD")}
                  className={
                    currencyCode === "SGD"
                      ? "dashboard-currency-active-btn"
                      : "dashboard-currency-btn"
                  }
                >
                  SGD
                </Button>
                <Button
                  onClick={() => setCurrencyCode("EUR")}
                  className={
                    currencyCode === "EUR"
                      ? "dashboard-currency-active-btn"
                      : "dashboard-currency-btn"
                  }
                >
                  EUR
                </Button>
              </div>
            </div>
            <Row
              className="mt-0 mb-10 media-borrower-b-row"
              gutter={16}
              style={{ display: "flex" }}
            >
              <Col
                className="gutter-row"
                lg={7}
                md={14}
                sm={14}
                xs={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: windowWidth <= 992 ? "10px" : "0",
                }}
              >
                <Row style={{ flex: 1 }}>
                  <Col
                    sm={24}
                    md={24}
                    lg={24}
                    className="gutter-row infomation-div"
                    style={{ flex: 1 }}
                  >
                    <TotalAssetsCard dashboardData={dashboardData} />
                  </Col>
                </Row>
              </Col>
              <Col
                className="gutter-row"
                lg={6}
                md={10}
                sm={10}
                xs={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: windowWidth <= 992 ? "10px" : "0",
                }}
              >
                <Row style={{ flex: 1 }}>
                  <Col
                    sm={24}
                    md={24}
                    lg={24}
                    className="gutter-row infomation-div"
                    style={{ flex: 1 }}
                  >
                    <InvestmentCard dashboardData={dashboardData} />
                  </Col>
                </Row>
              </Col>
              <Col
                className="gutter-row"
                lg={6}
                md={14}
                sm={14}
                xs={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: windowWidth <= 576 ? "10px" : "0",
                }}
              >
                <Row style={{ flex: 1 }}>
                  <Col
                    sm={24}
                    md={24}
                    lg={24}
                    className="gutter-row infomation-div"
                    style={{ flex: 1 }}
                  >
                    <NetAverageProfitCard
                      dashboardData={dashboardData}
                      checked={checked}
                      setChecked={setChecked}
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                className="gutter-row"
                lg={5}
                md={10}
                sm={10}
                xs={24}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <EarnedCard dashboardData={dashboardData} checked={checked} />
              </Col>
            </Row>
            {windowWidth <= 768 ? (
              <>
                <div className="mt-40">
                  <Tabs
                    activeKey={tabKey}
                    items={items}
                    onChange={(key) => {
                      setTabKey(key);
                      localStorage.setItem("activeTabKey", key);
                    }}
                    className="wallet-tab"
                  />
                </div>
                <div className="dashboard-head-div mt-24 mb-8">
                  <div className="currency-btn-div">
                    {showButtonActive ? (
                      <div
                        className="invest-button cursor-pointer"
                        onClick={handleButtonToggle}
                      >
                        <img src={buttonActive} alt="button" />
                        <img src={frame} alt="button" />
                      </div>
                    ) : (
                      <div
                        className="invest-button cursor-pointer"
                        value="passive"
                        onClick={handleButtonToggle}
                      >
                        <img src={button} alt="button" />
                        <img src={frameActive} alt="button" />
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : null}
            <DashboardInvestment
              showButtonActive={showButtonActive}
              currencyCode={currencyCode}
              activeKey={tabKey}
              setActiveKey={setTabKey}
              reservedtotalItem={reservedtotalItem}
              setReservedTotalItem={setReservedTotalItem}
            />
          </Content>
        </Spin>
        {user?.hasSeenMigrationScreen === false ? (
          <UpgradeKildePopup
            upgradeKildeModal={upgradeKildeModal}
            setUpgradeKildeModal={setUpgradeKildeModal}
          />
        ) : null}
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
