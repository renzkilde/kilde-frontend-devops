import React from "react";
import DoneImage from "../../../Assets/Images/positive-vote.png";

const RegtankCompleted = () => {
  return (
    <div className="kl-submission-success">
      <img
        src={DoneImage}
        alt="done-imag"
        style={{ width: 130, marginBottom: 10 }}
      />
      <h2>Verification completed 🎉</h2>
      <p style={{ textAlign: "center" }}>
        Congratulations! Your identity has been successfully verified.
        <br />
        <br />
        You're all set to enjoy a seamless experience with us.
      </p>
    </div>
  );
};

export default RegtankCompleted;
