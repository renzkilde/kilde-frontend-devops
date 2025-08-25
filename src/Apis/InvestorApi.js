import API_ROUTES from "../Config/ApiRoutes";
import { apiHandler, getOSAndBrowser } from "../Utils/Helpers";
import { REQUEST_METHODS, EMPTY_ARRAY } from "../Utils/Constant";
import { notification } from "antd";
import axios from "axios";
import { showMessageWithCloseIconError } from "../Utils/Reusables";

// NEW JAVA APIS INTEGARTION START

export const RerefenceProofOfAddressUploadApi = async (data) => {
  try {
    const url = API_ROUTES.KYC_INDIVIDUAL.REFERENCE_PROOF_OF_ADDRESS;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getRerefenceProofOfAddressApi = async () => {
  try {
    const url = API_ROUTES.KYC_INDIVIDUAL.GET_REFERENCE_PROOF_OF_ADDRESS;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const RerefenceProofOfAccrediationApi = async (data) => {
  try {
    const url = API_ROUTES.KYC_INDIVIDUAL.REFERENCE_PROOF_OF_ACCREDIATION;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const getRerefenceProofOfAccrediationApi = async (data) => {
  try {
    const url = API_ROUTES.KYC_INDIVIDUAL.GET_REFERENCE_PROOF_OF_ACCREDIATION;
    const result = await apiHandler(REQUEST_METHODS.GET, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

//END JAVA APIS

export const updateUser = async (data) => {
  try {
    const url = API_ROUTES.USER.ONBOARD;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result.data;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const updateCompanyInformation = async (data) => {
  try {
    const url = API_ROUTES.KYB_ORGANIZATION.COMPANY_INFORMATION;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result.data;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getCompanyInformation = async () => {
  try {
    const url = API_ROUTES.KYB_ORGANIZATION.GET_COMPANY_INFORMATION;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const updateKycInvestor = async (data) => {
  try {
    const url = API_ROUTES.USER.UPDATE_KYC_STATUS;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const updatePersonalInfo = async (data) => {
  try {
    const url = API_ROUTES.USER.PERSONAL_INFO;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getPersonalInfo = async () => {
  try {
    const url = API_ROUTES.USER.GET_PERSONAL_INFO;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const getCountryWithholdingTax = async (country) => {
  try {
    const url = `/api/investor/wht-info?countryCode=${country}`;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const submitInvestorQuestionnaire = async (data) => {
  try {
    const url = API_ROUTES.USER.INVESTOR_QUESTIONNAIRE;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const confirmInvestorQuestionnaire = async () => {
  try {
    const url = API_ROUTES.USER.CONFIRM_INVESTOR_QUESTIONNAIRE;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getInvestorQuestionnaire = async () => {
  try {
    const url = API_ROUTES.USER.GET_INVESTOR_QUESTIONNAIRE;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const createKycSingpassUser = async (data) => {
  try {
    const url = API_ROUTES.USER.KYC_SINGPASS;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const InvestorVerification = async (data) => {
  try {
    const url = API_ROUTES.USER.ONBOARD;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result.data;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const livenessRequest = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      axios
        .post(`/api/investor/liveness/request`, data, headers)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          const statusText = err?.response?.data?.success;
          const errorMessage = err?.response?.data?.message || err?.errorMsg;
          notification.error({
            type: "error",
            message: errorMessage,
            duration: 8,
          });
          reject({ errorMessage, statusText });
        });
    } catch (error) {
      notification.error({
        type: "error",
        message: error.message?.replace("Error", ""),
        duration: 8,
      });
      reject(error.message?.replace("Error", ""));
    }
  });
};

export const documentUpload = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      axios
        .post(`/api/investor/liveness/document-upload`, data, headers)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          console.error("Error uploading document", err);
          const statusText = err?.response?.data?.errorCode;
          const errorMessage = err?.response?.data?.errorMsg;
          if (err?.response?.status === 400) {
            reject({ errorMessage, statusText });
          }
          if (errorMessage) {
            notification.error({
              type: "error",
              message: "Sorry, it seems like you didn't upload the correct ID",
              description:
                errorMessage ===
                "Face is not found on the front page of the passport. Please upload with the correct photo."
                  ? "We couldn't find your face photo in the document. Please check and try again with the correct document."
                  : errorMessage,
              duration: 8,
            });
          } else if (
            err?.response?.data?.statusCode === 500 &&
            err?.response?.data?.message === "request entity too large"
          ) {
            notification.error({
              type: "error",
              message: "Ops! Error occured.",
              description:
                "Uploaded documents are too large, Please upload images with a min 500pixels x 500pixels and max 8192 pixels x 8192 pixels.",
              duration: 8,
            });
          } else {
            notification.error({
              type: "error",
              message: "Error",
              description:
                "Ops! something went wrong. Please try again after some time!",
              duration: 8,
            });
          }
          reject({ errorMessage, statusText });
        });
    } catch (error) {
      showMessageWithCloseIconError(error.message?.replace("Error", ""));
      reject(error.message?.replace("Error", ""));
    }
  });
};

export const statusCheck = async (data) => {
  try {
    const url = API_ROUTES.KYC_INDIVIDUAL.STATUS_CHECK;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const updateEmail = async (data) => {
  try {
    const url = API_ROUTES.USER.UPDATE_EMAIL;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const updateEmailVerification = async () => {
  try {
    const url = API_ROUTES.USER.EMAIL_VERIFICATION;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result.data;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getSystemId = async () => {
  try {
    const url = API_ROUTES.USER.GET_SYSTEM_ID;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getPassKeyChallenge = async () => {
  try {
    const url = API_ROUTES.USER.GET_PASSKEY_CHALLENGE;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const registerPasskey = async (data) => {
  try {
    const url = API_ROUTES.USER.REGISTER_PASSKEY;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {
      device: await getOSAndBrowser(),
      ...data,
    });
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getLoginPassKeyChallenge = async (data) => {
  try {
    const url = API_ROUTES.USER.GET_LOGIN_PASSKEY_CHALLENGE;
    const result = await apiHandler(REQUEST_METHODS.GET, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const loginPasskey = async (data) => {
  try {
    const url = API_ROUTES.USER.LOGIN_PASSKEY;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getPassKeyToggleStatus = async (data) => {
  try {
    const url = API_ROUTES.USER.TOGGLE_PASSKEY_STATUS;
    const result = await apiHandler(REQUEST_METHODS.GET, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const suppress2faPrompt = async (data) => {
  try {
    const url = API_ROUTES.USER.SUPRESS_PROMPT;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
