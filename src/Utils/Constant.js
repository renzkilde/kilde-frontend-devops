export const REQUEST_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

export const SIGNUP_METHODS = {
  MANUAL: "MANUAL",
  GOOGLE: "GOOGLE",
};

export const USER_TYPE = {
  INDIVIDUAL: "INDIVIDUAL",
  ORGANIZATION: "ORGANIZATION",
};

export const ONBOARDING_STAGES_INDIVIDUAL = {
  INVESTOR_CATEGORY: "INVESTOR_CATEGORY",
  INVESTOR_CATEGORY_COMPLETED: "INVESTOR_CATEGORY_COMPLETED",
  IDENTITY_VERIFICATION_DRAFT: "IDENTITY_VERIFICATION_DRAFT",
  IDENTITY_VERIFICATION_COMPLETED: "IDENTITY_VERIFICATION_COMPLETED",
  LIVELINESS_CHECK_DRAFT: "LIVELINESS_CHECK_DRAFT",
  LIVELINESS_CHECK_COMPLETED: "LIVELINESS_CHECK_COMPLETED",
  ADDRESS_DRAFT: "ADDRESS_DRAFT",
  ADDRESS_COMPLETED: "ADDRESS_COMPLETED",
  LEGAL_INFORMATION_DRAFT: "LEGAL_INFORMATION_DRAFT",
  LEGAL_INFORMATION_COMPLETED: "LEGAL_INFORMATION_COMPLETED",
  VERIFIED: "VERIFIED",
};

export const INVESTOR_VERIFICATION_STEP = {
  QUESTIONNAIRE: "QUESTIONNAIRE",
  PERSONAL_DETAILS: "PERSONAL_DETAILS",
  REGTANK: "REGTANK",
  VERIFF: "VERIFF",
  DOCUMENTS: "DOCUMENTS",
  PROOF_OF_ACCREDITATION: "PROOF_OF_ACCREDITATION",
};

export const ONBOARDING_STAGES_ORGANIZATION = {
  INVESTOR_CATEGORY_COMPLETED: "INVESTOR_CATEGORY_COMPLETED",
  ENTITY_INFORMATION_DRAFT: "ENTITY_INFORMATION_DRAFT",
  ENTITY_INFORMATION_COMPLETED: "ENTITY_INFORMATION_COMPLETED",
  ENTITY_ADDRESS_DRAFT: "ENTITY_ADDRESS_DRAFT",
  ENTITY_ADDRESS_COMPLETED: "ENTITY_ADDRESS_COMPLETED",
  ENTITY_DOCUMENTS_DRAFT: "ENTITY_DOCUMENTS_DRAFT",
  ENTITY_DOCUMENTS_COMPLETED: "ENTITY_DOCUMENTS_COMPLETED",
  LEGAL_SIGNERS_DRAFT: "LEGAL_SIGNERS_DRAFT",
  LEGAL_SIGNERS_COMPLETED: "LEGAL_SIGNERS_COMPLETED",
  REVIEW_DRAFT: "REVIEW_DRAFT",
  REVIEW_COMPLETED: "REVIEW_COMPLETED",
  VERIFIED: "VERIFIED",
};

export const ONBOARDING_INDIVIDUAL = {
  INVESTOR_VERIFICATION: "INVESTOR_VERIFICATION",
  PERSONAL_DETAILS_DRAFT: "PERSONAL_DETAILS_DRAFT",
  PERSONAL_DETAILS: "PERSONAL_DETAILS",
  IDENTITY_VERIFICATION_DRAFT: "IDENTITY_VERIFICATION_DRAFT",
  IDENTITY_VERIFICATION: "IDENTITY_VERIFICATION",
  PROOF_OF_ADDRESS_DRAFT: "PROOF_OF_ADDRESS_DRAFT",
  PROOF_OF_ADDRESS: "PROOF_OF_ADDRESS",
  PROOF_OF_ACCREDITATION_DRAFT: "PROOF_OF_ACCREDITATION_DRAFT",
  PROOF_OF_ACCREDITATION: "PROOF_OF_ACCREDITATION",
  TWO_FACTOR_DRAFT: "TWO_FACTOR_DRAFT",
  SUBMITTED: "SUBMITTED",
  VERIFIED: "VERIFIED",
};

export const EMPTY_ARRAY = [];

export const USER_FROM = {
  KILDE: "KILDE",
  SAFEBAY: "SAFEBAY",
};

