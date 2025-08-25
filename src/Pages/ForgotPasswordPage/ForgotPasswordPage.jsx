import React, { useEffect, useRef, useState } from "react";

import "./style.css";
import InputDefault from "../../Components/InputDefault/InputDefault";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import { Checkbox, Form, Input, Progress, message, Modal } from "antd";
import { ErrorResponse } from "../../Utils/ErrorResponse";
import AuthLayout from "../../Layouts/BlankHeaderLayout/AuthLayout";
import {
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
  validatePassword,
} from "../../Utils/Reusables.js";
import {
  confirmPasswordReset,
  sendResetEmailLink,
  validateResetPassword,
} from "../../Apis/UserApi.js";
import Cookies from "js-cookie";
import { getPasswordStrength } from "../../Utils/Helpers.js";
import TermsOfUse from "../../Assets/Pdf/Terms of Use.pdf";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [resetloader, setResetLoader] = useState(false);
  const [userForgot, setUserForgot] = useState(false);
  const [checked, setChecked] = useState(false);
  const [noCheckErr, setCheckErr] = useState(false);
  const [noPass, setNoPass] = useState({ pass: false, cPass: false });
  const [validationErrors, setValidationErrors] = useState({
    email: false,
  });
  const [privacyPdf, setPrivacyPdf] = useState(false);
  const [newPassword, setNewPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [cPassErr, setCPassErr] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [criteria, setCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const validatePasswordCustom = (password) => {
    return {
      length: password.length >= 10,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    // Update form data first
    setNewPassword((prev) => ({ ...prev, newPassword: value }));

    const updatedCriteria = validatePasswordCustom(value);

    // Update validation criteria
    setCriteria(updatedCriteria);

    // Ensure all conditions are met before setting noPass
    setNoPass({
      ...noPass,
      pass: !Object.values(updatedCriteria).every(Boolean),
    });
  };

  const hintRef = useRef(null);

  const handleClickOutside = (e) => {
    if (hintRef.current && !hintRef.current.contains(e.target)) {
      setShowHint(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const strength = getPasswordStrength(newPassword?.newPassword);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    Cookies.set("resetToken", token);
  }, []);

  useEffect(() => {
    if (Cookies.get("resetToken") !== "null") {
      validateResetPassword({ token: Cookies.get("resetToken") })
        .then((validateResponse) => {
          setEmailSent(false);
          setUserForgot(true);
          setEmail("");
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Cookies.get("resetToken")]);

  const handleForgotPassword = () => {
    setLoader(true);
    setValidationErrors({
      email: true,
    });
    if (email) {
      setValidationErrors({
        email: false,
      });
      sendResetEmailLink({ email })
        .then((resetEmailResponse) => {
          setEmailSent(true);
          if (resetEmailResponse?.token) {
            Cookies.set("resetToken", resetEmailResponse?.token);
          }
          setLoader(false);
          showMessageWithCloseIcon(
            "Now you can reset your password. Please enter a new password."
          );
        })
        .catch((err) => {
          ErrorResponse(err?.code);
          setLoader(false);
        });
    } else {
      setLoader(false);
    }
  };

  const handleResetPassword = async () => {
    setResetLoader(true);
    if (
      !newPassword?.newPassword ||
      !validatePassword(newPassword?.confirmPassword)
    ) {
      // if (checked === false) {
      //   setCheckErr(true);
      //   setResetLoader(false);
      // }
      setResetLoader(false);
      return setNoPass({ pass: true, cPass: true });
    }

    const requestBody = {
      password: newPassword?.newPassword,
      passwordRepeat: newPassword?.confirmPassword,
      token: Cookies.get("resetToken"),
    };
    if (cPassErr === false && Cookies.get("resetToken")) {
      if (newPassword?.newPassword === newPassword?.confirmPassword) {
        await confirmPasswordReset(requestBody)
          .then(() => {
            showMessageWithCloseIcon("Password updated successfully!");
            Cookies.remove("auth_inv_token");
            navigate(ROUTES.LOGIN);
            setResetLoader(false);
          })
          .catch((err) => {
            setResetLoader(false);
            console.log("rest pass error:", err);
          });
      } else if (newPassword?.newPassword === newPassword?.confirmPassword) {
        setCheckErr(true);
        setResetLoader(false);
      } else {
        setResetLoader(false);
        showMessageWithCloseIconError(
          "Passwords do not match. Please try again."
        );
      }
    } else {
      setResetLoader(false);
      showMessageWithCloseIconError("Somethign went wrong!");
    }
  };

  return (
    <AuthLayout>
      <div className="sb-onboarding-form-container">
        {emailSent ? (
          <div>
            <h1>Please check your email!</h1>
            <p className="sb-liveness-content">
              In a few minutes you will receive e-mail with a link to the
              password renewal form.
            </p>
          </div>
        ) : (
          <div>
            {userForgot ? (
              <h1 className="sb-verification-title fp-head">
                Setup New Password
              </h1>
            ) : (
              <h1 className="sb-verification-title fp-head">
                Forgot password?
              </h1>
            )}
            {userForgot ? (
              <div className="forgot-pass-subdiv">
                <p className="kl-subtitle">
                  Have you already reset the password ?{" "}
                  <a className="fp-link" href={ROUTES.LOGIN}>
                    Sign in
                  </a>
                </p>
                <div style={{ marginBottom: 12 }} ref={hintRef}>
                  <Input.Password
                    name="password"
                    placeholder="Password"
                    style={{ height: 40, borderRadius: "12px" }}
                    type="password"
                    onFocus={() => setShowHint(true)}
                    onChange={handlePasswordChange}
                    status={noPass?.pass && "error"}
                    required={true}
                  />
                  {showHint && (
                    <div
                      className={`password-hint ${showHint ? "show" : ""}`}
                      style={{
                        padding: "10px",
                        background: "#f9f9f9",
                        borderRadius: "8px",
                        marginTop: "8px",
                        fontSize: "12px",
                        display: showHint ? "block" : "none",
                      }}
                    >
                      {/* <p style={{ marginBottom: "4px", fontWeight: 500 }}>
                        Password must include:
                      </p> */}
                      <ul
                        style={{
                          paddingLeft: "16px",
                          listStyle: "none",
                          textAlign: "left",
                          fontWeight: 500,
                        }}
                      >
                        {[
                          { key: "length", text: "At least 10 characters" },
                          {
                            key: "lowercase",
                            text: "At least one lowercase letter",
                          },
                          {
                            key: "uppercase",
                            text: "At least one uppercase letter",
                          },
                          {
                            key: "number",
                            text: "At least one numeric character",
                          },
                          {
                            key: "special",
                            text: "At least one special character",
                          },
                        ].map(({ key, text }) => (
                          <li
                            key={key}
                            style={{
                              color: criteria[key] ? "green" : "#939393",
                            }}
                          >
                            {criteria[key] ? (
                              <CheckCircleOutlined style={{ color: "green" }} />
                            ) : (
                              <CloseCircleOutlined
                                style={{ color: "#939393" }}
                              />
                            )}{" "}
                            {text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* <div style={{ marginBottom: "-10px" }}>
                    <Progress
                      percent={strength}
                      size="small"
                      showInfo={false}
                    />
                  </div> */}
                  {/* <small style={{ fontSize: 11.1, color: "#999" }}>
                    <i className="bi bi-info-circle-fill"></i> Use at least 10
                    characters, including 1 uppercase, 1 lower case, 1 special
                    character, and 1 number
                  </small> */}
                  <div className="mt-10" style={{ width: "30em" }}>
                    {noPass?.pass && (
                      <label
                        className="error-msg"
                        style={{
                          display: "block",
                          marginTop: "-8px",
                          marginBottom: 12,
                        }}
                      >
                        Password is required.
                      </label>
                    )}
                  </div>
                </div>
                <div>
                  <Input.Password
                    name="repeatPassword"
                    placeholder="Repeat password"
                    type="password"
                    style={{ height: 40, borderRadius: "12px" }}
                    focusing={validationErrors?.cPassword}
                    onChange={({ target }) => {
                      setNoPass({ ...noPass, cPass: false });
                      setCPassErr(false);
                      setNewPassword({
                        ...newPassword,
                        confirmPassword: target.value,
                      });
                      if (target.value !== newPassword?.newPassword) {
                        setCPassErr(true);
                      }
                    }}
                    status={cPassErr && "error"}
                    onBlur={() => {
                      setCPassErr(false);
                      if (
                        newPassword?.confirmPassword !==
                        newPassword?.newPassword
                      ) {
                        setCPassErr(true);
                      }
                    }}
                    required={true}
                  />
                  {cPassErr && (
                    <label
                      className="error-msg"
                      style={{ display: "block", marginTop: "1px" }}
                    >
                      Passwords don't match!
                    </label>
                  )}
                  <div className="mt-10" style={{ width: "30em" }}>
                    {noPass?.cPass && (
                      <label
                        className="error-msg"
                        style={{
                          display: "block",
                          marginTop: "-8px",
                          marginBottom: 12,
                        }}
                      >
                        Confirm password is required.
                      </label>
                    )}
                  </div>
                </div>
                <div>
                  <div className="kl-subtitle" style={{ textAlign: "start" }}>
                    By continuing you agree to Kilde’s{" "}
                    {/* <span
                      className="cursor-pointer termsofuse"
                      style={{ color: "var(--kilde-blue)" }}
                      onClick={() => setPrivacyPdf(true)}
                    >
                      Terms of Use
                    </span>{" "} */}
                    <a
                      className="cursor-pointer termsofuse"
                      style={{ color: "var(--kilde-blue)" }}
                      href={TermsOfUse}
                    >
                      Terms of Use
                    </a>{" "}
                    {/* <Checkbox
                      className="checkbox-kilde"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCheckErr(false);
                        } else {
                          setCheckErr(true);
                        }
                        setChecked(e.target.checked);
                      }}
                      style={{ marginRight: 5 }}
                    />
                    I Accept the
                    <span
                      className="fp-link ml-5 cursor-pointer"
                      onClick={() => setPrivacyPdf(true)}
                    >
                      Terms of use
                    </span> */}
                  </div>
                  {/* {noCheckErr && (
                    <label
                      className="error-msg"
                      style={{
                        display: "block",
                        marginTop: "-8px",
                        marginBottom: 12,
                        marginLeft: 10,
                      }}
                    >
                      Please accept the Terms of Use & Privacy Policy
                    </label>
                  )} */}
                </div>
                <div className="mt-25">
                  <ButtonDefault
                    title="Submit"
                    onClick={handleResetPassword}
                    loading={resetloader}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ) : (
              <div className="forgot-pass-subdiv">
                <p className="kl-subtitle">
                  Enter the email address associated with your account and we'll
                  send you a link to reset your password.
                </p>
                <Form
                  onFinish={handleForgotPassword}
                  name="wrap"
                  labelCol={{ flex: "110px" }}
                  labelAlign="left"
                  labelWrap
                  wrapperCol={{ flex: 1 }}
                  colon={false}
                >
                  <div className="mt-30">
                    <InputDefault
                      placeholder="Please enter your email address"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      focusing={validationErrors?.email}
                      validationstate={setValidationErrors}
                      errorMsg={"Email is Required"}
                      required={true}
                    />
                  </div>
                  <div className="mt-30">
                    <ButtonDefault
                      title="Submit"
                      loading={loader}
                      style={{ width: "100%" }}
                    />
                  </div>
                </Form>
                <p className="kl-subtitle">
                  <a className="fp-link" href={ROUTES.LOGIN}>
                    Back
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        <Modal
          className="sb-pdf-modal"
          centered
          open={privacyPdf}
          onCancel={() => setPrivacyPdf(false)}
          width={1000}
          footer={null}
        >
          <iframe
            className="mt-20"
            src={TermsOfUse}
            width="100%"
            height="500px"
            title="PDF Viewer"
          />
        </Modal>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
