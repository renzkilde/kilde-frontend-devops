import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Content } from "antd/es/layout/layout";
import { Breadcrumb, Button, Checkbox, Col, Row, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import InputDefault from "../../Components/InputDefault/InputDefault";
import SelectDefault from "../../Components/SelectDefault/SelectDefault";

import DashIcon from "../../Assets/Images/SVGs/dash.svg";
import PercentageIcon from "../../Assets/Images/SVGs/percentage.svg";
import ArrowUpAndDownIcon from "../../Assets/Images/SVGs/ArrowLineUpDown.svg";

import "./style.css";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";

import {
  createStratergy,
  getAvailableInvestment,
  getStratergySettings,
  stratergyAcceptanceDownload,
} from "../../Apis/AutoInvestment";
import {
  formatCurrency,
  getTransformedCountries,
  getTransformedIndustries,
  getTransformedLoanOriginator,
  getTransformedProductTypes,
  showMessageWithCloseIcon,
} from "../../Utils/Reusables";
import { LoadingOutlined } from "@ant-design/icons";
import CustomRadioButton from "../../Components/DefaultRadio/CustomRadioButton";

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const isAnyFieldEmptyExceptStrategyName = (data) => {
  return Object.entries(data).some(
    ([key, value]) =>
      key !== "strategyName" &&
      ((typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0))
  );
};

const CreateStrategyPage = () => {
  const navigate = useNavigate();
  const [createStratergyLoader, setCreateStratergyLoader] = useState(false);
  const [loadDataLoader, setloadDataLoader] = useState(false);
  const [getStratergyData, setGetStrategyData] = useState();
  const [checkedAcceptance, setCheckedAcceptance] = useState(false);
  const [checkedAcceptanceErr, setCheckedAcceptanceErr] = useState(false);
  const countryList = getTransformedCountries(getStratergyData?.countries);
  const industryList = getTransformedIndustries(getStratergyData?.industries);
  const [downloadPdfLoader, setDownloadPdfLoader] = useState(false);
  const productTypeList = getTransformedProductTypes(
    getStratergyData?.productTypes
  );
  const OriginatorsList = getTransformedLoanOriginator(
    getStratergyData?.loanOriginators
  );
  const [availableInvestData, setAvailableInvestData] = useState();

  const initialState = {
    strategyName: "",
    currencyCode: "USD",
    minInterestRate: "6",
    maxInterestRate: "14",
    minRemainingLoanTerm: "5",
    maxRemainingLoanTerm: "24",
    portfolioSize: "1000",
    maxInvestmentInOneBorrower: "1000",
    industries: ["ALL"],
    productTypes: ["ALL"],
    countries: ["ALL"],
    loanOriginators: ["ALL"],
  };
  const [createStrategyData, setCreatStratergyData] = useState(initialState);
  const [validationErrors, setValidationErrors] = useState({
    strategyName: false,
    currencyCode: false,
    minInterestRate: false,
    maxInterestRate: false,
    minRemainingLoanTerm: false,
    maxRemainingLoanTerm: false,
    portfolioSize: false,
    maxInvestmentInOneBorrower: false,
    industries: false,
    productTypes: false,
    countries: false,
    loanOriginators: false,
  });

  const hasMounted = useRef(false);
  const debouncedStrategyData = useDebounce(createStrategyData, 300);
  const prevStrategyName = useRef(createStrategyData.strategyName);

  useEffect(() => {
    if (hasMounted.current) {
      if (prevStrategyName.current !== createStrategyData.strategyName) {
        prevStrategyName.current = createStrategyData.strategyName;
      } else if (!isAnyFieldEmptyExceptStrategyName(debouncedStrategyData)) {
        const availableInvestRequestBody = formatRequestBody(
          debouncedStrategyData
        );
        setloadDataLoader(true);
        getAvailableInvestmentDetails(availableInvestRequestBody);
      } else {
        setloadDataLoader(false);
      }
    } else {
      hasMounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedStrategyData]);

  const getAvailableInvestmentDetails = async (data) => {
    const response = await getAvailableInvestment(data);
    if (response) {
      setloadDataLoader(false);
      setAvailableInvestData(response);
    }
  };

  useEffect(() => {
    setloadDataLoader(true);
    getStratergySettingsDetails();
  }, []);

  const getStratergySettingsDetails = async () => {
    const response = await getStratergySettings();
    if (response) {
      setloadDataLoader(false);
      setGetStrategyData(response);
    }
  };

  const formatRequestBody = (data) => {
    return {
      strategyName: data.strategyName,
      acceptTerms: checkedAcceptance,
      params: {
        currencyCode: data.currencyCode,
        maxInvestmentInOneBorrower: data.maxInvestmentInOneBorrower,
        portfolioSize: data.portfolioSize,
        industries: data.industries,
        productTypes: data.productTypes,
        countries: data.countries,
        loanOriginators: data.loanOriginators,
        minInterestRate: data.minInterestRate,
        maxInterestRate: data.maxInterestRate,
        minRemainingLoanTerm: data.minRemainingLoanTerm,
        maxRemainingLoanTerm: data.maxRemainingLoanTerm,
      },
    };
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (
      name === "minInterestRate" &&
      value.toString() > getStratergyData?.maxInterestRate
    ) {
      return;
    } else if (
      name === "maxInterestRate" &&
      value.toString() > getStratergyData?.maxInterestRate
    ) {
      return;
    } else if (
      name === "minRemainingLoanTerm" &&
      value.toString() > getStratergyData?.maxRemainingLoanTerm
    ) {
      return;
    } else if (
      name === "maxRemainingLoanTerm" &&
      value.toString() > getStratergyData?.maxRemainingLoanTerm
    ) {
      return;
    } else {
      setCreatStratergyData({ ...createStrategyData, [name]: value });
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value.trim() !== "",
      }));
    }
  };

  const handleChangeCurrency = (e) => {
    setCreatStratergyData((prevState) => ({
      ...prevState,
      currencyCode: e.target.value,
    }));
  };

  const sharedProps = {
    mode: "multiple",
    style: {
      width: "100%",
      border: "1px solid var(--dark-blue-10, rgba(26, 32, 44, 0.1))",
      borderRadius: "var(--12)",
      height: "40px",
      alignItems: "center",
      textAlign: "start",
      padding: "var(--4, 4px) var(--12, 12px)",
    },
    placeholder: "Please select",
    maxTagCount: "responsive",
    showSearch: true,
    filterOption: (input, option) =>
      option.label.toLowerCase().includes(input.toLowerCase()),
  };

  const handleCreateStrategy = () => {
    setCreateStratergyLoader(true);
    setValidationErrors({
      strategyName: true,
      currencyCode: true,
      minInterestRate: true,
      maxInterestRate: true,
      minRemainingLoanTerm: true,
      maxRemainingLoanTerm: true,
      portfolioSize: true,
      maxInvestmentInOneBorrower: true,
      industries: createStrategyData?.industries?.length > 0 ? false : true,
      productTypes: createStrategyData?.productTypes?.length > 0 ? false : true,
      countries: createStrategyData?.countries?.length > 0 ? false : true,
      loanOriginators:
        createStrategyData?.loanOriginators?.length > 0 ? false : true,
    });

    const createStratergyRequestBody = formatRequestBody(debouncedStrategyData);
    const isFieldsNotEmpty = Object.values(createStrategyData)?.every(
      (value) => {
        if (typeof value === "string") {
          return value.trim() !== "";
        } else if (Array.isArray(value)) {
          return value.length > 0;
        }
        return true;
      }
    );

    if (checkedAcceptance === false) {
      setCheckedAcceptanceErr(true);
      setCreateStratergyLoader(false);
    } else if (isFieldsNotEmpty) {
      createStratergy(createStratergyRequestBody).then(async (response) => {
        if (response === "") {
          showMessageWithCloseIcon("Strategy created successfully!");
          navigate(ROUTES.TRANCH_LISTING, {
            state: { showComponent: "Auto-investment" },
          });
          setCreatStratergyData(initialState);
          setValidationErrors({
            strategyName: false,
            currencyCode: false,
            minInterestRate: false,
            maxInterestRate: false,
            minRemainingLoanTerm: false,
            maxRemainingLoanTerm: false,
            portfolioSize: false,
            maxInvestmentInOneBorrower: false,
            industries: false,
            productTypes: false,
            countries: false,
            loanOriginators: false,
          });
          setCreateStratergyLoader(false);
        } else {
          setCreateStratergyLoader(false);
        }
      });
    } else {
      setCreateStratergyLoader(false);
    }
  };

  const handleIndustriesChange = (value) => {
    setCreatStratergyData((prevState) => ({
      ...prevState,
      industries: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      industries: value.length === 0,
    }));
  };

  const handleproductTypesChange = (value) => {
    setCreatStratergyData((prevState) => ({
      ...prevState,
      productTypes: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      productTypes: value.length === 0,
    }));
  };

  const handleCountriesChange = (value) => {
    setCreatStratergyData((prevState) => ({
      ...prevState,
      countries: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      countries: value.length === 0,
    }));
  };

  const handleLoanOriginatorsChange = (value) => {
    setCreatStratergyData((prevState) => ({
      ...prevState,
      loanOriginators: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      loanOriginators: value.length === 0,
    }));
  };

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

  const handleDownLoadUserPdf = () => {
    const createStratergyRequestBody = formatRequestBody(debouncedStrategyData);
    try {
      setDownloadPdfLoader(true);

      stratergyAcceptanceDownload(createStratergyRequestBody)
        .then(async (response) => {
          if (!response.data || response.data.size === 0) {
            throw new Error("Empty file received from server");
          }

          const contentType = response.headers["content-type"];
          const blob = new Blob([response.data], { type: contentType });

          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = response.headers["k-filename"] || "download.xlsx";
          link.click();
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
    <div>
      <DashboardLayout>
        <Content className="setting-page-div">
          <Breadcrumb
            items={[
              {
                title: "Auto-investment",
                onClick: () => {
                  const showFundTranches =
                    localStorage.getItem("showFundTranches") === "true";

                  navigate(
                    showFundTranches
                      ? ROUTES.AUTO_INVEST
                      : ROUTES.TRANCH_LISTING,
                    showFundTranches
                      ? undefined
                      : { state: { showComponent: "Auto-investment" } }
                  );
                },
                className: "cursor-pointer",
              },
              {
                title: "Create new strategy",
              },
            ]}
          />

          <Row className="stratergy-main-div">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={20}
              className="setting-twofa-div medium-tranch-col"
            >
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 50, color: "var(--kilde-blue)" }}
                  />
                }
                spinning={loadDataLoader}
              >
                <Col xs={24} sm={24}>
                  <p className="page-title m-0">Create New Strategy</p>
                </Col>
                <Col xs={24} sm={24}>
                  <label className="input-label mb-4">Strategy name</label>
                  <InputDefault
                    type="text"
                    name="strategyName"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.strategyName}
                    onChange={handleChange}
                    value={createStrategyData?.strategyName}
                    required={true}
                    errorMsg={"Enter strategy name"}
                  />
                </Col>

                <Row gutter={[16, 16]} className="radio-strategy-div">
                  <Col xs={24}>
                    <label className="input-label">Currency</label>
                    <div className="create-stratergy-radio-group">
                      <CustomRadioButton
                        name="option"
                        label="USD"
                        value="USD"
                        checked={createStrategyData.currencyCode === "USD"}
                        onChange={handleChangeCurrency}
                      />
                      <CustomRadioButton
                        name="option"
                        value="SGD"
                        label="SGD"
                        checked={createStrategyData.currencyCode === "SGD"}
                        onChange={handleChangeCurrency}
                      />
                      <CustomRadioButton
                        name="option"
                        value="EUR"
                        label="EUR"
                        checked={createStrategyData.currencyCode === "EUR"}
                        onChange={handleChangeCurrency}
                      />
                    </div>
                  </Col>
                </Row>

                <Row gutter={[24, 24]} className="mt-16">
                  <Col xs={24} sm={12} md={12}>
                    <label className="input-label">Interest rate</label>
                    <div className="flex-container">
                      <div className="flex-item">
                        <div style={{ position: "relative" }}>
                          <InputDefault
                            className="noscroll"
                            type="number"
                            placeholder={3}
                            name="minInterestRate"
                            validationState={setValidationErrors}
                            focusing={validationErrors?.minInterestRate}
                            onChange={handleChange}
                            value={createStrategyData?.minInterestRate}
                            required={true}
                            errorMsg={"Enter min interest rate"}
                          />
                          <img
                            src={PercentageIcon}
                            alt="percentage"
                            style={{
                              position: "absolute",
                              top: 10,
                              right: 16,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-item-icon">
                        <img src={DashIcon} alt="dash-icon" />
                      </div>
                      <div className="flex-item">
                        <div style={{ position: "relative" }}>
                          <InputDefault
                            className="noscroll"
                            max={getStratergyData?.maxInterestRate}
                            type="number"
                            placeholder={20}
                            name="maxInterestRate"
                            validationState={setValidationErrors}
                            focusing={validationErrors?.maxInterestRate}
                            onChange={handleChange}
                            value={createStrategyData?.maxInterestRate}
                            required={true}
                            errorMsg={
                              createStrategyData?.maxInterestRate >
                              getStratergyData?.maxInterestRate
                                ? "Enter value less than the maximum interest rate"
                                : "Enter max interest rate"
                            }
                          />
                          <img
                            src={PercentageIcon}
                            alt="percentage"
                            style={{
                              position: "absolute",
                              top: 10,
                              right: 16,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={12}>
                    <label className="input-label">
                      Remaining loan term (m)
                    </label>
                    <div className="flex-container">
                      <div className="flex-item">
                        <InputDefault
                          className="noscroll"
                          type="number"
                          style={{ width: "100%" }}
                          placeholder={1}
                          name="minRemainingLoanTerm"
                          validationState={setValidationErrors}
                          focusing={validationErrors?.minRemainingLoanTerm}
                          onChange={handleChange}
                          value={createStrategyData?.minRemainingLoanTerm}
                          required={true}
                          errorMsg={"Enter Min Remaining Loan Term"}
                        />
                      </div>
                      <div className="flex-item-icon">
                        <img src={DashIcon} alt="dash-icon" />
                      </div>
                      <div className="flex-item">
                        <InputDefault
                          className="noscroll"
                          max={getStratergyData?.maxRemainingLoanTerm}
                          type="number"
                          style={{ width: "100%" }}
                          placeholder={24}
                          name="maxRemainingLoanTerm"
                          validationState={setValidationErrors}
                          focusing={validationErrors?.maxRemainingLoanTerm}
                          onChange={handleChange}
                          value={createStrategyData?.maxRemainingLoanTerm}
                          required={true}
                          errorMsg={
                            createStrategyData?.maxRemainingLoanTerm >
                            getStratergyData?.maxRemainingLoanTerm
                              ? "Enter value less than the maximum loan term"
                              : "Enter minRemainingLoan Term"
                          }
                        />
                      </div>
                    </div>
                  </Col>
                </Row>

                <Col xs={24} sm={24} className="mt-16">
                  <label className="input-label">Portfolio size</label>
                  <InputDefault
                    type="text"
                    style={{ width: "100%" }}
                    placeholder="100$"
                    name="portfolioSize"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.portfolioSize}
                    onChange={handleChange}
                    value={createStrategyData?.portfolioSize}
                    required={true}
                    errorMsg={"Enter portfolio Size"}
                  />
                  <span className="input-span-below">
                    The maximum limit of the auto investment strategy
                  </span>
                </Col>

                <Col className="mt-16 w-100">
                  <label className="input-label">
                    Investment in one borrower
                  </label>

                  <InputDefault
                    type="text"
                    style={{ width: "100%" }}
                    placeholder="Maximum amount"
                    name="maxInvestmentInOneBorrower"
                    validationState={setValidationErrors}
                    focusing={validationErrors?.maxInvestmentInOneBorrower}
                    onChange={handleChange}
                    value={createStrategyData?.maxInvestmentInOneBorrower}
                    required={true}
                    errorMsg={"Enter maxInvestmentInOne Borrower"}
                  />
                </Col>

                <Row gutter={[16, 16]} className="radio-strategy-div">
                  <Col xs={24} md={12}>
                    <label className="input-label">Industries</label>
                    <SelectDefault
                      {...sharedProps}
                      className="stratergy-mutiple-selectbox"
                      value={createStrategyData.industries}
                      onChange={handleIndustriesChange}
                      data={industryList}
                      errorMsg="Please select at least one industry"
                      validationState={validationErrors.industries}
                      MyValue={createStrategyData.industries.length > 0}
                      suffixIcon={
                        <img src={ArrowUpAndDownIcon} alt="arrow-icon" />
                      }
                      allowClear={true}
                      maxTagCount="responsive"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="input-label">Product types</label>
                    <SelectDefault
                      {...sharedProps}
                      className="stratergy-mutiple-selectbox"
                      value={createStrategyData.productTypes}
                      onChange={handleproductTypesChange}
                      data={productTypeList}
                      errorMsg="Please select at least one product type"
                      validationState={validationErrors.productTypes}
                      MyValue={createStrategyData.productTypes.length > 0}
                      suffixIcon={
                        <img src={ArrowUpAndDownIcon} alt="arrow-icon" />
                      }
                      allowClear={true}
                    />
                  </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col xs={24} md={12}>
                    <label className="input-label">Country</label>
                    <SelectDefault
                      {...sharedProps}
                      className="stratergy-mutiple-selectbox"
                      value={createStrategyData.countries}
                      onChange={handleCountriesChange}
                      data={countryList}
                      errorMsg="Please select at least one country"
                      validationState={validationErrors.countries}
                      MyValue={createStrategyData.countries.length > 0}
                      suffixIcon={
                        <img src={ArrowUpAndDownIcon} alt="arrow-icon" />
                      }
                      allowClear={true}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <label className="input-label">Loan originator</label>
                    <SelectDefault
                      {...sharedProps}
                      className="stratergy-mutiple-selectbox"
                      value={createStrategyData.loanOriginators}
                      onChange={handleLoanOriginatorsChange}
                      data={OriginatorsList}
                      errorMsg="Please select at least one Originator"
                      validationState={validationErrors.loanOriginators}
                      MyValue={createStrategyData.loanOriginators.length > 0}
                      suffixIcon={
                        <img src={ArrowUpAndDownIcon} alt="arrow-icon" />
                      }
                      allowClear={true}
                    />
                  </Col>
                </Row>
                <div style={{ marginTop: 20 }}>
                  <Checkbox
                    className="checkbox-kilde"
                    style={{ marginRight: 5 }}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCheckedAcceptanceErr(false);
                      } else {
                        setCheckedAcceptanceErr(true);
                      }
                      setCheckedAcceptance(e.target.checked);
                    }}
                  />{" "}
                  I have read and accept the terms of{" "}
                  <Button
                    loading={downloadPdfLoader}
                    className="acceptance-btn"
                    target="_blank"
                    onClick={handleDownLoadUserPdf}
                    rel="noreferrer"
                  >
                    Note of acceptance
                  </Button>
                  {checkedAcceptanceErr ? (
                    <label
                      className="error-msg mt-0"
                      style={{
                        display: "block",
                        fontSize: "12px",
                      }}
                    >
                      Please accept the Terms of Use & Privacy Policy
                    </label>
                  ) : null}
                </div>
                <div>
                  <p>
                    <b>Note:</b> With these parameters we have{" "}
                    {availableInvestData === undefined
                      ? "$1,000.00"
                      : formatCurrency(
                          "$",
                          availableInvestData?.availableInvestments?.amount
                        )}{" "}
                    available from{" "}
                    {availableInvestData === undefined
                      ? "1"
                      : availableInvestData?.availableInvestments
                          ?.borrowerCount}{" "}
                    borrowers
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 24,
                  }}
                >
                  <ButtonDefault
                    title="Save and Invest"
                    onClick={handleCreateStrategy}
                    loading={createStratergyLoader}
                  />
                </div>
              </Spin>
            </Col>
          </Row>
        </Content>
      </DashboardLayout>
    </div>
  );
};

export default CreateStrategyPage;
