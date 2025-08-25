/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row, Pagination, Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import InputDefault from "../../../Components/InputDefault/InputDefault";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import SelectDefault from "../../../Components/SelectDefault/SelectDefault";
import { RequestCurrencyExchange } from "../../../Apis/DashboardApi";
import { ErrorResponse } from "../../../Utils/ErrorResponse";
import CurrencyExchangeList from "./CurrencyExchangeList";
import CurrencyExchangeCard from "./CurrencyExchangeCard";
import { getUser } from "../../../Apis/UserApi";
import { setUserDetails } from "../../../Redux/Action/User";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrencyExchangeList } from "../../../Apis/WalletApi";
import {
  formatCurrency,
  handleFinish,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../../Utils/Reusables";
import ArrowUpAndDownIcon from "../../../Assets/Images/SVGs/ArrowLineUpDown.svg";
import ROUTES from "../../../Config/Routes";
import noData from "../../../Assets/Images/File.svg";

const CurrencyExchange = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [confirmModal, setConfirmModal] = useState(false);
  const user = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState();
  const [list, setList] = useState();
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [data, setData] = useState({
    currencyCodeFrom: "",
    currencyCodeTo: "",
    additionalNotes: "",
    amount: "",
  });
  const isDisabled = user?.investorStatus !== "ACTIVE";

  const [validationErrors, setValidationErrors] = useState({
    currencyCodeFrom: false,
    currencyCodeTo: false,
    amount: false,
  });
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );
  const [msgCurrencyFrom, setMsgCurrencyFrom] = useState("");
  const [msgCurrencyTo, setMsgCurrencyTo] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      if (user?.accounts !== undefined) {
        await handleCheckBalance(user?.accounts);
      }
    };

    fetchBalance();
  }, [user?.accounts, data?.currencyCodeFrom, data?.currencyCodeTo]);

  const handleCheckBalance = async (accounts) => {
    for (const currency of accounts) {
      if (currency?.currencyCode === data?.currencyCodeFrom) {
        setMsgCurrencyFrom(currency?.balance);
      }
      if (currency?.currencyCode === data?.currencyCodeTo) {
        setMsgCurrencyTo(currency?.balance);
      }
    }
    return null;
  };

  useEffect(() => {
    if (localStorage.getItem("currencyExchangePageSize") !== null) {
      setItemPerPage(
        parseInt(localStorage.getItem("currencyExchangePageSize"))
      );
    }
  }, [itemsPerPage]);

  const handleFinishCurrency = () => {
    if (!data?.currencyCodeFrom || !data?.currencyCodeTo || !data?.amount) {
      setValidationErrors({
        currencyCodeFrom: true,
        currencyCodeTo: true,
        amount: true,
      });
    } else if (data?.currencyCodeFrom === data?.currencyCodeTo) {
      showMessageWithCloseIconError(
        "Please select different currencies for conversion. The 'From' and 'To' currencies cannot be the same."
      );
    } else if (data?.amount > msgCurrencyFrom) {
      showMessageWithCloseIconError("Insufficient balance in your wallet.");
    } else {
      setConfirmModal(true);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    handleGetCurrencyExchange();
  }, [currentPage, itemsPerPage]);

  const getUserDetails = async () => {
    const response = await getUser();
    if (response) {
      setUserDetails(response, dispatch);
      return response;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleWheel = (event) => {
      if (
        document.activeElement.type === "number" &&
        document.activeElement.classList.contains("noscroll")
      ) {
        document.activeElement.blur();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleGetCurrencyExchange = async () => {
    const filterPayload = {
      page: currentPage,
      pageSize: itemsPerPage,
    };
    try {
      const response = await getCurrencyExchangeList(filterPayload);
      if (response) {
        setIsLoading(false);
        setList(response?.requests);
        setTotalItem(response?.totalRequest);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching currency exchange data:", error);
      return null;
    }
  };

  const handleChange = (page) => {
    setCurrentPage(page);
  };

  const requestBody = {
    currencyCodeFrom: data?.currencyCodeFrom,
    currencyCodeTo: data?.currencyCodeTo,
    additionalNotes: data?.additionalNotes,
    amount: data?.amount,
  };

  const handleCurrencyExchange = async () => {
    setLoader(true);
    RequestCurrencyExchange(requestBody)
      .then(async (curr) => {
        if (Object.keys(curr)?.length > 0) {
          setLoader(false);
          setConfirmModal(false);
          setData({
            currencyCodeFrom: "",
            currencyCodeTo: "",
            additionalNotes: "",
            amount: "",
          });
          setValidationErrors({
            currencyCodeFrom: false,
            currencyCodeTo: false,
            amount: false,
          });
        } else {
          showMessageWithCloseIcon(
            "Your currency exchange request has been successfully submitted. Please allow some time for processing."
          );
          getUserDetails().then(async (profileResponse) => {
            Cookies.remove("user", { path: "/" });
            Cookies.set("user", JSON.stringify(profileResponse), {
              path: "/",
              sameSite: "Lax",
            });
          });
          setConfirmModal(false);
          setLoader(false);
          setData({
            currencyCodeFrom: "",
            currencyCodeTo: "",
            additionalNotes: "",
            amount: "",
          });
          setValidationErrors({
            currencyCodeFrom: false,
            currencyCodeTo: false,
            amount: false,
          });
          handleGetCurrencyExchange();
        }
      })
      .catch((error) => {
        ErrorResponse(error?.code);
        setLoader(false);
        setConfirmModal(false);
      });
  };

  const onShowSizeChange = (current, size) => {
    setItemPerPage(size);
    localStorage.setItem("currencyExchangePageSize", size);
  };

  const currencyOptions = [
    { key: "USD", value: "USD" },
    { key: "SGD", value: "SGD" },
    { key: "EUR", value: "EUR" },
  ];

  const getFilteredOptions = (selectedCurrency, allOptions) => {
    return allOptions.filter((option) => option.value !== selectedCurrency);
  };

  return (
    <div>
      <Row>
        <Col
          sm={24}
          md={24}
          lg={24}
          className="gutter-row wallet-info-div"
          style={{ flex: 1 }}
        >
          {(user?.verificationState === "" ||
            user?.verificationState === null ||
            user?.verificationState === "WAITING_INVESTOR_DATA") &&
          user?.investorStatus !== "ACTIVE" ? (
            <>
              <p className="wallet-sub-head mt-0 mb-16">
                Your account is not active yet.
              </p>
              <p className="wallet-unactive-ins mt-0 mb-16">
                {user?.investorType === "INDIVIDUAL" ? (
                  "You will be able to exchange currency and invest funds once your account is activated."
                ) : (
                  <>
                    Complete onboarding and KYB to unlock full platform
                    features: investing, deposits, withdrawals, and currency
                    exchange. Contact{" "}
                    <a
                      href="mailto:sales@kilde.sg"
                      style={{ color: "var(--kilde-blue)" }}
                    >
                      sales@kilde.sg
                    </a>{" "}
                    for assistance.
                  </>
                )}
              </p>
              <ButtonDefault
                title="Finish Onboarding"
                onClick={() => handleFinish(user, navigate)}
              />
            </>
          ) : user?.investorStatus !== "ACTIVE" &&
            (user?.verificationState === "MANUAL_REVIEW" ||
              user?.verificationState === "COMPLETED") &&
            user?.secondFactorAuth !== null ? (
            <>
              <p className="wallet-sub-head mt-0 mb-16">
                Your account is not active yet.
              </p>
              <p className="wallet-unactive-ins mt-0 mb-16">
                {user?.investorType === "INDIVIDUAL" ? (
                  "We are currently reviewing the documents you have submitted.Once the review process is complete and your KYC requirements are met, your account will be activated. After activation, you will be able to start investing funds and exchange currency.."
                ) : (
                  <>
                    Complete onboarding and KYB to unlock full platform
                    features: investing, deposits, withdrawals, and currency
                    exchange. Contact{" "}
                    <a
                      href="mailto:sales@kilde.sg"
                      style={{ color: "var(--kilde-blue)" }}
                    >
                      sales@kilde.sg
                    </a>{" "}
                    for assistance.
                  </>
                )}
              </p>
            </>
          ) : (user?.investorStatus !== "ACTIVE" ||
              user?.verificationState === "MANUAL_REVIEW" ||
              user?.verificationState === "COMPLETED") &&
            user?.secondFactorAuth === null &&
            user?.twoFaCheckEnabled === true ? (
            <>
              <p className="wallet-sub-head mt-0 mb-16">
                Secure your account to start investing
              </p>
              <p className="wallet-unactive-ins mt-0 mb-16">
                To begin investing, you’ll need to set up biometric login (like
                fingerprint or face ID) or two-factor authentication. It’s
                quick, secure, and required to protect your portfolio.
              </p>
              <ButtonDefault
                title="Protect your Account"
                onClick={() => navigate(ROUTES.TWO_FACTOR_AUTH)}
              />
            </>
          ) : accountNo?.length > 0 ? (
            <>
              <Row gutter={16}>
                <Col className="gutter-row mb-20" md={12} sm={24} xs={24}>
                  <label className="mb-4 wallet-label">From</label>
                  <SelectDefault
                    validationState={validationErrors?.currencyCodeFrom}
                    value={data?.currencyCodeFrom}
                    MyValue={data?.currencyCodeFrom}
                    type="text"
                    name="currencyCodeFrom"
                    data={currencyOptions}
                    onChange={(value) => {
                      setData({ ...data, currencyCodeFrom: value });
                    }}
                    required={true}
                    errorMsg={"Currency code is required"}
                    disabled={isDisabled}
                    focusing={validationErrors?.currencyCodeFrom}
                    placeholder="$"
                    suffixIcon={
                      <img src={ArrowUpAndDownIcon} alt="arrow-icon" />
                    }
                  />
                </Col>
                <Col className="gutter-row mb-20" md={12} sm={24} xs={24}>
                  <label className="mb-4 wallet-label">To</label>
                  <SelectDefault
                    validationState={validationErrors?.currencyCodeTo}
                    value={data?.currencyCodeTo}
                    MyValue={data?.currencyCodeTo}
                    type="text"
                    name="currencyCodeTo"
                    required={true}
                    errorMsg={"Currency code is required"}
                    data={getFilteredOptions(
                      data?.currencyCodeFrom,
                      currencyOptions
                    )}
                    onChange={(value) => {
                      setData({ ...data, currencyCodeTo: value });
                    }}
                    disabled={isDisabled}
                    focusing={validationErrors?.currencyCodeTo}
                    suffixIcon={
                      <img src={ArrowUpAndDownIcon} alt="arrow-icon" />
                    }
                    placeholder="SGD"
                  />
                  {/* {msgCurrencyTo !== "" && (
                    <span className="curr-exchange-span">
                      You have{" "}
                      <span className="currency-bold">
                        {formatCurrency("", msgCurrencyTo)}{" "}
                        {data?.currencyCodeTo}
                      </span>{" "}
                      in your balance
                    </span>
                  )} */}
                </Col>
                <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
                  <div className="withdraw-label">
                    <label className="mb-4   wallet-label">Amount</label>
                    <label
                      className="mb-4 cursor-pointer"
                      onClick={() => {
                        setData({
                          ...data,
                          amount: msgCurrencyFrom,
                        });
                        setValidationErrors({
                          ...validationErrors,
                          amount: false,
                        });
                      }}
                    >
                      MAX
                    </label>
                  </div>
                  <InputDefault
                    className="noscroll"
                    type="number"
                    name="amount"
                    required={true}
                    errorMsg={"Please enter the amount"}
                    onChange={(e) => {
                      setData({ ...data, amount: e.target.value });
                    }}
                    disabled={isDisabled}
                    validationState={setValidationErrors}
                    focusing={validationErrors?.amount}
                    value={data?.amount}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {msgCurrencyFrom !== "" && (
                      <span className="curr-exchange-span">
                        You have{" "}
                        <span
                          className="currency-bold cursor-pointer"
                          onClick={() => {
                            setData({
                              ...data,
                              amount: msgCurrencyFrom,
                            });
                            setValidationErrors({
                              ...validationErrors,
                              amount: false,
                            });
                          }}
                        >
                          {formatCurrency("", msgCurrencyFrom)}{" "}
                          {data?.currencyCodeFrom}
                        </span>{" "}
                        in your wallet
                      </span>
                    )}
                    {data?.amount > msgCurrencyFrom && data.amount !== "" ? (
                      <span style={{ color: "red", fontSize: "12px" }}>
                        Insufficient {data?.currencyCode} balance in your
                        wallet.
                      </span>
                    ) : null}
                  </div>
                </Col>

                {/* <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
                  <label className="mb-4 wallet-label">Additional Note</label>
                  <InputDefault
                    placeholder="Your note"
                    type="text"
                    name="additionalNotes"
                    onChange={(e) => {
                      setData({ ...data, additionalNotes: e.target.value });
                    }}
                    disabled={isDisabled}
                    validationState={setValidationErrors}
                    focusing={validationErrors?.additionalNotes}
                    value={data?.additionalNotes}
                  />
                </Col> */}
                <Col className="media-width">
                  <ButtonDefault
                    title="Submit"
                    style={{ width: "100%" }}
                    onClick={handleFinishCurrency}
                    loading={loader}
                    disabled={isDisabled}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <>
              <p className="wallet-sub-head mt-0 mb-16">
                Banking Information Required
              </p>
              <p className="wallet-unactive-ins mt-0 mb-16">
                To exchange currency and invest funds, please add your banking
                information.
              </p>
            </>
          )}
        </Col>
      </Row>
      {windowWidth >= 576 ? (
        <Col
          sm={24}
          md={24}
          lg={24}
          className="gutter-row wallet-info-div mt-20"
          style={{ flex: 1 }}
        >
          <Row>
            <p className="mt-0 wallet-sub-head mb-16">
              Currency Exchange Requests
            </p>
          </Row>
          <CurrencyExchangeList
            currencyExchangeLists={list}
            isLoading={isLoading}
          />
        </Col>
      ) : (
        <div>
          <Row className="mt-40">
            <p className="mt-0 wallet-sub-head mb-12">
              Currency Exchange Requests
            </p>
          </Row>
          <Row>
            {list?.length > 0 ? (
              list?.map((request, index) => (
                <CurrencyExchangeCard request={request} index={index} />
              ))
            ) : (
              <div className="not-found-container withdraw-card mt-8">
                <img alt="nothing found" src={noData} />
                <p className="not-found-text">No data</p>
              </div>
            )}
          </Row>
        </div>
      )}
      {list?.length > 0 && (
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
      )}
      <Modal
        centered
        open={confirmModal}
        onCancel={() => {
          setConfirmModal(false);
        }}
        width={464}
        footer={null}
        maskClosable={false}
        className="withdraw-modal"
        closable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to make currency exchange?
        </p>

        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setConfirmModal(false);
            }}
          >
            Cancel
          </Button>
          <ButtonDefault
            loading={loader}
            style={{ width: "100%" }}
            title="Confirm"
            onClick={() => {
              handleCurrencyExchange();
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CurrencyExchange;
