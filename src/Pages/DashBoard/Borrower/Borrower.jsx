/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../../Layouts/DashboardLayout/DashboardLayout";
import {
  Breadcrumb,
  Button,
  Col,
  Layout,
  Row,
  Table,
  Tabs,
  Tooltip,
} from "antd";

import Down_blue_arrow from "../../../Assets/Images/Icons/down_blue_arrow.svg";

import "./style.css";
import Plus_Icon from "../../../Assets/Images/Plus_icon.svg";
import Close_Icon from "../../../Assets/Images/SVGs/close_gray.svg";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import TranchInvestInfo from "./TranchInvestInfo";
import StartInvesting from "./StartInvesting";
import InvestDetails from "./InvestDetails";
import BondDescription from "./BondDescription";
import AssetsInfo from "./AssetsInfo";
import CovenantInfo from "./covenantInfo";
import Document from "./Document";
import OutStandingPayment from "./OutStandingPayment";
import StartCapitalCallRequest from "./StartCapitalCallRequest";
import CapitalCallRequestLists from "./CapitalCallRequestList";
import ActiveUserBanner from "../../Settings/ActiveUserBanner";

import { CapitalCallList, InvestTranche } from "../../../Apis/DashboardApi";
import { britishFormatDate, getCountries } from "../../../Utils/Helpers";
import GlobalVariabels from "../../../Utils/GlobalVariabels";
import ROUTES from "../../../Config/Routes";
import { useDispatch, useSelector } from "react-redux";
import FinishOnboarding from "../Investment/FinishOnboarding";
import {
  setCapitalRequests,
  setTrancheResponse,
} from "../../../Redux/Action/Investor";
import { ErrorResponse } from "../../../Utils/ErrorResponse";
import { getUser } from "../../../Apis/UserApi";
import { setUserDetails } from "../../../Redux/Action/User";
import { formatCurrency, getCountryNameByCode } from "../../../Utils/Reusables";
import ReservationDetails from "./ReservationDetails";
import BorrowerVideos from "./BorrowerVideos";
import BondSalesRequests from "./BondSaleRequest";
import { allowedUserIds, promoConfigs } from "../../../Utils/Constant";
import {
  TranchInvestInfoSkeleton,
  HeaderSkeleton,
  ActiveUserBannerSkeleton,
  OverviewAndBondSkeleton,
  StartInvestingAndInvestmentSkeleton,
  BusinessAndDocumentsSkeleton,
  DealStructureSkeleton,
  DealMonitoringTableSkeleton,
} from "./BorrowerSkeletons";

const { Content } = Layout;

