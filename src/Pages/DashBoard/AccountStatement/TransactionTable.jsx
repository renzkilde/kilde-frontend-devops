/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Col, Pagination, Row, Spin, Table } from "antd";

import buttonActive from "../../../Assets/Images/ButtonActive.svg";
import frame from "../../../Assets/Images/Frame.svg";
import frameActive from "../../../Assets/Images/FrameActive.svg";
import button from "../../../Assets/Images/Button.svg";
import NoInvestmentIcon from "../../../Assets/Images/noinvestement.svg";
// import InfoIcon from "../../../Assets/Images/SVGs/Info.svg";

import DownloadNOA from "./DownloadNOA";

import { LoadingOutlined } from "@ant-design/icons";
import TransactionCard from "./TransactionCard";
import {
  britishFormatDateWithTime,
  formatCurrency,
  useWindowWidth,
} from "../../../Utils/Reusables";
import { useDispatch, useSelector } from "react-redux";
import { setTransactionList } from "../../../Redux/Action/Dashboards";
import { AccountStatementSummary } from "../../../Apis/DashboardApi";
import ROUTES from "../../../Config/Routes";
import { useNavigate } from "react-router-dom";
import TxStatus from "./TxStatus";

const TransactionTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();
  const [showButtonActive, setShowButtonActive] = useState(true);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState();
  const [transactionLoader, setTransactionLoader] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [transactionRows, setTransactionRows] = useState();

  const filterData = useSelector(
    (state) => state?.dashboards?.DashboardData?.accStatementFilterData
  );

  const postingDateFrom = filterData?.postingDateFrom;
  const postingDateTo = filterData?.postingDateTo;
  const currencyCode = filterData?.currencyCode;
  const txTypeSubtypeCombos = filterData?.txTypeSubtypeCombos;

  useEffect(() => {
    if (localStorage.getItem("accStatementTransactionPageSize") !== null) {
      setItemPerPage(
        parseInt(localStorage.getItem("accStatementTransactionPageSize"))
      );
    }
  }, []);

  const handleAccountStatement = (page, items) => {
    setTransactionLoader(true);
    const updatedTxTypeSubtypeCombos = txTypeSubtypeCombos?.map((combo) => {
      if (combo.txType === "SUBSCRIPTION" || combo.txType === "SETTLEMENT") {
        return {
          ...combo,
          txSubType: combo.txSubType?.map((subType) =>
            subType === "FEE" ? "INVESTOR_SUBSCRIPTION_FEE" : subType
          ),
        };
      }
      return combo;
    });
    const payload = {
      page: page,
      pageSize: items,
      postingDateFrom: postingDateFrom || null,
      postingDateTo: postingDateTo || null,
      currencyCode: currencyCode || "USD",
      txTypeSubtypeCombos:
        updatedTxTypeSubtypeCombos?.length > 0
          ? updatedTxTypeSubtypeCombos
          : [],
    };

    AccountStatementSummary(payload)
      .then(async (accountsummary) => {
        if (!accountsummary) {
          setTransactionLoader(false);
          return;
        }

        if (accountsummary && Object.keys(accountsummary)?.length > 0) {
          setTransactionRows(accountsummary?.txs);
          setTotalItem(accountsummary?.totalTxs);
          setCurrencySymbol(accountsummary?.currencySymbol);
          setTransactionList(accountsummary, dispatch);
          setTransactionLoader(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching account summary:", error);
        setTransactionLoader(false);
      });
  };

  const resetPageAndFetch = () => {
    setCurrentPage(1);
    handleAccountStatement(1, itemsPerPage);
  };

  useEffect(() => {
    if (
      postingDateFrom !== undefined ||
      postingDateTo !== undefined ||
      currencyCode !== undefined ||
      txTypeSubtypeCombos !== undefined ||
      txTypeSubtypeCombos?.length !== 0 ||
      itemsPerPage
    ) {
      resetPageAndFetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    txTypeSubtypeCombos,
    postingDateTo,
    postingDateFrom,
    currencyCode,
    itemsPerPage,
  ]);

  const handleButtonToggle = () => {
    setShowButtonActive((prevShowButtonActive) => !prevShowButtonActive);
  };

  const onShowSizeChange = (current, pageSize) => {
    setItemPerPage(pageSize);
    localStorage.setItem("accStatementTransactionPageSize", pageSize);
  };

  const handleChange = (page) => {
    if (currentPage === page) {
      return;
    }
    setCurrentPage(page);
    handleAccountStatement(page, itemsPerPage);
  };

  const transactionColumns = [
    {
      title: "TX ID",
      dataIndex: "tx_id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120, // <-- Set your desired width here (in px)
    },
    {
      title: "Tranche info",
      dataIndex: "trancheInfo",
    },
    {
      title: "Transaction",
      dataIndex: "transaction",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Reserved",
      dataIndex: "amount_reserved",
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },
    {
      title: (
        <div className="d-flex align-items-center gap-4">
          Documents{" "}
          {/* <Tooltip placement="top" title={DownloadDocTooltipContent}>
            <img src={InfoIcon} alt="info-icon" className="cursor-pointer" />
          </Tooltip> */}
        </div>
      ),
      dataIndex: "document",
    },
  ];

  const transactionData =
    transactionRows?.length > 0 &&
    transactionRows?.map((item, index) => ({
      key: index,
      tx_id: item.id,
      date: britishFormatDateWithTime(item?.postingTs),
      trancheInfo: (
        <div
          className={item?.trancheUuid ? "cursor-pointer" : ""}
          onClick={() => {
            if (item?.trancheUuid) {
              navigate(`${ROUTES.TRANCH_INVEST}/${item?.trancheUuid}`);
            }
          }}
        >
          <p className="m-0">
            {item?.trancheNumber !== null ? item?.trancheNumber : "-"}
          </p>
          <p className="m-0 transaction-company-head">{item?.trancheTitle}</p>
        </div>
      ),
      transaction: <TxStatus txTitle={item?.txTitle} txType={item?.txType} />,
      amount: formatCurrency(currencySymbol, item?.amount),
      amount_reserved: formatCurrency(currencySymbol, item?.amountReserved),
      balance: formatCurrency(currencySymbol, item?.balance),
      document: <DownloadNOA item={item} />,
    }));

  return (
    <div>
      <div className="transaction-grid-btn-div mt-24 mb-8">
        <div>
          <p className="m-0 tranch-head">Transaction</p>
        </div>
        <div className="currency-btn-div">
          {showButtonActive ? (
            <div
              className="transaction-button cursor-pointer"
              onClick={handleButtonToggle}
            >
              <img src={buttonActive} alt="button" />
              <img src={frame} alt="button" />
            </div>
          ) : (
            <div
              className="transaction-button cursor-pointer"
              value="passive"
              onClick={handleButtonToggle}
            >
              <img src={button} alt="button" />
              <img src={frameActive} alt="button" />
            </div>
          )}
        </div>
      </div>
      {showButtonActive && windowWidth <= 768 ? (
        <div>
          {transactionLoader ? (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 50, color: "var(--kilde-blue)" }}
                />
              }
              spinning={transactionLoader}
            />
          ) : (
            <>
              {transactionRows?.length > 0 ? (
                <Row gutter={[8, 8]}>
                  {transactionRows.map((item, index) => (
                    <Col xs={24} sm={12} key={index}>
                      <TransactionCard
                        item={item}
                        currencySymbol={currencySymbol}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="no-investment-div">
                  <div className="sb-flex-column-item-center">
                    <img src={NoInvestmentIcon} alt="no investment yet" />
                    <p
                      style={{
                        color: "var(--black-20, #1A202C33)",
                        fontSize: "12px",
                        lineHeight: "18px",
                        fontWeight: "400",
                      }}
                    >
                      No Investments yet
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <Col className="gutter-row summary-table-div" xs={24} sm={24} md={24}>
          <p className="m-0 tranch-head">Transaction</p>

          <Table
            scroll={{ x: "auto" }}
            columns={transactionColumns}
            dataSource={transactionData}
            className="trache-table outstanding-pay-table w-100"
            pagination={false}
            loading={
              transactionLoader
                ? {
                    indicator: (
                      <div>
                        <Spin />
                      </div>
                    ),
                  }
                : false
            }
          />
        </Col>
      )}

      {transactionRows?.length > 0 ? (
        <Col xs={24} className="summary-pagination-div">
          <Pagination
            className="tranch-table-pagination"
            pageSize={itemsPerPage}
            current={currentPage}
            total={totalItem}
            onChange={handleChange}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            pageSizeOptions={["10", "20", "50", "100"]}
            locale={{
              items_per_page: " ",
            }}
          />
        </Col>
      ) : null}
    </div>
  );
};

export default TransactionTable;
