import { Button, Col, Modal } from "antd";
import React, { useState } from "react";
import {
  formatCurrency,
  showMessageWithCloseIcon,
} from "../../../Utils/Reusables";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import {
  CancelReservationBond,
  ReservationBond,
} from "../../../Apis/DashboardApi";
import { getUser } from "../../../Apis/UserApi";
import { setUserDetails } from "../../../Redux/Action/User";
import { useDispatch } from "react-redux";

const ReservationDetails = ({ TrancheRes, setRenderComponent }) => {
  const dispatch = useDispatch();
  const [approveModal, setApproveModal] = useState(false);
  const [cancelApproveModal, setCancelApproveModal] = useState(false);
  const [cancelReservationLoading, setCancelReservationLoading] =
    useState(false);
  const [approveReservationLoading, setApproveReservationLoading] =
    useState(false);

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      return null || error;
    }
  };

  const handleApproveReservation = async () => {
    try {
      setApproveReservationLoading(true);

      const data = {
        trancheId: TrancheRes?.tranche?.uuid,
      };
      const response = await ReservationBond(data);
      if (!response) {
        showMessageWithCloseIcon("Reservation Approved successfully.");
        getUserDetails();
        setApproveModal(false);
        setRenderComponent(true);
      }
    } catch (error) {
      showMessageWithCloseIcon(
        "Failed to approve the reservation. Please try again."
      );
    } finally {
      setApproveReservationLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    try {
      setCancelReservationLoading(true);

      const data = {
        trancheId: TrancheRes?.tranche?.uuid,
      };
      const response = await CancelReservationBond(data);
      if (!response) {
        showMessageWithCloseIcon("Reservation successfully canceled.");
        setApproveReservationLoading(false);
        setCancelApproveModal(false);
      }
    } catch (error) {
      showMessageWithCloseIcon(
        "Failed to cancel the reservation. Please try again."
      );
    } finally {
      setCancelReservationLoading(false);
    }
  };

  return (
    <Col
      xs={24}
      sm={24}
      md={24}
      lg={24}
      className="infomation-div medium-tranch-col"
    >
      <div className="invest-reserve-detail-media-div">
        <div>
          <p className="m-0 tranch-head">Your reservation details</p>
        </div>
        {TrancheRes?.reservation?.principalReserved !== 0 && (
          <div>
            <p className="m-0 tranch-head">
              {formatCurrency(
                TrancheRes?.tranche?.currencyCode === "USD"
                  ? "$"
                  : TrancheRes?.tranche?.currencyCode === "SGD"
                  ? "S$"
                  : "€",
                TrancheRes?.reservation?.principalReserved
              )}
            </p>
          </div>
        )}
      </div>
      <div className="reserve-details-div">
        <Button className="invest-btn" onClick={() => setApproveModal(true)}>
          Approve
        </Button>
        <div className="cancel-invest-div">
          <Button
            onClick={() => {
              setCancelApproveModal(true);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
      <Modal
        centered
        open={approveModal}
        onCancel={() => {
          setApproveModal(false);
        }}
        width={460}
        footer={null}
        maskClosable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to Approve Reservation?
        </p>

        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setApproveModal(false);
            }}
          >
            No
          </Button>
          <ButtonDefault
            loading={approveReservationLoading}
            style={{ width: "100%" }}
            title="Yes"
            onClick={handleApproveReservation}
          />
        </div>
      </Modal>
      <Modal
        centered
        open={cancelApproveModal}
        onCancel={() => {
          setCancelApproveModal(false);
        }}
        width={460}
        footer={null}
        maskClosable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to Cancel Reservation?
        </p>

        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setCancelApproveModal(false);
            }}
          >
            No
          </Button>
          <ButtonDefault
            loading={cancelReservationLoading}
            style={{ width: "100%" }}
            title="Yes"
            onClick={handleCancelReservation}
          />
        </div>
      </Modal>
    </Col>
  );
};

export default ReservationDetails;
