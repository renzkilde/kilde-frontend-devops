/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import { useEffect } from "react";
import "./style.css";
import { getUser, verifyEmail } from "../../Apis/UserApi";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "../../Layouts/BlankHeaderLayout/AuthLayout";
import checkCircle from "../../Assets/Images/CheckCircle.svg";
import Cookies from "js-cookie";
import { setUserDetails } from "../../Redux/Action/User";
import { PublicEventApi } from "../../Apis/PublicApi";
import { updateAuthToken } from "../../Utils/Reusables";

const EmailVerifiedPage = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);

  const handleEmailVerified = () => {
    setLoader(true);
    navigate(ROUTES.VERIFICATION);
    setLoader(false);
  };

  const getUserDetails = async () => {
    const response = await getUser();
    if (response) {
      setUserDetails(response, dispatch);
    } else {
      console.error("Error fetching user data:");
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    Cookies.set("verificationToken", token);
    if (Cookies.get("verificationToken") !== "null") {
      verifyEmail({
        verificationToken: Cookies.get("verificationToken"),
      })
        .then((verifyEmailResponse) => {
          if (verifyEmailResponse?.token) {
            updateAuthToken(verifyEmailResponse?.token);
            getUserDetails();
            setLoader(false);
            PublicEventApi("emailConfirm");
          }
        })
        .catch((error) => {
          console.log("verify email", error);
          setLoader(false);
        });
    }
  }, []);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      window?.dataLayer?.push({
        event: "email-verify-success",
        user_id: user?.number,
        register_method: user?.registrationType,
      });
    }
  }, [user]);

  return (
    <AuthLayout>
      <div
        className="sb-onboarding-form-container"
        style={{ padding: "80px 148px" }}
      >
        <div className="sb-flex-column-item-center mb-28">
          <img src={checkCircle} alt="checkcircle" className="kl-checkcircle" />
        </div>
        <div className="mb-28">
          <p className="kl-title m-0">Your email has been verified!</p>
          <p className="kl-subtitle mt-10">Please click Continue</p>
        </div>

        <div className="sb-TwoFa-actions">
          <ButtonDefault
            title="Continue"
            block={true}
            onClick={handleEmailVerified}
            loading={loader}
            id="btn-continue-email-verified"
          />
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerifiedPage;
