import React, { useEffect, useState } from "react";
import { debounce } from "lodash";

import Down_blue_arrow from "../../../Assets/Images/Icons/down_blue_arrow.svg";
import EditStratergy from "../../../Assets/Images/SVGs/edit_stratergy";
import DeleteStratergy from "../../../Assets/Images/SVGs/delete_stratergy";
import pauseStratergy from "../../../Assets/Images/Icons/pause_stratergy.svg";
import continueStratergy from "../../../Assets/Images/Icons/continue_stratergy.svg";

import Create_stratergy from "../../../Assets/Images/Icons/create_stratergy.svg";
import {
  Button,
  Col,
  Modal,
  Pagination,
  Row,
  Spin,
  Table,
  Tooltip,
  message,
} from "antd";
import AutoInvestmentCard from "./AutoInvestmentCard";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../Config/Routes";
import {
  AutoInvestmentListing,
  activateStrategy,
  deleteStrategy,
  pauseStrategy,
} from "../../../Apis/AutoInvestment";
import { britishFormatDate } from "../../../Utils/Helpers";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import { useSelector } from "react-redux";
import {
  formatCurrency,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
  useWindowWidth,
} from "../../../Utils/Reusables";
import DashboardLayout from "../../../Layouts/DashboardLayout/DashboardLayout";
import FinishOnboarding from "./FinishOnboarding";
import ActiveUserBanner from "../../Settings/ActiveUserBanner";
import { allowedUserIds } from "../../../Utils/Constant";

