/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Checkbox,
  Col,
  Form,
  Modal,
  Spin,
  Tooltip,
  message,
  notification,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import InputDefault from "../../../Components/InputDefault/InputDefault";
import {
  CommitInvest,
  Invest,
  InvestTranche,
  trancheAcceptanceDownload,
} from "../../../Apis/DashboardApi";
import { ErrorResponse } from "../../../Utils/ErrorResponse";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTrancheResponse } from "../../../Redux/Action/Investor";
import Borrower_warning from "../../../Assets/Images/Icons/Dashboard/borrower_warning.svg";
import Coin_icon from "../../../Assets/Images/SVGs/coin_icon.svg";
import PlusBlack_icon from "../../../Assets/Images/plus_black.svg";
import Blue_principal_arrow from "../../../Assets/Images/SVGs/blue_principal_arrow.svg";
import {
  formatCurrency,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../../Utils/Reusables";
import { trackEvent } from "../../../Utils/Analytics";
import { LoadingOutlined } from "@ant-design/icons";
import { britishFormatDate } from "../../../Utils/Helpers";
import TagSimple from "../../../Assets/Images/SVGs/TagSimple.svg";
import { getUser } from "../../../Apis/UserApi";
import { setUserDetails } from "../../../Redux/Action/User";
import ROUTES from "../../../Config/Routes";
import InfoIcon from "../../../Assets/Images/SVGs/Info.svg";
import { promoConfigs } from "../../../Utils/Constant";

const StartInvesting = ({ TrancheRes, setLoader, couponValue, key }) => {
  const api = notification;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [investQuickLoader, setInvestQuickLoader] = useState(false);
  const [commiInvestLoader, setcommitInvestLoader] = useState(false);
  const [investAmount, setInvestAmount] = useState({
    amount: couponValue ? couponValue : "",
  });
  const [investmentVal, setInvestmentVal] = useState();
  const [checked, setChecked] = useState(false);
  const [noCheckErr, setCheckErr] = useState(false);
  const [walletBalance, setWalletBalance] = useState();
  const user = useSelector((state) => state.user);
  const [validationErrors, setValidationErrors] = useState({
    amount: false,
  });
  const [investAmt, setInvestAmt] = useState("");

  const [downloadPdfLoader, setDownloadPdfLoader] = useState(false);
  const [apisCallTime, setApiCallTime] = useState();
  const [afterFewSecound, setAfterFewSecound] = useState(false);

  const openNotificationWithIcon = (type) => {
    api[type]({
      description:
        "We're processing your investment, which may take a little longer than usual due to its substantial size. Thank you for your patience.",
      key: "uniqueNotificationKey",
      duration: null,
    });
  };

  useEffect(() => {
    if (afterFewSecound) {
      openNotificationWithIcon("info");
    } else {
      api.destroy("uniqueNotificationKey");
    }
  }, [afterFewSecound]);

  useEffect(() => {
    if (apisCallTime > 5000) {
      setAfterFewSecound(true);
    } else {
      setAfterFewSecound(false);
    }
  }, [apisCallTime]);

  useEffect(() => {
    if (investAmount?.amount) {
      setInvestAmt(investAmount.amount);
    }
  }, [investAmount]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (user?.accounts !== undefined) {
        const accBalance = await handleCheckBalance(user?.accounts);
        setWalletBalance(accBalance);
      }
    };

    fetchBalance();
  }, [user?.accounts]);

  const handleCheckBalance = async (accounts) => {
    for (const currency of accounts) {
      if (currency?.currencyCode === TrancheRes?.tranche?.currencyCode) {
        return currency?.balance;
      }
    }
    return null;
  };

  const handleQuickInvest = () => {
    setInvestQuickLoader(true);
    setInvestmentVal("");
    if (investAmt === "") {
      setValidationErrors({
        amount: true,
      });
      message.error("Please enter an amount.");
    } else if (
      investAmt < TrancheRes?.tranche?.nominalValue &&
      investAmt !== ""
    ) {
      setValidationErrors({
        amount: true,
      });
      message.error("Please enter amount more than nominal value");
    } else {
      setValidationErrors({
        amount: false,
      });
      finalInvest(investAmt);
    }
  };

  const finalInvest = (amount) => {
    setInvestQuickLoader(true);
    const requestBody = {
      trancheUuid: TrancheRes?.tranche?.uuid,
      amount: amount,
    };

    const startTime = performance.now();
    let elapsedTime = 0;

    const intervalId = setInterval(() => {
      elapsedTime = performance.now() - startTime;
      setApiCallTime(elapsedTime);
    }, 1);

    Invest(requestBody)
      .then(async (investmentData) => {
        clearInterval(intervalId);

        const endTime = performance.now();
        const apiCallTime = endTime - startTime;
        setApiCallTime(apiCallTime.toFixed(2));

        if (Object.keys(investmentData)?.length > 0) {
          // if (investmentData?.offer?.hasErrors === true) {
          //   setInvestmentVal(investmentData?.offer);
          //   setValidationErrors({ amount: true });
          //   showMessageWithCloseIconError(
          //     "There was a problem generating offer."
          //   );
          //   setInvestQuickLoader(false);
          // }
          //  else {
          setInvestmentVal(investmentData?.offer);
          setInvestQuickLoader(false);
          setAfterFewSecound(false);
          if (investmentData?.offer?.totalCostForInvestor !== 0) {
            setValidationErrors({ amount: false });
          }
          setApiCallTime(0);
          // }
        } else {
          setAfterFewSecound(false);
          setApiCallTime(0);
          setInvestQuickLoader(false);
        }
      })
      .catch((error) => {
        clearInterval(intervalId);

        const endTime = performance.now();
        const apiCallTime = endTime - startTime;
        setApiCallTime(apiCallTime);
        ErrorResponse(error?.code);
        setInvestQuickLoader(false);
      });
  };

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const handleCommitInvestment = () => {
    setcommitInvestLoader(true);

    if (!checked) {
      setcommitInvestLoader(false);
      return setCheckErr(true);
    }

    const requestBody = {
      trancheUuid: TrancheRes?.tranche?.uuid,
      amount: investAmount?.amount,
    };

    const startTime = performance.now();
    let elapsedTime = 0;

    const intervalId = setInterval(() => {
      elapsedTime = performance.now() - startTime;
      setApiCallTime(elapsedTime);
    }, 1);

    CommitInvest(requestBody)
      .then(async (commitInvestmentData) => {
        clearInterval(intervalId);

        const endTime = performance.now();
        const apiCallTime = endTime - startTime;
        setApiCallTime(apiCallTime.toFixed(2));

        if (Object.keys(commitInvestmentData)?.length > 0) {
          setApiCallTime(0);
          api.destroy("uniqueNotificationKey");
          setAfterFewSecound(false);

          trackEvent("investing", "createSubmitSuccess", {
            user_id: user?.number,
          });

          window?.dataLayer?.push({
            event: "createSubmitSuccess",
            user_id: user?.number,
            register_method: user?.registrationType,
          });

          setInvestmentVal("");
          setcommitInvestLoader(false);
          showMessageWithCloseIcon(
            "Congratulations! Your subscription is successful."
          );

          getUserDetails();
          handleGetTranche();

          // ✅ Optimized promo tracking logic
          const trancheNumber = TrancheRes?.tranche?.trancheNumber;
          const promoKey = key;
          const userId = user?.number;

          const matchedEntry = Object.entries(promoConfigs).find(
            ([, config]) => config.trancheNumber === trancheNumber
          );

          if (matchedEntry) {
            const [matchedKey, matchedConfig] = matchedEntry;

            // commit_click (always for matched promo)
            window?.dataLayer?.push({
              event: "commit_click",
              content_id: matchedConfig.content_id,
              user_id: userId,
              register_method: user?.registrationType,
            });

            // commit_from_promo (only if from promoKey match)
            if (promoKey === matchedKey) {
              window?.dataLayer?.push({
                event: "commit_from_promo",
                content_id: matchedConfig.content_id,
                user_id: userId,
                register_method: user?.registrationType,
              });
            }
          }
        } else {
          setApiCallTime(0);
          setAfterFewSecound(false);
          setcommitInvestLoader(false);
        }
      })
      .catch((error) => {
        clearInterval(intervalId);
        setApiCallTime(0);
        setAfterFewSecound(false);
        ErrorResponse(error?.code);
        setcommitInvestLoader(false);
      });
  };

  const handleGetTranche = () => {
    setLoader(true);
    const requestBody = {
      trancheUuid: slug,
    };
    InvestTranche(requestBody).then(async (tracheRes) => {
      setTrancheResponse(tracheRes, dispatch);
      setLoader(false);
    });
  };

  const handleDownLoadTrancheAcceptancePdf = () => {
    const data = {
      trancheId: slug,
      amount: investAmount?.amount,
    };

    try {
      setDownloadPdfLoader(true);

      trancheAcceptanceDownload(data)
        .then((response) => {
          if (!response.data || response.data.size === 0) {
            throw new Error("Empty file received from server");
          }

          const contentType = response.headers["content-type"];
          const blob = new Blob([response.data], { type: contentType });

          const blobUrl = window.URL.createObjectURL(blob);

          // Open in new tab
          const newTab = window.open(blobUrl, "_blank");

          if (!newTab) {
            throw new Error("Failed to open new tab. Please allow popups.");
          }

          setDownloadPdfLoader(false);
        })
        .catch((error) => {
          console.error("Error fetching account summary:", error);
          setDownloadPdfLoader(false);
        });
    } catch (e) {
      console.error("Error fetching account summary:", e);
      setDownloadPdfLoader(false);
    }
  };

  const handleInvestmentChange = (value) => {
    setCheckErr(false);
    setInvestQuickLoader(true);
    setInvestAmt(value);
    setInvestAmount({ ...investAmount, amount: value });
  };

  const fetchInvestmentData = useCallback(async () => {
    if (investAmt === "") {
      setInvestmentVal("");
      setValidationErrors({ amount: true });
      message.error("Please enter an amount.");
      setInvestQuickLoader(false);
    } else if (
      investAmt < TrancheRes?.tranche?.nominalValue &&
      investAmt !== ""
    ) {
      setInvestmentVal("");
      setValidationErrors({ amount: true });
      message.error("Please enter an amount greater than the nominal value.");
      setInvestQuickLoader(false);
    } else {
      handleQuickInvest();
    }

    setInvestQuickLoader(false);
  }, [investAmt]);

  useEffect(() => {
    if (investAmt !== "") {
      const delayDebounceFn = setTimeout(() => {
        fetchInvestmentData();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setInvestQuickLoader(false);
      setInvestmentVal("");
    }
  }, [investAmt]);

  const isFutureDate = (dateString) => {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    return givenDate > currentDate;
  };

  const getBalanceForCurrency = (currencyArray, currencyCode) => {
    const currency = currencyArray?.find(
      (curr) => curr.currencyCode === currencyCode
    );
    return currency ? currency.balance : null;
  };

  return (
    <Col
      className="gutter-row infomation-div p-relative"
      lg={24}
      md={24}
      sm={24}
      xs={24}
    >
      <div>
        {TrancheRes?.tranche?.subscriptionEnabled === true ? (
          <div className="start-invest-head">
            <img src={Coin_icon} alt="coin-icon" />
            <p className="m-0 tranch-head">Start Investing</p>
          </div>
        ) : isFutureDate(TrancheRes?.tranche?.issueDate) ? (
          `Investment will begin on ${britishFormatDate(
            TrancheRes?.tranche?.issueDate
          )}.`
        ) : (
          <p className="m-0 tranch-head">Fully Funded</p>
        )}
      </div>
      <div className="fund-head mt-20">
        <p className="m-0">
          Available balance{" "}
          {formatCurrency(
            TrancheRes?.tranche?.currencySymbol,
            getBalanceForCurrency(
              user?.accounts,
              TrancheRes?.tranche?.currencyCode
            )
          )}
        </p>
        <Button
          className="add-funds-btn"
          onClick={() =>
            navigate(ROUTES.WALLET, { state: { tabKey: "1", scroll: true } })
          }
        >
          {" "}
          <img src={PlusBlack_icon} alt="plus_black_icon" />
          Add Funds
        </Button>
      </div>
      <Form name="wrap" labelAlign="left" labelWrap colon={false}>
        <div
          className="mt-20 start-invest-div"
          style={{
            display: "flex",
            alignItems: "start",
            flexDirection: window.innerWidth <= 576 ? "column" : "row",
            flexWrap: "nowrap",
          }}
        >
          <div style={{ flex: 1, width: "100%" }}>
            <div
              className="start-invest-div mb-16"
              style={{ display: "flex", alignItems: "start" }}
            >
              <div
                style={{ flex: 1 }}
                className={
                  validationErrors.amount === true ? "error-border" : ""
                }
              >
                <div style={{ position: "relative" }}>
                  <InputDefault
                    placeholder="Enter amount to invest"
                    type="text"
                    name="invamt"
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/\s+/g, "");
                      value = value.replace(/[^0-9.]/g, "");
                      const parts = value.split(".");
                      if (parts.length > 2) {
                        value = parts[0] + "." + parts.slice(1).join("");
                      }
                      handleInvestmentChange(value);
                    }}
                    required={true}
                    errorMsg={"Amount is Required"}
                    style={{ backgroundColor: "#ffffff" }}
                    disabled={
                      user?.investorStatus !== "ACTIVE" ||
                      isFutureDate(TrancheRes?.tranche?.issueDate) ||
                      (user?.secondFactorAuth === null &&
                        user?.twoFaCheckEnabled === true)
                    }
                    value={investAmt}
                    prefix={
                      <span>
                        {TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€"}
                      </span>
                    }
                  />

                  {validationErrors.amount === true && (
                    <div className="borrower-warning-logo">
                      <img src={Borrower_warning} alt="Borrower_warning" />
                    </div>
                  )}
                </div>
                {validationErrors.amount === true &&
                investAmt !== "" &&
                investAmt < TrancheRes?.tranche?.nominalValue ? (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    Please enter an amount greater than the nominal value.
                  </span>
                ) : // : investmentVal?.hasErrors === true ? (
                //   <span style={{ color: "red", fontSize: "12px" }}>
                //     There was a problem generating offer.
                //   </span>
                // )
                investAmt > walletBalance && walletBalance === 0 ? (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    You don't have enough balance, please top up
                  </span>
                ) : investAmt === "" && validationErrors.amount === true ? (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    Please enter an amount.
                  </span>
                ) : null}
                {TrancheRes?.tranche?.subscriptionEnabled === true ? (
                  <p className="add-info-note mt-4 mb-0">
                    Min. amount{" "}
                    <span
                      onClick={
                        user?.investorStatus !== "ACTIVE" ||
                        isFutureDate(TrancheRes?.tranche?.issueDate) ||
                        (user?.secondFactorAuth === null &&
                          user?.twoFaCheckEnabled === true)
                          ? undefined
                          : () => {
                              setInvestAmount({
                                amount: TrancheRes?.tranche?.nominalValue,
                              });
                              setCheckErr(false);
                            }
                      }
                      className="cursor-pointer"
                      style={{
                        fontWeight: "bold",
                        cursor:
                          user?.investorStatus !== "ACTIVE" ||
                          isFutureDate(TrancheRes?.tranche?.issueDate) ||
                          (user?.secondFactorAuth === null &&
                            user?.twoFaCheckEnabled === true)
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        TrancheRes?.tranche?.nominalValue
                      )}
                    </span>
                    , Max. amount{" "}
                    <span
                      onClick={
                        user?.investorStatus !== "ACTIVE" ||
                        isFutureDate(TrancheRes?.tranche?.issueDate) ||
                        (user?.secondFactorAuth === null &&
                          user?.twoFaCheckEnabled === true)
                          ? undefined
                          : () => {
                              setInvestAmount({
                                amount: TrancheRes?.tranche?.principalAvailable,
                              });
                              setCheckErr(false);
                            }
                      }
                      className="cursor-pointer"
                      style={{
                        fontWeight: "bold",
                        cursor:
                          user?.investorStatus !== "ACTIVE" ||
                          isFutureDate(TrancheRes?.tranche?.issueDate) ||
                          (user?.secondFactorAuth === null &&
                            user?.twoFaCheckEnabled === true)
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        TrancheRes?.tranche?.principalAvailable
                      )}
                    </span>
                  </p>
                ) : null}
                {investAmt > TrancheRes?.tranche?.principalAvailable ? (
                  <p className="mt-5 mb-0 notes-for-invest">
                    The maximum investment for this deal is{" "}
                    {formatCurrency(
                      TrancheRes?.tranche?.currencyCode === "USD"
                        ? "$"
                        : TrancheRes?.tranche?.currencyCode === "SGD"
                        ? "S$"
                        : "€",
                      investmentVal?.principal
                    )}
                    .
                  </p>
                ) : investAmt > walletBalance && walletBalance !== 0 ? (
                  <p className="mt-5 mb-0 notes-for-invest">
                    Insufficient wallet balance. Please top up to proceed.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {!investmentVal ? null : (
          <div>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 50, color: "var(--kilde-blue)" }}
                />
              }
              spinning={investQuickLoader}
            >
              <div>
                {!TrancheRes?.tranche?.discountedPrice ? (
                  <div className="sb-flex-justify-between mb-8">
                    <div>
                      <p className="m-0">Principal</p>
                    </div>
                    <div>
                      <p className="m-0">
                        {formatCurrency(
                          TrancheRes?.tranche?.currencyCode === "USD"
                            ? "$"
                            : TrancheRes?.tranche?.currencyCode === "SGD"
                            ? "S$"
                            : "€",
                          investmentVal?.principal
                        )}
                      </p>
                    </div>
                  </div>
                ) : null}

                {TrancheRes?.tranche?.discountedPrice ? (
                  <div className="sb-flex-justify-between mb-8">
                    <div className="discount-tag">
                      <img src={TagSimple} alt="TagSimple" />
                      <p className="m-0 mb-0">Principal</p>
                    </div>
                    <div>
                      <p className="m-0">
                        <s className="discounted-price-strike">
                          {formatCurrency(
                            TrancheRes?.tranche?.currencyCode === "USD"
                              ? "$"
                              : TrancheRes?.tranche?.currencyCode === "SGD"
                              ? "S$"
                              : "€",
                            investmentVal?.principal
                          )}
                        </s>{" "}
                        <span className="discounted-price-span">
                          {formatCurrency(
                            TrancheRes?.tranche?.currencyCode === "USD"
                              ? "$"
                              : TrancheRes?.tranche?.currencyCode === "SGD"
                              ? "S$"
                              : "€",
                            investmentVal?.discountedPrice
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : null}

                <div
                  className="sb-flex-justify-between mb-8"
                  style={{ textWrap: "nowrap" }}
                >
                  <div className="sb-flex">
                    <p className="m-0">Accrued interest</p>
                    <Tooltip
                      placement="top"
                      className="ml-4"
                      title={
                        "If you invest between interest payment dates, an ‘Accrued Interest Expense’ is charged, which ensures you receive interest for the correct (pro-rata) period."
                      }
                    >
                      <img src={InfoIcon} alt="info-icon" />
                    </Tooltip>
                  </div>
                  <div>
                    <p className="m-0">
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        investmentVal?.accruedInterest === null
                          ? 0
                          : investmentVal?.accruedInterest
                      )}
                    </p>
                  </div>
                </div>
                <div className="sb-flex-justify-between mb-8">
                  <div>
                    <p className="m-0">Subscription fee</p>
                  </div>
                  <div>
                    <p className="m-0">
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        investmentVal?.investorSubscriptionFee === null
                          ? 0
                          : investmentVal?.investorSubscriptionFee
                      )}
                    </p>
                  </div>
                </div>
                <div className="sb-flex-justify-between mb-8">
                  <div>
                    <p className="m-0 fw-600">Total funds to commit</p>
                  </div>
                  <div>
                    <p className="m-0 fw-600">
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        investmentVal?.totalCostForInvestor === null
                          ? 0
                          : investmentVal?.totalCostForInvestor
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Spin>
          </div>
        )}

        <div
          className={
            !investmentVal ? "sb-justify-end-item-center" : "check-box-commit"
          }
        >
          {!investmentVal ? null : (
            <div>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setCheckErr(false);
                  } else {
                    setCheckErr(true);
                  }
                  setChecked(e.target.checked);
                }}
                key="borrower"
                className="checkbox-kilde"
              >
                I accept{" "}
                <Button
                  loading={downloadPdfLoader}
                  onClick={handleDownLoadTrancheAcceptancePdf}
                  className="acceptance-btn"
                  style={{
                    color: "var(--kilde-blue)",
                    fontSize: "14px",
                  }}
                >
                  investment terms
                </Button>
              </Checkbox>
            </div>
          )}

          <div className="sb-text-align">
            <ButtonDefault
              className="commit-btn"
              title="Commit"
              onClick={handleCommitInvestment}
              loading={commiInvestLoader}
              disabled={
                !investmentVal ||
                investmentVal?.principal <= 0 ||
                investAmt > walletBalance ||
                walletBalance === 0 ||
                investmentVal?.hasErrors === true
              }
            />
          </div>
        </div>
        {noCheckErr && (
          <label
            className="error-msg mt-0"
            style={{
              display: "block",
              marginBottom: 12,
              fontSize: "12px",
            }}
          >
            Please accept the Investment terms
          </label>
        )}
      </Form>
    </Col>
  );
};

export default StartInvesting;
