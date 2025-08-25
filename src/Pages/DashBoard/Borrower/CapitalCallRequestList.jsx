import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Close from "../../../Assets/Images/Icons/Dashboard/close_icon.svg";
import Close_disabled from "../../../Assets/Images/Icons/Dashboard/close_disabled_icon.svg";
import { Button, Col, Modal, Spin, Table } from "antd";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import {
  CancelCapitalCallRequest,
  CapitalCallList,
  InvestTranche,
} from "../../../Apis/DashboardApi";
import { ErrorResponse } from "../../../Utils/ErrorResponse";
import {
  setCapitalRequests,
  setTrancheResponse,
} from "../../../Redux/Action/Investor";
import { britishFormatDate } from "../../../Utils/Helpers";
import {
  formatCurrency,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../../Utils/Reusables";
import Down_blue_arrow from "../../../Assets/Images/Icons/down_blue_arrow.svg";

const CapitalCallRequestList = ({
  TrancheRes,
  capitalRequestLoading,
  setCapitalRequestLoading,
}) => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [cancelCapitalRequestModal, setCancelCapitalRequestModal] = useState();
  const [cancelCapitalLoading, setCancelCapitalLoading] = useState(false);
  const [cancelCapitalRequestId, setCancelCapitalRequestId] = useState();
  const capitalRequestData = useSelector(
    (state) => state?.investor?.capital?.capitalCallRequests
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
      title: "Request date",
      dataIndex: "RequestDate",
    },
    {
      title: "Redemption date",
      dataIndex: "capitalCallDate",
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
    setCancelCapitalRequestId(capitalId);
    setCancelCapitalRequestModal(true);
  };

  let myCapitalData = showAll
    ? capitalRequestData
    : capitalRequestData?.slice(0, 5);

  const capitalCallRequestListData =
    myCapitalData?.length > 0 &&
    myCapitalData?.map((capital) => {
      return {
        key: capital?.key,
        RequestDate: britishFormatDate(capital?.requestDate),
        capitalCallDate: britishFormatDate(capital?.capitalCallDate),
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
          ) : capital.status === "NEW" ? (
            <div
              className="cursor-pointer"
              onClick={() => handleOpenModal(capital?.id)}
            >
              <img src={Close} alt="close_icon" />
            </div>
          ) : null,
      };
    });

  const handleCancelCapitalRequest = async () => {
    setCancelCapitalLoading(true);
    const data = {
      capitalCallId: cancelCapitalRequestId,
    };

    try {
      const response = await CancelCapitalCallRequest(data);
      if (response === "") {
        setCancelCapitalRequestModal(false);
        showMessageWithCloseIcon("Capital request successfully canceled.");
        getCapitalCallRequestList();
        setCancelCapitalLoading(false);
        getTrancheDetails();
      } else {
        setCancelCapitalLoading(false);
      }
    } catch (error) {
      showMessageWithCloseIconError(error?.message);
      setCancelCapitalLoading(false);
      throw error;
    }
  };

  const getCapitalCallRequestList = async () => {
    const requestBody = {
      trancheUuid: slug,
    };
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

  return (
    <Col
      className="gutter-row infomation-div mt-10"
      lg={24}
      md={24}
      sm={24}
      xs={24}
    >
      <p className="mt-0 tranch-head mb-16">Your Redemption Requests</p>

      <div className="table-container">
        <Table
          columns={capitalCallRequestListColumns}
          dataSource={capitalCallRequestListData}
          className="trache-table outstanding-pay-table"
          pagination={false}
          loading={
            capitalRequestLoading
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
      {capitalRequestData?.length > 5 ? (
        <Button className="show-all" onClick={handleShowMore}>
          {showAll ? "Show Less" : "Show More"}
          <img src={Down_blue_arrow} alt="down_blue_arrow" className="ml-4" />
        </Button>
      ) : null}

      <Modal
        centered
        open={cancelCapitalRequestModal}
        onCancel={() => {
          setCancelCapitalRequestModal(false);
        }}
        width={464}
        footer={null}
        maskClosable={false}
        className="withdraw-modal"
        closable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to cancel Capital call request?
        </p>

        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setCancelCapitalRequestModal(false);
            }}
          >
            Back
          </Button>
          <ButtonDefault
            style={{ width: "100%" }}
            title="Cancel"
            onClick={handleCancelCapitalRequest}
            loading={cancelCapitalLoading}
          />
        </div>
      </Modal>
    </Col>
  );
};

export default CapitalCallRequestList;
