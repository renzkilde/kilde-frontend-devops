import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { Content } from "antd/es/layout/layout";
import { Breadcrumb, Button, Checkbox, Col, Modal, Row, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import InputDefault from "../../Components/InputDefault/InputDefault";
import SelectDefault from "../../Components/SelectDefault/SelectDefault";

import DashIcon from "../../Assets/Images/SVGs/dash.svg";
import DeleteStratergy from "../../Assets/Images/SVGs/delete_stratergy";

import ArrowUpAndDownIcon from "../../Assets/Images/SVGs/ArrowLineUpDown.svg";
import Delete from "../../Assets/Images/delete.svg";
import "./style.css";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import PercentageIcon from "../../Assets/Images/SVGs/percentage.svg";

import {
  deleteStrategy,
  editStrategy,
  getAvailableInvestment,
  getStrategy,
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

const EditStrategyPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [action, setAction] = useState("Pause");
  const [editStratergyLoader, setEditStratergyLoader] = useState(false);
  const [getStratergyData, setGetStrategyData] = useState();
  const [checkedAcceptance, setCheckedAcceptance] = useState(false);
  const [checkedAcceptanceErr, setCheckedAcceptanceErr] = useState(false);
  const countryList = getTransformedCountries(getStratergyData?.countries);
  const industryList = getTransformedIndustries(getStratergyData?.industries);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const initialState = {
    strategyName: "",
    currencyCode: "USD",
    minInterestRate: "",
    maxInterestRate: "",
    minRemainingLoanTerm: "",
    maxRemainingLoanTerm: "",
    portfolioSize: "",
    maxInvestmentInOneBorrower: "",
    industries: ["ALL"],
    productTypes: ["ALL"],
    countries: ["ALL"],
    loanOriginators: ["ALL"],
  };

  const [editStrategyData, setEditStratergyData] = useState(initialState);
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
  const [loadDataLoader, setloadDataLoader] = useState(false);
  const [availableInvestData, setAvailableInvestData] = useState();
  const hasMounted = useRef(false);
  const debouncedStrategyData = useDebounce(editStrategyData, 300);
  const prevStrategyName = useRef(editStrategyData.strategyName);
  const [downloadPdfLoader, setDownloadPdfLoader] = useState(false);

  useEffect(() => {
    if (hasMounted.current) {
      if (prevStrategyName.current !== editStrategyData.strategyName) {
        prevStrategyName.current = editStrategyData.strategyName;
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

  useEffect(() => {
    setloadDataLoader(true);
    getEditableStrategy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const getEditableStrategy = () => {
    getStrategy(slug).then(async (details) => {
      getEditStrategyData(details);
      setloadDataLoader(false);
    });
  };

  const getEditStrategyData = (data) => {
    if (data) {
      setEditStratergyData({
        strategyName: data.strategyName || "",
        currencyCode: data.params?.currencyCode || "USD",
        minInterestRate: data.params?.minInterestRate || "",
        maxInterestRate: data.params?.maxInterestRate || "",
        minRemainingLoanTerm: data.params?.minRemainingLoanTerm || "",
        maxRemainingLoanTerm: data.params?.maxRemainingLoanTerm || "",
        portfolioSize: data.params?.portfolioSize || "",
        maxInvestmentInOneBorrower:
          data.params?.maxInvestmentInOneBorrower || "",
        industries: data.params?.industries || ["ALL"],
        productTypes: data.params?.productTypes || ["ALL"],
        countries: data.params?.countries || ["ALL"],
        loanOriginators: data.params?.loanOriginators || ["ALL"],
      });
    }
  };

  const handleDelete = () => {
    setAction("delete");
    setConfirmModal(true);
  };

  const handleDeleteStrategy = async () => {
    setLoader(true);
    try {
      const resp = await deleteStrategy({ uuid: slug });
      if (resp === "") {
        showMessageWithCloseIcon("Strategy deleted successfully!");
        setLoader(false);
        setConfirmModal(false);
        navigate(ROUTES.TRANCH_LISTING, {
          state: { showComponent: "Auto-investment" },
        });
      } else {
        setLoader(false);
        setConfirmModal(false);
      }
    } catch (error) {
      setLoader(false);
      setConfirmModal(false);
    }
  };

  const handleAction = () => {
    if (action === "delete") {
      handleDeleteStrategy();
    }
  };
  const productTypeList = getTransformedProductTypes(
    getStratergyData?.productTypes
  );
  const OriginatorsList = getTransformedLoanOriginator(
    getStratergyData?.loanOriginators
  );

  useEffect(() => {
    getStratergySettingsDetails();
  }, []);

  const getStratergySettingsDetails = async () => {
    const response = await getStratergySettings();
    if (response) {
      setGetStrategyData(response);
    }
  };

  const formatRequestBody = (data) => {
    return {
      strategyName: data.strategyName,
      acceptTerms: checkedAcceptance,
      strategyUuid: slug,
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
      setEditStratergyData({ ...editStrategyData, [name]: value });
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value.trim() !== "",
      }));
    }
  };

  const handleChangeCurrency = (e) => {
    setEditStratergyData((prevState) => ({
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

  const handleEditStrategy = async () => {
    setEditStratergyLoader(true);
    const availableInvestRequestBody = formatRequestBody(editStrategyData);

    setValidationErrors({
      strategyName: true,
      currencyCode: true,
      minInterestRate: true,
      maxInterestRate: true,
      minRemainingLoanTerm: true,
      maxRemainingLoanTerm: true,
      portfolioSize: true,
      maxInvestmentInOneBorrower: true,
      industries: editStrategyData?.industries?.length > 0 ? false : true,
      productTypes: editStrategyData?.productTypes?.length > 0 ? false : true,
      countries: editStrategyData?.countries?.length > 0 ? false : true,
      loanOriginators:
        editStrategyData?.loanOriginators?.length > 0 ? false : true,
    });

    if (checkedAcceptance === false) {
      setCheckedAcceptanceErr(true);
      setEditStratergyLoader(false);
    } else {
      try {
        const resp = await editStrategy(availableInvestRequestBody);
        if (resp === "") {
          showMessageWithCloseIcon("Strategy edited successfully!");
          navigate(ROUTES.TRANCH_LISTING, {
            state: { showComponent: "Auto-investment" },
          });
          setEditStratergyLoader(false);
        } else {
          setEditStratergyLoader(false);
        }
      } catch (error) {
        setEditStratergyLoader(false);
      }
    }
  };

  const handleIndustriesChange = (value) => {
    setEditStratergyData((prevState) => ({
      ...prevState,
      industries: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      industries: value.length === 0,
    }));
  };

  const handleproductTypesChange = (value) => {
    setEditStratergyData((prevState) => ({
      ...prevState,
      productTypes: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      productTypes: value.length === 0,
    }));
  };

  const handleCountriesChange = (value) => {
    setEditStratergyData((prevState) => ({
      ...prevState,
      countries: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      countries: value.length === 0,
    }));
  };

  const handleLoanOriginatorsChange = (value) => {
    setEditStratergyData((prevState) => ({
      ...prevState,
      loanOriginators: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      loanOriginators: value.length === 0,
    }));
  };

  const getAvailableInvestmentDetails = async (data) => {
    const response = await getAvailableInvestment(data);
    if (response) {
      setloadDataLoader(false);
      setAvailableInvestData(response);
    }
  };

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
            separator=" / "
            items={[
              {
                title: (
                  <span
                    onClick={() => {
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
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Auto-investment
                  </span>
                ),
              },
              {
                title: "Edit strategy",
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
                <div className="strategy-action-main-div">
                  <p className="page-title m-0">Edit Strategy</p>
                  <div className="stratergy-action-icon-div">
                    <img
                      src={Delete}
                      alt="Delete"
                      style={{ cursor: "pointer" }}
                      onClick={handleDelete}
                    />
                  </div>
                  <div className="stratergy-actione-button-div">
                    <div className="w-100">
                      <Button
                        onClick={handleDelete}
                        className="stratergy-action-delete-btn"
                      >
                        <DeleteStratergy className="delete-stratergy-icon-btn" />{" "}
                        <p className="m-0">Delete</p>
                      </Button>
                    </div>
                  </div>
                </div>
                <label className="input-label mb-4">Strategy name</label>
                <InputDefault
                  type="text"
                  name="strategyName"
                  validationState={setValidationErrors}
                  focusing={validationErrors?.strategyName}
                  onChange={handleChange}
                  value={editStrategyData?.strategyName}
                  required={true}
                  errorMsg={"Enter strategy name"}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Row gutter={[16, 16]} className="radio-strategy-div">
                    <Col xs={24} style={{ cursor: "not-allowed" }}>
                      <label className="input-label">Currency</label>
                      <div className="create-stratergy-radio-group">
                        <CustomRadioButton
                          name="option"
                          label="USD"
                          value="USD"
                          checked={editStrategyData?.currencyCode === "USD"}
                          onChange={handleChangeCurrency}
                        />
                        <CustomRadioButton
                          name="option"
                          value="SGD"
                          label="SGD"
                          checked={editStrategyData.currencyCode === "SGD"}
                          onChange={handleChangeCurrency}
                        />
                        <CustomRadioButton
                          name="option"
                          value="EUR"
                          label="EUR"
                          checked={editStrategyData.currencyCode === "EUR"}
                          onChange={handleChangeCurrency}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]} className="mt-16">
                    <Col xs={24} sm={12} md={12}>
                      <label className="input-label">Interest rate</label>
                      <div className="flex-container">
                        <div className="flex-item">
                          <div style={{ position: "relative" }}>
                            <InputDefault
                              type="number"
                              placeholder={3}
                              name="minInterestRate"
                              validationState={setValidationErrors}
                              focusing={validationErrors?.minInterestRate}
                              onChange={handleChange}
                              value={editStrategyData?.minInterestRate}
                              required={true}
                              errorMsg={"Enter minInterest Rate"}
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
                              type="number"
                              placeholder={20}
                              name="maxInterestRate"
                              validationState={setValidationErrors}
                              focusing={validationErrors?.maxInterestRate}
                              onChange={handleChange}
                              value={editStrategyData?.maxInterestRate}
                              required={true}
                              errorMsg={"Enter maxInterest Rate"}
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

                    <Col
                      xs={24}
                      sm={12}
                      md={12}
                      className="remain-loan-stratergy"
                    >
                      <label className="input-label">
                        Remaining loan term (m)
                      </label>
                      <div className="flex-container">
                        <div className="flex-item">
                          <InputDefault
                            type="text"
                            style={{ width: "100%" }}
                            placeholder={1}
                            name="minRemainingLoanTerm"
                            validationState={setValidationErrors}
                            focusing={validationErrors?.minRemainingLoanTerm}
                            onChange={handleChange}
                            value={editStrategyData?.minRemainingLoanTerm}
                            required={true}
                            errorMsg={"Enter minRemainingLoan Term"}
                          />
                        </div>
                        <div className="flex-item-icon">
                          <img src={DashIcon} alt="dash-icon" />
                        </div>
                        <div className="flex-item">
                          <InputDefault
                            type="text"
                            style={{ width: "100%" }}
                            placeholder={24}
                            name="maxRemainingLoanTerm"
                            validationState={setValidationErrors}
                            focusing={validationErrors?.maxRemainingLoanTerm}
                            onChange={handleChange}
                            value={editStrategyData?.maxRemainingLoanTerm}
                            required={true}
                            errorMsg={"Enter maxRemainingLoan Term"}
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
                      value={editStrategyData?.portfolioSize}
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
                      value={editStrategyData?.maxInvestmentInOneBorrower}
                      required={true}
                      errorMsg={"Enter maxInvestmentInOne Borrower"}
                    />
                  </Col>

                  <Row gutter={16} className="radio-strategy-div">
                    <Col xs={24} sm={12} className="mb-16">
                      <label className="input-label">Industries</label>
                      <SelectDefault
                        {...sharedProps}
                        className="stratergy-mutiple-selectbox"
                        value={editStrategyData?.industries}
                        onChange={handleIndustriesChange}
                        data={industryList}
                        errorMsg="Please select at least one industry"
                        validationState={validationErrors.industries}
                        MyValue={editStrategyData?.industries?.length > 0}
                        suffixIcon={
                          <img src={ArrowUpAndDownIcon} alt="arrow-icon" />
                        }
                        allowClear={true}
                        maxTagCount="responsive"
                      />
                    </Col>
                    <Col xs={24} sm={12} className="mb-16">
                      <label className="input-label">Product types</label>
                      <SelectDefault
                        {...sharedProps}
                        className="stratergy-mutiple-selectbox"
                        value={editStrategyData?.productTypes}
                        onChange={handleproductTypesChange}
                        data={productTypeList}
                        errorMsg="Please select at least one product type"
                        validationState={validationErrors.productTypes}
                        MyValue={editStrategyData?.productTypes?.length > 0}
                        suffixIcon={
                          <img src={ArrowUpAndDownIcon} alt="arrow-icon" />
                        }
                        allowClear={true}
                      />
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12} className="mb-16">
                      <label className="input-label">Country</label>
                      <SelectDefault
                        {...sharedProps}
                        className="stratergy-mutiple-selectbox"
                        value={editStrategyData.countries}
                        onChange={handleCountriesChange}
                        data={countryList}
                        errorMsg="Please select at least one country"
                        validationState={validationErrors.countries}
                        MyValue={editStrategyData?.countries?.length > 0}
                        suffixIcon={
                          <img src={ArrowUpAndDownIcon} alt="arrow-icon" />
                        }
                        allowClear={true}
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <label className="input-label">Loan originator</label>
                      <SelectDefault
                        {...sharedProps}
                        className="stratergy-mutiple-selectbox"
                        value={editStrategyData?.loanOriginators}
                        onChange={handleLoanOriginatorsChange}
                        data={OriginatorsList}
                        errorMsg="Please select at least one Originator"
                        validationState={validationErrors.loanOriginators}
                        MyValue={editStrategyData?.loanOriginators?.length > 0}
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
                      value={editStrategyData?.acceptTerms}
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
                      onClick={handleEditStrategy}
                      loading={editStratergyLoader}
                    />
                  </div>
                </div>
              </Spin>
            </Col>
          </Row>
        </Content>
      </DashboardLayout>
      <Modal
        centered
        open={confirmModal}
        width={405}
        footer={null}
        maskClosable={false}
        className="withdraw-modal"
        closable={false}
      >
        <p className="mt-0 wallet-sub-head mb-24 sb-text-align">
          Are you sure you want to {action} Strategy?
        </p>

        <div className="sb-text-align d-flex">
          <Button
            className="remove-modal-back-btn mr-8 w-100"
            onClick={() => {
              setConfirmModal(false);
            }}
          >
            Back
          </Button>
          <ButtonDefault
            loading={loader}
            style={{ width: "100%" }}
            title={action}
            onClick={handleAction}
          />
        </div>
      </Modal>
    </div>
  );
};

export default EditStrategyPage;
