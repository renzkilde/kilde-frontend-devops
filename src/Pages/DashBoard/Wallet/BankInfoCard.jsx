import React, { useState } from "react";
import {
  camelCaseSting,
  formatAccountNumber,
  formatAccountNumberwithStar,
} from "../../../Utils/Reusables";
import Eye_icon from "../../../Assets/Images/eye_icon.svg";
import Blue_EyeSlash_icon from "../../../Assets/Images/blue_dash_eye.svg";
import Bank_logo from "../../../Assets/Images/Icons/Dashboard/bank_logo.svg";
// import edit from "../../../Assets/Images/edit_icon.svg";
import ChangeBank from "./ChangeBank";

const BankInfoCard = ({ acc }) => {
  const [visibleAccounts, setVisibleAccounts] = useState({});
  const [updateBankModal, setUpdateBankModal] = useState(false);

  const toggleShowDigits = (accountNumber) => {
    setVisibleAccounts((prevState) => ({
      ...prevState,
      [accountNumber]: !prevState[accountNumber],
    }));
  };

  return (
    <div className="bank-info-card-sub-div">
      <div className="bank-info-card-edit-div">
        <div className="wallet-account-no-div">
          <img src={Bank_logo} alt="bank_logo" />

          <div style={{ whiteSpace: "nowrap" }}>
            <p className="user-dropdown-link">{acc?.bankName.toUpperCase()}</p>
          </div>
        </div>

        {/* <div
          className="cursor-pointer"
          onClick={() => setUpdateBankModal(true)}
        >
          <img src={edit} alt="edit" />
        </div> */}
      </div>
      <div className="bank-others-info">
        <div className="acc-number-info-div mb-8">
          <p className="m-0 account-number-tag">
            {visibleAccounts[acc.accountNumber]
              ? formatAccountNumber(acc?.accountNumber)
              : formatAccountNumberwithStar(acc?.accountNumber)}
          </p>
          <span
            onClick={() => toggleShowDigits(acc?.accountNumber)}
            style={{
              cursor: "pointer",
              display: "inline-block",
              marginTop: "6px",
            }}
          >
            {visibleAccounts[acc.accountNumber] ? (
              <img src={Eye_icon} alt="eye_icon" />
            ) : (
              <img src={Blue_EyeSlash_icon} alt="eye_slash_icon" />
            )}
          </span>
        </div>
        <div>
          <p className="holder-name-tag">
            {camelCaseSting(acc?.accountHolderName)}
          </p>
        </div>
      </div>
      {updateBankModal ? (
        <ChangeBank
          setUpdateBankModal={setUpdateBankModal}
          updateBankModal={updateBankModal}
        />
      ) : null}
    </div>
  );
};

export default BankInfoCard;
