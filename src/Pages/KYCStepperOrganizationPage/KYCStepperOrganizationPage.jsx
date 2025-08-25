/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Modal, Progress, Row, Steps } from "antd";

import { RenderOrganizationComponent } from "./RenderOrganizationComponent/RenderOrganizationComponent";
import Right_arrow from "../../Assets/Images/Icons/right_arrow.svg";

import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import { useSelector, useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

import "./style.css";
import { setCurrentSate } from "../../Redux/Action/common";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import Left_arrow from "../../Assets/Images/Icons/left_arrow.svg";
import { checkStepStatus } from "../../Utils/Helpers";
import { setCorporateInfoDetails } from "../../Redux/Action/KycOrganization";
import { setUserDetails } from "../../Redux/Action/User";
import { getUser } from "../../Apis/UserApi";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../Config/Routes";
import { updateCompanyInformation } from "../../Apis/InvestorApi";
import TwoFAModal from "../TwoFAPage/TwoFAModal.jsx";
import Cookies from "js-cookie";
import OnboardingBanner from "../CommonOnboardingPages/OnboardingBanner.jsx";
import WarningIcon from "../../Assets/Images/Warning.svg";
import CorporateSurveyForm from "./CorporateSurveyForm.jsx";
import { showMessageWithCloseIcon } from "../../Utils/Reusables.js";

const KYCStepperOrganizationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const [twoFaModal, setTwoFaModal] = useState(false);
  const [progress, setProgress] = useState(50);
  const [loader, setLoader] = useState(false);
  const [UiLoad, setUiLoad] = useState(false);
  const current = useSelector((state) => state.common.current);
  const [mobileUpdate, setMobileUpdate] = useState(false);
  const [twofaloader, setTwofaLoader] = useState(false);
  const corporateData = useSelector(
    (state) => state?.kycOrganization?.corporateInformation
  );
  const corporateInfoValidator = corporateData?.data;
  const [isSurveyModal, setIsSurveyModal] = useState(false);

  const getUserDetails = async () => {
    const response = await getUser();
    if (response) {
      setUserDetails(response, dispatch);
      return response;
    } else {
      console.error("Error fetching user details data");
    }
  };

  useEffect(() => {
    updateProgressBar();
  }, [user?.waitingVerificationSteps]);

  function updateProgressBar() {
    if (
      checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
        false &&
      checkStepStatus(user?.waitingVerificationSteps, "COMPANY_INFORMATION") ===
        false &&
      user?.waitingVerificationSteps?.length === 0
    ) {
      setProgress(progress + 50);
    }
  }

  useEffect(() => {
    const userData = async () => {
      await getUserDetails();
      if (
        checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
          false &&
        checkStepStatus(
          user?.waitingVerificationSteps,
          "COMPANY_INFORMATION"
        ) === true
      ) {
        setCurrentSate(1, dispatch);
      } else if (
        checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
          false &&
        checkStepStatus(
          user?.waitingVerificationSteps,
          "COMPANY_INFORMATION"
        ) === false &&
        user?.waitingVerificationSteps?.length === 0 &&
        user?.investorStatus === "COMPLETED"
      ) {
        setCurrentSate(2, dispatch);
      } else if (
        checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
        true
      ) {
        navigate(ROUTES.VERIFICATION);
      }
    };
    userData();
  }, [dispatch, navigate]);

  const onChangeStep = (step, method) => {
    if (
      checkStepStatus(user?.waitingVerificationSteps, "COMPANY_INFORMATION") ===
        true &&
      (step === 1 || step === 0)
    ) {
      setCurrentSate(step, dispatch);
    } else if (
      checkStepStatus(user?.waitingVerificationSteps, "COMPANY_INFORMATION") ===
      false
    ) {
      setCurrentSate(step, dispatch);
    }

    if (method !== undefined) {
      switch (step) {
        case 0:
          handleInvestorInfoHandler(method);
          break;
        case 1:
          handleCompanyInfoHandler(method);
          break;
        default:
          break;
      }
    }
  };

  const handleInvestorInfoHandler = () => {
    setCurrentSate(current + 1, dispatch);
  };

  const handleCloseModal = () => {
    setIsSurveyModal(false);
  };

  const handleCompanyInfoHandler = async () => {
    const personlDetailsStatus = checkStepStatus(
      user?.waitingVerificationSteps,
      "COMPANY_INFORMATION"
    );

    if (personlDetailsStatus === true) {
      const updatedValidator = {
        companyName: true,
        companyRegistrationNumber: true,
        companyTaxResidenceCountry: true,
        companyAddress: true,
        zipCode: true,
        firstName: true,
        mobileNo: true,
        email: true,
      };
      setCorporateInfoDetails(
        {
          data: corporateData.data,
          validator: { validator: updatedValidator },
        },
        dispatch
      );
      const requestBody = {
        ...corporateData?.data,
      };

      if (
        corporateInfoValidator !== undefined &&
        Object.keys(corporateInfoValidator)?.length !== 0 &&
        Object.entries(corporateInfoValidator)?.every(([field, value]) => {
          const excludedFields = ["lastName"];
          if (!excludedFields?.includes(field)) {
            return value !== "";
          }
          return true;
        })
      ) {
        if (
          requestBody?.mobileNumber !== user?.mobilePhone &&
          user?.secondFactorAuth !== null
        ) {
          setMobileUpdate(true);
        } else {
          try {
            setLoader(true);
            const response = await updateCompanyInformation(requestBody);
            if (response !== undefined) {
              setLoader(false);
            } else {
              await getUserDetails().then((profileResponse) => {
                if (profileResponse) {
                  Cookies.remove("user", { path: "/" });
                  Cookies.set("user", JSON.stringify(profileResponse), {
                    path: "/",
                    sameSite: "Lax",
                  });
                }
              });
              // if (user?.secondFactorAuth === null) setTwoFaModal(true);
              showMessageWithCloseIcon(
                "Company information updated successfully"
              );

              setLoader(false);
              setCurrentSate(current + 1, dispatch);
            }
          } catch (error) {
            console.log("Error:", error);
          }
        }
      }
    } else {
      setCurrentSate(current + 1, dispatch);
    }
  };

  const stepItems = [
    {
      title: (
        <div
          className={`sb-flex ${
            current === 0 && "sb-stepper-kilde-item-active"
          }  ${current !== 0 && "sb-stepper-kilde-item"} `}
          onClick={() => onChangeStep(0)}
        >
          <div>
            <span>Investor Type</span>
          </div>
        </div>
      ),
      status: current === 0 ? "process" : "finish",
    },
    {
      title: (
        <div
          className={`sb-flex ${
            current === 1 && "sb-stepper-kilde-item-active"
          }  ${current !== 1 && "sb-stepper-kilde-item"} `}
          onClick={() => onChangeStep(1)}
        >
          <div>
            <span>Corporate Information</span>
          </div>
        </div>
      ),
      status:
        current === 1
          ? "process"
          : checkStepStatus(
              user?.waitingVerificationSteps,
              "COMPANY_INFORMATION"
            ) === true
          ? "warning"
          : checkStepStatus(
              user?.waitingVerificationSteps,
              "COMPANY_INFORMATION"
            ) === false && "finish",
    },
  ];

  useEffect(() => {
    const handleUiLoad = async () => {
      setUiLoad(true);
      if (user?.registrationStep === "EMAIL_VERIFICATION") {
        setUiLoad(false);
        navigate(ROUTES.EMAIL_VERIFICATION);
      } else if (
        (user?.registrationStep === "COMPLETED" &&
          user?.investorStatus === "VERIFICATION" &&
          user?.waitingVerificationSteps?.length === 0 &&
          user?.verificationState === "") ||
        user?.verificationState === null
      ) {
        setUiLoad(false);
        navigate(ROUTES.VERIFICATION);
      } else {
        setUiLoad(false);
      }
    };
    handleUiLoad();
  }, [user]);

  const handle2Faupdate = async () => {
    setTwofaLoader(true);
    const requestBody = {
      ...corporateData?.data,
    };
    try {
      setTwofaLoader(true);
      const response = await updateCompanyInformation(requestBody);
      if (response !== undefined) {
        setTwofaLoader(false);
      } else {
        await getUserDetails().then((profileResponse) => {
          if (profileResponse) {
            Cookies.remove("user", { path: "/" });
            Cookies.set("user", JSON.stringify(profileResponse), {
              path: "/",
              sameSite: "Lax",
            });
          }
        });
        // setTwoFaModal(true);
        setTwofaLoader(false);
        setMobileUpdate(false);
        setCurrentSate(current + 1, dispatch);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleCancel = () => {
    setMobileUpdate(false);
  };

  return (
    <>
      <DashboardLayout>
        {UiLoad === false ? (
          <div>
            <Row className="onboarding-main-div p-relative">
              <OnboardingBanner />
              <div className="onboard-sub-main-div">
                <div className="stepper-left-sidebar">
                  <div className="stepper-div">
                    <div className="stepper-sub-div">
                      <p className="sb-verification-title-onboarding media-hide mt-0">
                        Onboarding
                      </p>
                      <Steps
                        current={current}
                        onChange={(step) => onChangeStep(step)}
                        direction="vertical"
                        items={stepItems}
                        className="stepper-killed"
                      />
                    </div>
                  </div>
                </div>
                <div className="sb-stepper-progress stepper-div media-stepper-margin">
                  <div className="stepper-right">
                    <Progress percent={progress} status="active" />
                    <div className="sb-verification-content-container">
                      <RenderOrganizationComponent current={current} />
                      <div
                        className={current === 2 ? "d-none" : "stepper-btn-div"}
                      >
                        {(checkStepStatus(
                          user?.waitingVerificationSteps,
                          "QUESTIONNAIRE"
                        ) === true &&
                          current === 1) ||
                        (checkStepStatus(
                          user?.waitingVerificationSteps,
                          "QUESTIONNAIRE"
                        ) === false &&
                          current === 2) ||
                        current === 3 ||
                        current === 4 ||
                        current === 1 ? (
                          <Button
                            style={{
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className="prev-btn mr-10"
                            onClick={() => {
                              onChangeStep(current - 1);
                            }}
                          >
                            <span className="sb-next-button-span">
                              <img
                                src={Left_arrow}
                                alt="right_arrow"
                                className="mr-5"
                              />
                              Previous Step
                            </span>
                          </Button>
                        ) : null}

                        <ButtonDefault
                          style={{
                            width: 130,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title={
                            (checkStepStatus(
                              user?.waitingVerificationSteps,
                              "QUESTIONNAIRE"
                            ) === false &&
                              current === 0) ||
                            (checkStepStatus(
                              user?.waitingVerificationSteps,
                              "COMPANY_INFORMATION"
                            ) === false &&
                              current === 1) ? (
                              <span className="sb-next-button-span">
                                Next step
                                <img
                                  src={Right_arrow}
                                  alt="right_arrow"
                                  className="ml-5 "
                                />
                              </span>
                            ) : (
                              <span>Submit</span>
                            )
                          }
                          onClick={() => {
                            onChangeStep(current, "continue");
                          }}
                          loading={loader}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {current === 1 || current === 2 ? (
                <div className="survey-div">
                  <p className="survey-form-text mb-16 m-0">
                    To ensure we offer you the most suitable personalize deals,
                    we kindly request you to indicate your preference
                  </p>
                  <Button
                    className="survey-btn"
                    onClick={() => setIsSurveyModal(true)}
                  >
                    Take a survey
                  </Button>
                </div>
              ) : null}
            </Row>
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
            <LoadingOutlined
              style={{
                fontSize: 100,
              }}
              spin
            />
          </div>
        )}

        <Modal
          open={mobileUpdate}
          onCancel={handleCancel}
          width={464}
          footer={null}
          maskClosable={false}
          className="withdraw-modal"
          closable={false}
        >
          <div className="twofa-modal">
            <img
              src={WarningIcon}
              alt="warning"
              style={{ width: "40px", height: "40px" }}
            ></img>
            <p
              className="mt-0 mb-24"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--black-100, #1A202C)",
              }}
            >
              Changing your registered mobile number will affect your 2FA
              security. Please confirm if you want to proceed. You will be
              required to verify your new number with an OTP.
            </p>
          </div>
          <div className="sb-text-align d-flex">
            <Button
              className="remove-modal-back-btn mr-8 w-100"
              onClick={() => {
                setMobileUpdate(false);
              }}
            >
              Cancel
            </Button>
            <ButtonDefault
              style={{ width: "100%" }}
              title="Confirm"
              onClick={handle2Faupdate}
              loading={twofaloader}
            />
          </div>
        </Modal>
        {twoFaModal === true ? (
          <TwoFAModal twoFaModal={twoFaModal} setTwoFaModal={setTwoFaModal} />
        ) : null}

        {isSurveyModal === true ? (
          <CorporateSurveyForm
            show={isSurveyModal}
            onClose={handleCloseModal}
            user={user}
          />
        ) : null}
      </DashboardLayout>
    </>
  );
};

export default KYCStepperOrganizationPage;
