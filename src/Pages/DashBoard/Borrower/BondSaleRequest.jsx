import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Close from "../../../Assets/Images/Icons/Dashboard/close_icon.svg";
import Close_disabled from "../../../Assets/Images/Icons/Dashboard/close_disabled_icon.svg";
import { Button, Col, Modal, Spin, Table, message } from "antd";
import { britishFormatDate } from "../../../Utils/Helpers";
import {
  formatCurrency,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../../Utils/Reusables";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import {
  BondSellList,
  CancelBondCallRequest,
  InvestTranche,
} from "../../../Apis/DashboardApi";
import {
  setBondSellRequests,
  setTrancheResponse,
} from "../../../Redux/Action/Investor";
import { ErrorResponse } from "../../../Utils/ErrorResponse";
import Down_blue_arrow from "../../../Assets/Images/Icons/down_blue_arrow.svg";

const BondSaleRequest = ({
  TrancheRes,
  bondSaleRequestLoading,
  setbondSaleRequestLoading,
}) => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [cancelBondRequestModal, setCancelBondRequestModal] = useState();
  const [cancelBondLoading, setCancelBondLoading] = useState(false);
  const [cancelBondRequestId, setCancelBondRequestId] = useState();
  const bondSellRequestData = useSelector(
    (state) => state?.investor?.bondSell?.sellOrders
  );
  const [showAll, setShowAll] = useState(false);

  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  const getTrancheDetails = async () => {
    await InvestTranche({
      trancheUuid: slug,
    }).then(async (tracheRes) => {
      setTrancheResponse(tracheRes, dispatch);
    });
  };

  const capitalCallRequestListColumns = [
    {
      title: "Sell request date",
      dataIndex: "RequestDate",
    },
    {
      title: "Settlement date",
      dataIndex: "settlementDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: " ",
      dataIndex: "Sign",
    },
  ];

  const handleOpenModal = (capitalId) => {
    setCancelBondRequestId(capitalId);
    setCancelBondRequestModal(true);
  };

  let myBondRequestData = showAll
    ? bondSellRequestData
    : bondSellRequestData?.slice(0, 5);

  const bondSellRequestListData =
    myBondRequestData?.length > 0 &&
    myBondRequestData?.map((capital) => {
      return {
        key: capital?.key,
        RequestDate: britishFormatDate(capital?.requestDate),
        settlementDate: britishFormatDate(capital?.settlementDate),
        amount: formatCurrency(
          TrancheRes?.tranche?.currencyCode === "USD"
            ? "$"
            : TrancheRes?.tranche?.currencyCode === "SGD"
            ? "S$"
            : "€",
          capital?.amount
        ),
        status:
          capital.status === "CANCELLED" ? (
            <div className="withdraw-status-div">
              <span className="capitalRequest-cancel-circle-span"></span>
              <p className="capitalRequest-cancel-p">Cancelled</p>
            </div>
          ) : capital.status === "NEW" ? (
            <div className="withdraw-status-div">
              <span className="capitalRequest-new-circle-span"></span>
              <p className="capitalRequest-new-p">New</p>
            </div>
          ) : capital.status === "SETTLED" ? (
            <div className="withdraw-status-div">
              <span className="capitalRequest-new-circle-span"></span>
              <p className="capitalRequest-new-p">Settled</p>
            </div>
          ) : capital.status === "PENDING" ? (
            <div className="withdraw-status-div">
              <span className="capitalRequest-new-circle-span"></span>
              <p className="capitalRequest-new-p">Pending</p>
            </div>
          ) : capital.status === "PAID" ? (
            <div className="withdraw-status-div">
              <span className="capitalRequest-paid-circle-span"></span>
              <p className="capitalRequest-paid-p">Paid</p>
            </div>
          ) : null,
        Sign:
          capital.status === "CANCELLED" ? (
            <div className="cursor-pointer">
              <img src={Close_disabled} alt="close_icon_disabled" />
            </div>
          ) : capital.status === "PAID" ? (
            <div className="cursor-pointer">
              <img src={Close_disabled} alt="close_icon_disabled" />
            </div>
          ) : capital.status === "SETTLED" ? (
            <div className="cursor-pointer">
              <img src={Close_disabled} alt="close_icon_disabled" />
            </div>
          ) : capital.status === "NEW" || capital.status === "PENDING" ? (
            <div
              className="cursor-pointer"
              onClick={() => handleOpenModal(capital?.id)}
            >
              <img src={Close} alt="close_icon" />
            </div>
          ) : null,
      };
    });

  const handleCancelBondRequest = async () => {
    setCancelBondLoading(true);
    const data = {
      sellOrderId: cancelBondRequestId,
    };

    try {
      const response = await CancelBondCallRequest(data);
      if (response === "") {
        setCancelBondRequestModal(false);
        showMessageWithCloseIcon("Bond sell request successfully canceled.");
        getBondSellRequestList();
        setCancelBondLoading(false);
        getTrancheDetails();
      } else {
        setCancelBondLoading(false);
      }
    } catch (error) {
      showMessageWithCloseIconError(error?.message);
      setCancelBondLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    getBondSellRequestList();
  }, []);

  const getBondSellRequestList = () => {
    setbondSaleRequestLoading(true);
    const requestBody = {
      trancheUuid: slug,
    };
    BondSellList(requestBody?.trancheUuid)
      .then(async (bondSellList) => {
        if (Object.keys(bondSellList)?.length > 0) {
          setBondSellRequests(bondSellList, dispatch);
          setbondSaleRequestLoading(false);
        } else {
          setbondSaleRequestLoading(false);
        }
      })
      .catch((error) => {
        ErrorResponse(error?.code);
        setbondSaleRequestLoading(false);
      });
  };

  return (
    <Col
      className="gutter-row infomation-div mt-10"
      lg={24}
      md={24}
      sm={24}
      xs={24}
    >
      <p className="mt-0 tranch-head mb-16">Your Bond Sale Requests</p>

      <div className="table-container">
        <Table
          columns={capitalCallRequestListColumns}
          dataSource={bondSellRequestListData}
          className="trache-table outstanding-pay-table"
          pagination={false}
          loading={
            bondSaleRequestLoading
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
      </div>
      {bondSellRequestData?.length > 5 ? (
        <Button className="show-all" onClick={handleShowMore}>
          {showAll ? "Show Less" : "Show More"}
          <img src={Down_blue_arrow} alt="down_blue_arrow" className="ml-4" />
        </Button>
      ) : null}

      <Modal
        centered
        open={cancelBondRequestModal}
        onCancel={() => {
          setCancelBondRequestModal(false);
        }}
        width={464}
        footer={null}
        maskClosable={false}
        className="withdraw-modal"
        closable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to cancel Bond sell request?
        </p>

        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setCancelBondRequestModal(false);
            }}
          >
            Back
          </Button>
          <ButtonDefault
            style={{ width: "100%" }}
            title="Cancel"
            onClick={handleCancelBondRequest}
            loading={cancelBondLoading}
          />
        </div>
      </Modal>
    </Col>
  );
};

export default BondSaleRequest;