export const ONBOARD_STEP_STATUS = {
  DRAFT: "DRAFT",
  COMPLETED: "COMPLETED",
  WAITING: "WAITING",
};

export const QUESTIONNAIRE = {
  kycQuestionAnnualIncome: "ANNUAL_INCOME_MORE_THAN_300K",
  kycQuestionPersonalAssets: "PERSONAL_ASSETS_MORE_THAN_2M",
  kycQuestionFinancialAssets: "FINANCIAL_ASSETS_MORE_THAN_1M",
  companyDirectlyCoversHoldingCMP: "COMPANY_DIRECT_COVERS_HOLDING_CMP",
  companyInvolvesDisposalHoldingCMP: "COMPANY_INVOLVES_DISPOSAL_HOLDING_CMP",
  kybQuestionCapitalMarketsServiceLicense: "CAPITAL_MARKETS_SERVICE_LICENSE",
  kybQuestionLicensedUnderTheFinanceCompaniesAct:
    "LICENSED_UNDER_THE_FINANACE_COMPANIES_ACT",
  kybQuestionSecuritiesandFuturesAct: "SECURITY_AND_FUTURE_ACT",
  kybQuestionNetAssets: "NET_ASSETS_EXEEDING_OR_EQUIVALENT_TO_10M",
  kybQuestionEntireShareCapitalIsOwnedByOneOrMorePersons:
    "ENTIRE_SHARE_CAPITAL_OWNED_BY_ONE_OR_MORE_PERSONS",
  notAccreditedInvestor: "NOT_ACCREDITED_INVESTOR",
  notExpertInvestor: "NOT_EXPERT_INVESTOR",
  notInstitutionalInvestor: "NOT_INSTITUTIONAL_INVESTOR"

};

export const INVESTOR_STATUS = {
  REGISTRATION: "REGISTRATION",
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  VERIFICATION: "VERIFICATION",
  COMPLETED: "COMPLETED",
  ACTIVE: "ACTIVE",
  REJECTED: "REJECTED",
};

export const REGTANK_STATE = {
  LIVENESS: "LIVENESS",
  KYC: "KYC",
  KYB: "KYB",
};
export const INVESTOR_TYPE = {
  ACCREDITED_INVESTOR: "ACCREDITED",
  EXPERT_INVESTOR: "EXPERT",
};

export const PDF = {
  TERM_OF_USE:
    "https://assets.website-files.com/61c1fc0c4b29a848ee7d2928/633149af2ffcde097e5b8fba_20220815_Terms%20of%20Use.pdf",
  PRIVACY_POLICY:
    "https://www.kilde.sg/privacy",
  COMPLAINT_POLICY:
    "https://cdn.prod.website-files.com/61c1fc0c4b29a848ee7d2928/6475ee65b4ee31f45bd7fb52_Kilde%20Complaints%20Policy.pdf",
};

export const CLIENT_ID = {
  GOOGLE_CLIENTID:
    "460413380813-9l0nhdfla1hea3ggcjd78q7rkjfuie45.apps.googleusercontent.com",
  APPLE_CLIENTID:
    "http://81217029264-4fifceq93m7cc3iruv42cu74f218u719.apps.googleusercontent.com",
};

export const LOGO_LINK = "https://kilde.sg/";

export const TRUST_PILOT = "https://www.trustpilot.com/review/kilde.sg";

export const CORPORATE_SURVEY_FORM =
  "https://rjpkoewsg2e.typeform.com/to/XQy1UrTj";

