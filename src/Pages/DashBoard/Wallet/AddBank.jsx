import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Select, Tooltip, message } from "antd";
import Add_Bank from "../../../Assets/Images/Icons/Dashboard/add_bank_account.svg";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import InputDefault from "../../../Components/InputDefault/InputDefault";
import { GetBankAccountApi, addBankApi } from "../../../Apis/WalletApi";
import {
  setAccountDetails,
  setBankInfoModal,
} from "../../../Redux/Action/Wallet";
import { useDispatch, useSelector } from "react-redux";
import InfoIcon from "../../../Assets/Images/SVGs/Info.svg";
import { showMessageWithCloseIcon } from "../../../Utils/Reusables";
import BankInfoCard from "./BankInfoCard";
import { bankSwiftCodes } from "../../../Utils/Reusables";
import { bankOptions } from "../../../Utils/Reusables";
import CustomRadioButton from "../../../Components/DefaultRadio/CustomRadioButton";

const { Option } = Select;

const AddBank = () => {
  const dispatch = useDispatch();
  const [, contextHolder] = message.useMessage();

  const [addBankModal, setAddBankModal] = useState(false);
  const [addBankLoader, setAddBankLoader] = useState(false);
  const [bankInputValue, setBankInputValue] = useState("");

  const [error, setError] = useState("");
  const [titles, setTitles] = useState(bankOptions);
  const [value, setValue] = useState("Singaporean");
  const [addBankData, setAddBankData] = useState({
    bankName: "",
    accountNumber: "",
    swiftCode: "",
    accountHolderName: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    bankName: false,
    accountNumber: false,
    swiftCode: false,
    accountHolderName: false,
  });

  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );
  const openModal = useSelector((state) => state.wallet.bankInfoModal);

  useEffect(() => {
    setAddBankData({
      bankName: "",
      accountNumber: "",
      swiftCode: "",
      accountHolderName: "",
    });
    setError("");

    setValidationErrors({
      bankName: false,
      accountNumber: false,
      swiftCode: false,
      accountHolderName: false,
    });
  }, [value]);

  useEffect(() => {
    if (openModal === true) {
      setAddBankModal(true);
    } else {
      setAddBankModal(false);
    }
  }, [openModal]);

  const handleSearch = (value) => {
    if (value && value !== "") {
      setTitles((prevTitles) => [...bankOptions, value]);
    } else {
      setTitles(bankOptions);
    }
  };

  const handleAddBankOpenModal = () => {
    setAddBankModal(true);
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const HandleAddBank = () => {
    if (addBankData?.accountNumber?.length < 5) {
      const errors = {
        bankName: !addBankData?.bankName,
        accountNumber:
          !addBankData?.accountNumber || addBankData?.accountNumber.length < 5,
        swiftCode: !addBankData?.swiftCode,
        accountHolderName: !addBankData?.accountHolderName,
      };
      setValidationErrors(errors);
    } else {
      setAddBankLoader(true);
      const data = {
        bankName: addBankData?.bankName,
        accountNumber: addBankData?.accountNumber,
        accountHolderName: addBankData?.accountHolderName,
        branch: "",
        swiftCode: addBankData?.swiftCode,
      };

      addBankApi(data)
        .then(async (response) => {
          if (Object.keys(response)?.length > 0) {
            setAddBankLoader(false);
          } else {
            showMessageWithCloseIcon(
              "Your banking information has been submitted successfully."
            );
            setAddBankData({
              bankName: "",
              accountNumber: "",
              swiftCode: "",
              accountHolderName: "",
            });
            setValidationErrors({
              bankName: false,
              accountNumber: false,
              swiftCode: false,
              accountHolderName: false,
            });
            setAddBankModal(false);
            await getBankAccountNo();
            setAddBankLoader(false);
          }
        })
        .catch((error) => {
          console.error("Error adding bank:", error);
          setAddBankLoader(false);
        });
    }
  };

  const getBankAccountNo = async () => {
    try {
      const response = await GetBankAccountApi();
      if (response) {
        setAccountDetails(response, dispatch);
        return response;
      }
    } catch (error) {
      console.error("Error fetching bank account number:", error);
      return null;
    }
  };

  const handleAccNumberChange = (e) => {
    let value = e.target.value;
    // if (value.length > 20) {
    //   return;
    // }
    setAddBankData({
      ...addBankData,
      accountNumber: value,
    });
  };

  const closeAddBankModel = async () => {
    await setBankInfoModal(false, dispatch);
    setValue("Singaporean");
    setValidationErrors({
      bankName: false,
      accountNumber: false,
      swiftCode: false,
      accountHolderName: false,
    });
    setError("");
    setAddBankModal(false);
  };

  const handleAccNumberBlur = () => {
    if (addBankData?.accountNumber.length < 5) {
      setError("Account number must be at least 5 characters long.");
    } else {
      setError("");
    }
  };

  const handleBankChange = (value) => {
    setAddBankData({
      ...addBankData,
      bankName: value,
      swiftCode: bankSwiftCodes[value] || "",
    });
  };

  return (
    <Col className="gutter-row" xl={17} lg={18} md={22} sm={24} xs={24}>
      <Row>
        {contextHolder}
        <Col
          sm={24}
          md={24}
          lg={24}
          className="gutter-row wallet-info-div"
          style={{ flex: 1 }}
        >
          <Row style={{ alignItems: "center" }}>
            <Col xs={12} sm={12} md={12} className="mb-20">
              <p className="m-0 wallet-sub-head">Bank Details</p>
            </Col>
            {/* {accountNo?.length < 3 ? ( */}
            <Col xs={12} sm={12} md={12} className="sb-text-align-end mb-20">
              <div className="cursor-pointer" onClick={handleAddBankOpenModal}>
                <img src={Add_Bank} alt="add_bank_account" />
              </div>
            </Col>
            {/* ) : null} */}

            <Row className="full-width-row">
              {accountNo?.length > 0 &&
                accountNo
                  .filter((acc) => acc?.verified !== false)
                  .map((acc, index) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={12}
                      lg={12}
                      xlg={12}
                      key={index}
                      className="bank-info-card"
                    >
                      <BankInfoCard acc={acc} />
                    </Col>
                  ))}
            </Row>
          </Row>
        </Col>
      </Row>

      <Modal
        className="wallet-addbank-modal"
        centered
        open={addBankModal}
        onCancel={closeAddBankModel}
        footer={null}
        maskClosable={false}
        width={616}
      >
        <p className="mt-0 wallet-sub-head mb-40">Add your bank details</p>
        <p className="mb-4 radio-text">Choose your bank location</p>
        <div className="mb-16 w-100 sb-justify-center-item-center gap-8">
          <CustomRadioButton
            label="Singapore"
            name="option"
            value="Singaporean"
            checked={value === "Singaporean"}
            onChange={onChange}
          />
          <CustomRadioButton
            label="Others"
            name="option"
            value="Others"
            checked={value === "Others"}
            onChange={onChange}
          />
        </div>
        {value === "Others" ? (
          <>
            <Row gutter={16}>
              <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
                <label className="mb-4">Bank name</label>
                <InputDefault
                  value={addBankData?.bankName}
                  type="text"
                  name="bankName"
                  placeholder="Bank name"
                  validationState={setValidationErrors}
                  focusing={validationErrors?.bankName}
                  onChange={({ target }) =>
                    setAddBankData({ ...addBankData, bankName: target.value })
                  }
                  required={true}
                  errorMsg={"Bank name is required"}
                />
              </Col>
              <Col className="gutter-row mb-20" md={12} sm={12} xs={24}>
                <div className="sb-flex mb-4">
                  <label>Account number / IBAN</label>
                  <Tooltip
                    placement="top"
                    title={
                      "Enter your IBAN for international transfers if supported; otherwise, provide your Bank Account Number."
                    }
                    overlayStyle={{ maxWidth: "280px", whiteSpace: "normal" }}
                  >
                    <img src={InfoIcon} alt="info-icon" className="ml-4" />
                  </Tooltip>
                </div>
                <InputDefault
                  value={addBankData?.accountNumber}
                  type="text"
                  name="accountNumber"
                  placeholder="Account number"
                  validationState={setValidationErrors}
                  focusing={validationErrors?.accountNumber}
                  onChange={handleAccNumberChange}
                  required={true}
                  errorMsg={"Account number is required"}
                  // onBlur={handleAccNumberBlur}
                />
                {validationErrors.accountNumber &&
                  addBankData?.accountNumber?.length < 5 && (
                    <span className="error-message">{error}</span>
                  )}
              </Col>
              <Col className="gutter-row mb-20" md={12} sm={12} xs={24}>
                <label className="mb-4">SWIFT code</label>
                <InputDefault
                  value={addBankData?.swiftCode}
                  type="text"
                  name="swiftCode"
                  placeholder="SWIFT code"
                  validationState={setValidationErrors}
                  focusing={validationErrors?.swiftCode}
                  onChange={({ target }) =>
                    setAddBankData({
                      ...addBankData,
                      swiftCode: target.value,
                    })
                  }
                  required={true}
                  errorMsg={"SWIFT code is required"}
                />
              </Col>
              <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
                <label className="mb-4">
                  Account holder name (as per Bank Statement)
                </label>
                <InputDefault
                  value={addBankData?.accountHolderName}
                  placeholder="John Doe"
                  type="text"
                  name="accountHolderName"
                  validationState={setValidationErrors}
                  focusing={validationErrors?.accountHolderName}
                  onChange={({ target }) =>
                    setAddBankData({
                      ...addBankData,
                      accountHolderName: target.value,
                    })
                  }
                  required={true}
                  errorMsg={"Account holder name is required"}
                />
              </Col>
              <Col className="addbank-button">
                <Button
                  className="remove-modal-back-btn mr-8"
                  onClick={closeAddBankModel}
                >
                  Cancel
                </Button>
                <ButtonDefault
                  title="Add Bank Details"
                  loading={addBankLoader}
                  onClick={HandleAddBank}
                />
              </Col>
            </Row>
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginTop: "8px",
              }}
            >
              <img src={InfoIcon} alt="info-icon" />
              <label>Ensure accurate banking details before submitting.</label>
            </div>
          </>
        ) : (
          <>
            <Row gutter={16}>
              <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
                <label className="mb-4">Bank name</label>

                <Select
                  showSearch
                  value={addBankData?.bankName || null}
                  filterOption={true}
                  onSearch={(val) => {
                    handleSearch(val);
                    setBankInputValue(val);
                  }}
                  onBlur={() => {
                    const matched = titles.find(
                      (title) =>
                        title.toLowerCase() === bankInputValue.toLowerCase()
                    );
                    if (matched) {
                      handleBankChange(matched);
                    }
                  }}
                  onChange={(value) => {
                    handleBankChange(value);
                    setBankInputValue(value); // sync inputValue when user clicks
                  }}
                  className={`${
                    validationErrors.bankName ? "sb-select-error" : "sb-select"
                  }`}
                  placeholder="Bank name"
                >
                  {titles.map((title) => (
                    <Option key={title} value={title}>
                      {title}
                    </Option>
                  ))}
                </Select>

                {validationErrors.bankName && (
                  <span className="error-message">Bank name is required</span>
                )}
              </Col>
              <Col className="gutter-row mb-20" md={12} sm={12} xs={24}>
                <label className="mb-4">Account number</label>

                <InputDefault
                  value={addBankData?.accountNumber}
                  type="number"
                  name="accountNumber"
                  placeholder="Account number"
                  validationState={setValidationErrors}
                  focusing={validationErrors?.accountNumber}
                  onChange={handleAccNumberChange}
                  required={true}
                  errorMsg={"Account number is required"}
                  onBlur={handleAccNumberBlur}
                />
                {validationErrors.accountNumber &&
                  addBankData?.accountNumber?.length < 5 && (
                    <span className="error-message">{error}</span>
                  )}
              </Col>
              <Col className="gutter-row mb-20" md={12} sm={12} xs={24}>
                <label className="mb-4">SWIFT code</label>
                <InputDefault
                  value={addBankData?.swiftCode}
                  type="text"
                  name="swiftCode"
                  placeholder="SWIFT code"
                  validationState={setValidationErrors}
                  focusing={validationErrors?.swiftCode}
                  onChange={({ target }) =>
                    setAddBankData({
                      ...addBankData,
                      swiftCode: target.value,
                    })
                  }
                  required={true}
                  errorMsg={"SWIFT code is required"}
                />
              </Col>
              <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
                <label className="mb-4">
                  Account holder name (as per Bank Statement)
                </label>
                <InputDefault
                  value={addBankData?.accountHolderName}
                  placeholder="John Doe"
                  type="text"
                  name="accountHolderName"
                  validationState={setValidationErrors}
                  focusing={validationErrors?.accountHolderName}
                  onChange={({ target }) =>
                    setAddBankData({
                      ...addBankData,
                      accountHolderName: target.value,
                    })
                  }
                  required={true}
                  errorMsg={"Account holder name is required"}
                />
              </Col>
              <Col className="addbank-button">
                <Button
                  className="remove-modal-back-btn mr-8"
                  onClick={closeAddBankModel}
                >
                  Cancel
                </Button>
                <ButtonDefault
                  title="Add Bank Details"
                  loading={addBankLoader}
                  onClick={HandleAddBank}
                />
              </Col>
            </Row>
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginTop: "8px",
              }}
            >
              <img src={InfoIcon} alt="info-icon" />
              <label>Ensure accurate banking details before submitting.</label>
            </div>
          </>
        )}
      </Modal>
    </Col>
  );
};

export default AddBank;