const Borrower = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const sectionsRef = useRef({});
  const infoDivRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const TrancheRes = useSelector((state) => state?.investor?.tranche);
  const [loader, setLoader] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedOverview, setExpandedOverview] = useState(false);
  const user = useSelector((state) => state.user);
  const [capitalRequestLoading, setCapitalRequestLoading] = useState(false);
  const [bondSaleRequestLoading, setbondSaleRequestLoading] = useState(false);
  const countryList = getCountries();
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );
  const [renderComponent, setRenderComponent] = useState(false);
  const [couponAmount, setCouponAmount] = useState();
  const [openstateModal, setOpenstateModal] = useState(false);
  const modalRef = useRef(null);
  const fixedComponentRef = useRef(null);
  const [capitalRadio, setCapitalRadio] = useState("nextCapitalCallDate");

  const companyWebsite = TrancheRes?.borrower?.companyWebsite;
  const formattedWebsite =
    companyWebsite?.startsWith("http://") ||
    companyWebsite?.startsWith("https://")
      ? companyWebsite
      : `https://${companyWebsite}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        fixedComponentRef.current &&
        !fixedComponentRef.current.contains(event.target)
      ) {
        setOpenstateModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const trancheNumber = TrancheRes?.tranche?.trancheNumber;
    const promoKey = location?.state?.key;
    const userId = user?.number;

    Object.entries(promoConfigs).forEach(([key, config]) => {
      if (trancheNumber === config.trancheNumber) {
        // Always fire borrower_page_visit
        window?.dataLayer?.push({
          event: "borrower_page_visit",
          content_id: config.content_id,
          user_id: userId,
          register_method: user?.registrationType,
        });

        // Conditionally fire borrower_from_promo
        if (promoKey === key) {
          window?.dataLayer?.push({
            event: "borrower_from_promo",
            content_id: config.content_id,
            user_id: userId,
            register_method: user?.registrationType,
          });
        }
      }
    });
  }, [TrancheRes, location?.state?.key, user?.number]);

  const handleScroll = () => {
    const sectionNames = Object.keys(sectionsRef.current);
    let currentActiveSection = activeSection;

    sectionNames.forEach((section) => {
      const sectionEl = sectionsRef.current[section];
      if (sectionEl) {
        const rect = sectionEl.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 4) {
          currentActiveSection = section;
        }
      }
    });

    if (currentActiveSection !== activeSection) {
      setActiveSection(currentActiveSection);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection]);

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (location?.state && location?.state?.scrollState) {
      if (TrancheRes) {
        const timeout = setTimeout(() => {
          if (infoDivRef.current) {
            infoDivRef.current.scrollIntoView({
              behavior: "auto",
              block: "center",
            });
          }
        }, 10);
        return () => clearTimeout(timeout);
      }
    }
  }, [TrancheRes, location]);

  const isFutureDate = (dateString) => {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    return givenDate > currentDate;
  };

  useEffect(() => {
    if (
      TrancheRes?.tranche?.subscriptionEnabled === false &&
      !isFutureDate(TrancheRes?.tranche?.issueDate) &&
      location?.state?.amount !== undefined
    ) {
      navigate(ROUTES.TRANCH_LISTING);
    } else if (location?.state?.amount >= TrancheRes?.tranche?.nominalValue) {
      setCouponAmount(location?.state?.amount);
    }
  }, [location?.state?.amount]);

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

  useEffect(() => {
    setLoader(true);
    const requestBody = {
      trancheUuid: slug,
    };
    InvestTranche(requestBody).then(async (tracheRes) => {
      setTrancheResponse(tracheRes, dispatch);
      setLoader(false);
    });
  }, [renderComponent, location]);

  const capitalCallColumns = [
    {
      title: "Next redemption rate",
      dataIndex: "NextCapitalCallDates",
    },
    {
      title: "Submit the notice before",
      dataIndex: "SubmitNoticeBy",
    },
  ];

  const capitalCallData = TrancheRes?.tranche?.capitalCallDates?.map(
    (data, index) => ({
      key: index,
      NextCapitalCallDates: britishFormatDate(data.nextCapitalCallDate),
      SubmitNoticeBy: britishFormatDate(data.nextCapitalCallRequestDeadline),
    })
  );

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleLess = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const requestBody = {
      trancheUuid: slug,
    };
    if (TrancheRes?.investment?.debentureCount > 0) {
      getCapitalCallRequestList(requestBody);
    }
  }, [TrancheRes?.investment?.debentureCount]);

  const getCapitalCallRequestList = (requestBody) => {
    setCapitalRequestLoading(true);
    CapitalCallList(requestBody)
      .then(async (capitaRequestlist) => {
        if (Object.keys(capitaRequestlist)?.length > 0) {
          setCapitalRequests(capitaRequestlist, dispatch);
          setCapitalRequestLoading(false);
        } else {
          setCapitalRequestLoading(false);
        }
      })
      .catch((error) => {
        ErrorResponse(error?.code);
        setCapitalRequestLoading(false);
      });
  };

  const handleScrollToSection = (section) => {
    if (sectionsRef.current[section]) {
      const element = sectionsRef.current[section];
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "auto",
      });
    }
  };

  const sections = [
    { key: "overview", label: "Overview" },
    { key: "overview-sec", label: "Bond" },
    { key: "invest", label: "Invest" },
    {
      key: "financial",
      label: "Financials",
      condition: TrancheRes?.tranche?.details?.keyFinancialsCsv,
    },
    {
      key: "covenantInfo",
      label: "Deal Monitoring",
      condition:
        TrancheRes?.tranche?.details?.covenantCsv !== "" &&
        TrancheRes?.tranche?.details?.covenantCsv !== null &&
        TrancheRes?.tranche?.details?.covenantCsv !== undefined,
    },
    { key: "business-description", label: "Business" },
    {
      key: "repayments",
      label: "Repayment Sched.",
      condition:
        TrancheRes?.tranche?.paymentScheduleSummary?.payments?.length > 0,
    },
    {
      key: "capital",
      label: "Capital Call Dates",
      condition: TrancheRes?.tranche?.capitalCallEnabled === true,
    },
  ];

  return (
    <div className={`app-container ${openstateModal ? "modal-open" : ""}`}>
      <DashboardLayout>
        <Content className="borrower-page-div">
          <div className="borrower-navigation-div">
            <div className="borrower-navigation-sub-div">
              <Tabs
                className="borrower-navigation-sub-div"
                tabPosition="right"
                activeKey={activeSection}
                onChange={(key) => {
                  setActiveSection(key);
                  handleScrollToSection(key);
                }}
                items={sections
                  .filter(({ condition = true }) => condition)
                  .map(({ key, label }) => ({
                    key,
                    label,
                  }))}
              />
            </div>
          </div>
          {/* )} */}
          {user?.investorStatus !== "ACTIVE" ||
          (user?.investorStatus === "ACTIVE" && accountNo?.length <= 0) ||
          (user?.secondFactorAuth === null &&
            user?.twoFaCheckEnabled === true) ? (
            loader ? (
              <ActiveUserBannerSkeleton />
            ) : (
              <FinishOnboarding />
            )
          ) : null}
          {allowedUserIds.includes(user?.number) ? <ActiveUserBanner /> : null}
          {loader ? (
            <HeaderSkeleton />
          ) : (
            <>
              {" "}
              <Breadcrumb
                items={[
                  {
                    title: (
                      <span
                        className="cursor-pointer"
                        onClick={() => navigate(ROUTES.TRANCH_LISTING)}
                      >
                        Invest
                      </span>
                    ),
                  },
                  {
                    title: TrancheRes?.tranche?.details?.title,
                  },
                ]}
              />
              <Row className="media-tranche-head">
                <Col sx={24} sm={24} className="mt-10 mb-8">
                  {TrancheRes?.borrower?.companyLogo ? (
                    <div className="company-logo-div">
                      <img
                        src={`${GlobalVariabels.VIEW_IMG}/${TrancheRes?.borrower?.companyLogo}`}
                        alt="borrower_icon"
                        id="company-logo-div"
                      />
                    </div>
                  ) : null}
                </Col>
                <Col xs={24} md={24}>
                  <p className="borrower-id-text mb-0  mt-0">
                    {TrancheRes?.tranche?.trancheNumber}
                  </p>
                  <h2 className="mt-0 mb-0 borrower-company-title">
                    {TrancheRes?.tranche?.details?.title}
                  </h2>
                </Col>
              </Row>
              <div className="borrower-logo-div desktop-tranche-head">
                <div>
                  <p className="borrower-id-text mb-0 mt-10">
                    {TrancheRes?.tranche?.trancheNumber}
                  </p>
                  <h2 className="mt-0 mb-0 borrower-company-title">
                    {TrancheRes?.tranche?.details?.title}
                  </h2>
                </div>
                {TrancheRes?.borrower?.companyLogo ? (
                  <div className="company-logo-div">
                    <img
                      src={`${GlobalVariabels.VIEW_IMG}/${TrancheRes?.borrower?.companyLogo}`}
                      alt="borrower_icon"
                    />
                  </div>
                ) : null}
              </div>
            </>
          )}
          {loader ? (
            <TranchInvestInfoSkeleton />
          ) : (
            <Row
              className="mt-24 mb-24 media-borrower-b-row overview"
              ref={(el) => (sectionsRef.current["overview"] = el)}
            >
              <TranchInvestInfo TrancheRes={TrancheRes} />
            </Row>
          )}
          {loader ? (
            <OverviewAndBondSkeleton />
          ) : (
            <>
              <Row
                gutter={10}
                className="mt-24 business-div business-description"
                ref={(el) => (sectionsRef.current["overview-sec"] = el)}
              >
                <Col sm={24} md={14} lg={14} className="gutter-row">
                  <div className="infomation-div">
                    <Row>
                      <Col md={24} className="mb-24">
                        <p className="m-0 tranch-head">Overview</p>
                        {TrancheRes?.tranche?.details?.summary
                          ?.shortDescription === "" ? (
                          "No Description found"
                        ) : (
                          <>
                            <div className="business-dec-borrower mb-0">
                              <>
                                {expandedOverview ? (
                                  TrancheRes?.tranche?.details?.summary?.shortDescription
                                    .split("\n\n")
                                    .map((paragraph, index) => (
                                      <p key={index} className="mb-0">
                                        {paragraph
                                          .split("\n")
                                          .map((line, lineIndex) => (
                                            <React.Fragment key={lineIndex}>
                                              {line}
                                              {lineIndex <
                                                paragraph.split("\n").length -
                                                  1 && <br />}
                                            </React.Fragment>
                                          ))}
                                      </p>
                                    ))
                                ) : (
                                  <p className="mb-0">
                                    {`${TrancheRes?.tranche?.details?.summary?.shortDescription.slice(
                                      0,
                                      200
                                    )}`}
                                    {TrancheRes?.tranche?.details?.summary
                                      ?.shortDescription.length > 200 &&
                                      !expandedOverview &&
                                      "..."}
                                  </p>
                                )}
                              </>
                            </div>
                            {TrancheRes?.tranche?.details?.summary
                              ?.shortDescription.length > 200 ? (
                              expandedOverview ? (
                                <Button
                                  onClick={() =>
                                    setExpandedOverview(!expandedOverview)
                                  }
                                  className="read-more-btn"
                                >
                                  Read Less{" "}
                                  <img
                                    className="ml-4"
                                    src={Down_blue_arrow}
                                    alt="Down_blue_arrow"
                                  />
                                </Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    setExpandedOverview(!expandedOverview)
                                  }
                                  className="read-more-btn"
                                >
                                  Read More{" "}
                                  <img
                                    className="ml-4"
                                    src={Down_blue_arrow}
                                    alt="Down_blue_arrow"
                                  />
                                </Button>
                              )
                            ) : null}
                          </>
                        )}
                      </Col>
                      <Col sm={24} md={24} lg={24} style={{ width: "100%" }}>
                        <div style={{ width: "100%" }}>
                          <OwlCarousel
                            className="owl-main owl-theme"
                            items={1}
                            nav={true}
                            loop
                            dots={true}
                          >
                            {TrancheRes?.tranche?.pictures?.length > 0
                              ? TrancheRes?.tranche?.pictures?.map(
                                  (data, index) => {
                                    return (
                                      <div
                                        className="item"
                                        key={index}
                                        style={{ width: "100%" }}
                                      >
                                        <img
                                          id="borrower-img"
                                          src={`${GlobalVariabels.VIEW_IMG}/${data}`}
                                          alt="Client"
                                          style={{
                                            width: "100%",
                                            height: "auto",
                                            objectFit: "contain",
                                            maxWidth: "100%",
                                            display: "block",
                                          }}
                                        />
                                      </div>
                                    );
                                  }
                                )
                              : "No picture found"}
                          </OwlCarousel>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col
                  sm={24}
                  md={10}
                  lg={10}
                  className="gutter-row medium-tranch-col"
                >
                  <div className="infomation-div">
                    <BondDescription TrancheRes={TrancheRes} />
                  </div>
                </Col>
              </Row>
            </>
          )}
          {loader ? (
            <StartInvestingAndInvestmentSkeleton />
          ) : (
            <Row
              className="mb-24 media-borrower-b-row t-desc-div invest mt-24"
              ref={(el) => (sectionsRef.current["invest"] = el)}
              gutter={window.innerWidth >= 768 ? 10 : 0}
              style={{ display: "flex" }}
            >
              <Col
                sm={24}
                md={12}
                lg={12}
                className="gutter-row media-right-pad"
                style={{ flexGrow: 1 }}
              >
                <Row style={{ height: "100%", gap: "10px" }}>
                  <StartInvesting
                    TrancheRes={TrancheRes}
                    setLoader={setLoader}
                    couponValue={couponAmount}
                    {...(location?.state?.key && { key: location.state.key })}
                  />
                </Row>
              </Col>
              <Col
                sm={24}
                md={12}
                lg={12}
                className=" gutter-row medium-tranch-col"
                style={{ flexGrow: 1 }}
              >
                <Row style={{ height: "100%", gap: "10px" }}>
                  {TrancheRes?.reservation === null ? null : (
                    <ReservationDetails
                      TrancheRes={TrancheRes}
                      setLoader={setLoader}
                      setRenderComponent={setRenderComponent}
                    />
                  )}

                  <InvestDetails
                    TrancheRes={TrancheRes}
                    setLoader={setLoader}
                  />
                </Row>
              </Col>
            </Row>
          )}
          {TrancheRes?.tranche?.details?.keyFinancialsCsv !== "" &&
            TrancheRes?.tranche?.details?.keyFinancialsCsv !== null && (
              <Row
                className="media-margin left-marg-none mb-24 financial"
                ref={(el) => (sectionsRef.current["financial"] = el)}
              >
                <Col
                  xs={24}
                  sm={24}
                  md={
                    TrancheRes?.tranche?.details?.repaymentRate === "" ? 24 : 24
                  }
                  lg={
                    TrancheRes?.tranche?.details?.repaymentRate === "" ? 24 : 24
                  }
                  className={
                    TrancheRes?.tranche?.details?.repaymentRate === ""
                      ? "gutter-row"
                      : "gutter-row medium-tranch-col"
                  }
                >
                  <AssetsInfo TrancheRes={TrancheRes} />
                </Col>
              </Row>
            )}

          {TrancheRes?.tranche?.details?.covenantCsv !== "" &&
            TrancheRes?.tranche?.details?.covenantCsv !== null &&
            TrancheRes?.tranche?.details?.covenantCsv !== undefined && (
              <Row
                className="media-margin left-marg-none mb-24 financial"
                ref={(el) => (sectionsRef.current["covenantInfo"] = el)}
              >
                <Col xs={24} sm={24} md={24} lg={24} className="gutter-row">
                  {loader ? (
                    <DealMonitoringTableSkeleton />
                  ) : (
                    <CovenantInfo TrancheRes={TrancheRes} />
                  )}
                </Col>
              </Row>
            )}
          {loader ? (
            <BusinessAndDocumentsSkeleton />
          ) : (
            <Row
              gutter={10}
              className="mt-24 business-div business-description"
              ref={(el) => (sectionsRef.current["business-description"] = el)}
            >
              <Col sm={24} md={14} lg={14} className="gutter-row">
                <div className="infomation-div">
                  <Row>
                    <Col md={24} className="mb-24">
                      <p className="mt-0 tranch-head">Business</p>
                      {TrancheRes?.borrower?.description === "" ? (
                        "No Description found"
                      ) : (
                        <>
                          <div className="business-dec-borrower mb-0">
                            {expanded ? (
                              TrancheRes?.borrower?.description
                                .split("\n\n")
                                .map((paragraph, index) => (
                                  <p key={index} className="mb-0">
                                    {paragraph
                                      .split("\n")
                                      .map((line, lineIndex) => (
                                        <React.Fragment key={lineIndex}>
                                          {line}
                                          {lineIndex <
                                            paragraph.split("\n").length -
                                              1 && <br />}
                                        </React.Fragment>
                                      ))}
                                  </p>
                                ))
                            ) : (
                              <p className="mb-0">
                                {`${TrancheRes?.borrower?.description.slice(
                                  0,
                                  150
                                )}`}
                                {!expanded && "..."}
                              </p>
                            )}
                          </div>
                          {expanded ? (
                            <Button
                              onClick={toggleLess}
                              className="read-more-btn"
                            >
                              Read Less{" "}
                              <img
                                className="ml-4"
                                src={Down_blue_arrow}
                                alt="Down_blue_arrow"
                              />
                            </Button>
                          ) : (
                            <Button
                              onClick={toggleExpand}
                              className="read-more-btn"
                            >
                              Read More{" "}
                              <img
                                className="ml-4"
                                src={Down_blue_arrow}
                                alt="Down_blue_arrow"
                              />
                            </Button>
                          )}
                        </>
                      )}
                    </Col>
                    <Row className="trach-info">
                      <Col xs={12} lg={12}>
                        <p className="mb-5 mt-0 borrower-info-tag">Countries</p>
                      </Col>
                      <Col xs={12} lg={12} className="country-flag">
                        <div className="mb-5 mt-0 card-val-tag">
                          {TrancheRes?.borrower?.countries?.length > 0
                            ? TrancheRes?.borrower?.countries?.map(
                                (countryCode, index) => (
                                  <Tooltip
                                    title={getCountryNameByCode(
                                      countryList,
                                      countryCode
                                    )}
                                    key={index}
                                  >
                                    <span
                                      style={{
                                        filter:
                                          "drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.10))",
                                        border: "1px solid black",
                                      }}
                                      key={index}
                                      className={`mb-5 ml-5 mt-0 fi fi-${countryCode.toLowerCase()}`}
                                    />
                                  </Tooltip>
                                )
                              )
                            : "-"}
                        </div>
                      </Col>

                      {TrancheRes?.tranche?.industry === "REAL_ESTATE" ? (
                        <>
                          <Col xs={12} lg={12}>
                            <p className="mb-5 mt-0 borrower-info-tag">
                              Number of projects
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            <p className="mb-5 mt-0 card-val-tag">
                              {TrancheRes?.borrower?.numberOfProjects}
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            <p className="mb-5 mt-0 borrower-info-tag">
                              Current projects
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            <p className="mb-5 mt-0 card-val-tag">
                              {TrancheRes?.borrower?.currentProjects}
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            <p className="mb-5 mt-0 borrower-info-tag">
                              Experience
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            <p className="mb-5 mt-0 card-val-tag">
                              {TrancheRes?.borrower?.yearsOfExperience} years
                            </p>
                          </Col>
                        </>
                      ) : (
                        <>
                          <Col xs={12} lg={12}>
                            <p className="mb-5 mt-0 borrower-info-tag">
                              Kilde rating
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            <p className="mb-5 mt-0 card-val-tag">
                              {TrancheRes?.borrower?.creditRating
                                ? TrancheRes?.borrower?.creditRating
                                : "-"}
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            <p className="m-0 mb-5 borrower-info-tag">
                              Loans originated
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            {" "}
                            <p className="m-0 mb-5 card-val-tag">
                              {TrancheRes?.borrower?.loansOriginated === 0
                                ? "-"
                                : formatCurrency(
                                    TrancheRes?.borrower?.currencySymbol,
                                    TrancheRes?.borrower?.loansOriginated
                                  )}
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            <p className="m-0 mb-5 borrower-info-tag">
                              Loan portfolio
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            <p className="m-0 mb-5 card-val-tag">
                              {TrancheRes?.borrower?.loansPortfolio > 0
                                ? formatCurrency(
                                    TrancheRes?.borrower?.currencySymbol,
                                    TrancheRes?.borrower?.loansPortfolio
                                  )
                                : "-"}
                            </p>
                          </Col>
                          <Col xs={24} lg={24}>
                            <p className="m-0 mb-5 borrower-info-tag">
                              Issuance on Kilde
                            </p>
                          </Col>

                          {TrancheRes?.borrower?.borrowingsOnPlatform?.map(
                            (res, index) => (
                              <React.Fragment key={index}>
                                <Col xs={12} lg={12}>
                                  <p className="m-0 mb-5 borrower-info-tag-issuance">
                                    Bond in {res?.currencyCode}
                                  </p>
                                </Col>
                                <Col xs={12} lg={12}>
                                  <p className="m-0 mb-5 card-val-tag">
                                    {formatCurrency(
                                      res?.currencySymbol,
                                      res?.borrowingOnPlatform
                                    )}
                                  </p>
                                </Col>
                              </React.Fragment>
                            )
                          )}

                          <Col xs={12} lg={12}>
                            <p className="m-0 mb-5 borrower-info-tag">
                              Founded year
                            </p>
                          </Col>
                          <Col xs={12} lg={12}>
                            <p className="m-0 mb-5 card-val-tag">
                              {TrancheRes?.borrower?.foundedYear}
                            </p>
                          </Col>
                        </>
                      )}

                      <Col xs={12} lg={12}>
                        <p className="m-0 mb-5 borrower-info-tag">
                          Number of employees
                        </p>
                      </Col>
                      <Col xs={12} lg={12}>
                        <p className="m-0 mb-5 card-val-tag">
                          {TrancheRes?.borrower?.numberOfEmployees === 0
                            ? "NA"
                            : TrancheRes?.borrower?.numberOfEmployees}
                        </p>
                      </Col>
                      <Col xs={12} lg={12}>
                        <p className="m-0 mb-5 borrower-info-tag">Site</p>
                      </Col>
                      <Col xs={12} lg={12}>
                        <div
                          className="m-0 mb-5 card-val-tag"
                          style={{ wordBreak: "break-word", maxWidth: "100%" }}
                        >
                          <a
                            href={formattedWebsite}
                            className="borrower-desc-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {companyWebsite}
                          </a>
                        </div>
                      </Col>
                    </Row>
                  </Row>
                </div>
              </Col>
              <Col
                sm={24}
                md={10}
                lg={10}
                className="gutter-row medium-tranch-col"
              >
                <Row style={{ height: "100%" }}>
                  <Col className="w-100">
                    <div className="infomation-div" style={{ height: "100%" }}>
                      <Document TrancheRes={TrancheRes} />
                    </div>
                  </Col>

                  {TrancheRes?.borrower?.youtubeVideoLink !== null &&
                  TrancheRes?.borrower?.youtubeVideoLink !== undefined ? (
                    <Col className="w-100 mt-16">
                      <div
                        className="infomation-div"
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <BorrowerVideos TrancheRes={TrancheRes} />
                      </div>
                    </Col>
                  ) : null}
                </Row>
              </Col>
            </Row>
          )}
          {TrancheRes?.tranche?.paymentScheduleSummary?.payments?.length > 0 ? (
            <Row
              className="mt-24 repayments"
              ref={(el) => (sectionsRef.current["repayments"] = el)}
            >
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                className="gutter-row infomation-div"
              >
                <OutStandingPayment TrancheRes={TrancheRes} />
              </Col>
            </Row>
          ) : null}
          {TrancheRes?.tranche?.capitalCallEnabled === true && (
            <Row
              className="mt-24 capital remove-margin-left-from-desktop"
              gutter={window.innerWidth >= 768 ? 20 : 0}
              ref={(el) => (sectionsRef.current["capital"] = el)}
            >
              <>
                <Col
                  xs={24}
                  sm={24}
                  md={TrancheRes?.investment?.debentureCount > 0 ? 12 : 24}
                  lg={TrancheRes?.investment?.debentureCount > 0 ? 12 : 24}
                  className="gutter-row infomation-div"
                >
                  <div style={{ height: "100%" }} ref={infoDivRef}>
                    <p className="mt-0 tranch-head mb-4">Capital Call Dates</p>

                    {TrancheRes?.tranche?.details?.summary?.tooltips && (
                      <p
                        className="m-0"
                        style={{ fontSize: "12px", color: "#656c78" }}
                      >
                        {TrancheRes?.tranche?.details?.summary?.tooltips}
                      </p>
                    )}
                    <div
                      className={
                        TrancheRes?.investment?.debentureCount > 0
                          ? "over-capital-desc-div"
                          : "capital-desc-div"
                      }
                    >
                      {TrancheRes?.investment?.nextCapitalCallDate === null ? (
                        <p className="business-dec-borrower">
                          No capital call dates available
                        </p>
                      ) : (
                        <>
                          <div className="text-container">
                            <p className="business-dec-borrower">
                              {`You may execute early repayment of the principal and accrued but unpaid interest on specific dates, as defined in the table below, provided you give us ${TrancheRes?.tranche?.noticePeriodBeforeCapitalCall} days advance notice.`}
                            </p>

                            <p className="business-dec-borrower">
                              {`The next early redemption date is ${britishFormatDate(
                                TrancheRes?.investment?.nextCapitalCallDate
                              )}, so you need to give us advance notice by ${britishFormatDate(
                                TrancheRes?.investment
                                  ?.nextCapitalCallRequestDeadline
                              )}.`}
                            </p>
                          </div>
                          <div
                            className={`table-container ${
                              TrancheRes?.investment?.debentureCount > 0
                                ? ""
                                : "trach-info"
                            }`}
                          >
                            <Table
                              columns={capitalCallColumns}
                              dataSource={capitalCallData}
                              className="trache-table outstanding-pay-table"
                              pagination={false}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Col>
                {TrancheRes?.investment?.debentureCount > 0 && (
                  <Col
                    sm={24}
                    md={12}
                    lg={12}
                    className="gutter-row media-right-pad medium-tranch-col"
                    style={{ flexGrow: 1 }}
                  >
                    <Row style={{ height: "100%" }}>
                      <StartCapitalCallRequest
                        TrancheRes={TrancheRes}
                        setCapitalRequestLoading={setCapitalRequestLoading}
                        capitalRadio={capitalRadio}
                        setCapitalRadio={setCapitalRadio}
                      />
                      {/* <CapitalCallRequestLists
                          TrancheRes={TrancheRes}
                          capitalRequestLoading={capitalRequestLoading}
                          setCapitalRequestLoading={setCapitalRequestLoading}
                        /> */}
                      {capitalRadio === "nextCapitalCallDate" ? (
                        <CapitalCallRequestLists
                          TrancheRes={TrancheRes}
                          capitalRequestLoading={capitalRequestLoading}
                          setCapitalRequestLoading={setCapitalRequestLoading}
                        />
                      ) : (
                        <BondSalesRequests
                          TrancheRes={TrancheRes}
                          bondSaleRequestLoading={bondSaleRequestLoading}
                          setbondSaleRequestLoading={setbondSaleRequestLoading}
                        />
                      )}
                    </Row>
                  </Col>
                )}
              </>
            </Row>
          )}
          {TrancheRes?.tranche?.details?.summary?.dealStructure &&
            (loader ? (
              <DealStructureSkeleton />
            ) : (
              <Row className="mt-24 media-borrower-t-row">
                <Col xs={24} md={24}>
                  <div className="infomation-div">
                    <p className="m-0 tranch-head">Deal Structure</p>
                    <p className="business-dec-borrower mb-0">
                      {TrancheRes?.tranche?.details?.summary?.dealStructure}
                    </p>
                  </div>
                </Col>
              </Row>
            ))}
        </Content>
        {openstateModal ? (
          <div ref={modalRef} className="media-screen-modal-tab-div">
            <div className="borrower-navigation-sub-div">
              {sections.map(
                ({ key, label, condition = true }) =>
                  condition && (
                    <p
                      key={key}
                      className={`notification-title mt-12 cursor-pointer ${
                        activeSection === key ? "active-borrower-tab" : ""
                      }`}
                      onClick={() => handleScrollToSection(key)}
                    >
                      {label}
                    </p>
                  )
              )}
            </div>
          </div>
        ) : null}
        {openstateModal && <div className="overlay"></div>}
        <div ref={fixedComponentRef} className="fixed-component">
          <p className="user-dropdown-link m-0">overview</p>
          <div>
            {openstateModal ? (
              <img
                src={Close_Icon}
                alt="close_icon"
                onClick={() => setOpenstateModal(false)}
              />
            ) : (
              <img
                src={Plus_Icon}
                alt="plus_icon"
                onClick={() => setOpenstateModal(true)}
              />
            )}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Borrower;