export const REGTANK_ERROR_MESSAGES = {
  FRONT_ID_TYPE_NOT_MATCH:
    " Front image Mismatch. Please upload with the correct photo.",
  BACK_ID_TYPE_NOT_MATCH:
    " Back image Mismatch. Please upload with the correct photo.",
  FRONT_BOUNDS_ERROR:
    " Part of the front image is cut off. Please ensure the entire document is within the image frame.",
  BACK_BOUNDS_ERROR:
    " Part of the back image is cut off. Please ensure the entire document is within the image frame.",
  FRONT_COLORNESS_ERROR:
    " Front image color too faint. Please ensure the document is well-lit and the colors are clear.",
  BACK_COLORNESS_ERROR:
    " Back image color too faint. Please ensure the document is well-lit and the colors are clear.",
  FRONT_FOCUS_ERROR:
    " Front image is blurry. Please take a clearer photo where all text and images are sharp.",
  BACK_FOCUS_ERROR:
    " Back image is blurry. Please take a clearer photo where all text and images are sharp.",
  FRONT_GLARES_ERROR:
    " Glare detected on front image. Please retake the photo without any glare obscuring the document.",
  BACK_GLARES_ERROR:
    " Glare detected on back image. Please retake the photo without any glare obscuring the document.",
  FRONT_RESOLUTION_ERROR:
    " Low resolution on front image. Please use a higher resolution camera for clearer details.",
  BACK_RESOLUTION_ERROR:
    " Low resolution on back image. Please use a higher resolution camera for clearer details.",
  FRONT_PERSPECTIVE_ERROR:
    " Incorrect angle on front image. Please capture the document from a direct, top-down perspective.",
  BACK_PERSPECTIVE_ERROR:
    " Incorrect angle on back image. Please capture the document from a direct, top-down perspective.",
  FRONT_SCREEN_CAPTURE_ERROR:
    " Screen capture of front image detected. Please only use the image of the original document.",
  BACK_SCREEN_CAPTURE_ERROR:
    " Screen capture of back image detected. Please only use the image of the original document.",
  MISSING_DOCUMENT_NUMBER:
    " Document/Passport number not captured. Please ensure all required fields are visible and clear.",
  MISSING_SURNAME_AND_GIVEN_NAMES:
    " Surname and given names not captured. Please ensure all required fields are visible and clear.",
  MISSING_DATE_OF_BIRTH:
    " Date of birth not captured. Please ensure all required fields are visible and clear.",
};

export const menuLabels = {
  invest: "Invest",
  whyKilde: "Why Kilde",
  platform: "Platform",
  company: "Company",
  insights: "Insights",
};

export const INVESTOR_CATEGORY = {
  INDIVIDUAL: "https://www.kilde.sg/",
  FAMILY_OFFICE: "https://www.kilde.sg/familyoffice",
  MONT_KILDE_FUND: "https://mont.kilde.sg",
}

export const WHY_KILDE = {
  BEAT_INFLATION: "https://www.kilde.sg/investing/beat-inflation",
  MONTHLY_INCOME: "https://www.kilde.sg/investing/monthly-passive-income",
  PUT_IDLE_MONEY_TO_WORK: "https://www.kilde.sg/investing/put-idle-cash-to-work",
  PORTFOLIO_RETURN: "https://www.kilde.sg/investing/smoothen-portfolio-returns",
  IMPACT_ON_LIVES: "https://www.kilde.sg/investing/make-an-impact-on-lives",
  COMPARE_KILDE: "https://www.kilde.sg/comparisons/kilde-vs-endowus-comparison",
  KILDE_VS_SYFE: "https://www.kilde.sg/comparisons/kilde-vs-syfe-income-plus-comparison",
  KILDE_VS_CHOCOLATE: "https://www.kilde.sg/comparisons/kilde-vs-chocolate-finance-comparison",
  KILDE_VS_STASHAWAY: "https://www.kilde.sg/comparisons/kilde-vs-syfe-income-plus-comparison",
  STATISTICS: "https://www.kilde.sg/statistics",
  SECURITY: "https://www.kilde.sg/security",
};

export const COMPANY = {
  ABOUT: "https://www.kilde.sg/about",
  TEAM: "https://www.kilde.sg/team",
  CONTACT: "https://www.kilde.sg/contacts"
}

export const INSIGHTS = {
  BASIC_INVESTING: "https://www.kilde.sg/news-and-insights/basics-of-investing",
  REVIEW: "https://www.kilde.sg/news-and-insights/reviews-comparisons",
  INSIGHT: "https://www.kilde.sg/news-and-insights/insights",
  KILDE_PRESS: "https://www.kilde.sg/news-and-insights/in-the-press",
  VIDEO_HUB: "https://www.kilde.sg/news-and-insights/video-hub",
  BLOG_POST: "https://www.kilde.sg/post/czech-republics-non-bank-lending-landscape-traditional-digital-and-fintech-convergence"
}

export const PLATFORM = {
  HOW_WORK: "https://www.kilde.sg/how-it-works",
  FAQ: "https://www.kilde.sg/faq",
  GLOSSARY: "https://www.kilde.sg/glossary",
  FOR_BORROWER: "https://www.kilde.sg/borrowers",
}

export const allowedUserIds = [];


export const promoConfigs = {};
