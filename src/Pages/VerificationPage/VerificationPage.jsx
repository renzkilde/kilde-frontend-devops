/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Modal, Progress } from "antd";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import KYCStepperIndividualUI from "../../Pages/KYCStepperIndividualPage/KYCStepperIndividualUI/KYCStepperIndividualUI";
import { eventsApi, getUser } from "../../Apis/UserApi";
import { useDispatch, useSelector } from "react-redux";
import ROUTES from "../../Config/Routes";
import { setUserDetails } from "../../Redux/Action/User";
import {
  confirmInvestorQuestionnaire,
  submitInvestorQuestionnaire,
  updateKycInvestor,
  createKycSingpassUser,
} from "../../Apis/InvestorApi";
// import { ONBOARDING_INDIVIDUAL } from "../../Utils/Constant";

import "../CommonOnboardingPages/KildePages/CommonKDPageStyle.css";
import "./style.css";
import KYCStepperOrganizationUI from "../KYCStepperIndividualPage/KYCStepperOrganizationUI/KYCStepperOrganizationUI";
import Corporate_Institutional_Investor from "../../Assets/Pdf/Corporate_institutional_investor.pdf";
import Corporate_Accredited_Investor from "../../Assets/Pdf/Corporate_Accredited_Investor.pdf";
import AED_Corporate_Accredited_Investor from "../../Assets/Pdf/AED_corporate_investor.pdf";

import Accredited_Investor from "../../Assets/Pdf/Accredited_Investor.pdf";
import AED_accredited_Investor from "../../Assets/Pdf/AED_accrediated_investor.pdf";
import Expert_Investor from "../../Assets/Pdf/Expert_Investor.pdf";
import Alert from "../../Assets/Images/alert.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { checkStepStatus, get_ga_clientid } from "../../Utils/Helpers";
import ComonVerification from "./ComonVerification";
import TwoFAModal from "../TwoFAPage/TwoFAModal";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout";
import { setCurrentSate } from "../../Redux/Action/common";
import { setInvestorIdentificationDetails } from "../../Redux/Action/KycIndividual";
import OnboardingBanner from "../CommonOnboardingPages/OnboardingBanner";
import { showMessageWithCloseIconError } from "../../Utils/Reusables";

const VerificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("individual");

  const [modal2Open, setModal2Open] = useState(false);
  const [loader, setLoader] = useState(false);
  const user = useSelector((state) => state.user);
  const [value, setValue] = useState("ACCREDITED");
  const [twoFaModal, setTwoFaModal] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const investorIdentification = useSelector(
    (state) => state?.kycIndividual?.investorIdentification?.data
  );

  useEffect(() => {
    setInvestorIdentificationDetails({ data: [] }, dispatch);
  }, [value]);

  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [UiLoad, setUiLoad] = useState(false);

  const getUserDetails = async () => {
    try {
      const response = await getUser();
      if (response) {
        setUserDetails(response, dispatch);
        return response;
      } else {
        console.error("Error fetching user data:");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    setUiLoad(true);
    getUserDetails().then(async (response) => {
      if (response?.registrationStep === "EMAIL_VERIFICATION") {
        setUiLoad(false);
        navigate(ROUTES.EMAIL_VERIFICATION);
      } else if (
        response?.registrationStep === "COMPLETED" &&
        response?.verificationState === "MANUAL_REVIEW"
      ) {
        setUiLoad(false);
        if (response?.investorType === "INDIVIDUAL") {
          navigate(ROUTES.INDIVIDUAL_VERIFICATION);
          setCurrentSate(5, dispatch);
        } else {
          navigate(ROUTES.ORGANIZATION_VERIFICATION);
          setCurrentSate(2, dispatch);
        }
      } else if (
        response?.waitingVerificationSteps?.length > 0 &&
        checkStepStatus(response?.waitingVerificationSteps, "QUESTIONNAIRE") ===
          false
      ) {
        setUiLoad(false);
        if (response?.investorType === "INDIVIDUAL") {
          navigate(ROUTES.INDIVIDUAL_VERIFICATION);
        } else {
          navigate(ROUTES.ORGANIZATION_VERIFICATION);
        }
      } else {
        setUiLoad(false);
      }
    });
  }, []);

  useEffect(() => {
    if (
      checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") === true
    ) {
      const verificationStartEventData = {
        gaClientId: get_ga_clientid(),
        action: "verificationStart",
        category: "verification",
      };
      eventsApi(verificationStartEventData);

      const verificationEndEventData = {
        gaClientId: get_ga_clientid(),
        action: "verificationContinuation",
        category: "verification",
      };
      eventsApi(verificationEndEventData);
    }
  }, []);

  useEffect(() => {
    if (selectedOption === "individual") {
      setValue("ACCREDITED");
    } else {
      setValue("ACCREDITED");
    }
  }, [selectedOption]);

  const openPdfModal = () => {
    setPdfModalVisible(true);
  };

  const closePdfModal = () => {
    setPdfModalVisible(false);
  };

  const onClick = async () => {
    setLoader(true);

    const allTasksCompleted = investorIdentification?.every(
      (task) => !task?.completed
    );

    let dataToSend = [];
    // eslint-disable-next-line array-callback-return
    investorIdentification?.map((Pinfo) => {
      if (Pinfo?.completed === true) {
        dataToSend.push(`${Pinfo?.value}: ${Pinfo?.id}`);
      }
    });
    const finalData = Object.values(dataToSend).join("\n");
    const data = {
      type: selectedOption === "individual" ? "INDIVIDUAL" : "COMPANY",
    };

    const finalApiData = {
      finalData,
      investorType: data?.type,
      investorSubType: value,
    };

    const keyValuePairs = finalApiData.finalData.split("\n");

    const kycData = [];
    keyValuePairs.forEach((pair) => {
      const [key, value] = pair.split(": ");
      if (value) {
        kycData.push(value);
      }
    });

    const result = {
      investorType: finalApiData.investorType,
      investorSubType: finalApiData.investorSubType,
      questionnaire: {
        selectedOptions: kycData,
      },
    };

    if (allTasksCompleted === undefined || allTasksCompleted) {
      let checkClass = document.getElementsByClassName("checkbox-kilde");
      if (checkClass?.length > 0) {
        for (let i = 0; i < checkClass.length; i++) {
          checkClass[i].classList.add("redBorder");
        }
      }
      showMessageWithCloseIconError(
        "Please select any investor qualification."
      );
      setLoader(false);
    } else {
      const response = await submitInvestorQuestionnaire(result);
      if (response?.questionnaireRejected === false) {
        const VerificationInfoEventData = {
          gaClientId: get_ga_clientid(),
          action: "verificationInfo",
          category: "verification",
        };
        window?.dataLayer?.push({
          event: "incomedata",
          user_id: user?.number,
          register_method: user?.registrationType,
        });
        eventsApi(VerificationInfoEventData);
        await confirmInvestorQuestionnaire();
        const VerificationSuccessEventData = {
          gaClientId: get_ga_clientid(),
          action: "verificationInfoSuccess",
          category: "verification",
        };
        eventsApi(VerificationSuccessEventData);

        if (user?.singpassUser === true) {
          window?.dataLayer?.push({
            event: "PersonalDetailsSubmission-skipped",
            user_id: user?.number,
            register_method: user?.registrationType,
          });
          window?.dataLayer?.push({
            event: "Registerdocs-skipped",
            user_id: user?.number,
            register_method: user?.registrationType,
          });
          window?.dataLayer?.push({
            event: "ProofofAddressSubmission-skipped",
            user_id: user?.number,
            register_method: user?.registrationType,
          });
          const singpass = await kycSingpassUser();
          if (singpass?.length > 0) {
            navigate(`${ROUTES.VERIFICATION}/${selectedOption}`);
            setLoader(false);
          } else {
            setLoader(false);
            showMessageWithCloseIconError(singpass?.message);
          }
        } else {
          setLoader(false);

          navigate(`${ROUTES.VERIFICATION}/${selectedOption}`);
        }
      } else if (response?.questionnaireRejected === true) {
        setLoader(false);
        setModal2Open(true);
      } else {
        setLoader(false);
      }
    }
  };

  const kycSingpassUser = async () => {
    const updatekyc = await createKycSingpassUser();
    if (updatekyc?.systemId) {
      const requestBody = {
        systemId: updatekyc?.systemId,
      };
      const updateInvestor = await updateKycInvestor(requestBody);
      return updateInvestor;
    } else {
      showMessageWithCloseIconError("Something went wrong");
    }
  };

  // const handleCloseModal = async () => {
  //   const requestBody = {
  //     identificationQuestions: ["I am not an Accredited Investor"],
  //   };
  //   const response = await updateKycInvestor(requestBody);
  //   if (
  //     response?.kyc?.KYCStatus === ONBOARDING_INDIVIDUAL.INVESTOR_IDENTIFICATION
  //   ) {
  //     navigate(ROUTES.LOGIN);
  //   } else {
  //     notification.error({
  //       type: "error",
  //       message: "Something went Wrong!",
  //     });
  //   }
  // };

  useEffect(() => {
    if (shouldNavigate === true) {
      if (user?.investorType === "INDIVIDUAL") {
        navigate(ROUTES.INDIVIDUAL_VERIFICATION);
      } else {
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
      }
    }
  }, [shouldNavigate]);

  const getHref = (selectedOption, value) => {
    if (
      (selectedOption === "COMPANY" || selectedOption === "company") &&
      value === "ACCREDITED"
    ) {
      return localStorage.getItem("currency")
        ? AED_Corporate_Accredited_Investor
        : Corporate_Accredited_Investor;
    } else if (
      (selectedOption === "COMPANY" || selectedOption === "company") &&
      value === "INSTITUTIONAL"
    ) {
      return Corporate_Institutional_Investor;
    } else if (
      (selectedOption === "INDIVIDUAL" || selectedOption === "individual") &&
      value === "ACCREDITED"
    ) {
      return localStorage.getItem("currency")
        ? AED_accredited_Investor
        : Accredited_Investor;
    } else if (
      (selectedOption === "INDIVIDUAL" || selectedOption === "individual") &&
      value === "EXPERT"
    ) {
      return Expert_Investor;
    }
    return null;
  };

  return (
    <DashboardLayout>
      {UiLoad === false ? (
        <div>
          <div className="onboarding-main-div">
            <OnboardingBanner />
            <div className="onboard-sub-main-div">
              <div className="stepper-left-sidebar">
                <div className="stepper-div">
                  <div className="stepper-sub-div">
                    <p className="sb-verification-title-onboarding media-hide mt-0">
                      Onboarding
                    </p>
                    {selectedOption === "individual" ? (
                      <KYCStepperIndividualUI user={user} />
                    ) : (
                      <KYCStepperOrganizationUI />
                    )}
                  </div>
                </div>
              </div>
              <div className="sb-stepper-progress stepper-div media-stepper-margin">
                <div className="stepper-right">
                  <Progress
                    percent={0}
                    status="active"
                    className="stepper-progress"
                  />
                  <div className="sb-flex onboard-sub-div">
                    <div
                      style={{ flex: 10 }}
                      className="sb-verification-title-container"
                    >
                      <p className="sb-verification-title mt-0">
                        Select Investor Type
                      </p>
                    </div>
                  </div>

                  <p className="m-0 head-userId verification-text">
                    Hi{" "}
                    <b className="p-capitalize">
                      {" "}
                      {user?.firstName + " " + user?.lastName}
                    </b>
                    . Please select the option(s) that apply to you.
                  </p>
                  <p className="head-userId verification-text mt-5">
                    <a
                      className="verification-here-link m-0"
                      target="_blank"
                      href={getHref(selectedOption, value)}
                      rel="noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        openPdfModal();
                      }}
                    >
                      Learn more
                    </a>{" "}
                    about how to verify your {value.toLowerCase()} investor
                    status.
                  </p>
                  <ComonVerification
                    value={value}
                    setValue={setValue}
                    setSelectedOption={setSelectedOption}
                    selectedOption={selectedOption}
                  />
                  <div className="verification-btn-div bg-white">
                    <ButtonDefault
                      style={{ width: 130, height: 40 }}
                      title="Submit"
                      onClick={() => onClick()}
                      loading={loader}
                      id="btn-investor-type-questionnarie"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        width={400}
        centered
        style={{ padding: 0 }}
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        className="kilde-modal-button warning-modal"
      >
        <div className="not-investormodal" style={{ paddingTop: 10 }}>
          <img src={Alert} alt="alert_img" />
          <div className="child-notinvestor" style={{ padding: 0 }}>
            <p className="sb-verification-title mt-5 mb-10">
              Thank you for your interest.
            </p>
            <p className="kl-subtitle mt-0">
              Kilde is currently for accredited, expert, and institutional
              investors.
            </p>
            <p className="kl-subtitle mt-0">
              Please change your investor status or contact{" "}
              <a
                href="mailto:sales@kilde.sg"
                style={{ color: "var(--kilde-blue)" }}
              >
                sales@kilde.sg
              </a>{" "}
              for more information.
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        className="sb-pdf-modal"
        centered
        open={pdfModalVisible}
        onCancel={closePdfModal}
        width={1000}
        footer={null}
      >
        <iframe
          className="mt-20"
          src={`${getHref(selectedOption, value)}#toolbar=0`}
          width="100%"
          height="500px"
          title="PDF Viewer"
        />
      </Modal>
      {twoFaModal === true ? (
        <TwoFAModal
          twoFaModal={twoFaModal}
          setTwoFaModal={setTwoFaModal}
          setShouldNavigate={setShouldNavigate}
        />
      ) : null}
    </DashboardLayout>
  );
};

export default VerificationPage;
