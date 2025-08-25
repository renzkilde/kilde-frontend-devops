/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Progress, Steps, message, notification } from "antd";

import axios from "axios";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";

import { RenderComponent } from "./RenderComponent/RenderComponent";
import ButtonDefault from "../../Components/ButtonDefault/ButtonDefault";
import {
  checkStepStatus,
  get_ga_clientid,
  redirectToVue,
} from "../../Utils/Helpers";
import {
  RerefenceProofOfAccrediationApi,
  RerefenceProofOfAddressUploadApi,
  documentUpload,
  getPersonalInfo,
  getSystemId,
  livenessRequest,
  statusCheck,
  updatePersonalInfo,
} from "../../Apis/InvestorApi.js";
import {
  setIdentifyProofDetails,
  setIdentityVerificationResponse,
  setLivenessDetails,
  setPersonalData,
  setPersonalInfoDetails,
  setStatusCheckResponse,
} from "../../Redux/Action/KycIndividual";
import TwoFAModal from "../TwoFAPage/TwoFAModal.jsx";
import { setCurrentSate } from "../../Redux/Action/common";
import { getBase64 } from "../../Utils/Helpers";
import ROUTES from "../../Config/Routes";
import { eventsApi, getUser } from "../../Apis/UserApi.js";
import { setUserDetails } from "../../Redux/Action/User.js";
import { CloseCircleFilled, LoadingOutlined } from "@ant-design/icons";
import Right_arrow from "../../Assets/Images/Icons/right_arrow.svg";
import Left_arrow from "../../Assets/Images/Icons/left_arrow.svg";

import "./style.css";
import DashboardLayout from "../../Layouts/DashboardLayout/DashboardLayout.jsx";
import WarningIcon from "../../Assets/Images/Warning.svg";
import {
  formatCamelCaseToTitle,
  generateErrorMessages,
  showMessageWithCloseIcon,
  showMessageWithCloseIconError,
} from "../../Utils/Reusables.js";
import { RedirectionToVeriff } from "../../Utils/RedirectionToVeriff.jsx";
// import { fetchVeriffURL } from "../../Apis/Veriff.js";
import OnboardingBanner from "../CommonOnboardingPages/OnboardingBanner.jsx";

const VerificationStepperPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(20);
  const [loader, setLoader] = useState(false);
  const [livenessData, setLivenessData] = useState();
  const [UiLoad, setUiLoad] = useState(false);
  const [twoFaModal, setTwoFaModal] = useState(false);
  const [riskTags, setRiskTags] = useState([]);
  const [hasWarningTags, setHasWarningTags] = useState(false);
  const [showIdv, setShowIdv] = useState("hideIdv");
  const [mobileUpdate, setMobileUpdate] = useState(false);
  const [twofaloader, setTwofaLoader] = useState(false);

  const identifyVerification = useSelector(
    (state) => state.kycIndividual.identifyVerification
  );
  const personalInformation = useSelector(
    (state) => state.kycIndividual.personalInfo
  );
  const entityDocument = useSelector(
    (state) => state?.kycOrganization?.entityDocument
  );
  const personalData = useSelector(
    (state) => state?.kycIndividual?.personalDetails
  );
  const livenessCheck = useSelector(
    (state) => state?.kycIndividual?.identityResponse
  );
  const regtankStatus = useSelector(
    (state) => state?.kycIndividual?.livenessCheck
  );
  const documents = useSelector((state) => state.kycIndividual.document);
  const current = useSelector((state) => state.common.current);
  const livenessVideo = useSelector((state) => state.kycIndividual.liveness);
  const user = useSelector((state) => state.user);
  const personalInfoValidator = personalInformation?.data;
  // const [redirectURL, setRedirectURL] = useState("");

  // useEffect(() => {
  //   if (RedirectionToVeriff(user) === true) {
  //     fetchVeriffURL()
  //       .then((res) => {
  //         setRedirectURL(res?.redirectURL);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, []);

  useEffect(() => {
    if (
      ((livenessCheck?.systemId !== null &&
        livenessCheck?.systemId !== undefined &&
        livenessCheck?.systemId !== "undefined") ||
        (Cookies.get("systemId") !== null &&
          Cookies.get("systemId") !== undefined &&
          Cookies.get("systemId") !== "undefined")) &&
      user?.vwoFeatures?.identityVerificationSystem?.idvSystemToUse ===
        "regtank"
    ) {
      const fetchData = async () => {
        try {
          const status = await statusCheck({
            email: user?.email,
            systemId: livenessCheck?.systemId || Cookies.get("systemId"),
          });
          await setStatusCheckResponse(status, dispatch);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 180000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [user]);

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
    const handleEmailVerification = async () => {
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
    handleEmailVerification();
  }, [user]);

  const getPersonalDetails = async () => {
    const response = await getPersonalInfo();
    if (response) {
      setPersonalData(response, dispatch);
    } else {
      console.error("Error fetching personal details data:");
    }
  };

  function updateProgressBar() {
    if (user?.singpassUser === true) {
      if (
        (checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
          false &&
          checkStepStatus(
            user?.waitingVerificationSteps,
            "PROOF_OF_ACCREDITATION"
          ) === false &&
          user?.waitingVerificationSteps?.length === 0 &&
          user?.verificationState === "") ||
        user?.verificationState === null
      ) {
        setProgress(progress + 50);
      } else if (
        checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
          false &&
        checkStepStatus(
          user?.waitingVerificationSteps,
          "PROOF_OF_ACCREDITATION"
        ) === true
      ) {
        setProgress(50);
      } else {
        setProgress(100);
      }
    } else {
      const totalSteps = 5;
      let completedSteps;
      if (
        [
          "LIVENESS_PASSED",
          "APPROVED",
          "WAIT_FOR_APPROVAL",
          "Score Generated",
          "COMPLETED",
          null,
        ].includes(regtankStatus?.status)
      ) {
        if (
          user?.waitingVerificationSteps?.includes(
            "SECOND_FACTOR_AUTHENTICATION"
          )
        ) {
          completedSteps = user?.waitingVerificationSteps?.length - 2;
        } else {
          completedSteps = user?.waitingVerificationSteps?.length - 1;
        }
      } else {
        if (
          user?.waitingVerificationSteps?.includes(
            "SECOND_FACTOR_AUTHENTICATION"
          )
        ) {
          completedSteps = user?.waitingVerificationSteps?.length - 1;
        } else {
          completedSteps = user?.waitingVerificationSteps?.length;
        }
      }

      const percentage = (totalSteps - completedSteps) * 20;
      setProgress(percentage);
    }
  }

  useEffect(() => {
    updateProgressBar();
  }, [user?.waitingVerificationSteps, regtankStatus?.status]);

  useEffect(() => {
    const userData = async () => {
      await getUserDetails();
      if (user?.singpassUser === false) {
        if (
          user?.verificationState !== "" &&
          checkStepStatus(
            user?.waitingVerificationSteps,
            "PERSONAL_DETAILS"
          ) === false
        ) {
          await getPersonalDetails();
        }
      }
      if (user?.singpassUser === true) {
        if (
          checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
          true
        ) {
          navigate(ROUTES.VERIFICATION);
        }
        if (
          checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
          false
        ) {
          setCurrentSate(1, dispatch);
        }
        if (
          checkStepStatus(
            user?.waitingVerificationSteps,
            "PROOF_OF_ACCREDITATION"
          ) === false
        ) {
          setCurrentSate(5, dispatch);
        }
      } else {
        if (
          checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
            false &&
          checkStepStatus(
            user?.waitingVerificationSteps,
            "PERSONAL_DETAILS"
          ) === true
        ) {
          setCurrentSate(1, dispatch);
        }
        if (
          checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") ===
          true
        ) {
          navigate(ROUTES.VERIFICATION);
        }
        if (
          checkStepStatus(
            user?.waitingVerificationSteps,
            "PERSONAL_DETAILS"
          ) === false &&
          ([
            "LIVENESS_FAILED",
            "RESUBMISSION",
            "EMAIL_SENT",
            "ID_UPLOADED_FAILED",
          ].includes(regtankStatus?.status) ||
            (checkStepStatus(
              user?.waitingVerificationSteps,
              "IDENTITY_VERIFICATION"
            ) === true &&
              regtankStatus?.status === undefined))
        ) {
          setCurrentSate(2, dispatch);
        }
        if (
          ["COMPLETED", "APPROVED"].includes(regtankStatus?.status) &&
          checkStepStatus(user?.waitingVerificationSteps, "DOCUMENTS") === true
        ) {
          setCurrentSate(3, dispatch);
        }
        if (
          checkStepStatus(user?.waitingVerificationSteps, "DOCUMENTS") ===
            false &&
          checkStepStatus(
            user?.waitingVerificationSteps,
            "PROOF_OF_ACCREDITATION"
          ) === true
        ) {
          setCurrentSate(4, dispatch);
        }
        if (
          checkStepStatus(
            user?.waitingVerificationSteps,
            "PROOF_OF_ACCREDITATION"
          ) === true
        ) {
          if (
            [
              "LIVENESS_FAILED",
              "REJECTED",
              "RESUBMISSION",
              "EMAIL_SENT",
              "ID_UPLOADED_FAILED",
            ].includes(regtankStatus?.status)
          ) {
            setCurrentSate(2, dispatch);
          } else if (
            checkStepStatus(user?.waitingVerificationSteps, "DOCUMENTS") ===
            false
          ) {
            setCurrentSate(3, dispatch);
          } else if (
            [
              ("LIVENESS_PASSED",
              "APPROVED",
              "WAIT_FOR_APPROVAL",
              "Score Generated",
              "COMPLETED"),
            ].includes(regtankStatus?.status) &&
            checkStepStatus(user?.waitingVerificationSteps, "DOCUMENTS") ===
              true
          ) {
            setCurrentSate(5, dispatch);
          }
        }
      }
    };
    userData();
  }, [dispatch, navigate]);

  const onChangeStep = (step, method) => {
    if (
      checkStepStatus(user?.waitingVerificationSteps, "PERSONAL_DETAILS") ===
        true &&
      (step === 1 || step === 0)
    ) {
      setCurrentSate(step, dispatch);
    } else if (
      checkStepStatus(user?.waitingVerificationSteps, "PERSONAL_DETAILS") ===
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
          if (user?.singpassUser === true) {
            handleProofOfAccreditationHandler(method);
          } else {
            handlePersonalInfoHandler(method);
          }
          break;
        case 2:
          if (
            (livenessCheck?.systemId !== "" &&
              livenessCheck?.systemId !== undefined &&
              showIdv === "hideIdv") ||
            (regtankStatus?.status === "ID_UPLOADED" &&
              showIdv === "hideIdv") ||
            (regtankStatus?.status === "LIVENESS_FAILED" &&
              showIdv === "hideIdv") ||
            regtankStatus?.errorCode === "ERROR_VIDEO_FACE_NOT_FOUND"
          ) {
            handleLivenessHandler(method);
          } else if (
            regtankStatus?.status === "LIVENESS_FAILED" &&
            showIdv === "showIdv"
          ) {
            handleIdentityInfoHandler(method);
          } else {
            handleIdentityInfoHandler(method);
          }
          break;
        case 3:
          handleStep3Handler(method);
          break;
        case 4:
          handleProofOfAccreditationHandler(method);
          break;
        default:
          break;
      }
    }
  };

  const handleInvestorInfoHandler = () => {
    setCurrentSate(current + 1, dispatch);
  };

  const handlePersonalInfoHandler = async () => {
    const personlDetailsStatus = checkStepStatus(
      user?.waitingVerificationSteps,
      "PERSONAL_DETAILS"
    );
    if (personlDetailsStatus === true) {
      let excludedFields = ["taxIdentificationNumber", "signupReferralCode"];

      if (personalInformation?.data?.singaporePermanentResident) {
        excludedFields.push("passportNumber", "passportExpiryDate");
      } else {
        excludedFields.push("singaporeNricNumber");
      }

      if (personalInformation?.data?.taxResidenceCountrySame) {
        excludedFields.push("taxResidenceCountry");
      }

      const emptyFields =
        personalInfoValidator !== undefined &&
        Object?.entries(personalInfoValidator)
          ?.filter(
            ([field, value]) => !excludedFields?.includes(field) && value === ""
          )
          ?.map(([field]) => formatCamelCaseToTitle(field));

      if (emptyFields.length > 0) {
        message.error({
          content: (
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <CloseCircleFilled
                style={{
                  color: "red",
                  marginRight: "6px",
                }}
              />
              <p
                style={{
                  maxWidth: "600px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textAlign: "left",
                }}
              >
                Please fill in the
                <span style={{ fontWeight: 400 }}>
                  {" "}
                  "{emptyFields?.join(", ")}"{" "}
                </span>
                {emptyFields.length > 1 ? "fields" : "field"}.
              </p>
            </div>
          ),
          duration: 5,
          icon: <span style={{ width: 0, height: 0 }}></span>,
        });

        return;
      }

      const updatedValidator = {
        firstName: true,
        lastName: true,
        mobileNumber: true,
        gender: true,
        dateOfBirth: true,
        countryOfBirth: true,
        houseNumber: true,
        residenceAddressStreet: true,
        residenceAddressCountry: true,
        residenceAddressCity: true,
        residenceAddressPostalCode: true,
        taxResidenceCountry: true,
        taxIdentificationNumber: true,
        countryOfCitizenship: true,
        singaporeNricNumber: true,
        passportNumber: true,
        passportExpiryDate: true,
      };
      setPersonalInfoDetails(
        {
          data: personalInformation.data,
          validator: { validator: updatedValidator },
        },
        dispatch
      );
      const requestBody = {
        ...personalInformation?.data,
      };

      if (
        personalInfoValidator !== undefined &&
        Object.keys(personalInfoValidator)?.length !== 0 &&
        Object.entries(personalInfoValidator)?.every(([field, value]) => {
          const excludedFields = [
            "passportNumber",
            "passportExpiryDate",
            "countryOfCitizenship",
            "taxResidenceCountry",
            "singaporeNricNumber",
            "taxIdentificationNumber",
            "signupReferralCode",
          ];
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
            const response = await updatePersonalInfo(requestBody);
            if (Object.keys(response)?.length > 0) {
              setLoader(false);
            } else {
              await getPersonalDetails();
              await getUserDetails();
              // if (user?.secondFactorAuth === null) {
              // setTwoFaModal(true);
              // } else {
              setCurrentSate(current + 1, dispatch);
              // }
              setLoader(false);
              window?.dataLayer?.push({
                event: "PersonalDetailsSubmission",
                user_id: user?.number,
                register_method: user?.registrationType,
              });
              const eventData = {
                gaClientId: get_ga_clientid(),
                action: "personalData",
                category: "registration",
              };
              eventsApi(eventData);
              showMessageWithCloseIcon(
                "Personal information updated successfully"
              );
              Cookies.remove("referral_code");
            }
          } catch (error) {
            setLoader(false);
            console.log("Error:", error);
          }
        }
      }
    } else {
      setCurrentSate(current + 1, dispatch);
    }
  };

  const idUploadDoc = async (method) => {
    try {
      if (method === "doItLater") {
        setCurrentSate(current + 1, dispatch);
      } else {
        if (
          identifyVerification?.documentType === "Identity" &&
          (identifyVerification?.docs?.frontImage === "" ||
            identifyVerification?.docs?.backImage === "") &&
          showIdv === "hideIdv"
        ) {
          setLoader(false);
          notification.error({
            type: "error",
            message: "Error",
            description:
              "Please upload front side and back side of your document",
            duration: 1,
          });
        } else if (
          identifyVerification?.documentType === "Passport" &&
          identifyVerification?.docs?.frontImage === ""
        ) {
          setLoader(false);
          notification.error({
            type: "error",
            message: "Error",
            description: "Please upload front side of your document",
            duration: 1,
          });
        } else if (
          identifyVerification?.documentType === "" ||
          identifyVerification?.documentType === undefined
        ) {
          setLoader(false);
          notification.error({
            type: "error",
            message: "Error",
            description: "Please select type of your document",
            duration: 1,
          });
        } else {
          if (!personalData || Object.keys(personalData).length === 0) {
            getPersonalDetails();
          } else if (personalData?.length !== 0) {
            setLoader(true);
            const data = {
              email: user?.email,
              surname: personalData?.lastName || "",
              forename: personalData?.firstName || "",
              countryOfResidence: personalData?.residenceAddressCountry || "",
              countryOfCitizenship: personalData?.countryOfCitizenship || "SG",
              placeOfBirth: personalData?.countryOfBirth || "",
              dateOfBirth: personalData?.dateOfBirth || "",
              yearOfBirth: personalData?.dateOfBirth?.split("-")[0],
              gender: personalData?.gender || "",
              idType: "IDENTITY",
              referenceId: `KD-${user?.email}`,
              nationality: personalData?.countryOfCitizenship,
              governmentIdNumber:
                personalData?.singaporeNricNumber ||
                personalData?.taxIdentificationNumber,
              language: "en",
              bypassIdUpload: "FALSE",
              phoneNumber: personalData?.mobileNumber,
              address:
                personalData?.houseNumber +
                "," +
                personalData?.residenceAddressStreet +
                "," +
                personalData?.residenceAddressCity +
                "," +
                personalData?.residenceAddressCountry +
                "," +
                personalData?.residenceAddressPostalCode,
            };
            const livenessReq = await livenessRequest(data);

            if (livenessReq) {
              Cookies.set("systemId", livenessReq?.systemId);
              setLivenessData(livenessReq);
            }
            let frontimage_base64;
            let backimage_base64;
            if (
              identifyVerification?.docs?.frontImage?.file &&
              identifyVerification?.docs?.backImage?.file
            ) {
              frontimage_base64 = await getBase64(
                identifyVerification?.docs?.frontImage?.file
              );
              backimage_base64 = await getBase64(
                identifyVerification?.docs?.backImage?.file
              );
            } else if (identifyVerification?.docs?.frontImage?.file) {
              frontimage_base64 = await getBase64(
                identifyVerification?.docs?.frontImage?.file
              );
            }
            if (frontimage_base64 !== "" && livenessReq) {
              const docs = {
                systemId: livenessReq?.systemId,
                email: user?.email,
                documentType: identifyVerification?.documentType,
                frontImage: {
                  fileName: identifyVerification?.docs?.frontImage?.file?.name,
                  fileContent: frontimage_base64,
                },
                backImage: {
                  fileName: identifyVerification?.docs?.backImage?.file?.name,
                  fileContent: backimage_base64,
                },
              };
              documentUpload(docs)
                .then(async (response) => {
                  if (response?.status === "ID_UPLOADED") {
                    setShowIdv("hideIdv");
                    Cookies.set("systemId", response?.systemId);

                    const status = await statusCheck({
                      email: user?.email,
                      systemId: response?.systemId,
                    });
                    setStatusCheckResponse(status, dispatch);
                    setIdentityVerificationResponse(response, dispatch);
                    setLoader(false);
                    return showMessageWithCloseIcon(
                      "Your identity proof has been successfully uploaded."
                    );
                  }
                  const errorMessageList = generateErrorMessages(
                    response?.docUploadErrors
                  );
                  if (errorMessageList?.length > 0) {
                    setLoader(false);
                    setHasWarningTags(true);
                  }
                  setRiskTags(errorMessageList);
                  window?.dataLayer?.push({
                    event: "verificationDocumentsAutoDecline",
                    user_id: user?.number,
                    register_method: user?.registrationType,
                  });
                })
                .catch((error) => {
                  setLoader(false);
                });
            } else {
              setLoader(false);
            }
          } else {
            notification.error({
              type: "error",
              message: "Error",
              description:
                "Ops! something went wrong. Please try again after some time!",
              duration: 1,
            });
            setLoader(false);
          }
        }
      }
    } catch (e) {
      setLoader(false);
      console.log("error:", e);
    }
  };

  const moveToNext = () => {
    setCurrentSate(current + 1, dispatch);
  };

  const handleIdentityInfoHandler = async (method) => {
    // if (RedirectionToVeriff(user) === true) {
    //   window?.open(redirectURL, "_blank");
    // } else {
    if (regtankStatus?.status === "LIVENESS_FAILED" && showIdv === "showIdv") {
      idUploadDoc(method);
    } else if (regtankStatus?.status === "EMAIL_SENT") {
      idUploadDoc(method);
    } else if (regtankStatus?.status === "RESUBMISSION") {
      idUploadDoc(method);
    } else if (regtankStatus?.status === "EXPIRED") {
      idUploadDoc(method);
    } else if (regtankStatus?.status === "URL_GENERATED") {
      idUploadDoc(method);
    } else if (regtankStatus?.status === "ID_UPLOADED_FAILED") {
      idUploadDoc(method);
    } else if (
      regtankStatus?.status === "ID_UPLOADED" &&
      showIdv === "showIdv"
    ) {
      idUploadDoc(method);
    } else if (
      checkStepStatus(
        user?.waitingVerificationSteps,
        "IDENTITY_VERIFICATION"
      ) === true &&
      regtankStatus?.status === undefined
    ) {
      idUploadDoc(method);
    } else {
      moveToNext();
    }
    // }
  };

  const handleStep3Handler = async (method) => {
    const documentStatus = checkStepStatus(
      user?.waitingVerificationSteps,
      "DOCUMENTS"
    );
    if (documentStatus === true) {
      if (method === "doItLater") {
        setCurrentSate(current + 1, dispatch);
      } else {
        setLoader(true);
        if (documents && documents.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < documents.length; i++) {
            formData.append(`files`, documents[i]);
          }
          if (formData) {
            try {
              const response = await axios.post(
                `/api/v2/guest/upload`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              if (response) {
                if (response?.data?.fileReference?.length > 0)
                  RerefenceProofOfAddressUploadApi({
                    addressFileReference: response?.data?.fileReference,
                  })
                    .then(async (referenceResponse) => {
                      await getUserDetails();
                      window?.dataLayer?.push({
                        event: "ProofofAddressSubmission",
                        user_id: user?.number,
                        register_method: user?.registrationType,
                      });
                      const DocumentEventData = {
                        gaClientId: get_ga_clientid(),
                        action: "adressDownload",
                        category: "adress",
                      };
                      eventsApi(DocumentEventData);
                      setLoader(false);
                      setCurrentSate(current + 1, dispatch);
                    })
                    .catch((error) => {
                      console.log("error", error);
                    });
              }
            } catch (error) {
              setLoader(false);
              showMessageWithCloseIconError("File upload error:", error);
            }
          }
        } else {
          showMessageWithCloseIconError("Please upload documents.");
          setLoader(false);
        }
      }
    } else {
      setCurrentSate(current + 1, dispatch);
    }
  };

  const handleLivenessHandler = async (method) => {
    if (
      regtankStatus?.status === undefined ||
      regtankStatus?.status === null ||
      regtankStatus?.status === "" ||
      regtankStatus?.status === "undefined"
    ) {
      if (
        Cookies.get("systemId") === null ||
        Cookies.get("systemId") === undefined ||
        Cookies.get("systemId") === "" ||
        Cookies.get("systemId") === "undefined"
      ) {
        const getSystId = await getSystemId();
        Cookies.set("systemId", getSystId?.systemId);
        if (
          getSystId?.systemId !== null &&
          getSystId?.systemId !== undefined &&
          Object.keys(getSystId)?.length > 0
        ) {
          const status = await statusCheck({
            email: user?.email,
            systemId: getSystId?.systemId,
          });
          setStatusCheckResponse(status, dispatch);
        }
      } else {
        const status = await statusCheck({
          email: user?.email,
          systemId: Cookies.get("systemId"),
        });
        setStatusCheckResponse(status, dispatch);
      }
    }

    setLoader(true);
    if (
      [
        "LIVENESS_FAILED",
        "RESUBMISSION",
        "EMAIL_SENT",
        "URL_GENERATED",
        "EXPIRED",
      ].includes(regtankStatus?.status) ||
      regtankStatus?.errorCode === "ERROR_VIDEO_FACE_NOT_FOUND" ||
      (regtankStatus?.status === "ID_UPLOADED" && showIdv === "hideIdv")
    ) {
      if (livenessVideo?.size > 0) {
        let params;
        let token;
        let formData;
        let systemId;

        if (!livenessData) {
          const data = {
            email: user?.email,
            surname: personalData?.lastName || "",
            forename: personalData?.firstName || "",
            countryOfResidence: personalData?.residenceAddressCountry || "",
            countryOfCitizenship: personalData?.countryOfCitizenship || "SG",
            placeOfBirth: personalData?.countryOfBirth || "",
            dateOfBirth: personalData?.dateOfBirth || "",
            yearOfBirth: personalData?.dateOfBirth?.split("-")[0],
            gender: personalData?.gender || "",
            idType: "IDENTITY",
            referenceId: `KD-${user?.email}`,
            language: "en",
            bypassIdUpload: "FALSE",
            phoneNumber: personalData?.mobileNumber,
            governmentIdNumber:
              personalData?.singaporeNricNumber ||
              personalData?.taxIdentificationNumber,
            address:
              personalData?.houseNumber +
              "," +
              personalData?.residenceAddressStreet +
              "," +
              personalData?.residenceAddressCity +
              "," +
              personalData?.residenceAddressCountry +
              "," +
              personalData?.residenceAddressPostalCode,
          };
          await livenessRequest(data)
            .then((res) => {
              Cookies.set("systemId", res?.systemId);
              params = new URLSearchParams(res?.verifyLink);
              token = params.get("token");
              systemId = res?.systemId;
              formData = new FormData();
            })
            .catch((err) => {
              setLoader(false);
            });
        } else {
          params = new URLSearchParams(livenessData?.verifyLink);
          token = params.get("token");
          systemId = livenessData?.systemId;
          formData = new FormData();
        }

        if (token !== null && systemId !== undefined) {
          formData.append("systemId", systemId);
          formData.append("token", token);
          formData.append("video", livenessVideo);

          try {
            const headers = {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data",
              },
            };
            axios
              .post(`/api/investor/liveness/check`, formData, headers)
              .then(async (res) => {
                const datatosend = {
                  email: user?.email,
                  systemId: livenessData?.systemId || Cookies.get("systemId"),
                };
                if (res?.verifyStatus === "REJECTED") {
                  await setIdentityVerificationResponse("", dispatch);
                  setLivenessDetails("", dispatch);

                  notification.error({
                    type: "error",
                    message: "Error",
                    description: "Liveness check rejected, please try again",
                    duration: 8,
                  });
                  setLoader(false);
                } else {
                  const status = await statusCheck(datatosend);
                  setStatusCheckResponse(status, dispatch);

                  if (status?.errorCode) {
                    notification.error({
                      type: "error",
                      message: status?.errorCode,
                      description: status?.errorMsg,
                      duration: 8,
                    });
                    setLoader(false);
                  } else if (
                    status?.status === "REJECTED" &&
                    status?.note === "exceed liveness total limit"
                  ) {
                    notification.error({
                      type: "error",
                      message: (
                        <div>
                          <p>
                            You've been rejected because you exceeded the limit
                            of 3 failed liveness test attempts.
                          </p>
                        </div>
                      ),
                      duration: 10,
                    });
                    setLoader(false);
                  } else if (status?.status === "LIVENESS_FAILED") {
                    await setIdentityVerificationResponse("", dispatch);
                    setLivenessDetails("", dispatch);
                    setIdentifyProofDetails("", dispatch);
                    notification.error({
                      type: "error",
                      message: "The liveness test failed!",
                      description:
                        "Please try again with the correct ID and good lighting. You'll be auto-rejected after 3 failed attempts.",
                      duration: 8,
                    });
                    setLoader(false);
                  } else if (
                    status?.status === "LIVENESS_PASSED" ||
                    (status?.livenessCheckInfo?.verifyStatus ===
                      "LIVENESS_PASSED" &&
                      status?.status === null)
                  ) {
                    notification.success({
                      type: "success",
                      message: "Submitted successfully",
                      description:
                        "Thank you! Your ID and liveness test have been submitted successfully. We will now proceed with the KYC/AML check and our team will update you on the status shortly.",
                      duration: 8,
                    });
                    window?.dataLayer?.push({
                      event: "registerdocs",
                      user_id: user?.number,
                      register_method: user?.registrationType,
                    });
                    setLoader(false);
                    await getUserDetails();
                  }
                }
                setLoader(false);
              })
              .catch(async (err) => {
                setLivenessDetails("", dispatch);

                notification.error({
                  type: "error",
                  message:
                    err?.response?.data?.errorCode ||
                    "Oops! Something happened.",
                  description:
                    err?.response?.data?.errorMsg ||
                    "Could you please give it another try!",

                  duration: 5,
                });
                setLoader(false);
              });
          } catch (error) {
            setLivenessDetails("", dispatch);
            notification.error({
              type: "error",
              message: error.message?.replace("Error", ""),
              duration: 5,
            });
            setLoader(false);
          }
        } else {
          showMessageWithCloseIconError("Something went wrong, Try again");
          setLoader(false);
        }
      } else {
        notification.error({
          type: "error",
          message: "Error",
          description: "Please capture video duration of 1-3 seconds.",
        });
        setLoader(false);
      }
    } else {
      setLoader(false);
      setCurrentSate(current + 1, dispatch);
    }
  };

  const handleProofOfAccreditationHandler = async (method) => {
    const accreditationStatus = checkStepStatus(
      user?.waitingVerificationSteps,
      "PROOF_OF_ACCREDITATION"
    );
    if (accreditationStatus === true) {
      if (method === "doItLater") {
        if (
          [
            "LIVENESS_FAILED",
            "RESUBMISSION",
            "EMAIL_SENT",
            "ID_UPLOADED_FAILED",
            "REJECTED",
            "ID_UPLOADED",
            "EXPIRED",
          ].includes(regtankStatus?.status) ||
          (checkStepStatus(
            user?.waitingVerificationSteps,
            "IDENTITY_VERIFICATION"
          ) === true &&
            regtankStatus?.status === undefined)
        ) {
          setCurrentSate(2, dispatch);
        } else if (
          checkStepStatus(user?.waitingVerificationSteps, "DOCUMENTS") === true
        ) {
          setCurrentSate(3, dispatch);
        } else {
          redirectToVue(user?.vwoFeatures.redirectApp?.appToRedirect, navigate);
        }
      } else {
        setLoader(true);
        const singleArray = transformInToSingleArray(entityDocument);
        const proofDocuments = transformDocumentObjectToArray(singleArray);

        if (proofDocuments && proofDocuments.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < proofDocuments.length; i++) {
            formData.append(`files`, proofDocuments[i]);
          }
          if (formData) {
            try {
              const response = await axios.post(
                "/api/v2/guest/upload",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              if (response) {
                if (response?.data?.fileReference?.length > 0)
                  RerefenceProofOfAccrediationApi({
                    poiFileReference: response?.data?.fileReference,
                  })
                    .then(async (referenceResponse) => {
                      window?.dataLayer?.push({
                        event: "ProofofAccreditationSubmission",
                        user_id: user?.number,
                        register_method: user?.registrationType,
                      });
                      await getUserDetails();
                      setLoader(false);
                    })
                    .catch((error) => {
                      console.log("error", error);
                    });
                setLoader(false);
                if (user?.singpassUser === true) {
                  setCurrentSate(5, dispatch);
                } else {
                  if (
                    [
                      "LIVENESS_FAILED",
                      "RESUBMISSION",
                      "EMAIL_SENT",
                      "ID_UPLOADED_FAILED",
                      "REJECTED",
                      "ID_UPLOADED",
                      "EXPIRED",
                    ].includes(regtankStatus?.status) ||
                    (checkStepStatus(
                      user?.waitingVerificationSteps,
                      "IDENTITY_VERIFICATION"
                    ) === true &&
                      regtankStatus?.status === undefined)
                  ) {
                    setCurrentSate(2, dispatch);
                  } else if (
                    checkStepStatus(
                      user?.waitingVerificationSteps,
                      "DOCUMENTS"
                    ) === true
                  ) {
                    setCurrentSate(3, dispatch);
                  } else {
                    setCurrentSate(5, dispatch);
                  }
                }
              }
            } catch (error) {
              setLoader(false);
              showMessageWithCloseIconError("File upload error");
            }
          }
        } else {
          showMessageWithCloseIconError("Please upload documents.");
          setLoader(false);
        }
      }
    } else {
      if (user?.singpassUser === true) {
        setCurrentSate(5, dispatch);
      } else {
        if (
          [
            "LIVENESS_FAILED",
            "RESUBMISSION",
            "EMAIL_SENT",
            "ID_UPLOADED_FAILED",
            "REJECTED",
            "ID_UPLOADED",
            "EXPIRED",
          ].includes(regtankStatus?.status) ||
          (checkStepStatus(
            user?.waitingVerificationSteps,
            "IDENTITY_VERIFICATION"
          ) === true &&
            regtankStatus?.status === undefined)
        ) {
          setCurrentSate(2, dispatch);
        } else if (
          checkStepStatus(user?.waitingVerificationSteps, "DOCUMENTS") === true
        ) {
          setCurrentSate(3, dispatch);
        } else {
          setCurrentSate(5, dispatch);
        }
      }
    }
  };

  const transformDocumentObjectToArray = (documentObject) => {
    const transformedArray = [];

    Object.entries(documentObject).forEach(([documentType, { file }]) => {
      if (file !== undefined && file !== null) {
        transformedArray.push(file);
      }
    });
    return transformedArray;
  };

  const transformInToSingleArray = (documentObject) => {
    return Object.values(documentObject).flat();
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
          }  ${current !== 1 && "sb-stepper-kilde-item"}`}
          onClick={() => onChangeStep(1)}
        >
          <div>
            <span>Personal Details</span>
          </div>
        </div>
      ),

      status:
        current === 1
          ? "process"
          : checkStepStatus(
              user?.waitingVerificationSteps,
              "PERSONAL_DETAILS"
            ) === true
          ? "warning"
          : checkStepStatus(
              user?.waitingVerificationSteps,
              "PERSONAL_DETAILS"
            ) === false && "finish",
    },

    {
      title: (
        <div
          className={`sb-flex ${
            current === 2 && "sb-stepper-kilde-item-active"
          }  ${current !== 2 && "sb-stepper-kilde-item"} `}
          onClick={() => onChangeStep(2)}
        >
          <div>
            <span>Identity Verification</span>
          </div>
        </div>
      ),

      status:
        current === 2
          ? "process"
          : [
              "EMAIL_SENT",
              "RESUBMISSION",
              "LIVENESS_FAILED",
              "REJECTED",
              "EXPIRED",
              "ID_UPLOADED_FAILED",
              "ID_UPLOADED",
            ].includes(regtankStatus?.status) ||
            (checkStepStatus(
              user?.waitingVerificationSteps,
              "IDENTITY_VERIFICATION"
            ) === true &&
              regtankStatus?.status === undefined)
          ? "warning"
          : [
              "LIVENESS_PASSED",
              "APPROVED",
              "WAIT_FOR_APPROVAL",
              null,
              "Score Generated",
            ].includes(regtankStatus?.status) ||
            checkStepStatus(
              user?.waitingVerificationSteps,
              "IDENTITY_VERIFICATION"
            ) === false
          ? "finish"
          : "",
    },

    {
      title: (
        <div
          className={`sb-flex ${
            current === 3 && "sb-stepper-kilde-item-active"
          }  ${current !== 3 && "sb-stepper-kilde-item"} `}
          onClick={() => onChangeStep(3)}
        >
          <div>
            <span>Proof of Address</span>
          </div>
        </div>
      ),
      status:
        current === 3
          ? "process"
          : checkStepStatus(user?.waitingVerificationSteps, "DOCUMENTS") ===
            true
          ? "warning"
          : checkStepStatus(user?.waitingVerificationSteps, "DOCUMENTS") ===
            false
          ? "finish"
          : "",
    },
    {
      title: (
        <div
          className={`sb-flex ${
            current === 4 && "sb-stepper-kilde-item-active"
          }  ${current !== 4 && "sb-stepper-kilde-item"} `}
          onClick={() => onChangeStep(4)}
        >
          <div>
            <span>Investor Status Confirmation</span>
          </div>
        </div>
      ),
      status:
        current === 4
          ? "process"
          : checkStepStatus(
              user?.waitingVerificationSteps,
              "PROOF_OF_ACCREDITATION"
            ) === true
          ? "warning"
          : checkStepStatus(
              user?.waitingVerificationSteps,
              "PROOF_OF_ACCREDITATION"
            ) === false
          ? "finish"
          : "",
    },
  ];

  const sinngPassStepItem = [
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
            <span>Investor Status Confirmation</span>
          </div>
        </div>
      ),
      status:
        current === 1
          ? "process"
          : checkStepStatus(
              user?.waitingVerificationSteps,
              "PROOF_OF_ACCREDITATION"
            ) === true
          ? "warning"
          : checkStepStatus(
              user?.waitingVerificationSteps,
              "PROOF_OF_ACCREDITATION"
            ) === false
          ? "finish"
          : "",
    },
  ];

  const handleCloseRisktagModal = async () => {
    setIdentifyProofDetails("", dispatch);
    setHasWarningTags(false);
  };

  const handlePreviousStep = async () => {
    if (
      current === 2 &&
      (regtankStatus?.status === "ID_UPLOADED" ||
        regtankStatus?.status === "LIVENESS_FAILED") &&
      showIdv === "hideIdv"
    ) {
      onChangeStep(current);
      setShowIdv("showIdv");
    } else if (
      showIdv === "showIdv" &&
      current === 2 &&
      regtankStatus?.status === "ID_UPLOADED"
    ) {
      onChangeStep(current - 1);
      setShowIdv("hideIdv");
    } else {
      setShowIdv("hideIdv");
      onChangeStep(current - 1);
    }
  };

  const handle2Faupdate = async () => {
    setTwofaLoader(true);
    const requestBody = {
      ...personalInformation?.data,
    };

    try {
      const response = await updatePersonalInfo(requestBody);
      if (Object.keys(response)?.length > 0) {
        setTwofaLoader(false);
      } else {
        await getPersonalDetails();
        await getUserDetails();
        // setTwoFaModal(true);
        setTwofaLoader(false);
        setMobileUpdate(false);
        window?.dataLayer?.push({
          event: "PersonalDetailsSubmission",
          user_id: user?.number,
          register_method: user?.registrationType,
        });
        const eventData = {
          gaClientId: get_ga_clientid(),
          action: "personalData",
          category: "registration",
        };
        eventsApi(eventData);
      }
    } catch (error) {
      setTwofaLoader(false);
      console.log("Error:", error);
    }
  };

  const handleCancel = () => {
    setTwofaLoader(true);
    setPersonalInfoDetails(
      {
        data: {
          ...personalInformation?.data,
          mobileNumber: user?.mobilePhone,
        },
        validator: {
          ...personalInformation?.validator,
        },
      },
      dispatch
    );
    setMobileUpdate(false);
    setTwofaLoader(false);
  };

  return (
    <>
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
                      <Steps
                        current={current}
                        onChange={(step) => onChangeStep(step)}
                        direction="vertical"
                        items={
                          user?.singpassUser === true
                            ? sinngPassStepItem
                            : stepItems
                        }
                        className="stepper-killed"
                      />
                    </div>
                  </div>
                </div>
                <div className="sb-stepper-progress stepper-div media-stepper-margin">
                  <div className="stepper-right">
                    <Progress percent={progress} status="active" />
                    <div className="sb-verification-content-container">
                      <RenderComponent current={current} showIdv={showIdv} />
                      <div
                        className={current === 5 ? "d-none" : "stepper-btn-div"}
                      >
                        {current !== 0 ? (
                          <Button
                            style={{
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            className="prev-btn mr-10"
                            onClick={handlePreviousStep}
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

                        {RedirectionToVeriff(user) === true &&
                        current === 2 &&
                        checkStepStatus(
                          user?.waitingVerificationSteps,
                          "IDENTITY_VERIFICATION"
                        ) === false ? (
                          <ButtonDefault
                            style={{
                              width: 130,
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title={
                              <span className="sb-next-button-span">
                                Next step{" "}
                                <img
                                  src={Right_arrow}
                                  alt="right_arrow"
                                  className="ml-5 "
                                />
                              </span>
                            }
                            onClick={() => {
                              onChangeStep(current, "continue");
                            }}
                            loading={loader}
                          />
                        ) : RedirectionToVeriff(user) === true &&
                          current === 2 ? null : (
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
                              (user?.singpassUser === false
                                ? checkStepStatus(
                                    user?.waitingVerificationSteps,
                                    "IDENTITY_VERIFICATION"
                                  ) === false && current === 1
                                : checkStepStatus(
                                    user?.waitingVerificationSteps,
                                    "PROOF_OF_ACCREDITATION"
                                  ) === false && current === 1) ||
                              (checkStepStatus(
                                user?.waitingVerificationSteps,
                                "PERSONAL_DETAILS"
                              ) === false &&
                                user?.singpassUser === false &&
                                current === 1) ||
                              (([
                                "LIVENESS_PASSED",
                                "APPROVED",
                                "WAIT_FOR_APPROVAL",
                                "Score Generated",
                                null,
                              ].includes(regtankStatus?.status) ||
                                (regtankStatus?.status === null &&
                                  regtankStatus?.livenessCheckInfo
                                    ?.verifyStatus === "LIVENESS_PASSED") ||
                                regtankStatus?.status === "COMPLETED" ||
                                regtankStatus?.status === "REJECTED" ||
                                checkStepStatus(
                                  user?.waitingVerificationSteps,
                                  "IDENTITY_VERIFICATION"
                                ) === false) &&
                                user?.singpassUser === false &&
                                current === 2) ||
                              (checkStepStatus(
                                user?.waitingVerificationSteps,
                                "DOCUMENTS"
                              ) === false &&
                                user?.singpassUser === false &&
                                current === 3) ||
                              (checkStepStatus(
                                user?.waitingVerificationSteps,
                                "PROOF_OF_ACCREDITATION"
                              ) === false &&
                                user?.singpassUser === false &&
                                current === 4) ? (
                                <span className="sb-next-button-span">
                                  Next step{" "}
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
                        )}
                        {current === 0 ||
                        current === 1 ||
                        current === 4 ||
                        (checkStepStatus(
                          user?.waitingVerificationSteps,
                          "PERSONAL_DETAILS"
                        ) === false &&
                          checkStepStatus(
                            user?.waitingVerificationSteps,
                            "IDENTITY_VERIFICATION"
                          ) === false &&
                          current === 1) ||
                        (checkStepStatus(
                          user?.waitingVerificationSteps,
                          "PERSONAL_DETAILS"
                        ) === false &&
                          current === 1) ||
                        (checkStepStatus(
                          user?.waitingVerificationSteps,
                          "DOCUMENTS"
                        ) === false &&
                          current === 3) ||
                        (((regtankStatus?.status === null &&
                          regtankStatus?.livenessCheckInfo?.verifyStatus ===
                            "LIVENESS_PASSED") ||
                          regtankStatus?.status === "COMPLETED" ||
                          regtankStatus?.status === "APPROVED" ||
                          regtankStatus?.status === "REJECTED" ||
                          regtankStatus?.status === "WAIT_FOR_APPROVAL") &&
                          current === 2) ||
                        (checkStepStatus(
                          user?.waitingVerificationSteps,
                          "IDENTITY_VERIFICATION"
                        ) === false &&
                          current === 2) ? (
                          ""
                        ) : current === 2 &&
                          (regtankStatus?.status === "ID_UPLOADED" ||
                            regtankStatus?.status === "LIVENESS_FAILED") &&
                          showIdv === "showIdv" ? (
                          <Button type="link" className="doitlater-media">
                            <b
                              className="sb-link-button"
                              onClick={() => {
                                setShowIdv("hideIdv");
                              }}
                            >
                              Next step
                            </b>
                          </Button>
                        ) : (
                          <Button type="link" className="doitlater-media">
                            <b
                              className="sb-link-button"
                              onClick={() => {
                                onChangeStep(current + 1);
                              }}
                            >
                              Do it later
                            </b>
                          </Button>
                        )}
                        {current === 4 ? (
                          <Button type="link" className="doitlater-media">
                            <b
                              className="sb-link-button"
                              onClick={() => navigate(ROUTES.TRANCH_LISTING)}
                            >
                              Return to the onboarding later
                            </b>
                          </Button>
                        ) : null}
                      </div>
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
          centered
          open={hasWarningTags}
          onCancel={handleCloseRisktagModal}
          footer={null}
          maskClosable={false}
          className="riskTag-modal"
        >
          <div>
            <div className="align-start sb-flex mb-20">
              <img src={WarningIcon} alt="warn-icon" className="mr-5" />
              <p className="m-0 modal-head">Image Invalid. Please reupload!</p>
            </div>

            <div>
              {riskTags.length > 0 &&
                riskTags.map((tag, index) => (
                  <div key={index}>
                    <ul className="list-ul">
                      <li>
                        <p style={{ fontSize: 14, fontWeight: 500 }}> {tag}</p>
                      </li>
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </Modal>

        <Modal
          open={mobileUpdate}
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
              Changing your registered mobile number will compromise your 2FA
              security. To activate 2FA on your new number, you'll need to
              verify it with an OTP. Confirm to proceed or cancel the change.
            </p>
          </div>
          <div className="sb-text-align d-flex">
            <Button
              className="remove-modal-back-btn mr-8 w-100"
              onClick={handleCancel}
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
      </DashboardLayout>
    </>
  );
};
export default VerificationStepperPage;
