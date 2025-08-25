import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../Layouts/DashboardLayout/DashboardLayout";
import { Button, Col, Dropdown, Menu, Row, Space } from "antd";
import AccountStatementFilterComponent from "./AccountStatementFilterComponent";
import SlidersHorizontal from "../../../Assets/Images/SlidersHorizontal.svg";
import Download_icon from "../../../Assets/Images/download_icon.svg";
import Download_icon_disable from "../../../Assets/Images/dowloadicondisable.svg";
import ShowAccountStatementFilterModal from "./ShowAccountStatementFilterModal";
import AccountSummaryTable from "./AccountSummaryTable";
import TransactionTable from "./TransactionTable";
import ActiveUserBanner from "../../Settings/ActiveUserBanner";
import { useDispatch, useSelector } from "react-redux";
import {
  AccountStatementDownloadPdf,
  AccountStatementSummaryDownload,
} from "../../../Apis/DashboardApi";
import FinishOnboarding from "../Investment/FinishOnboarding";
import { setUserDetails } from "../../../Redux/Action/User";
import { getUser } from "../../../Apis/UserApi";
import File_xls from "../../../Assets/Images/FileXls.svg";
import File_pdf_active from "../../../Assets/Images/FilePdf_active.svg";
import File_pdf from "../../../Assets/Images/FilePdf.svg";

import xls_active from "../../../Assets/Images/SVGs/FileXls_active.svg";
import { allowedUserIds } from "../../../Utils/Constant";

