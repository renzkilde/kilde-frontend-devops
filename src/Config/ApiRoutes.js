const USER = {
  READ: "/api/investor/user",
  ONBOARD: "/api/investor/profile",
  OTP_VERIFICATION: "/api/investor/verify-token",
  GENERATE_TOKEN: "/api/investor/generate-secret",
  MIGRATE_USER: "/api/investor/migrate",
  EMAIL_VERIFICATION: "/api/investor/registration/send-verification-email",
  UPDATE_EMAIL: "/api/investor/update-email",
  SINGPASS_USER_DATA: "/api/investor/public/singpass/get-personal-data",
  SINGPASS_CONFIG: "/api/investor/public/singpass/config",
  SINGPASS_CODE: "/api/investor/public/singpass/generate-code-challenge",
  KYC_SINGPASS: "/api/investor/create-kyc",
  UPDATE_KYC_STATUS: "/api/investor/kyc-status",
  INVESTOR_QUESTIONNAIRE:
    "/api/investor/v2/registration/submit-investor-questionnaire",
  CONFIRM_INVESTOR_QUESTIONNAIRE:
    "/api/investor/registration/confirm-investor-questionnaire",
  GET_INVESTOR_QUESTIONNAIRE: "/api/investor/questionnaire/details",
  PERSONAL_INFO: "/api/investor/v2/registration/personal",
  GET_PERSONAL_INFO: "/api/investor/public/v2/personal-details",
  GET_SYSTEM_ID: "/api/investor/get/systemId",
  ADDITIONAL_DOC_UPLOAD: "/api/investor/profile/document",
  GET_VERIFICATION_STEPS: "/api/investor/public/getVerificationSteps",
  PREFRRED_APP_USER: "/api/investor/save/prefredApp",
  MIGRATION_USER: "/api/investor/save/migration-screen-info",
  PRODUCT_TOUR_UPDATE: "/api/investor/save/seenProductTour",
  UPDATE_ADDRESS: "/api/investor/update/address-info",
  GA_TRANCHE_INVESTOR_CLICK: "/api/investor/marketing/analytics-event",
  REGISTER_PASSKEY: "/api/investor/passkey/register",
  GET_LOGIN_PASSKEY_CHALLENGE: "/api/investor/public/login/get-challenge",
  GET_PASSKEY_CHALLENGE: "/api/investor/passkey/register-challenge",
  LOGIN_PASSKEY: "/api/investor/public/login/verify-challenge",
  TOGGLE_PASSKEY_STATUS: "/api/investor/public/passkey/feature/toggle",
  NOTE_OF_ACCEPTANCE: "/api/investor/profile/attachments",
  SUPRESS_PROMPT: "/api/investor/passkey/suppress-2fa-prompt",
};

const KYC_INDIVIDUAL = {
  IDENTIFY_VERIFICATION: "/api/investor/onboard/identity-verification",
  ADDRESS_PHONE: "/api/investor/onboard/address",
  LEGAL_SIGNER: "/api/investor/onboard/legal-info",
  LIVENESS_REQUEST: "/api/investor/liveness/request",
  DOC_UPLOAD: "/api/v2/guest/upload",
  REFERENCE_PROOF_OF_ADDRESS: "/api/investor/v2/registration/documents",
  GET_REFERENCE_PROOF_OF_ADDRESS: "/api/investor/address/doc/references",
  REFERENCE_PROOF_OF_ACCREDIATION: "/api/investor/registration/poi-documents",
  GET_REFERENCE_PROOF_OF_ACCREDIATION:
    "/api/investor/acceridation/doc/references",
  UPLOAD_VIDEO: "/api/investor/liveness/check",
  STATUS_CHECK: "/api/investor/liveness/status-check",
  GET_RISKTAG: "/api/investor/regtank/onboarding/details",
};

const KYB_ORGANIZATION = {
  COMPANY_INFORMATION: "/api/investor/registration/companyInfo",
  GET_COMPANY_INFORMATION: "/api/investor/company-info",
};

const ONBOARDING_AUTH = {
  LOGIN: "/api/investor/public/v2/login",
  REGISTER: "/api/investor/public/v2/sign-up",
  GOOGLE_REGISTER: "/api/investor/public/signup/google",
  GOOGLE_LOGIN: "/api/investor/public/login/google",
  SINGPASS_REGISTER: "/api/investor/public/v2/fast-sign-up",
  EMAIL_VERIFY: "/api/investor/public/v2/verify-email",
  TWO_FA_INIT: "/api/investor/2fa/init",
  RESET_PASSWORD: "/api/investor/public/send-reset-password-link",
  VALIDATE_RESET_PASSWORD: "/api/investor/public/validate-reset-password-token",
  CONFIRM_RESET_PASSWORD: "/api/investor/public/reset-password",
  TWO_FA_AUTH: "/api/investor/2fa/authenticate",
  SETUP_SMS: "/api/investor/setup-sms",
  ENABLE_SMS: "/api/investor/enable-sms",
  SETUP_TOTP: "/api/investor/setup-totp",
  ENABLE_TOTP: "/api/investor/enable-totp",
  CHANGE_PASSWORD: "/api/investor/profile/change-password",
  UPDATE_MOBILE: "/api/investor/setup-mobile",
  SEND_VERIFICATION_CODE: "/api/investor/update/send-verification-code",
  AUNTHENTICATE_CODE: "/api/investor/update/verify-code",
  SEND_VERIFICATION_SMS: "/api/investor/passkey/send-verification-sms",
  AUNTHENTICATE_CODE_2FA: "/api/investor/passkey/verify-sms",
  ENABLE_SMS_2FA: "/api/investor/passkey/enable-sms",
  DELETE_PASSKEY: "/api/investor/passkey/delete/",
  EDIT_PASSKEY: "/api/investor/passkey/edit-name",
};

