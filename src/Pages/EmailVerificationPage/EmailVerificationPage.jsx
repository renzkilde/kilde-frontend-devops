/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import "./style.css";
import { getUser, verifyEmail } from "../../Apis/UserApi";
import { useNavigate } from "react-router";
import { LoadingOutlined } from "@ant-design/icons";
import ROUTES from "../../Config/Routes";
import AuthLayout from "../../Layouts/BlankHeaderLayout/AuthLayout";
import Vector from "../../Assets/Images/Vector.svg";
import Cookies from "js-cookie";
import { setUserDetails } from "../../Redux/Action/User";
import { useDispatch, useSelector } from "react-redux";
import GlobalVariabels from "../../Utils/GlobalVariabels";
import { PublicEventApi } from "../../Apis/PublicApi";
import { identify } from "../../Utils/Analytics";
import JivoChat from "../../Layouts/BlankHeaderLayout/JivoChat";
import { useEmailVerification } from "./useEmailVerification";
import { updateAuthToken } from "../../Utils/Reusables";

const currentEnv = GlobalVariabels.NODE_ENV;

const EmailVerificationPage = () => {
  const { handleResendEmail, loader, seconds, buttonDisabled } =
    useEmailVerification();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [routeLoader, setRouteLoader] = useState(false);

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secondsPart = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secondsPart}`;
  };

  useEffect(() => {
    setRouteLoader(true);
    getUser()
      .then(async (profileResponse) => {
        identify(profileResponse);
        Cookies.remove("user", { path: "/" });
        Cookies.set("user", JSON.stringify(profileResponse), {
          path: "/",
          sameSite: "Lax",
        });
        setUserDetails(profileResponse, dispatch);
        if (profileResponse?.registrationStep === "COMPLETED") {
          navigate(ROUTES.VERIFICATION);
        } else {
          setRouteLoader(false);
        }
      })
      .catch((error) => {
        console.log(error, "Error");
        setRouteLoader(false);
      });
  }, []);

  const handleVerifyEmail = () => {
    verifyEmail({
      verificationToken: Cookies.get("verificationToken"),
    })
      .then((verifyEmailResponse) => {
        if (verifyEmailResponse?.token) {
          updateAuthToken(verifyEmailResponse?.token);
          navigate(ROUTES.VERIFICATION);
          PublicEventApi("emailConfirm");
        }
      })
      .catch((error) => {
        console.log("verify email", error);
      });
  };

  return (
    <AuthLayout>
      {routeLoader === false ? (
        <div
          className="sb-onboarding-form-container"
          style={{ padding: "80px 148px" }}
        >
          <div className="sb-flex-column-item-center  mb-28">
            <img src={Vector} alt="email" className="kl-checkcircle" />
          </div>
          <div className="mb-28">
            <p className="kl-title m-0">Verify your email</p>
            <p className="kl-subtitle mt-10">
              A verification link was sent to your email{" "}
              <strong>{user?.email}</strong>. Please check your inbox and verify
              your account by clicking on the link provided.
            </p>
          </div>
          <div className="mb-28">
            <p className="kl-subtitle">
              Didn’t receive a verification email? If you don't receive it
              within 15 minutes, check your spam folder or click the “Resend
              Email” button below.
            </p>
          </div>
          <div className="sb-TwoFa-actions">
            <ButtonDefault
              title="Resend Email"
              block={true}
              loading={loader}
              onClick={handleResendEmail}
              id="btn-resend-email"
              disabled={buttonDisabled}
            />
            {seconds > 0 && (
              <p className="resend-text">
                You can resend email in {""}
                <span style={{ color: "#22b5e9" }}>
                  {formatTime(seconds)}
                </span>{" "}
                minutes
              </p>
            )}
          </div>

          {currentEnv === "DEV" && (
            <div className="mt-10">
              <p
                className="fp-link cursor-pointer"
                onClick={handleVerifyEmail}
                style={{ display: "inline" }}
              >
                Verify Email
              </p>
              <p style={{ color: "#ddd", display: "inline" }}>
                {" "}
                (For testing purpose)
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <LoadingOutlined style={{ fontSize: 100 }} spin />
        </div>
      )}
      <JivoChat user={user} />
    </AuthLayout>
  );
};

export default EmailVerificationPage;