const AutoInvestment = ({ showButtonActive, showLayout }) => {
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState();
  const [autoInvestmentListLoader, setAutoInvestmentListLoader] =
    useState(false);
  const [autoInvestList, setAutoInvestList] = useState();
  const [loadingStates, setLoadingStates] = useState(false);
  const [stratergyActionModal, setStratergyActionModal] = useState(false);
  const [action, setAction] = useState("Pause");
  const [actionStartergyId, setActionStratergyId] = useState("");
  const [actionStartergyName, setActionStratergyName] = useState("");
  const user = useSelector((state) => state.user);
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );

  useEffect(() => {
    if (localStorage.getItem("trancheAutoPageSize") !== null) {
      setItemPerPage(parseInt(localStorage.getItem("trancheAutoPageSize")));
    }
  }, [itemsPerPage]);

  const handlePause = (uuid, name) => {
    setActionStratergyId(uuid);
    setActionStratergyName(name);
    setAction("pause");
    setStratergyActionModal(true);
  };

  const handlePlay = (uuid, name) => {
    setActionStratergyId(uuid);
    setActionStratergyName(name);
    setAction("play");
    setStratergyActionModal(true);
  };

  const handleDelete = (uuid, name) => {
    setActionStratergyId(uuid);
    setActionStratergyName(name);
    setAction("delete");
    setStratergyActionModal(true);
  };

  const handleInvestListing = (page) => {
    setAutoInvestmentListLoader(true);
    const filterPayload = {
      page: page,
      pageSize: itemsPerPage,
      ordering: [
        {
          field: "name",
          asc: true,
        },
      ],
    };

    AutoInvestmentListing(filterPayload).then((trachRes) => {
      setAutoInvestmentListLoader(false);
      setTotalItem(trachRes?.totalItems);
      setAutoInvestList(trachRes?.items);
    });
  };

  useEffect(() => {
    resetPageAndFetch();
  }, [itemsPerPage]);

  const resetPageAndFetch = debounce(() => {
    setCurrentPage(1);
    handleInvestListing(1);
  }, 300);

  const handleChange = (page) => {
    setCurrentPage(page);
    handleInvestListing(page);
  };

  const onShowSizeChange = (current, pageSize) => {
    setItemPerPage(pageSize);
    localStorage.setItem("trancheAutoPageSize", pageSize);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Interest rate",
      dataIndex: "interestRate",
      key: "interestRate",
    },
    {
      title: "Portfolio size",
      dataIndex: "portfoliosize",
      key: "portfoliosize",
    },
    {
      title: "Outstanding amount",
      dataIndex: "outstandingAmount",
      key: "outstandingAmount",
    },
    {
      title: "Remaining loan term  (m)",
      dataIndex: "remainingLoanTerm",
      key: "remainingLoanTerm",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
    },
  ];

  const autoInvestmentData =
    autoInvestList?.length > 0 &&
    autoInvestList?.map((item, index) => {
      return {
        key: index,
        name: (
          <p
            className="m-0 table-stratedy-name fw-600"
            onClick={() => navigate(`${ROUTES.EDIT_STRATEGY}/${item?.uuid}`)}
          >
            {item?.name}
          </p>
        ),
        status:
          item?.status === "ACTIVE" ? (
            <div className="stratergy-status-div">
              <span className="active-stratergy-span"></span>
              <p className="active-stratergy-p">{item?.status}</p>
            </div>
          ) : (
            <div className="stratergy-status-div">
              <span className="pause-invest-span"></span>
              <p className="pause-invest-p">{item?.status}</p>
            </div>
          ),
        currency: item?.currencyCode,
        interestRate: `${item?.params?.minInterestRate}% - ${item?.params?.maxInterestRate}%`,
        portfoliosize: formatCurrency(
          item?.currencySymbol,
          item?.params?.portfolioSize
        ),
        outstandingAmount: formatCurrency(
          item?.currencySymbol,
          item?.outstandingPrincipal
        ),
        remainingLoanTerm: `${item?.params?.minRemainingLoanTerm} - ${item?.params?.maxRemainingLoanTerm} m.`,
        action: (
          <div className="strategy-btn-div">
            <Tooltip placement="top" title="Edit">
              <Button
                className="strategy-btn"
                onClick={() =>
                  navigate(`${ROUTES.EDIT_STRATEGY}/${item?.uuid}`)
                }
              >
                <EditStratergy className="edit-stratergy-icon" />
              </Button>
            </Tooltip>
            {item?.status === "PAUSED" ? (
              <Tooltip placement="top" title="Active">
                <Button
                  className="strategy-btn"
                  onClick={() => handlePlay(item?.uuid, item?.name)}
                >
                  <img src={pauseStratergy} alt="pauseStratergy" />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip placement="top" title="Pause">
                <Button
                  className="strategy-btn"
                  onClick={() => handlePause(item?.uuid, item?.name)}
                >
                  <img src={continueStratergy} alt="continueStratergy" />
                </Button>
              </Tooltip>
            )}
            <Tooltip placement="top" title="Delete">
              <Button
                className="strategy-btn"
                onClick={() => handleDelete(item?.uuid, item?.name)}
              >
                <DeleteStratergy className="delete-stratergy-icon" />
              </Button>
            </Tooltip>
          </div>
        ),
        investments: item?.investments?.map((inv, invIndex) => ({
          key: invIndex,
          company: inv?.company,
          interestRate: `${inv?.interestRate}%`,
          maturityDate: britishFormatDate(inv?.maturityDate),
          outstandingPrincipal: formatCurrency(
            item?.currencySymbol,
            inv?.outstandingPrincipal
          ),
        })),
      };
    });

  const childColumn = [
    { title: "Company", dataIndex: "company", key: "company" },
    {
      title: "Interest Rate",
      dataIndex: "interestRate",
      key: "interestRate",
    },
    {
      title: "Maturity date",
      dataIndex: "maturityDate",
      key: "maturityDate",
    },
    {
      title: "Outstanding principal",
      dataIndex: "outstandingPrincipal",
      key: "outstandingPrincipal",
    },
  ];

  const handlePauseStrategy = async () => {
    setLoadingStates(true);
    try {
      const resp = await pauseStrategy({ uuid: actionStartergyId });
      if (resp === "") {
        showMessageWithCloseIcon("Strategy paused successfully!");
        setStratergyActionModal(false);
        setLoadingStates(false);
        setActionStratergyId("");
        handleInvestListing(currentPage);
      } else {
        setLoadingStates(false);
        setActionStratergyId("");
      }
    } catch (error) {
      setLoadingStates(false);
      setActionStratergyId("");
    }
  };

  const handleActiveStrategy = async () => {
    setLoadingStates(true);
    try {
      const resp = await activateStrategy({ uuid: actionStartergyId });
      if (resp === "") {
        showMessageWithCloseIcon("Strategy activated successfully!");
        setStratergyActionModal(false);
        setLoadingStates(false);
        setActionStratergyId("");
        handleInvestListing(currentPage);
      } else {
        setLoadingStates(false);
        setActionStratergyId("");
      }
    } catch (error) {
      setLoadingStates(false);
      setActionStratergyId("");
    }
  };

  const handleDeleteStrategy = async () => {
    setLoadingStates(true);
    try {
      const resp = await deleteStrategy({ uuid: actionStartergyId });
      if (resp === "") {
        showMessageWithCloseIcon("Strategy deleted successfully!");
        setStratergyActionModal(false);
        setLoadingStates(false);
        setActionStratergyId("");
        handleInvestListing(currentPage);
      } else {
        setLoadingStates(false);
        setActionStratergyId("");
      }
    } catch (error) {
      setLoadingStates(false);
      setActionStratergyId("");
    }
  };

  const handleAction = () => {
    if (action === "play") {
      handleActiveStrategy();
    } else if (action === "pause") {
      handlePauseStrategy();
    } else if (action === "delete") {
      handleDeleteStrategy();
    }
  };

  const handleCreateStartergy = () => {
    if (user?.investorStatus !== "ACTIVE") {
      return showMessageWithCloseIconError(
        "Please complete the onboarding process to start your investment journey."
      );
    } else if (
      user?.secondFactorAuth === null &&
      user?.twoFaCheckEnabled === true &&
      user?.investorStatus === "ACTIVE"
    ) {
      return showMessageWithCloseIconError(
        "Please enable Two Factor Authentication to start investing"
      );
    } else {
      return navigate(ROUTES.CREATE_STRATEGY);
    }
  };

  const content = (
    <div className={showLayout === false ? null : "trance-listing-main-div"}>
      {showLayout !== false && (
        <>
          {(user?.investorStatus !== "ACTIVE" ||
            (user?.investorStatus === "ACTIVE" && accountNo?.length <= 0) ||
            (user?.secondFactorAuth === null &&
              user?.twoFaCheckEnabled === true)) && <FinishOnboarding />}

          {allowedUserIds.includes(user?.number) && <ActiveUserBanner />}
        </>
      )}

      <Row>
        <Col sx={24} sm={24} className="mb-24 w-100">
          <Button
            className="create_stratergy_btn"
            icon={<img src={Create_stratergy} alt="create_stratergy" />}
            onClick={handleCreateStartergy}
          >
            Create Strategy
          </Button>
        </Col>
        {showButtonActive && windowWidth <= 768 ? (
          <Row gutter={[16, 16]}>
            {autoInvestList?.length > 0 &&
              autoInvestList?.map((item, index) => (
                <Col xs={24} sm={12} md={24} lg={8} key={index}>
                  <AutoInvestmentCard
                    item={item}
                    handlePauseStrategy={handlePause}
                    handleActiveStrategy={handlePlay}
                    handleDeleteStrategy={handleDelete}
                  />
                </Col>
              ))}
          </Row>
        ) : (
          <Col className="gutter-row infomation-div" xs={24} sm={24} md={24}>
            {showButtonActive === false ? null : (
              <p className="m-0 mb-16 tranch-head">
                Your Auto-investment Strategies
              </p>
            )}
            <Table
              scroll={{ x: "auto" }}
              columns={columns}
              expandable={{
                expandedRowRender: (record) => (
                  <Table
                    columns={childColumn}
                    dataSource={record?.investments?.map(
                      (investment, index) => ({
                        key: index,
                        company: investment.company,
                        interestRate: investment.interestRate,
                        maturityDate: investment?.maturityDate,
                        outstandingPrincipal: investment.outstandingPrincipal,
                      })
                    )}
                    pagination={false}
                  />
                ),
                expandIcon: ({ expanded, onExpand, record }) => (
                  <img
                    src={Down_blue_arrow}
                    alt="down_arrow"
                    onClick={(e) => onExpand(record, e)}
                    className="cursor-pointer"
                    style={{
                      transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  />
                ),
              }}
              dataSource={autoInvestmentData}
              className="trache-table outstanding-pay-table autoInvest-tbl"
              pagination={false}
              loading={
                autoInvestmentListLoader
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
        {autoInvestList?.length > 0 ? (
          <Col xs={24}>
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
        <Modal
          centered
          open={stratergyActionModal}
          width={405}
          footer={null}
          maskClosable={false}
          className="withdraw-modal"
          closable={false}
        >
          <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
            Are you sure you want to {action} Strategy {actionStartergyName}?
          </p>

          <div className="sb-text-align d-flex">
            <Button
              className="remove-modal-back-btn mr-8 w-100"
              onClick={() => {
                setStratergyActionModal(false);
                setActionStratergyId("");
              }}
            >
              Back
            </Button>
            <ButtonDefault
              loading={loadingStates}
              style={{ width: "100%" }}
              title={action}
              onClick={handleAction}
            />
          </div>
        </Modal>
      </Row>
    </div>
  );

  return showLayout === false ? (
    content
  ) : (
    <DashboardLayout>{content}</DashboardLayout>
  );
};

export default AutoInvestment;