const AccountStatement = () => {
  const dispatch = useDispatch();
  const [filterModal, setFilterModal] = useState(false);
  const [loadExcel, setLoadExcel] = useState(false);
  const [loadPdf, setLoadPdf] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const filterData = useSelector(
    (state) => state?.dashboards?.DashboardData?.accStatementFilterData
  );
  const postingDateFrom = filterData?.postingDateFrom;
  const postingDateTo = filterData?.postingDateTo;
  const currencyCode = filterData?.currencyCode;
  const txType = filterData?.txType;
  const txSubType = filterData?.txSubType;
  const user = useSelector((state) => state?.user);
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );

  const accountSummary = useSelector(
    (state) => state?.dashboards?.DashboardData?.transactionData
  );

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      } else {
        console.error("Error fetching user data:");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleExportXLS = async () => {
    try {
      setLoadExcel(true);
      const payload = {
        page: 1,
        pageSize: 100,
        postingDateFrom: postingDateFrom || null,
        postingDateTo: postingDateTo || null,
        currencyCode: currencyCode || "USD",
      };
      AccountStatementSummaryDownload(payload)
        .then(async (response) => {
          if (!response.data || response.data.size === 0) {
            throw new Error("Empty file received from server");
          }

          const contentType = response.headers["content-type"];
          const blob = new Blob([response.data], { type: contentType });

          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = response.headers["k-filename"] || "download.xlsx";
          link.click();
          setLoadExcel(false);
          setDropdownVisible(false);
        })
        .catch((error) => {
          console.error("Error fetching account summary:", error);
          setLoadExcel(false);
          setDropdownVisible(false);
        });
    } catch (e) {
      console.error("Error fetching account summary:", e);
      setLoadExcel(false);
      setDropdownVisible(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoadPdf(true);

      const payload = {
        page: 1,
        pageSize: 100,
        postingDateFrom: postingDateFrom || null,
        postingDateTo: postingDateTo || null,
        currencyCode: currencyCode || "USD",
      };
      AccountStatementDownloadPdf(payload)
        .then(async (response) => {
          if (!response.data || response.data.size === 0) {
            throw new Error("Empty file received from server");
          }

          const contentType = response.headers["content-type"];
          const blob = new Blob([response.data], { type: contentType });

          // Create a download link for the PDF file
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = response.headers["k-filename"] || "download.pdf";
          link.click();

          // Clean up the URL object after the download
          window.URL.revokeObjectURL(link.href);

          setLoadPdf(false);
          setDropdownVisible(false);
        })
        .catch((error) => {
          console.error("Error fetching account summary:", error);
          setLoadPdf(false);
          setDropdownVisible(false);
        });
    } catch (e) {
      console.error("Error fetching account summary:", e);
      setLoadPdf(false);
      setDropdownVisible(false);
    }
  };

  const handleMenuClick = (key) => {
    setDropdownVisible(true);
    if (key === "0") {
      handleExportXLS();
    } else if (key === "1") {
      handleExportPDF();
    }
  };

  return (
    <div>
      <DashboardLayout>
        <div className="trance-listing-main-div">
          {user?.investorStatus !== "ACTIVE" ||
          (user?.investorStatus === "ACTIVE" && accountNo?.length <= 0) ||
          (user?.secondFactorAuth === null &&
            user?.twoFaCheckEnabled === true) ? (
            <FinishOnboarding />
          ) : null}
          {allowedUserIds.includes(user?.number) ? <ActiveUserBanner /> : null}
          <div>
            <Row gutter={window.innerWidth >= 768 ? 20 : 0}>
              <Col xs={5} className="invest-filter">
                <AccountStatementFilterComponent />
                <ShowAccountStatementFilterModal
                  filterModal={filterModal}
                  setFilterModal={setFilterModal}
                />
              </Col>

              <Col xs={24} md={19} lg={19} className="gutter-row">
                <div className="account-summary-main-div">
                  <p className="tranche-header m-0">Account Statement</p>
                  <div>
                    {user?.investorStatus === "ACTIVE" &&
                    (accountSummary?.turnovers?.length > 0 ||
                      accountSummary?.txs?.length > 0) ? (
                      <Dropdown
                        className="cursor-pointer"
                        menu={{
                          items: [
                            {
                              key: "0",
                              label: (
                                <Button
                                  className="export-excel cursor-pointer"
                                  loading={loadExcel}
                                  style={{
                                    border: "none",
                                    boxShadow: "none",
                                    outline: "none",
                                  }}
                                >
                                  <img
                                    src={File_xls}
                                    alt="File_xls"
                                    className="xls_image"
                                  />
                                  <img
                                    src={xls_active}
                                    alt="File_xls_active"
                                    className="xls_image_active"
                                  />
                                  <span className="export-text">
                                    Export as Excel
                                  </span>
                                </Button>
                              ),
                              className: "export-menu-item",
                            },
                            {
                              key: "1",
                              label: (
                                <Button
                                  className="export-excel"
                                  loading={loadPdf}
                                  style={{
                                    border: "none",
                                    boxShadow: "none",
                                    outline: "none",
                                  }}
                                >
                                  <img
                                    src={File_pdf}
                                    alt="File_pdf"
                                    className="pdf_image"
                                  />
                                  <img
                                    src={File_pdf_active}
                                    alt="File_pdf_active"
                                    className="pdf_image_active"
                                  />
                                  <span className="export-text">
                                    Export as PDF
                                  </span>
                                </Button>
                              ),
                              className: "export-menu-item",
                            },
                          ],
                          onClick: ({ key }) => handleMenuClick(key),
                          className: "account-statement-export-dropdown",
                        }}
                        trigger={["click"]}
                        open={dropdownVisible}
                        onOpenChange={(visible) => setDropdownVisible(visible)}
                      >
                        <Space>
                          <p style={{ color: "var(--kilde-blue)" }}>
                            Download report
                          </p>
                          <img src={Download_icon} alt="Download_icon" />
                        </Space>
                      </Dropdown>
                    ) : (
                      <Space>
                        <p
                          style={{
                            color: "var(--black-40, rgba(26, 32, 44, 0.40))",
                            cursor: "none",
                          }}
                        >
                          Download report
                        </p>
                        <img src={Download_icon_disable} alt="Download_icon" />
                      </Space>
                    )}
                  </div>
                </div>
                <Col xs={24} className="invest-col mt-24">
                  <Button
                    className="invest-showfilterbutton"
                    onClick={() => setFilterModal(true)}
                    style={{ height: 36 }}
                  >
                    Show Filters
                    <img src={SlidersHorizontal} alt="img" />
                  </Button>
                </Col>
                <Col xs={24} className="mt-24">
                  <AccountSummaryTable />
                  <div className="mt-24">
                    <TransactionTable />
                  </div>
                </Col>
              </Col>
            </Row>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default AccountStatement;
