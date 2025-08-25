/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Submission_success from "../../../Assets/Images/submission_success.svg";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { getUser } from "../../../Apis/UserApi";
import { setUserDetails } from "../../../Redux/Action/User";

const SubmissionSuccess = ({ type }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const regtankStatus = useSelector(
    (state) => state?.kycIndividual?.livenessCheck
  );
  useEffect(() => {
    if (
      user?.myInfo === null ||
      user?.myInfo?.length === 0 ||
      user?.myInfo === undefined
    ) {
      const interval = setInterval(async () => {
        await getUserDetails();
      }, 60000);
      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  const getUserDetails = async () => {
    const response = await getUser();
    if (response) {
      setUserDetails(response, dispatch);
    } else {
      console.error("Error fetching user data");
    }
  };

  return (
    <div>
      <p className="sb-verification-title">Verify Your Identity</p>
      <div className="submission-success-div">
        <div className="kl-submission-success">
          {regtankStatus?.status === "REJECTED" ||
          regtankStatus?.note === "exceed liveness total limit" ? (
            <div className="kl-submission-sucees-subdiv">
              <h2 className="mt-40">Identity Verification Failed!</h2>
              <p className="mt-0 mb-20 kl-subtitle">
                You've exceeded the limit of allowed liveness test attempts. As
                a result, your identity verification has been rejected.
              </p>
              <p className="kl-subtitle">
                Please contact{" "}
                <a
                  href="mailto:sales@kilde.sg"
                  style={{ color: "var(--kilde-blue" }}
                >
                  sales@kilde.sg
                </a>{" "}
                for further assistance.
              </p>
            </div>
          ) : (
            <div className="kl-submission-sucees-subdiv">
              <img src={Submission_success} alt="submission_success" />
              <h2 className="mt-40">
                {type === "EMAIL_SENT"
                  ? "Required to re-do the liveness check"
                  : "Submission Successful"}
              </h2>
              <p className="kl-subtitle mt-0 mb-20">
                {type === "EMAIL_SENT"
                  ? "You are required to re-do the liveness check. Please check your email for the link for verification or scan the QR code in the email to start the liveness check process."
                  : "Your submission has been successfully received, and we are now processing your request."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