const DASHBOARD = {
  DASHBOARD: "/api/investor/dashboard",
  TRANCHE_NO_OF_ACCEPTANCE: "/api/investor/tranche/note-of-acceptance-preview",
  BOND_PURCHASE_CONDITION_DOWNLOAD: "/api/investor/tranche/seller-note-of-acceptance-preview",
  TRANCH_LISTING: "/api/investor/v2/tranche-listing",
  PAST_TRANCHE_LISTING: "/api/investor/past-deals-tranche-listing",
  NEW_TRANCHE_LISTING: "/api/investor/new-deals-tranche-listing",
  INVEST_TRANCHE: "/api/investor/tranche",
  TRANCHE_UNSUBSCRIBE: "/api/investor/tranche/unsubscribe",
  CURRENCY_EXCHANGE: "/api/investor/request-currency-exchange",
  INVEST: "/api/investor/tranche/calculate-offer",
  COMMIT_INVEST: "/api/investor/tranche/subscribe",
  CANCEL_INVEST: "/api/investor/tranche/unsubscribe",
  CAPITAL_CALL_REQUEST_LIST: "/api/investor/tranche/capital-call-requests",
  CAPITAL_CALL_REQUEST: "/api/investor/tranche/request-capital-call",
  CANCEL_CAPITAL_CALL: "/api/investor/tranche/cancel-capital-call",
  CANCEL_BOND_SELL: "/api/investor/tranche/cancel-sell-order",
  INVESTMENT_SUMMARY: "/api/investor/portfolio/investment",
  ACCOUNT_STATEMENT_SUMMARY: "/api/investor/account-statement",
  ACCOUNT_STATEMENT_SUMMARY_DOWNLOAD:
    "/api/investor/account-statement/download",
  ACCOUNT_STATEMENT_SUMMARY_DOWNLOAD_PDF:
    "/api/investor/account-statement/download-pdf",
  RESERVED_INVESTMENT: "/api/investor/portfolio/reserved",
};

const AUTO_INVESTMENT = {
  STRATERGY_SETTINGS: "/api/investor/autoinvestment/strategy-settings",
  GET_AVAILABLE_INVESTMENT:
    "/api/investor/autoinvestment/available-investments",
  CREATE_STRATERGY: "/api/investor/autoinvestment/strategy",
  EDIT_STRATEGY: "/api/investor/autoinvestment/strategy",
  AUTO_INVESTMENT_LISTING: "/api/investor/v2/autoinvestment",
  STRATEGY_ACCEPTANCE_DOWNLOAD:
    "/api/investor/autoinvestment/strategy/note-of-acceptance-preview",
};

const GA_CLIENT = {
  EVENT: "/api/investor/public/events",
};

const WALLET = {
  ADD_BANK: "/api/investor/registration/bank-account-details",
  UPDATE_BANK_ACCOUNT: "/api/investor/update/bank-account-details",
  GET_BANK_ACCOUNT: "/api/investor/bank-accounts",
  REQUEST_WITHDRAWAL: "/api/investor/request-withdrawal",
  GET_WITHDRAWAL_REQUEST: "/api/investor/get/withdraw/request",
  CANCEL_WITHDRAWAL_REQUEST: "/api/investor/cancel/withdraw/request",
  CURRENCY_EXCHANGE_LIST: "/api/investor/get/currency-exchange-request",
  GET_QR: "/api/investor/profile/paynow/qr",
};

const VERIFF = {
  VERIFF_URL: "/api/investor/start-verification",
};

const NOTIFICATION = {
  GET_NOTIFICATION: "/api/investor/all-notifications",
  READ_ALL_NOTIFICATION: "/api/investor/mark-all-notification-as-read",
  READ_SINGLE_NOTIFICATION: "/api/investor/mark-notification-as-read",
};

const SYSTEM_FEATURES = {
  SYSTEM_FEATURE: "/api/guest/public/system-features",
};

const API_ROUTES = {
  USER,
  KYC_INDIVIDUAL,
  KYB_ORGANIZATION,
  ONBOARDING_AUTH,
  GA_CLIENT,
  DASHBOARD,
  WALLET,
  AUTO_INVESTMENT,
  VERIFF,
  NOTIFICATION,
  SYSTEM_FEATURES,
};

export default API_ROUTES;
