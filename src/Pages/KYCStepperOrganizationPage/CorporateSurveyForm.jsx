import React from "react";
import Close from "../../Assets/Images/closeIcon.svg";
import { CORPORATE_SURVEY_FORM } from "../../Utils/Constant";

const CorporateSurveyForm = ({ show, onClose, user }) => {
  if (!show) {
    return null;
  }

  const modifiedTypeformUrl = `${CORPORATE_SURVEY_FORM}?email=${user?.email}&investor_number=${user?.number}&phone_number=${user?.mobilePhone}`;

  return (
    <div style={styles.overlay} className="corporate-survey-form">
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          <img src={Close} alt="close_icon" />
        </button>
        <iframe
          src={modifiedTypeformUrl}
          style={styles.iframe}
          title="Typeform"
          allow="camera; microphone; autoplay; encrypted-media;"
          className="typeform-embed"
        ></iframe>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "1030px",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  iframe: {
    width: "100%",
    height: "500px",
  },
};

export default CorporateSurveyForm;
