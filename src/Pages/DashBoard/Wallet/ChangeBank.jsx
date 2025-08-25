/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Col, Modal, Row, message } from "antd";
// import Change_Bank from "../../../Assets/Images/Icons/Dashboard/change_bank_account.svg";
// import Eye_icon from "../../../Assets/Images/eye_icon.svg";
// import EyeSlash_icon from "../../../Assets/Images/EyeSlash.svg";
// import Bank_logo from "../../../Assets/Images/Icons/Dashboard/bank_logo.svg";
import ButtonDefault from "../../../Components/ButtonDefault/ButtonDefault";
import InputDefault from "../../../Components/InputDefault/InputDefault";
import { useDispatch, useSelector } from "react-redux";
import { GetBankAccountApi, updateBankApi } from "../../../Apis/WalletApi";
import { setAccountDetails } from "../../../Redux/Action/Wallet";
import { showMessageWithCloseIcon } from "../../../Utils/Reusables";

const ChangeBank = ({ setUpdateBankModal, updateBankModal }) => {
  const dispatch = useDispatch();
  const accountNo = useSelector(
    (state) => state?.wallet?.bankAccount?.bankAccounts
  );

  const [updateBankLoader, setUpdateBankLoader] = useState(false);

  const [updateBankData, setUpdateBankData] = useState({
    currentAccountNumber: "",
    newAccountNumber: "",
    confirmAccountNumber: "",
    bankName: "",
    swiftCode: "",
    accountHolderName: "",
    changeRequest: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    currentAccountNumber: false,
    newAccountNumber: false,
    confirmAccountNumber: false,
    bankName: false,
    swiftCode: false,
    accountHolderName: false,
    changeRequest: false,
  });

  useEffect(() => {
    getBankAccountNo();
  }, []);

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

  const handleUpdateBankDetails = () => {
    setUpdateBankLoader(true);
    setValidationErrors({
      currentAccountNumber: true,
      newAccountNumber: true,
      confirmAccountNumber: true,
      bankName: true,
      swiftCode: true,
      accountHolderName: true,
      changeRequest: true,
    });
    const data = {
      currentAccountNumber: updateBankData?.currentAccountNumber,
      newAccountNumber: updateBankData?.newAccountNumber,
      confirmNewAccountNumber: updateBankData?.confirmAccountNumber,
      bankName: updateBankData?.bankName,
      swiftCode: updateBankData?.swiftCode,
      accountHolderName: updateBankData?.accountHolderName,
      reason: updateBankData?.changeRequest,
    };

    const isFieldsNotEmpty = Object.values(data).every(
      (value) => value.trim() !== ""
    );

    if (
      accountNo?.length > 0 &&
      accountNo[0]?.accountNumber === data?.newAccountNumber
    ) {
      message?.error("You are currently using the same account as before");
      setUpdateBankLoader(false);
    } else if (isFieldsNotEmpty) {
      updateBankApi(data).then(async (response) => {
        if (response === "") {
          showMessageWithCloseIcon(
            "Your Banking information updated successfully"
          );
          setUpdateBankData({
            currentAccountNumber: "",
            newAccountNumber: "",
            confirmAccountNumber: "",
            bankName: "",
            swiftCode: "",
            accountHolderName: "",
            changeRequest: "",
          });
          setValidationErrors({
            bankName: false,
            accountNumber: false,
            swiftCode: false,
            accountHolderName: false,
          });
          setUpdateBankModal(false);
          getBankAccountNo();
          setUpdateBankLoader(false);
        } else {
          setUpdateBankLoader(false);
        }
      });
    } else {
      setUpdateBankLoader(false);
    }
  };

  return (
    <Modal
      className="wallet-addbank-modal"
      centered
      open={updateBankModal}
      onCancel={() => {
        setUpdateBankModal(false);
      }}
      footer={null}
      maskClosable={false}
      width={616}
    >
      <p className="mt-0 wallet-sub-head mb-40">Change your bank details</p>
      <Row gutter={16}>
        <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
          <label className="mb-4">Current bank account number</label>
          <InputDefault
            value={updateBankData?.currentAccountNumber}
            validationState={setValidationErrors}
            focusing={validationErrors?.currentAccountNumber}
            onChange={({ target }) =>
              setUpdateBankData({
                ...updateBankData,
                currentAccountNumber: target.value,
              })
            }
            placeholder=""
            type="text"
            name="currentAccountNumber"
            required={true}
            errorMsg={"Account number is required"}
          />
        </Col>
        <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
          <label className="mb-4">New bank account number</label>
          <InputDefault
            value={updateBankData?.newAccountNumber}
            validationState={setValidationErrors}
            focusing={validationErrors?.newAccountNumber}
            onChange={({ target }) =>
              setUpdateBankData({
                ...updateBankData,
                newAccountNumber: target.value,
              })
            }
            placeholder=""
            type="text"
            name="newAccountNumber"
            required={true}
            errorMsg={"New bank account number is required"}
          />
        </Col>
        <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
          <label className="mb-4">Confirm new bank account number</label>
          <InputDefault
            value={updateBankData?.confirmAccountNumber}
            validationState={setValidationErrors}
            focusing={validationErrors?.confirmAccountNumber}
            onChange={({ target }) =>
              setUpdateBankData({
                ...updateBankData,
                confirmAccountNumber: target.value,
              })
            }
            placeholder=""
            type="text"
            name="confirmNewAccountNumber"
            required={true}
            errorMsg={"Confirm new bank account number is required"}
          />
        </Col>
        <Col className="gutter-row mb-20" md={12} sm={12} xs={24}>
          <label className="mb-4">Bank name</label>
          <InputDefault
            value={updateBankData?.bankName}
            type="text"
            name="bankName"
            placeholder=""
            validationState={setValidationErrors}
            focusing={validationErrors?.bankName}
            onChange={({ target }) =>
              setUpdateBankData({ ...updateBankData, bankName: target.value })
            }
            required={true}
            errorMsg={"Bank name is required"}
          />
        </Col>
        <Col className="gutter-row mb-20" md={12} sm={12} xs={24}>
          <label className="mb-4">SWIFT Code</label>
          <InputDefault
            value={updateBankData?.swiftCode}
            type="text"
            name="swiftCode"
            placeholder=""
            validationState={setValidationErrors}
            focusing={validationErrors?.swiftCode}
            onChange={({ target }) =>
              setUpdateBankData({
                ...updateBankData,
                swiftCode: target.value,
              })
            }
            required={true}
            errorMsg={"SWIFT code is required"}
          />
        </Col>
        <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
          <label className="mb-4">Account holder name</label>
          <InputDefault
            value={updateBankData?.accountHolderName}
            placeholder="John Doe"
            type="text"
            name="accountHolderName"
            validationState={setValidationErrors}
            focusing={validationErrors?.accountHolderName}
            onChange={({ target }) =>
              setUpdateBankData({
                ...updateBankData,
                accountHolderName: target.value,
              })
            }
            required={true}
            errorMsg={"Account holder name is required"}
          />
        </Col>
        <Col className="gutter-row mb-20" md={24} sm={24} xs={24}>
          <label className="mb-4">Reason of bank account change request</label>
          <InputDefault
            value={updateBankData?.changeRequest}
            placeholder=""
            type="text"
            name="changeRequest"
            required={true}
            validationState={setValidationErrors}
            focusing={validationErrors?.changeRequest}
            onChange={({ target }) =>
              setUpdateBankData({
                ...updateBankData,
                changeRequest: target.value,
              })
            }
            errorMsg={"Reason is required"}
          />
        </Col>
        <Col>
          <ButtonDefault
            title="Submit"
            onClick={handleUpdateBankDetails}
            loading={updateBankLoader}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ChangeBank;
