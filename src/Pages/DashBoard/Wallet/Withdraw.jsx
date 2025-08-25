/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Form, Modal, Pagination, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import InputDefault from "../../../Components/InputDefault/InputDefault";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import SelectDefault from "../../../Components/SelectDefault/SelectDefault";

import { useSelector, useDispatch } from "react-redux";
import WithdrawRequestList from "./WithdrawRequestList";
import WithdrawRequestCard from "./WithdrawRequestCard";
import {
  GetWithdrawalRequestListApi,
  RequestWithdrawalApi,
} from "../../../Apis/WalletApi";

import { useNavigate } from "react-router-dom";
import { setWithdrawRequestList } from "../../../Redux/Action/Wallet";
import {
  formatCurrency,
  handleFinish,
  isNonDBSSingaporeBank,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
  useWindowWidth,
} from "../../../Utils/Reusables";
import { setUserDetails } from "../../../Redux/Action/User";
import { getUser } from "../../../Apis/UserApi";
import ROUTES from "../../../Config/Routes";
import noData from "../../../Assets/Images/File.svg";

const Withdraw = ({ tabKey }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();
  const user = useSelector((state) => state?.user);
  const [walletBalance, setWalletBalance] = useState();
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const isDisabled = user?.investorStatus !== "ACTIVE";
  const withdrawalRequestList = useSelector(
    (state) => state?.wallet?.withDrawRequest
  );

  const [validationErrors, setValidationErrors] = useState({
    currencyCode: false,
    bankAccountUuid: false,
    amount: false,
  });

  const [isWithdrawalRequestLoading, setIsWithdrawalRequestLoading] =
    useState(false);
  const [totalItem, setTotalItem] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [msgCurrency, setMsgCurrency] = useState("");

  const [withdrawData, setWithdrawData] = useState({
    currencyCode: "",
    bankAccountUuid: "",
    amount: "",
  });

  const verifiedAccounts =
    accountNo?.filter((item) => item?.verified !== false) || [];

  useEffect(() => {
    if (
      verifiedAccounts.length > 0 &&
      (!withdrawData?.bankAccountUuid ||
        !verifiedAccounts.some(
          (item) => item.uuid === withdrawData.bankAccountUuid
        ))
    ) {
      setWithdrawData((prev) => ({
        ...prev,
        bankAccountUuid: verifiedAccounts[0].uuid,
      }));
    }
  }, [accountNo, verifiedAccounts]);

  const selectedAccount = verifiedAccounts.find(
    (item) => item.uuid === withdrawData?.bankAccountUuid
  );

  const showValue = selectedAccount?.uuid || undefined;

  useEffect(() => {
    if (localStorage.getItem("withdrawListPageSize") !== null) {
      setItemPerPage(parseInt(localStorage.getItem("withdrawListPageSize")));
    }
  }, [itemsPerPage]);

  const onShowSizeChange = (current, size) => {
    setItemPerPage(size);
    localStorage.setItem("withdrawListPageSize", size);
  };

  useEffect(() => {
    if (accountNo !== undefined && user?.accounts !== undefined) {
      setWithdrawData({
        bankAccountUuid: accountNo[0]?.uuid,
        currencyCode: user?.accounts[0]?.currencyCode,
        amount: "",
      });
    }
  }, [accountNo]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (user?.accounts !== undefined) {
        const accBalance = await handleCheckBalance(user?.accounts);
        setWalletBalance(accBalance);
      }
    };

    fetchBalance();
  }, [user?.accounts, withdrawData?.currencyCode]);

  const handleCheckBalance = async (accounts) => {
    for (const currency of accounts) {
      if (currency?.currencyCode === withdrawData?.currencyCode) {
        return currency?.balance;
      }
    }
    return null;
  };

  useEffect(() => {
    setValidationErrors({
      amount: false,
    });
  }, [tabKey]);

  useEffect(() => {
    getUser().then((response) => {
      if (
        Array.isArray(response?.accounts) &&
        response.accounts.length > 0 &&
        response.accounts[0]?.balance
      ) {
        setMsgCurrency(response.accounts[0].balance);
      }
    });
  }, []);

  const getUserDetails = async () => {
    const response = await getUser();
    if (response) {
      setUserDetails(response, dispatch);
      return response;
    }
  };

  useEffect(() => {
    setIsWithdrawalRequestLoading(true);
    getWithdrawalRequestList();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const handleWheel = (event) => {
      if (
        document.activeElement.type === "number" &&
        document.activeElement.classList.contains("noscroll")
      ) {
        document.activeElement.blur();
      }
    };

    document.addEventListener("wheel", handleWheel);
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const getWithdrawalRequestList = async () => {
    const filterPayload = {
      page: currentPage,
      pageSize: itemsPerPage,
    };

    try {
      const response = await GetWithdrawalRequestListApi(filterPayload);
      if (response) {
        setIsWithdrawalRequestLoading(false);
        setWithdrawRequestList(response?.requests, dispatch);
        setTotalItem(response?.totalRequest);
      }
    } catch (error) {
      setIsWithdrawalRequestLoading(false);
      console.error("Error fetching withdrawal request list data:", error);
      return null;
    }
  };

  const handleChange = (page) => {
    setCurrentPage(page);
  };

  const HandleWithdraw = () => {
    if (withdrawData?.amount > walletBalance) {
      showMessageWithCloseIconError("Insufficient balance in your wallet.");
    } else {
      if (
        !withdrawData?.currencyCode ||
        !withdrawData?.bankAccountUuid ||
        !withdrawData?.amount
      ) {
        setValidationErrors({
          currencyCode: true,
          bankAccountUuid: true,
          amount: true,
        });
      } else if (
        withdrawData?.currencyCode === "SGD" &&
        accountNo[0] &&
        isNonDBSSingaporeBank(accountNo[0].swiftCode) === true &&
        withdrawData?.amount > 200000
      ) {
        setValidationErrors({
          amount: true,
        });
        showMessageWithCloseIconError(
          "The maximum withdrawal limit for non-DBS bank transactions is SGD 200,000. Please adjust your request accordingly."
        );
      } else {
        setWithdrawModal(true);
      }
    }
  };

  const handleWithdrawAmount = async () => {
    setWithdrawLoading(true);
    try {
      const data = {
        currencyCode: withdrawData?.currencyCode,
        bankAccountUuid: withdrawData?.bankAccountUuid,
        amount: withdrawData?.amount,
      };

      const response = await RequestWithdrawalApi(data);

      if (Object.keys(response)?.length > 0) {
        setWithdrawLoading(false);
        setWithdrawModal(false);
        if (response?.fieldErrors?.amount === "INVALID_VALUE") {
          message.warning("Your bank account was deleted as per your request.");
        }
      } else {
        showMessageWithCloseIcon(
          "Your withdrawal request has been successfully submitted. Please allow some time for processing."
        );
        getUserDetails();
        setWithdrawModal(false);
        setWithdrawLoading(false);
        setWithdrawData({
          currencyCode: user?.accounts[0]?.currencyCode,
          bankAccountUuid: accountNo[0]?.uuid,
          amount: "",
        });
        setValidationErrors({
          currencyCode: false,
          bankAccountUuid: false,
          amount: false,
        });
        getWithdrawalRequestList();
      }
    } catch (error) {
      console.error("Error occurred while processing withdrawal:", error);
    }
  };

  const handleAccountChange = (value, key) => {
    setWithdrawData({
      ...withdrawData,
      currencyCode: key?.value,
    });
    for (const currency of user?.accounts) {
      if (currency?.currencyCode === key?.value) {
        setMsgCurrency(currency?.balance);
      }
    }
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
                  "You will be able to withdraw and invest funds once your account is activated."
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
                  "We are currently reviewing the documents you have submitted.Once the review process is complete and your KYC requirements are met, your account will be activated. After activation, you will be able to start investing and withdraw funds."
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
              <Form
                onFinish={HandleWithdraw}
                name="wrap"
                labelCol={{ flex: "110px" }}
                labelAlign="left"
                labelWrap
                wrapperCol={{ flex: 1 }}
                colon={false}
              >
                <Row gutter={16}>
                  <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
                    <label>Wallet</label>
                    <SelectDefault
                      validationState={validationErrors?.currencyCode}
                      value={withdrawData?.currencyCode}
                      MyValue={withdrawData?.currencyCode}
                      data={user?.accounts?.map((item) => ({
                        key: item.currencyCode,
                        value: item.currencyCode,
                      }))}
                      style={{ width: "100%" }}
                      onChange={handleAccountChange}
                      required={true}
                      disabled={isDisabled}
                      errorMsg={"Please select a currencyCode."}
                    />
                  </Col>
                  <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
                    <label className="mb-4">Bank account</label>
                    {/* <SelectDefault
                      validationState={validationErrors?.bankAccountUuid}
                      value={withdrawData?.bankAccountUuid}
                      MyValue={withdrawData?.bankAccountUuid}
                      data={
                        accountNo?.length > 0 &&
                        accountNo
                          .filter((item) => item?.verified !== false)
                          .map((item) => ({
                            key: item.uuid,
                            value: `${item?.bankName.toUpperCase()} | ${item.accountNumber
                              .replace(/(.{4})(?=.)/g, "$1 ")
                              .trim()}`,
                          }))
                      }
                      style={{ width: "100%" }}
                      onChange={(value, key) => {
                        setWithdrawData({
                          ...withdrawData,
                          bankAccountUuid: key?.value,
                        });
                      }}
                      required={true}
                      errorMsg={"bank accountUuid is required"}
                      disabled={isDisabled}
                    /> */}

                    <SelectDefault
                      validationState={validationErrors?.bankAccountUuid}
                      value={showValue}
                      MyValue={showValue}
                      data={verifiedAccounts.map((item) => ({
                        key: item.uuid,
                        value: `${item.bankName.toUpperCase()} | ${item.accountNumber
                          .replace(/(.{4})(?=.)/g, "$1 ")
                          .trim()}`,
                      }))}
                      style={{ width: "100%" }}
                      onChange={(value, key) => {
                        setWithdrawData({
                          ...withdrawData,
                          bankAccountUuid: key?.value,
                        });
                      }}
                      required={true}
                      errorMsg={"Bank account is required"}
                      disabled={isDisabled}
                    />
                  </Col>
                  <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
                    <div className="withdraw-label">
                      <label className="mb-4 cursor-pointer">
                        Amount to withdraw
                      </label>
                      <label
                        className="mb-4"
                        onClick={() => {
                          setWithdrawData({
                            ...withdrawData,
                            amount: walletBalance,
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
                    <div
                      style={{ flex: 1, width: "100%" }}
                      className={
                        validationErrors.amount === true
                          ? "error-border-withdraw"
                          : ""
                      }
                    >
                      <InputDefault
                        className="noscroll"
                        placeholder="Amount to withdraw"
                        type="number"
                        name="amount"
                        validationState={setValidationErrors}
                        focusing={validationErrors?.amount}
                        value={withdrawData?.amount}
                        onChange={({ target }) => {
                          setWithdrawData({
                            ...withdrawData,
                            amount: target.value,
                          });
                          setValidationErrors({
                            ...validationErrors,
                            amount: false,
                          });
                        }}
                        onBlur={() => {
                          if (withdrawData?.amount > walletBalance) {
                            setValidationErrors({
                              ...validationErrors,
                              amount: true,
                            });
                          }
                        }}
                        required={true}
                        errorMsg={"Account withdraw is Required"}
                        disabled={isDisabled}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {msgCurrency !== "" && (
                        <span className="curr-exchange-span">
                          You have{" "}
                          <span
                            className="currency-bold cursor-pointer"
                            onClick={() => {
                              setWithdrawData({
                                ...withdrawData,
                                amount: walletBalance,
                              });
                              setValidationErrors({
                                ...validationErrors,
                                amount: false,
                              });
                            }}
                          >
                            {formatCurrency("", walletBalance)}{" "}
                            {withdrawData?.currencyCode}
                          </span>{" "}
                          in your wallet
                        </span>
                      )}
                      {withdrawData?.amount > walletBalance &&
                      validationErrors.amount === true &&
                      withdrawData.amount !== "" ? (
                        <span style={{ color: "red", fontSize: "12px" }}>
                          Insufficient {withdrawData?.currencyCode} balance in
                          your wallet.
                        </span>
                      ) : null}
                    </div>
                  </Col>
                  <Col className="media-width">
                    <ButtonDefault
                      title="Withdraw"
                      style={{ width: "100%" }}
                      loading={withdrawLoading}
                      disabled={isDisabled}
                    />
                  </Col>
                </Row>
              </Form>
            </>
          ) : (
            <>
              <p className="wallet-sub-head mt-0 mb-16">
                Banking Information Required
              </p>
              <p className="wallet-unactive-ins mt-0 mb-16">
                To withdraw or invest funds, please add your banking
                information.
              </p>
            </>
          )}
        </Col>
      </Row>
      <>
        {windowWidth >= 576 ? (
          <Col
            sm={24}
            md={24}
            lg={24}
            className="gutter-row wallet-info-div mt-20"
            style={{ flex: 1 }}
          >
            <Row>
              <p className="mt-0 wallet-sub-head mb-16">Withdrawal Requests</p>
            </Row>
            <WithdrawRequestList
              withdrawalRequestList={withdrawalRequestList}
              isWithdrawalRequestLoading={isWithdrawalRequestLoading}
              setIsWithdrawalRequestLoading={setIsWithdrawalRequestLoading}
            />
          </Col>
        ) : (
          <div>
            <Row className="mt-40">
              <p className="mt-0 wallet-sub-head mb-12">Withdrawal Requests</p>
            </Row>
            <Row>
              {withdrawalRequestList?.length > 0 ? (
                withdrawalRequestList?.map((request, index) => (
                  <WithdrawRequestCard request={request} index={index} />
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
        {withdrawalRequestList?.length > 0 && (
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
      </>

      <Modal
        centered
        open={withdrawModal}
        onCancel={() => {
          setWithdrawModal(false);
        }}
        width={464}
        footer={null}
        maskClosable={false}
        className="withdraw-modal"
        closable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to make a withdrawal request?
        </p>

        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setWithdrawModal(false);
            }}
          >
            Cancel
          </Button>
          <ButtonDefault
            loading={withdrawLoading}
            style={{ width: "100%" }}
            title="Confirm"
            onClick={() => {
              handleWithdrawAmount();
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Withdraw;
