import React, { useState } from "react";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import { Button, Col, Modal, Row } from "antd";
import { CancelInvest, InvestTranche } from "../../../Apis/DashboardApi";
import { setTrancheResponse } from "../../../Redux/Action/Investor";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ErrorResponse } from "../../../Utils/ErrorResponse";
import {
  formatCurrency,
  showMessageWithCloseIcon,
} from "../../../Utils/Reusables";
import { getUser } from "../../../Apis/UserApi";
import { setUserDetails } from "../../../Redux/Action/User";

const InvestDetails = ({ TrancheRes, setLoader }) => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [cancelInvestLoading, setCancelInvestLoading] = useState(false);
  const [cancelInvestModal, setCancelInvestModal] = useState(false);

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching invest details data:", error);
      return null;
    }
  };

  const handleCancelInvestment = () => {
    setCancelInvestLoading(true);
    const requestBody = {
      trancheUuid: TrancheRes?.tranche?.uuid,
    };
    CancelInvest(requestBody)
      .then(async (cancelInvestmentData) => {
        if (Object.keys(cancelInvestmentData)?.length > 0) {
          showMessageWithCloseIcon(
            "Your committed investment is successfully canceled.."
          );
          getUserDetails();
          setCancelInvestLoading(false);
          setCancelInvestModal(false);
          handleGetTranche();
        } else {
          setCancelInvestLoading(false);
        }
      })
      .catch((error) => {
        ErrorResponse(error?.code);
        setCancelInvestLoading(false);
      });
  };

  const handleGetTranche = () => {
    setLoader(true);
    const requestBody = {
      trancheUuid: slug,
    };
    InvestTranche(requestBody).then(async (tracheRes) => {
      await setTrancheResponse(tracheRes, dispatch);
      setLoader(false);
    });
  };

  const investItems = [
    {
      key: "1",
      label: (
        <div className="sb-flex-justify-between">
          <div>
            <p className="trache-details mt-0 mb-0">Funded investment</p>
          </div>
          <div className="trache-details mb-0">
            <p className="mt-0 mb-0">
              {formatCurrency(
                TrancheRes?.tranche?.currencyCode === "USD"
                  ? "$"
                  : TrancheRes?.tranche?.currencyCode === "SGD"
                  ? "S$"
                  : "€",
                TrancheRes?.investment?.principalSettled
              )}
            </p>
          </div>
        </div>
      ),
      children: (
        <div className="sb-flex-justify-between">
          <div>
            <p className="trache-sub-details mt-0 mb-0">Discounted price</p>
          </div>
          <div className="trache-sub-details mb-0">
            <p className="mt-0 mb-0">
              {formatCurrency(
                TrancheRes?.tranche?.currencyCode === "USD"
                  ? "$"
                  : TrancheRes?.tranche?.currencyCode === "SGD"
                  ? "S$"
                  : "€",
                TrancheRes?.tranche?.discountedPrice *
                  TrancheRes?.investment?.debentureCount
              )}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="sb-flex-justify-between">
          <div>
            <p className="trache-details mt-0 mb-0">Committed investments</p>
          </div>
          <div>
            <p className="trache-details mt-0 mb-0">
              {formatCurrency(
                TrancheRes?.tranche?.currencyCode === "USD"
                  ? "$"
                  : TrancheRes?.tranche?.currencyCode === "SGD"
                  ? "S$"
                  : "€",
                TrancheRes?.investment?.principalSubscribed
              )}
            </p>
          </div>
        </div>
      ),
      children: (
        <div className="sb-flex-justify-between">
          <div>
            <p className="trache-sub-details mt-0 mb-0">Discounted price</p>
          </div>
          <div className="trache-sub-details mb-0">
            <p className="mt-0 mb-0">
              {formatCurrency(
                TrancheRes?.tranche?.currencyCode === "USD"
                  ? "$"
                  : TrancheRes?.tranche?.currencyCode === "SGD"
                  ? "S$"
                  : "€",
                TrancheRes?.tranche?.discountedPrice *
                  TrancheRes?.investment?.debentureCount
              )}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Col
      xs={24}
      sm={24}
      md={24}
      lg={24}
      className="infomation-div medium-tranch-col"
    >
      <div className="invest-detail-media-div">
        <div>
          <p className="m-0 tranch-head">Your Investments</p>
        </div>
        {TrancheRes?.investment?.principalInvested !== 0 && (
          <div className="mt-16">
            <p className="m-0 tranch-head">
              {formatCurrency(
                TrancheRes?.tranche?.currencyCode === "USD"
                  ? "$"
                  : TrancheRes?.tranche?.currencyCode === "SGD"
                  ? "S$"
                  : "€",
                TrancheRes?.investment?.principalInvested
              )}
            </p>
          </div>
        )}
      </div>
      {TrancheRes?.investment?.principalInvested === 0 && (
        <p className="mt-16 no-data-text">
          You have no investments in the tranche
        </p>
      )}
      {TrancheRes?.investment?.principalInvested > 0 && (
        <>
          {/* {TrancheRes?.tranche?.discountedPrice > 0 ? (
            <Collapse
              className="invest-collapse"
              items={investItems}
              bordered={false}
            />
          ) : (
            <> */}{" "}
          <div className="sb-flex-justify-between">
            <div>
              <p className="trache-details mb-0">Funded investment</p>
            </div>
            <div className="trache-details mb-0">
              <p>
                {formatCurrency(
                  TrancheRes?.tranche?.currencyCode === "USD"
                    ? "$"
                    : TrancheRes?.tranche?.currencyCode === "SGD"
                    ? "S$"
                    : "€",
                  TrancheRes?.investment?.principalSettled
                )}
              </p>
            </div>
          </div>
          <div className="sb-flex-justify-between">
            <div>
              <p className="trache-details mt-0 mb-0">Committed investments</p>
            </div>
            <div>
              <p className="trache-details mt-0 mb-0">
                {formatCurrency(
                  TrancheRes?.tranche?.currencyCode === "USD"
                    ? "$"
                    : TrancheRes?.tranche?.currencyCode === "SGD"
                    ? "S$"
                    : "€",
                  TrancheRes?.investment?.principalSubscribed
                )}
              </p>
            </div>
          </div>
          {/* </>
          )} */}
          <div
            className={
              TrancheRes?.investment?.principalSubscribed > 0
                ? "cancel-invest-div"
                : "cancel-invest-div-hide"
            }
          >
            <Button
              loading={cancelInvestLoading}
              onClick={() => {
                setCancelInvestModal(true);
              }}
            >
              Cancel
            </Button>
          </div>
          {TrancheRes?.investment?.principalSubscribed > 0 && (
            <Row className="invest-detail-div mt-8">
              <Col sx={24} sm={24} md={24}>
                <p>
                  Thank you for investing with us! Your investment is being
                  processed and will be settled within one business day.
                </p>
              </Col>
            </Row>
          )}
        </>
      )}

      <Modal
        centered
        open={cancelInvestModal}
        onCancel={() => {
          setCancelInvestModal(false);
        }}
        width={464}
        footer={null}
        maskClosable={false}
        className="withdraw-modal"
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to cancel your committed investment (
          {formatCurrency(
            TrancheRes?.tranche?.currencyCode === "USD"
              ? "$"
              : TrancheRes?.tranche?.currencyCode === "SGD"
              ? "S$"
              : "€",
            TrancheRes?.investment?.principalSubscribed
          )}
          ) ?
        </p>

        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setCancelInvestModal(false);
            }}
          >
            No
          </Button>
          <ButtonDefault
            loading={cancelInvestLoading}
            style={{ width: "100%" }}
            title="Yes"
            onClick={handleCancelInvestment}
          />
        </div>
      </Modal>
    </Col>
  );
};

export default InvestDetails;
