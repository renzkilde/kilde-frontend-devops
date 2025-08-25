import API_ROUTES from "../Config/ApiRoutes";
import { apiHandler, withoutTokenApiHandler } from "../Utils/Helpers";
import { REQUEST_METHODS, EMPTY_ARRAY } from "../Utils/Constant";

// NEW JAVA APIS INTEGARTION START
export const RegisterApi = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.REGISTER;
    const result = await withoutTokenApiHandler(
      REQUEST_METHODS.POST,
      url,
      data
    );
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const GoogleRegisterApi = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.GOOGLE_REGISTER;
    const result = await withoutTokenApiHandler(
      REQUEST_METHODS.POST,
      url,
      data
    );
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const GoogleLoginApiWithCode = async (data) => {
  try {
    const url = `${API_ROUTES.ONBOARDING_AUTH.GOOGLE_LOGIN}?authCode=${data}`;
    const result = await withoutTokenApiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const GoogleSignInApi = async (accessTokenParams) => {
  try {
    const url = `${API_ROUTES.ONBOARDING_AUTH.GOOGLE_LOGIN}?idToken=${accessTokenParams}`;
    const result = await withoutTokenApiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const RegisterSingpassApi = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.SINGPASS_REGISTER;
    const result = await withoutTokenApiHandler(
      REQUEST_METHODS.POST,
      url,
      data
    );
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const LoginApi = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.LOGIN;
    const result = await withoutTokenApiHandler(
      REQUEST_METHODS.POST,
      url,
      data
    );
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const emailVerification = async () => {
  try {
    const url = API_ROUTES.USER.EMAIL_VERIFICATION;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const verifyEmail = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.EMAIL_VERIFY;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const eventsApi = async (data) => {
  try {
    const url = API_ROUTES.GA_CLIENT.EVENT;
    const result = await withoutTokenApiHandler(
      REQUEST_METHODS.POST,
      url,
      data
    );
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const twoFaInit = async () => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.TWO_FA_INIT;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const setupSms = async () => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.SETUP_SMS;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const setupTotp = async () => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.SETUP_TOTP;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const enableSMS = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.ENABLE_SMS;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const enableTOTP = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.ENABLE_TOTP;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const updateMobileNo = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.UPDATE_MOBILE;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const sendResetEmailLink = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.RESET_PASSWORD;
    const result = await withoutTokenApiHandler(
      REQUEST_METHODS.POST,
      url,
      data
    );
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const validateResetPassword = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.VALIDATE_RESET_PASSWORD;
    const result = await withoutTokenApiHandler(
      REQUEST_METHODS.POST,
      url,
      data
    );
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const confirmPasswordReset = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.CONFIRM_RESET_PASSWORD;
    const result = await withoutTokenApiHandler(
      REQUEST_METHODS.POST,
      url,
      data
    );
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const twoFaAuth = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.TWO_FA_AUTH;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

// END NEW JAVA APIS INTEGARTION

export const OtpVerified = async (data) => {
  try {
    const url = API_ROUTES.USER.OTP_VERIFICATION;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result.data;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const generateToken = async (data) => {
  try {
    const url = API_ROUTES.USER.GENERATE_TOKEN;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result.data;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const migrateUser = async (data) => {
  try {
    const url = API_ROUTES.USER.MIGRATE_USER;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getUser = async (data) => {
  try {
    const url = API_ROUTES.USER.ONBOARD;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getSingPassUserData = async (data) => {
  try {
    const url = API_ROUTES.USER.SINGPASS_USER_DATA;
    const result = await withoutTokenApiHandler(
      REQUEST_METHODS.POST,
      url,
      data
    );
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const getSignPassConfig = async () => {
  try {
    const url = API_ROUTES.USER.SINGPASS_CONFIG;
    const result = await withoutTokenApiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const generateSignpassCode = async () => {
  try {
    const url = API_ROUTES.USER.SINGPASS_CODE;
    const result = await withoutTokenApiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const changePassword = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.CHANGE_PASSWORD;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const AdditionalDocumentUploadApi = async (data) => {
  try {
    const url = API_ROUTES.USER.ADDITIONAL_DOC_UPLOAD;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const GetVerificationSteps = async () => {
  try {
    const url = API_ROUTES.USER.GET_VERIFICATION_STEPS;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const PreferredAppUser = async () => {
  try {
    const url = `${API_ROUTES.USER.PREFRRED_APP_USER}?prefredUserApp=vue`;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const MigrationUser = async () => {
  try {
    const url = `${API_ROUTES.USER.MIGRATION_USER}?hasSeenMigrationScreen=true`;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const productTourUpdate = async () => {
  try {
    const url = `${API_ROUTES.USER.PRODUCT_TOUR_UPDATE}?hasSeenProductTour=true`;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const updateAddress = async (data) => {
  try {
    const url = API_ROUTES.USER.UPDATE_ADDRESS;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const recordFeatures = async () => {
  try {
    const url = API_ROUTES.SYSTEM_FEATURES.SYSTEM_FEATURE;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const sendVerificationCode = async () => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.SEND_VERIFICATION_CODE;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const sendVerificationCode2FA = async () => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.SEND_VERIFICATION_SMS;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const authenticateCode = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.AUNTHENTICATE_CODE;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const authenticateCodeNon2FA = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.AUNTHENTICATE_CODE_2FA;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const enableSMS2FA = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.ENABLE_SMS_2FA;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const deletePasskey = async (data) => {
  try {
    const url = API_ROUTES.ONBOARDING_AUTH.DELETE_PASSKEY + data;
    const result = await apiHandler(REQUEST_METHODS.POST, url);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const editPasskey = async (data) => {
  console.log(data);

  try {
    const url = API_ROUTES.ONBOARDING_AUTH.EDIT_PASSKEY;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const sendGATrancheInvestor = async (data) => {
  try {
    const url = API_ROUTES.USER.GA_TRANCHE_INVESTOR_CLICK;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const getNoteOfAcceptance = async (data) => {
  try {
    const url = `${API_ROUTES.USER.NOTE_OF_ACCEPTANCE}?fileType=${data}`;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
