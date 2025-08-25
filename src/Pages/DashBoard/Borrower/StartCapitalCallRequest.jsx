/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  message,
  notification,
  Spin,
  Tooltip,
} from "antd";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import InputDefault from "../../../Components/InputDefault/InputDefault";
import {
  BondSellList,
  bondSellPurchaseConditionDownload,
  bondSellRequest,
  CapitalCallList,
  CapitalCallRequest,
  finalBondSellRequest,
  InvestTranche,
} from "../../../Apis/DashboardApi";
import { ErrorResponse } from "../../../Utils/ErrorResponse";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setBondSellRequests,
  setCapitalRequests,
  setTrancheResponse,
} from "../../../Redux/Action/Investor";
import InfoIcon from "../../../Assets/Images/SVGs/Info.svg";
import Borrower_warning from "../../../Assets/Images/Icons/Dashboard/borrower_warning.svg";
import PurchaseSaleAgreement from "../../../Assets/Pdf/Purchase-Sale-Agreement.pdf";
import {
  formatCurrency,
  isValidResponse,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../../Utils/Reusables";
import { britishFormatDate } from "../../../Utils/Helpers";
import { capitalCallLimitCapTooltip } from "../TooltopContent";
import RedemptionSkeleton from "./RedemptionSkeleton";
import CustomRadioButton from "../../../Components/DefaultRadio/CustomRadioButton";

const StartCapitalCallRequest = ({
  TrancheRes,
  setCapitalRequestLoading,
  capitalRadio,
  setCapitalRadio,
}) => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [capitalRequestLoader, setCapitalRequestLoader] = useState(false);
  const [capitalResponseLoader, setCapitalResponseLoader] = useState(false);

  const [noCheckErr, setCheckErr] = useState(false);
  const [checked, setChecked] = useState(false);
  const [downloadPdfLoader, setDownloadPdfLoader] = useState(false);
  const [investAmount, setInvestAmount] = useState({
    amount: "",
  });
  const [investAmt, setInvestAmt] = useState("");
  const [bondSellAmount, setBondSellAmount] = useState({
    amount: "",
  });
  const [bondSellAmt, setBondSellAmt] = useState("");
  const [bondSellvalidationErrors, setBondSellValidationErrors] = useState({
    amount: false,
  });
  const [validationErrors, setValidationErrors] = useState({
    amount: false,
  });
  const [backendError, setBackendError] = useState(null);
  const [redemptionModal, setRedemptionModal] = useState(null);
  const [bonSellResponse, setBondSellResponse] = useState([]);
  const [finalBondRequestLoading, setFinalBondRequestLoading] = useState(false);
  const maxCapitalRequestAmount =
    TrancheRes?.investment?.maxAmountAvailableForCapitalCall <
    TrancheRes?.tranche?.nominalValue
      ? 0
      : TrancheRes?.investment?.maxAmountAvailableForCapitalCall;

  const maxBondSellRequestAmount =
    TrancheRes?.tranche?.secondaryMarketAvailableLiquidity >
    TrancheRes?.investment?.maxAmountAvailableForSellRequest
      ? TrancheRes?.investment?.maxAmountAvailableForSellRequest
      : TrancheRes?.tranche?.secondaryMarketAvailableLiquidity <=
        TrancheRes?.investment?.maxAmountAvailableForSellRequest
      ? TrancheRes?.tranche?.secondaryMarketAvailableLiquidity
      : TrancheRes?.investment?.maxAmountAvailableForSellRequest;

  const minCapitalRequestAmount =
    TrancheRes?.investment?.maxAmountAvailableForCapitalCall > 0 &&
    TrancheRes?.investment?.maxAmountAvailableForCapitalCall >=
      TrancheRes?.tranche?.nominalValue
      ? TrancheRes?.tranche?.nominalValue
      : 0;

  const minBondSellRequestAmount =
    TrancheRes?.investment?.maxAmountAvailableForSellRequest > 0 &&
    TrancheRes?.investment?.maxAmountAvailableForSellRequest >=
      TrancheRes?.tranche?.nominalValue
      ? TrancheRes?.tranche?.nominalValue
      : 0;

  const handleChangeRadio = (e) => {
    setCapitalRadio(e.target.value);
  };

  const getTrancheDetails = async () => {
    await InvestTranche({
      trancheUuid: slug,
    }).then(async (tracheRes) => {
      setTrancheResponse(tracheRes, dispatch);
    });
  };

  useEffect(() => {
    const amount = investAmount?.amount;

    let errors = { ...validationErrors };
    if (investAmount?.amount !== "") {
      if (amount < minCapitalRequestAmount) {
        errors.amount = true;
      } else if (amount > maxCapitalRequestAmount) {
        errors.amount = true;
      } else {
        errors.amount = false;
      }
    }

    setValidationErrors(errors);
  }, [investAmount?.amount]);

  useEffect(() => {
    const amount = investAmount?.amount;

    let errors = { ...validationErrors };
    if (investAmount?.amount !== "") {
      if (amount < minCapitalRequestAmount) {
        errors.amount = true;
      } else if (amount > maxCapitalRequestAmount) {
        errors.amount = true;
      } else {
        errors.amount = false;
      }
    }

    setValidationErrors(errors);
  }, [investAmount?.amount]);

  const handleInvestmentChange = (e) => {
    setCapitalResponseLoader(true);
    const value = e?.target?.value;
    setInvestAmt(value);
    setInvestAmount({ ...investAmount, amount: value });
  };

  const fetchInvestmentData = useCallback(async () => {
    if (investAmt === "") {
      setValidationErrors({ amount: true });
      message.error("Please enter an amount.");
      setCapitalResponseLoader(false);
    } else if (investAmt < minCapitalRequestAmount && investAmt !== "") {
      setValidationErrors({ amount: true });
      message.error("Please enter an amount greater then minimum value.");
      setCapitalResponseLoader(false);
    } else if (investAmt > maxCapitalRequestAmount && investAmt !== "") {
      setValidationErrors({ amount: true });
      message.error("Please enter an amount less than the maximum value.");
      setCapitalResponseLoader(false);
    } else {
      handleQuickInvest();
    }
    setCapitalResponseLoader(false);
  }, [investAmt]);

  const handleQuickInvest = () => {
    setCapitalResponseLoader(true);
    if (investAmt === "") {
      setValidationErrors({
        amount: true,
      });
      message.error("Please enter an amount.");
      setCapitalResponseLoader(false);
    } else if (investAmt < minCapitalRequestAmount && investAmt !== "") {
      setValidationErrors({
        amount: true,
      });
      message.error("Please enter amount more than minimum value");
      setCapitalResponseLoader(false);
    } else if (investAmt > maxCapitalRequestAmount && investAmt !== "") {
      setValidationErrors({
        amount: true,
      });
      message.error("Please enter amount less than maximum value");
      setCapitalResponseLoader(false);
    } else {
      setValidationErrors({
        amount: false,
      });
      setRedemptionModal(true);
      setCapitalResponseLoader(false);
    }
  };

  useEffect(() => {
    setCapitalResponseLoader(true);
    if (investAmt !== "") {
      const delayDebounceFn = setTimeout(() => {
        fetchInvestmentData();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setCapitalResponseLoader(false);
    }
  }, [investAmt]);

  const handleBondSellChange = (e) => {
    setCapitalResponseLoader(true);
    setCheckErr(false);
    const value = e?.target?.value;
    setBondSellAmt(value);
    setBondSellAmount({ ...bondSellAmount, amount: value });
  };

  useEffect(() => {
    if (bondSellAmt !== "") {
      const delayDebounceFn = setTimeout(() => {
        handleBondSaleToday();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setCapitalResponseLoader(false);
    }
  }, [bondSellAmt]);

  const handleCapitalRequest = () => {
    setCapitalResponseLoader(true);
    setBackendError(null);
    setCapitalRequestLoader(true);
    if (investAmount?.amount === "") {
      setValidationErrors({
        amount: true,
      });
      showMessageWithCloseIconError("Please enter an amount.");
      setCapitalRequestLoader(false);
      setCapitalResponseLoader(false);
    } else if (investAmount?.amount < minCapitalRequestAmount) {
      setValidationErrors({
        amount: true,
      });
      showMessageWithCloseIconError(
        "Please enter amount more than nominal value"
      );
      setCapitalRequestLoader(false);
      setCapitalResponseLoader(false);
    } else {
      setCapitalResponseLoader(false);
      setValidationErrors({
        amount: false,
      });
      const requestBody = {
        trancheUuid: TrancheRes?.tranche?.uuid,
        amount: investAmount?.amount,
      };
      CapitalCallRequest(requestBody)
        .then(async (commitInvestmentData) => {
          if (
            commitInvestmentData === "" ||
            (Object.keys(commitInvestmentData)?.length > 0 &&
              isValidResponse(commitInvestmentData))
          ) {
            setRedemptionModal(false);
            showMessageWithCloseIcon("Request successfully added.");
            setInvestAmount({
              amount: "",
            });
            setCapitalRequestLoader(false);
            getCapitalCallRequestList();
            getTrancheDetails();
          } else {
            if (commitInvestmentData?.fieldErrors?.amount === "INVALID_VALUE") {
              setValidationErrors({
                amount: true,
              });
              setBackendError(commitInvestmentData?.fieldErrors?.amount);
              setCapitalRequestLoader(false);
            } else if (
              commitInvestmentData?.fieldErrors?.amount ===
              "CAPITAL_CALL_EXCEEDS_LIMIT"
            ) {
              setValidationErrors({
                amount: true,
              });
              setBackendError(commitInvestmentData?.fieldErrors?.amount);
              setCapitalRequestLoader(false);
            } else if (
              commitInvestmentData?.fieldErrors?.amount ===
              "CAPITAL_CALL_EXCEEDS_TOTAL_INVESTMENTS"
            ) {
              setValidationErrors({
                amount: true,
              });
              setBackendError(commitInvestmentData?.fieldErrors?.amount);
              setCapitalRequestLoader(false);
            } else if (
              commitInvestmentData?.fieldErrors?.amount ===
              "NO_SPLIT_IN_DEBENTURE_AMOUNT"
            ) {
              setValidationErrors({
                amount: true,
              });
              setBackendError(commitInvestmentData?.fieldErrors?.amount);
              setCapitalRequestLoader(false);
            } else {
              setCapitalRequestLoader(false);
            }
          }
        })
        .catch((error) => {
          ErrorResponse(error?.code);
          setCapitalRequestLoader(false);
        });
    }
  };

  const getCapitalCallRequestList = () => {
    setCapitalRequestLoading(true);
    const requestBody = {
      trancheUuid: slug,
    };
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

  const getBondSellRequestList = () => {
    setCapitalRequestLoading(true);
    const requestBody = {
      trancheUuid: slug,
    };
    BondSellList(requestBody?.trancheUuid)
      .then(async (bondSellList) => {
        if (Object.keys(bondSellList)?.length > 0) {
          setBondSellRequests(bondSellList, dispatch);
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

  const handleBondSaleToday = async () => {
    setCapitalResponseLoader(true);
    setBackendError(null);
    setCapitalRequestLoader(true);
    if (bondSellAmount?.amount === "") {
      setBondSellValidationErrors({
        amount: true,
      });
      showMessageWithCloseIconError("Please enter an amount.");
      setCapitalRequestLoader(false);
      setCapitalResponseLoader(false);
    } else if (bondSellAmount.amount < minBondSellRequestAmount) {
      setBondSellValidationErrors({
        amount: true,
      });
      showMessageWithCloseIconError(
        `The minimum redemption for this investment is ${minBondSellRequestAmount}`
      );
      setCapitalRequestLoader(false);
      setCapitalResponseLoader(false);
    } else if (bondSellAmount.amount > maxBondSellRequestAmount) {
      setBondSellValidationErrors({
        amount: true,
      });
      showMessageWithCloseIconError(
        `The maximum redemption for this investment is ${maxBondSellRequestAmount}`
      );
      setCapitalRequestLoader(false);
      setCapitalResponseLoader(false);
    } else if (
      bondSellAmount?.amount >
      TrancheRes?.tranche?.secondaryMarketAvailableLiquidity
    ) {
      setBondSellValidationErrors({
        amount: true,
      });
      showMessageWithCloseIconError(
        "Sell requests are unavailable due to insufficient liquidity."
      );
      setCapitalRequestLoader(false);
      setCapitalResponseLoader(false);
    } else {
      setBondSellValidationErrors({
        amount: false,
      });
      const requestBody = {
        amount: bondSellAmount?.amount,
      };
      await bondSellRequest(TrancheRes?.tranche?.uuid, requestBody)
        .then(async (bondSellInvestmentData) => {
          if (
            bondSellInvestmentData === "" ||
            (Object.keys(bondSellInvestmentData)?.length > 0 &&
              isValidResponse(bondSellInvestmentData))
          ) {
            setBondSellResponse(bondSellInvestmentData);
            setCapitalRequestLoader(false);
            setCapitalResponseLoader(false);
          } else if (
            bondSellInvestmentData?.fieldErrors?.amount === "INVALID_VALUE"
          ) {
            setBondSellValidationErrors({
              amount: true,
            });
            notification.error({
              type: "error",
              message: "Insufficient Liquidity",
              description:
                "Sell requests are unavailable due to insufficient liquidity.",
            });
            setCapitalRequestLoader(false);
            setCapitalResponseLoader(false);
          } else if (
            bondSellInvestmentData?.errors[0] ===
            "No debentures found for investor"
          ) {
            setBondSellValidationErrors({
              amount: true,
            });
            notification.error({
              type: "error",
              message: "No debentures found for investor",
              description:
                "Sell requests are unavailable due to insufficient liquidity.",
            });
            setCapitalRequestLoader(false);
            setCapitalResponseLoader(false);
          } else {
            console.log("api not giving proper response");
            setCapitalRequestLoader(false);
            setCapitalResponseLoader(false);
          }
        })
        .catch((error) => {
          ErrorResponse(error?.code);
          setCapitalRequestLoader(false);
          setCapitalResponseLoader(false);
        });
    }
  };

  const handleSubmitBondRequest = async () => {
    try {
      setFinalBondRequestLoading(true);
      if (!checked) {
        setCheckErr(true);
        return;
      }

      const requestBody = { amount: bondSellAmount?.amount };

      const bondSellInvestmentData = await finalBondSellRequest(
        TrancheRes?.tranche?.uuid,
        requestBody
      );
      if (
        bondSellInvestmentData === "" ||
        (Object.keys(bondSellInvestmentData)?.length > 0 &&
          isValidResponse(bondSellInvestmentData))
      ) {
        setBondSellResponse(bondSellInvestmentData);
        showMessageWithCloseIcon("Request successfully added.");
        setBondSellAmount({ amount: "" });
        getBondSellRequestList();
        getTrancheDetails();
      } else if (
        bondSellInvestmentData?.errors?.[0] === "Not enough debentures"
      ) {
        setBondSellValidationErrors({ amount: true });
        notification.error({
          type: "error",
          message: "Not enough debentures",
          description:
            "Sell requests are unavailable due to insufficient liquidity.",
        });
      } else {
        console.log(
          "API did not return a valid response",
          bondSellInvestmentData
        );
      }
    } catch (error) {
      ErrorResponse(error?.code);
    } finally {
      setFinalBondRequestLoading(false);
    }
  };

  const handleDownLoadPurchasedConditionPdf = () => {
    const data = {
      trancheId: slug,
      amount: bondSellAmount?.amount,
    };

    try {
      setDownloadPdfLoader(true);
      bondSellPurchaseConditionDownload(data)
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

  return (
    <Col className="gutter-row infomation-div" lg={24} md={24} sm={24} xs={24}>
      <p className="m-0 tranch-head d-flex">
        Early Redemption Request
        {/**  {TrancheRes?.investment?.capitalCallLimitPercentage > 0 ? (
          <Tooltip
            placement="top"
            title={capitalCallLimitCapTooltip(
              TrancheRes?.investment?.capitalCallLimitPercentage
            )}
          >
            <img src={InfoIcon} alt="info-icon" className="ml-4" />
          </Tooltip>
        ) : null}*/}
      </p>
      {TrancheRes?.tranche?.secondaryMarketEnabled === true ? (
        <div className="mt-16 mb-16 w-100 d-flex justify-center items-stretch gap-16">
          <div className="flex-1 w-100">
            <CustomRadioButton
              label="Wait for capital call"
              name="option"
              value="nextCapitalCallDate"
              checked={capitalRadio === "nextCapitalCallDate"}
              onChange={handleChangeRadio}
            />
          </div>
          <div className="flex-1 w-100">
            <CustomRadioButton
              label="Sell today"
              name="option"
              value="BondSaleToday"
              checked={capitalRadio === "BondSaleToday"}
              onChange={handleChangeRadio}
            />
          </div>
        </div>
      ) : null}
      {capitalRadio === "nextCapitalCallDate" ? (
        <>
          <div
            className="mt-15 start-invest-div"
            style={{ display: "flex", alignItems: "start" }}
          >
            <div
              style={{ flex: 1 }}
              className={
                validationErrors.amount === true ? "error-border-capital" : ""
              }
            >
              <div style={{ position: "relative" }}>
                <InputDefault
                  value={investAmt}
                  placeholder="Enter amount"
                  type="number"
                  name="amount"
                  onChange={handleInvestmentChange}
                  required={false}
                  errorMsg={"Amount is Required"}
                  style={{ backgroundColor: "#ffffff" }}
                  disabled={
                    minCapitalRequestAmount <= 0 ||
                    (maxCapitalRequestAmount <= 0 &&
                      TrancheRes?.investment?.capitalCallValidityDate !== null)
                  }
                />
                {validationErrors.amount === true && (
                  <div className="borrower-warning-logo">
                    <img src={Borrower_warning} alt="Borrower_warning" />
                  </div>
                )}
              </div>
              {validationErrors.amount === true &&
              investAmount.amount === "" ? (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter an amount
                </span>
              ) : validationErrors.amount === true &&
                investAmount.amount !== "" &&
                investAmount?.amount < minCapitalRequestAmount ? (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter amount more than minimum amount
                </span>
              ) : validationErrors.amount === true &&
                investAmount.amount !== "" &&
                investAmount?.amount > maxCapitalRequestAmount ? (
                <span style={{ color: "red", fontSize: "12px" }}>
                  The maximum redemption for this investment is{" "}
                  {formatCurrency(
                    TrancheRes?.tranche?.currencyCode === "USD"
                      ? "$"
                      : TrancheRes?.tranche?.currencyCode === "SGD"
                      ? "S$"
                      : "€",
                    maxCapitalRequestAmount
                  )}
                </span>
              ) : validationErrors.amount === true &&
                investAmount.amount !== "" &&
                backendError === "NO_SPLIT_IN_DEBENTURE_AMOUNT" ? (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Amount cannot be split in debenture amounts
                </span>
              ) : null}
              {maxCapitalRequestAmount <= 0 &&
              TrancheRes?.investment?.capitalCallValidityDate !== null ? (
                <p className="capital-info-note mt-4 mb-0">
                  Capital call limit will reset on{" "}
                  <span className="capital-limit-date">
                    {TrancheRes?.investment?.capitalCallValidityDate}
                  </span>
                  . Please check back after this date for new availability.
                </p>
              ) : minCapitalRequestAmount > 0 ? (
                <p className="capital-info-note mt-4 mb-0">
                  Min. amount{" "}
                  <span
                    onClick={() => {
                      setInvestAmount({
                        amount: minCapitalRequestAmount,
                      });

                      setInvestAmt(minCapitalRequestAmount);
                    }}
                    className="cursor-pointer"
                    style={{ fontWeight: "bold" }}
                  >
                    {formatCurrency(
                      TrancheRes?.tranche?.currencyCode === "USD"
                        ? "$"
                        : TrancheRes?.tranche?.currencyCode === "SGD"
                        ? "S$"
                        : "€",
                      minCapitalRequestAmount
                    )}
                  </span>
                  , Max. amount{" "}
                  <span
                    onClick={() => {
                      setInvestAmount({
                        amount:
                          TrancheRes?.investment
                            ?.maxAmountAvailableForCapitalCall,
                      });

                      setInvestAmt(
                        TrancheRes?.investment?.maxAmountAvailableForCapitalCall
                      );
                    }}
                    className="cursor-pointer"
                    style={{ fontWeight: "bold" }}
                  >
                    {formatCurrency(
                      TrancheRes?.tranche?.currencyCode === "USD"
                        ? "$"
                        : TrancheRes?.tranche?.currencyCode === "SGD"
                        ? "S$"
                        : "€",
                      maxCapitalRequestAmount
                    )}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
          {capitalResponseLoader && (
            <div>
              <RedemptionSkeleton />
            </div>
          )}
          {redemptionModal && capitalResponseLoader === false ? (
            <div>
              <div className="mt-24">
                <div className="sb-flex-justify-between mb-16">
                  <div>
                    <p className="m-0">Redemption principal</p>
                  </div>
                  <div>
                    <p className="m-0">
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        investAmount?.amount
                      )}
                    </p>
                  </div>
                </div>

                <div className="sb-flex-justify-between mb-16">
                  <div>
                    <p className="m-0">Fees</p>
                  </div>
                  <div>
                    <p className="m-0">
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        0
                      )}
                    </p>
                  </div>
                </div>
                <div className="sb-flex-justify-between mb-16">
                  <div>
                    <p className="m-0">Redemption date</p>
                  </div>
                  <div>
                    <p className="m-0">
                      {britishFormatDate(
                        TrancheRes?.investment?.nextCapitalCallDate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="sb-text-align mt-24">
                <ButtonDefault
                  style={{ width: "100%" }}
                  className="commit-btn"
                  title="Submit"
                  onClick={handleCapitalRequest}
                  loading={capitalRequestLoader}
                  disabled={
                    investAmount?.amount >
                      TrancheRes?.investment?.principalSettled ||
                    investAmount?.amount < minCapitalRequestAmount ||
                    investAmount?.amount === "" ||
                    investAmount?.amount > maxCapitalRequestAmount
                  }
                />
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div>
          <p className="capital-bond-sale-info-note mt-4 mb-4">
            Available liquidity is{" "}
            <span className="cursor-pointer">
              {formatCurrency(
                TrancheRes?.tranche?.currencyCode === "USD"
                  ? "$"
                  : TrancheRes?.tranche?.currencyCode === "SGD"
                  ? "S$"
                  : "€",
                TrancheRes?.tranche?.secondaryMarketAvailableLiquidity
              )}
            </span>
          </p>
          <div
            className="start-invest-div"
            style={{ display: "flex", alignItems: "start" }}
          >
            <div
              style={{ flex: 1 }}
              className={
                bondSellvalidationErrors.amount === true
                  ? "error-border-capital"
                  : ""
              }
            >
              <div style={{ position: "relative" }}>
                <InputDefault
                  value={bondSellAmount?.amount}
                  placeholder="Enter amount"
                  type="number"
                  name="amount"
                  onChange={handleBondSellChange}
                  required={true}
                  errorMsg={"Amount is Required"}
                  style={{ backgroundColor: "#ffffff" }}
                  disabled={
                    minBondSellRequestAmount <= 0 ||
                    maxBondSellRequestAmount <= 0
                  }
                />
                {bondSellvalidationErrors.amount === true && (
                  <div className="borrower-warning-logo">
                    <img src={Borrower_warning} alt="Borrower_warning" />
                  </div>
                )}
              </div>
              {bondSellvalidationErrors.amount === true &&
              bondSellAmount.amount === "" ? (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Please enter an amount
                </span>
              ) : bondSellvalidationErrors.amount === true &&
                bondSellAmount.amount !== "" &&
                bondSellAmount.amount > maxBondSellRequestAmount ? (
                <span style={{ color: "red", fontSize: "12px" }}>
                  The maximum redemption for this investment is{" "}
                  {formatCurrency(
                    TrancheRes?.tranche?.currencyCode === "USD"
                      ? "$"
                      : TrancheRes?.tranche?.currencyCode === "SGD"
                      ? "S$"
                      : "€",
                    maxBondSellRequestAmount
                  )}
                </span>
              ) : bondSellvalidationErrors.amount === true &&
                bondSellAmount.amount !== "" &&
                bondSellAmount.amount < minBondSellRequestAmount ? (
                <span style={{ color: "red", fontSize: "12px" }}>
                  The minimum redemption for this investment is{" "}
                  {formatCurrency(
                    TrancheRes?.tranche?.currencyCode === "USD"
                      ? "$"
                      : TrancheRes?.tranche?.currencyCode === "SGD"
                      ? "S$"
                      : "€",
                    minBondSellRequestAmount
                  )}
                </span>
              ) : bondSellvalidationErrors.amount === true &&
                bondSellAmount.amount !== "" &&
                bondSellAmount?.amount >
                  TrancheRes?.tranche?.secondaryMarketAvailableLiquidity ? (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Available liquidity is{" "}
                  {formatCurrency(
                    TrancheRes?.tranche?.currencyCode === "USD"
                      ? "$"
                      : TrancheRes?.tranche?.currencyCode === "SGD"
                      ? "S$"
                      : "€",
                    TrancheRes?.tranche?.secondaryMarketAvailableLiquidity
                  )}
                  . Sell requests are unavailable due to insufficient liquidity.
                  Please check back later.
                </span>
              ) : null}
              {minBondSellRequestAmount > 0 && maxBondSellRequestAmount > 0 ? (
                <p className="capital-info-note mt-4 mb-0">
                  Min. amount{" "}
                  <span
                    onClick={() => {
                      setCheckErr(false);
                      setBondSellAmt({
                        amount: minBondSellRequestAmount,
                      });

                      setBondSellAmount({
                        amount: minBondSellRequestAmount,
                      });
                    }}
                    className="cursor-pointer"
                    style={{ fontWeight: "bold" }}
                  >
                    {formatCurrency(
                      TrancheRes?.tranche?.currencyCode === "USD"
                        ? "$"
                        : TrancheRes?.tranche?.currencyCode === "SGD"
                        ? "S$"
                        : "€",
                      minBondSellRequestAmount
                    )}
                  </span>
                  , Max. amount{" "}
                  <span
                    onClick={() => {
                      setCheckErr(false);
                      setBondSellAmt({
                        amount: maxBondSellRequestAmount,
                      });

                      setBondSellAmount({
                        amount: maxBondSellRequestAmount,
                      });
                    }}
                    className="cursor-pointer"
                    style={{ fontWeight: "bold" }}
                  >
                    {formatCurrency(
                      TrancheRes?.tranche?.currencyCode === "USD"
                        ? "$"
                        : TrancheRes?.tranche?.currencyCode === "SGD"
                        ? "S$"
                        : "€",
                      maxBondSellRequestAmount
                    )}
                  </span>
                </p>
              ) : null}
              {minBondSellRequestAmount <= 0 &&
                maxBondSellRequestAmount <= 0 && (
                  <p className="capital-info-note mt-4 mb-0">
                    Min. amount{" "}
                    <span
                      className="cursor-pointer"
                      style={{ fontWeight: "bold" }}
                    >
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        100
                      )}
                    </span>
                    . You do not have sufficient princinpal to sell
                  </p>
                )}

              {(minBondSellRequestAmount < 100 &&
                TrancheRes?.tranche?.secondaryMarketAvailableLiquidity < 100) ||
              TrancheRes?.tranche?.secondaryMarketAvailableLiquidity < 100 ? (
                <p className="capital-info-note mt-4 mb-0">
                  Liquidity run out for a moment. please come back later
                </p>
              ) : null}
            </div>
          </div>
          {capitalResponseLoader && (
            <div>
              <RedemptionSkeleton />
            </div>
          )}
          {bonSellResponse &&
          Object.keys(bonSellResponse)?.length > 0 &&
          capitalResponseLoader === false &&
          bondSellAmount?.amount !== "" ? (
            <>
              <div className="mt-24">
                <div className="sb-flex-justify-between mb-16">
                  <div>
                    <p className="m-0">Original price</p>
                  </div>
                  <div>
                    <p className="m-0">
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        bonSellResponse?.originalAmount
                      )}
                    </p>
                  </div>
                </div>

                <div className="sb-flex-justify-between mb-16">
                  <div>
                    <p className="m-0">Selling price</p>
                  </div>
                  <div>
                    <p className="m-0">
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        bonSellResponse?.sellingPrice
                      )}
                    </p>
                  </div>
                </div>
                <div className="sb-flex-justify-between mb-16">
                  <div>
                    <p className="m-0">Accrued Interest</p>
                  </div>
                  <div>
                    <p className="m-0">
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        bonSellResponse?.accruedInterest
                      )}
                    </p>
                  </div>
                </div>
                <div className="sb-flex-justify-between mb-16 fw-600">
                  <div>
                    <p className="m-0">Total amount</p>
                  </div>
                  <div>
                    <p className="m-0">
                      {formatCurrency(
                        TrancheRes?.tranche?.currencyCode === "USD"
                          ? "$"
                          : TrancheRes?.tranche?.currencyCode === "SGD"
                          ? "S$"
                          : "€",
                        bonSellResponse?.totalAmount
                      )}
                    </p>
                  </div>
                </div>
              </div>
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
                    onClick={handleDownLoadPurchasedConditionPdf}
                    className="acceptance-btn"
                    style={{
                      color: "var(--kilde-blue)",
                      fontSize: "14px",
                    }}
                  >
                    conditions
                  </Button>{" "}
                  and{" "}
                  <Button
                    onClick={() => {
                      window.open(PurchaseSaleAgreement);
                    }}
                    className="acceptance-btn"
                    style={{
                      color: "var(--kilde-blue)",
                      fontSize: "14px",
                    }}
                  >
                    purchase agreement.
                  </Button>
                </Checkbox>
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
                  Please accept the purchase agreement to continue.
                </label>
              )}
              <div className="mt-16">
                <ButtonDefault
                  title="Submit"
                  onClick={handleSubmitBondRequest}
                  className="invest-btn"
                  loading={finalBondRequestLoading}
                  style={{ width: "100%" }}
                  disabled={
                    bondSellAmount?.amount === "" ||
                    TrancheRes?.investment?.principalSettled <= 0 ||
                    maxBondSellRequestAmount <= 0 ||
                    (bondSellAmount?.amount !== "" &&
                      (bondSellAmount?.amount >
                        TrancheRes?.investment?.principalSettled ||
                        bondSellAmount?.amount < minBondSellRequestAmount)) ||
                    bondSellAmount?.amount > maxBondSellRequestAmount
                  }
                />
              </div>
            </>
          ) : null}
        </div>
      )}
    </Col>
  );
};

export default StartCapitalCallRequest;
