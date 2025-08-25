/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Col,
  Modal,
  Pagination,
  Row,
  Select,
  Skeleton,
  Spin,
  Table,
  Tabs,
} from "antd";
import React, { useEffect, useState, Children } from "react";
import ROUTES from "../../../Config/Routes";
import { useNavigate } from "react-router-dom";
import Arrow from "../../../Assets/Images/arrow.svg";
import Close from "../../../Assets/Images/Icons/Dashboard/close_icon.svg";
import "./style.css";
import {
  approvedReservedInvestmentsSummary,
  cancelReservedInvestmentsSummary,
  InvestmentSummary,
  ReservedInvestmentsSummary,
  UnsubscribeTranche,
} from "../../../Apis/DashboardApi";
import { britishFormatDate } from "../../../Utils/Helpers";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import InvestmentCard from "./InvestmentCard";
import { LoadingOutlined } from "@ant-design/icons";
import NoInvestmentIcon from "../../../Assets/Images/noinvestement.svg";
import {
  formatCurrency,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
  useWindowWidth,
} from "../../../Utils/Reusables";
import ReservedInvestment from "./ReservedInvestment";
import ReservedInvestmentCard from "./ReservedInvestmentCard";

const DashboardInvestment = ({
  showButtonActive,
  currencyCode,
  activeKey,
  setActiveKey,
  reservedtotalItem,
  setReservedTotalItem,
}) => {
  const navigate = useNavigate();
  const [totalItem, setTotalItem] = useState();
  const windowWidth = useWindowWidth();
  const [investSummaryList, setInvestSummaryList] = useState();
  const [investSummaryLoader, setInvestSummaryLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [cancelCommitModal, setCancelCommitModal] = useState(false);
  const [cancelCommitLoading, setCancelCommitLoading] = useState(false);
  const [cancelCommitInvestId, setCancelCommitInvestId] = useState();
  const [principal_invest_sort, setPrincipal_invest_sort] = useState("");
  const [maturityDate_sort, setMaturityDate_sort] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [handleField, setHandleField] = useState(null);
  const { Option } = Select;
  const [filterVisible, setFilterVisible] = useState(false);
  const [isStatusClicked, setIsStatusClicked] = useState(false);

  const [reservedInvestLoader, setReservedInvestLoader] = useState(false);
  const [reservedCurrentPage, setReservedCurrentPage] = useState(1);
  const [reservedItemsPerPage, setReservedItemPerPage] = useState(10);
  const [reservedInvestmentList, setReservedInvestmentList] = useState([]);
  const [reserved_maturityDate_sort, setReserved_MaturityDate_sort] =
    useState("");
  const [cancelReservedLoading, setCancelReservedLoading] = useState(false);
  const [approvedReservedLoading, setApprovedReservedLoading] = useState(false);
  const [cancelReservedInvestId, setCancelReservedInvestId] = useState();
  const [cancelReservedModal, setCancelReservedModal] = useState(false);
  const [approvedReservedModal, setApprovedReservedModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("dashboardPageSize") !== null) {
      setItemPerPage(parseInt(localStorage.getItem("dashboardPageSize")));
    }
  }, [itemsPerPage]);

  useEffect(() => {
    if (localStorage.getItem("reservedInvestPageSize") !== null) {
      setReservedItemPerPage(
        parseInt(localStorage.getItem("reservedInvestPageSize"))
      );
    }
  }, [reservedItemsPerPage]);

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    setFilterVisible(false);
  };

  const handleClearFilter = () => {
    setSelectedFilter(null);
    setFilterVisible(false);
  };

  const handleViewTranche = (trancheUuid) => {
    navigate(`${ROUTES.TRANCH_INVEST}/${trancheUuid}`);
  };
  const outstandingPaymentColumns = [
    {
      title: "Tranche number / Title",
      dataIndex: "trancheNumber",
    },
    {
      title: "Kilde rating",
      dataIndex: "kildeRating",
    },
    {
      title: "Interest rate",
      dataIndex: "interestRate",
    },
    {
      title: "Interest received",
      dataIndex: "interestReceived",
    },
    {
      title: "Outstanding principal",
      dataIndex: "outstandingPrincipal",
      sorter: (a, b) => a.age - b.age,
      sortOrder: principal_invest_sort,
      sortDirections: ["ascend", "descend", "ascend"],
      onHeaderCell: () => ({
        onClick: () => {
          if (principal_invest_sort === "ascend") {
            setPrincipal_invest_sort("descend");
            setMaturityDate_sort("");
          } else if (principal_invest_sort === "descend") {
            setPrincipal_invest_sort("");
          } else {
            setPrincipal_invest_sort("ascend");
            setMaturityDate_sort("");
          }
        },
      }),
    },
    {
      title: "Maturity date",
      dataIndex: "maturityDate",
      sorter: (a, b) => a.age - b.age,
      sortOrder: maturityDate_sort,
      sortDirections: ["ascend", "descend", "ascend"],
      onHeaderCell: () => ({
        onClick: () => {
          if (maturityDate_sort === "ascend") {
            setMaturityDate_sort("descend");
            setPrincipal_invest_sort("");
          } else if (maturityDate_sort === "descend") {
            setMaturityDate_sort("");
          } else {
            setMaturityDate_sort("ascend");
            setPrincipal_invest_sort("");
          }
        },
      }),
    },
    {
      title: "Next payment",
      dataIndex: "nextPayment",
    },
    {
      title: () => (
        <div
          onClick={() => {
            setFilterVisible(!filterVisible);
            setIsStatusClicked(!filterVisible);
          }}
          style={{
            color: isStatusClicked ? "#22B5E9" : "inherit",
            cursor: "pointer",
          }}
        >
          Status
        </div>
      ),
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Outstanding",
          value: "OUTSTANDING",
        },
        {
          text: "Committed",
          value: "COMMITED",
        },
        {
          text: "Repaid",
          value: "REPAID",
        },
      ],
      filterDropdown: ({ confirm }) => (
        <div style={{ padding: 8, display: "flex", flexDirection: "column" }}>
          <Select
            defaultValue={selectedFilter || "Select Status"}
            onChange={(value) => {
              handleFilterChange(value);
              confirm({ closeDropdown: true });
            }}
          >
            <Option value="OUTSTANDING">
              <p className="invest-outstanding-p">Outstanding</p>
            </Option>
            <Option value="COMMITED">
              <p className="invest-committed-p">Committed</p>
            </Option>
            <Option value="REPAID">
              <p className="invest-repaid-p">Repaid</p>
            </Option>{" "}
          </Select>
          <Button
            onClick={() => {
              handleClearFilter();
              confirm({ closeDropdown: true });
            }}
            className="mt-4"
            disabled={selectedFilter === null}
          >
            Clear Filter
          </Button>
        </div>
      ),
      filterDropdownOpen: filterVisible,
      onFilterDropdownOpenChange: (visible) => setFilterVisible(visible),
      onFilter: (value, record) => record.status.includes(value),
    },
    {
      title: " ",
      dataIndex: "arrow",
    },
    {
      title: " ",
      dataIndex: "sign",
    },
  ];

  const outstandingPaymentData =
    investSummaryList?.length > 0 &&
    investSummaryList?.map((item, index) => {
      return {
        key: index,
        uuid: item?.uuid,
        trancheNumber: (
          <div className="cursor-pointer">
            <p className="m-0">{item?.trancheNumber}</p>
            <h3 className="m-0">{item?.trancheTitle}</h3>
          </div>
        ),
        kildeRating: item?.creditRating,
        interestRate: formatCurrency("", item?.interestRate) + "%",

        interestReceived:
          item?.investmentStatus === "COMMITED"
            ? "-"
            : formatCurrency(item?.currencySymbol, item?.interestPaid),
        outstandingPrincipal: (
          <>
            <p className="m-0">
              {formatCurrency(item?.currencySymbol, item?.principalInvestment)}
            </p>
            {item?.investmentStatus === "OUTSTANDING" &&
            item?.principalOsByAutoInvest > 0 ? (
              <p className="m-0">
                {`Auto: ${formatCurrency(
                  item?.currencySymbol,
                  item?.principalOsByAutoInvest
                )}`}
              </p>
            ) : item?.investmentStatus === "COMMITED" &&
              item?.principalSubscribedByAutoInvest > 0 ? (
              <p className="m-0">
                {`Auto: ${formatCurrency(
                  item?.currencySymbol,
                  item?.principalSubscribedByAutoInvest
                )}`}
              </p>
            ) : null}
          </>
        ),
        maturityDate: britishFormatDate(item?.maturityDate),
        nextPayment: (
          <div>
            <p className="dashborad-inv-text">
              {item?.investmentStatus === "OUTSTANDING"
                ? item?.nextPaymentDate === null
                  ? ""
                  : britishFormatDate(item?.nextPaymentDate)
                : item?.investmentStatus === "COMMITED"
                ? item?.nextPaymentDateOfSubscribed === null
                  ? ""
                  : britishFormatDate(item?.nextPaymentDateOfSubscribed)
                : "-"}
            </p>
            <p className="dashborad-inv-text">
              {item?.investmentStatus === "OUTSTANDING"
                ? item?.nextPaymentDate === null
                  ? ""
                  : formatCurrency(
                      item?.currencySymbol,
                      item?.nextPaymentAmount
                    )
                : item?.investmentStatus === "COMMITED"
                ? item?.nextPaymentDateOfSubscribed === null
                  ? ""
                  : formatCurrency(
                      item?.currencySymbol,
                      item?.nextPaymentAmountOfSubscribed
                    )
                : null}
            </p>
            {item?.dpd > 0 ? (
              <p className="invest-table-warning-msg">
                {item?.investmentStatus === "OUTSTANDING"
                  ? `Days past due: ${item?.dpd}`
                  : null}
              </p>
            ) : null}
          </div>
        ),
        status:
          item?.investmentStatus === "OUTSTANDING" ? (
            <p className="invest-outstanding-p">Outstanding</p>
          ) : item?.investmentStatus === "REPAID" ? (
            <p className="invest-repaid-p">Repaid</p>
          ) : (
            <p className="invest-committed-p">Committed</p>
          ),
        arrow: (
          <div onClick={() => handleViewTranche(item?.uuid)}>
            <img src={Arrow} alt="right_arrow" className="cursor-pointer" />
          </div>
        ),
        sign:
          item?.investmentStatus === "COMMITED" ? (
            <div
              className="cursor-pointer"
              onClick={() => handleOpenModal(item?.uuid)}
            >
              <img src={Close} alt="close_icon" />
            </div>
          ) : null,
      };
    });

  const handleOpenModal = (capitalId) => {
    setCancelCommitInvestId(capitalId);
    setCancelCommitModal(true);
  };

  const onShowSizeChange = (current, pageSize) => {
    setItemPerPage(pageSize);
    localStorage.setItem("dashboardPageSize", pageSize);
  };

  const onReserveShowSizeChange = (current, pageSize) => {
    setReservedItemPerPage(pageSize);
    localStorage.setItem("reservedInvestPageSize", pageSize);
  };

  const handleChange = (page) => {
    setCurrentPage(page);
    handleInvestPortfolioList(page, itemsPerPage);
  };

  const handleReserveChange = (page) => {
    setReservedCurrentPage(page);
    handleReservedInvestList(page, reservedItemsPerPage);
  };

  const handleReservedInvestList = (page, items) => {
    setReservedInvestLoader(true);
    const filterPayload = {
      page: page,
      pageSize: items,
      currencyCode: currencyCode,
      ordering: [],
    };

    if (reserved_maturityDate_sort !== "") {
      filterPayload.ordering.push({
        field: "maturity_date",
        asc: reserved_maturityDate_sort === "ascend" ? true : false,
      });
    }
    ReservedInvestmentsSummary(filterPayload).then(async (summary) => {
      setReservedInvestLoader(false);
      setReservedTotalItem(summary?.totalItems);
      setReservedInvestmentList(summary?.items);
    });
  };

  const handleInvestPortfolioList = (page, items) => {
    setInvestSummaryLoader(true);
    const filterPayload = {
      page: page,
      pageSize: items,
      currencyCode: currencyCode,
      ordering: [],
    };
    if (principal_invest_sort !== "") {
      filterPayload.ordering.push({
        field: "principal_invest",
        asc: principal_invest_sort === "ascend" ? true : false,
      });
    }
    if (maturityDate_sort !== "") {
      filterPayload.ordering.push({
        field: "maturity_date",
        asc: maturityDate_sort === "ascend" ? true : false,
      });
    }
    if (selectedFilter !== null) {
      filterPayload["investmentStatus"] = selectedFilter;
    }
    InvestmentSummary(filterPayload).then(async (summary) => {
      setInvestSummaryLoader(false);
      setTotalItem(summary?.totalItems);
      setInvestSummaryList(summary?.items);
    });
  };

  const items = [
    {
      key: "1",
      label: "Your Investments",
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

  const resetPageAndFetch = () => {
    setCurrentPage(1);
    handleInvestPortfolioList(1, itemsPerPage);
  };

  useEffect(() => {
    if (
      principal_invest_sort !== undefined ||
      maturityDate_sort !== undefined ||
      selectedFilter !== undefined ||
      currencyCode !== undefined ||
      itemsPerPage !== 5
    ) {
      resetPageAndFetch();
    }
  }, [
    principal_invest_sort,
    maturityDate_sort,
    selectedFilter,
    currencyCode,
    itemsPerPage,
  ]);

  const resetReservePageAndFetch = () => {
    setReservedCurrentPage(1);
    handleReservedInvestList(1, itemsPerPage);
  };

  useEffect(() => {
    if (
      reserved_maturityDate_sort !== undefined ||
      currencyCode !== undefined ||
      reservedItemsPerPage !== 5
    ) {
      resetReservePageAndFetch();
    }
  }, [reserved_maturityDate_sort, currencyCode, setReservedItemPerPage]);

  const handleCancelCommitInvestment = async () => {
    setCancelCommitLoading(true);
    const data = {
      trancheUuid: cancelCommitInvestId,
    };
    try {
      const response = await UnsubscribeTranche(data);
      if (response?.trancheUuid) {
        showMessageWithCloseIcon("Committed investment successfully canceled.");
        setCancelCommitModal(false);
        handleInvestPortfolioList(currentPage, itemsPerPage);
        setCancelCommitLoading(false);
        setCancelCommitInvestId("");
      } else {
        setCancelCommitLoading(false);
      }
    } catch (error) {
      showMessageWithCloseIconError(error?.message);
      setCancelCommitLoading(false);
      throw error;
    }
  };

  const handleCancelReservedInvestment = async () => {
    setCancelReservedLoading(true);
    const data = {
      trancheUuid: cancelReservedInvestId,
    };
    try {
      const response = await cancelReservedInvestmentsSummary(data);
      if (!response) {
        setCancelReservedModal(false);
        handleReservedInvestList(currentPage, itemsPerPage);
        setCancelReservedLoading(false);
        setCancelReservedInvestId("");
      } else {
        setCancelReservedLoading(false);
        setCancelReservedModal(false);
      }
    } catch (error) {
      showMessageWithCloseIconError(error?.message);
      setCancelReservedLoading(false);
      throw error;
    }
  };
  const handleApprovedReservedInvestment = async () => {
    setApprovedReservedLoading(true);
    const data = {
      trancheUuid: cancelReservedInvestId,
    };
    try {
      const response = await approvedReservedInvestmentsSummary(data);
      if (!response) {
        setApprovedReservedModal(false);
        handleReservedInvestList(currentPage, itemsPerPage);
        setApprovedReservedLoading(false);
        setCancelReservedInvestId("");
      } else {
        showMessageWithCloseIconError("Couldn`t process reservation");
        setApprovedReservedModal(false);
        setApprovedReservedLoading(false);
      }
    } catch (error) {
      showMessageWithCloseIconError(error?.message);
      setApprovedReservedLoading(false);
      throw error;
    }
  };

  const handleFieldValue = (field) => {
    setHandleField(field);
  };

  const handleFieldWiseSorting = (value) => {
    if (handleField === "principal_invest") {
      setPrincipal_invest_sort(value === "ascend" ? true : false);
    } else if (handleField === "maturity_date") {
      setMaturityDate_sort(value === "ascend" ? true : false);
    } else {
      setHandleField(value);
      setPrincipal_invest_sort("");
      setMaturityDate_sort("");
    }
  };

  const components = {
    body: {
      row: (props) => {
        const showSkeleton =
          props?.children[6]?.props?.record?.nextPayment?.props?.children[0]
            ?.props?.children === null ||
          props?.children[6]?.props?.record?.nextPayment?.props?.children[0]
            ?.props?.children === "";

        const childrenArray = Children.toArray(props.children);

        return showSkeleton ? (
          <tr
            className="commit-progress-row"
            onClick={() =>
              handleViewTranche(childrenArray[0]?.props?.record?.uuid)
            }
          >
            <td {...childrenArray[0].props}>
              {childrenArray[0]?.props?.record?.trancheNumber}
            </td>
            {childrenArray.slice(1, -3).map((child, index) => (
              <td key={index}>
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 1, width: "100%" }}
                />
              </td>
            ))}
            <td {...childrenArray[childrenArray.length - 2].props}>
              <p className="invest-inprogress-p">In Progress</p>
            </td>
            <td {...childrenArray[childrenArray.length - 1].props}>
              <div
                onClick={() =>
                  handleViewTranche(childrenArray[0]?.props?.record?.uuid)
                }
              >
                <img src={Arrow} alt="right_arrow" className="cursor-pointer" />
              </div>
            </td>
            <td>
              <div
                className="cursor-pointer"
                onClick={() =>
                  handleOpenModal(childrenArray[0]?.props?.record?.uuid)
                }
              >
                <img src={Close} alt="close_icon" />
              </div>
            </td>
          </tr>
        ) : (
          <tr {...props} />
        );
      },
    },
  };

  return (
    <Row className="mt-0 mb-10 media-borrower-b-row card-view">
      {showButtonActive && windowWidth <= 768 ? (
        <div>
          <div
            className={activeKey === "1" ? "sorting-div" : "not-sorting-div"}
          >
            <div className="d-flex">
              <div className="cursor-pointer m-0">
                Sort by:
                <Select
                  defaultValue="Outstanding Payment"
                  className="dashboard-sorting-selectbox"
                  onChange={(value) => handleFieldValue(value)}
                  options={[
                    {
                      value: "principal_invest",
                      label: "Outstanding Principal",
                    },
                    {
                      value: "maturity_date",
                      label: "Maturity Date",
                    },
                    {
                      value: "investmentStatus",
                      label: "Status",
                    },
                  ]}
                />
              </div>
              {handleField === "principal_invest" ||
              handleField === "maturity_date" ||
              handleField === null ? (
                <div className="cursor-pointer m-0">
                  Sort from:
                  <Select
                    placeholder="Highest"
                    className="dashboard-sorting-selectbox"
                    onChange={(value) => handleFieldWiseSorting(value)}
                    options={[
                      {
                        value: "descend",
                        label: "Highest",
                      },
                      {
                        value: "ascend",
                        label: "Lowest",
                      },
                    ]}
                  />
                </div>
              ) : (
                <div className="cursor-pointer m-0">
                  Filter by:
                  <Select
                    placeholder="Select Status"
                    defaultValue="OUTSTANDING"
                    className="dashboard-sorting-selectbox"
                    onChange={(value) => setSelectedFilter(value)}
                    options={[
                      {
                        value: "OUTSTANDING",
                        label: (
                          <p className="invest-outstanding-p">Outstanding</p>
                        ),
                      },
                      {
                        value: "COMMITED",
                        label: <p className="invest-committed-p">Committed</p>,
                      },
                      {
                        value: "REPAID",
                        label: <p className="invest-repaid-p">Repaid</p>,
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
          {investSummaryLoader ? (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 50, color: "var(--kilde-blue)" }}
                />
              }
              spinning={investSummaryLoader}
            />
          ) : activeKey === "1" && investSummaryList?.length > 0 ? (
            investSummaryList?.map((item, index) => (
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={8}
                key={index}
                style={{ marginBottom: 0 }}
              >
                <InvestmentCard item={item} onCancelCommit={handleOpenModal} />
              </Col>
            ))
          ) : activeKey === "2" && reservedInvestmentList?.length > 0 ? (
            reservedInvestmentList?.map((item, index) => (
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={8}
                key={index}
                style={{ marginBottom: 0 }}
              >
                <ReservedInvestmentCard
                  item={item}
                  setCancelReservedInvestId={setCancelReservedInvestId}
                  setCancelReservedModal={setCancelReservedModal}
                  setApprovedReservedModal={setApprovedReservedModal}
                />
              </Col>
            ))
          ) : activeKey === "1" || activeKey === "2" ? (
            <div className="no-investment-div ">
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
          ) : null}
        </div>
      ) : (
        <Col className="gutter-row infomation-div" xs={24} sm={24} md={24}>
          {showButtonActive === false ? null : (
            <>
              <div>
                <Tabs
                  defaultActiveKey={activeKey}
                  items={items}
                  onChange={(key) => {
                    setActiveKey(key);
                    localStorage.setItem("activeTabKey", key);
                  }}
                  className="wallet-tab"
                />
              </div>
            </>
          )}
          {activeKey === "1" ? (
            <Table
              scroll={{ x: "auto" }}
              columns={outstandingPaymentColumns}
              dataSource={outstandingPaymentData}
              className="trache-table outstanding-pay-table"
              components={components} // Use custom components if loading
              pagination={false}
              loading={
                investSummaryLoader
                  ? {
                      indicator: (
                        <div>
                          <Spin />
                        </div>
                      ),
                    }
                  : false
              }
              onRow={(record, rowIndex) => {
                return {
                  onClick: (e) => {
                    const columnIndex = e.target.closest("td")?.cellIndex;
                    const isLastColumn =
                      columnIndex === outstandingPaymentColumns.length - 1;
                    if (!isLastColumn) {
                      handleViewTranche(record.uuid);
                    }
                  },
                };
              }}
            />
          ) : (
            <ReservedInvestment
              currencyCode={currencyCode}
              reservedInvestmentList={reservedInvestmentList}
              reservedInvestLoader={reservedInvestLoader}
              reserved_maturityDate_sort={reserved_maturityDate_sort}
              setReserved_MaturityDate_sort={setReserved_MaturityDate_sort}
              cancelReservedLoading={cancelReservedLoading}
              setCancelReservedInvestId={setCancelReservedInvestId}
              handleCancelReservedInvestment={handleCancelReservedInvestment}
              setCancelReservedModal={setCancelReservedModal}
              cancelReservedModal={cancelReservedModal}
              approvedReservedLoading={approvedReservedLoading}
              approvedReservedModal={approvedReservedModal}
              setApprovedReservedModal={setApprovedReservedModal}
              setApprovedReservedLoading={setApprovedReservedLoading}
              handleApprovedReservedInvestment={
                handleApprovedReservedInvestment
              }
            />
          )}
        </Col>
      )}
      <Col xs={24}>
        {investSummaryList?.length > 0 && activeKey === "1" ? (
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
        ) : reservedInvestmentList?.length > 0 && activeKey === "2" ? (
          <Pagination
            className="tranch-table-pagination"
            pageSize={reservedItemsPerPage}
            current={reservedCurrentPage}
            total={reservedtotalItem}
            onChange={handleReserveChange}
            showSizeChanger
            onShowSizeChange={onReserveShowSizeChange}
            pageSizeOptions={["10", "20", "50", "100"]}
            locale={{
              items_per_page: " ",
            }}
          />
        ) : null}
      </Col>

      <Modal
        centered
        open={cancelCommitModal}
        onCancel={() => {
          setCancelCommitModal(false);
        }}
        width={464}
        footer={null}
        maskClosable={false}
        className="withdraw-modal"
        closable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to cancel committed Investment?
        </p>
        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setCancelCommitModal(false);
            }}
          >
            Cancel
          </Button>
          <ButtonDefault
            loading={cancelCommitLoading}
            style={{ width: "100%" }}
            title="Confirm"
            onClick={() => {
              handleCancelCommitInvestment();
            }}
          />
        </div>
      </Modal>

      <Modal
        centered
        open={cancelReservedModal}
        onCancel={() => {
          setCancelReservedModal(false);
        }}
        width={464}
        footer={null}
        maskClosable={false}
        className="withdraw-modal"
        closable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to cancel reserved Investment?
        </p>
        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setCancelReservedModal(false);
            }}
          >
            Cancel
          </Button>
          <ButtonDefault
            loading={cancelReservedLoading}
            style={{ width: "100%" }}
            title="Confirm"
            onClick={() => {
              handleCancelReservedInvestment();
            }}
          />
        </div>
      </Modal>
      <Modal
        centered
        open={approvedReservedModal}
        onCancel={() => {
          setApprovedReservedModal(false);
        }}
        width={464}
        footer={null}
        maskClosable={false}
        className="withdraw-modal"
        closable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to approved reserved Investment?
        </p>
        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setApprovedReservedModal(false);
            }}
          >
            Cancel
          </Button>
          <ButtonDefault
            loading={approvedReservedLoading}
            style={{ width: "100%" }}
            title="Confirm"
            onClick={() => {
              handleApprovedReservedInvestment();
            }}
          />
        </div>
      </Modal>
    </Row>
  );
};
export default DashboardInvestment;
