if (window.location.host === "localhost:3000") {
  module.exports = {
    NODE_ENV: "DEV",
    NODE_VERSION: process.env.REACT_APP_VERSION,
    API_BASE_URL: "https://dev.kilde.sg",
    PRIMARY_BLUE_COLOR: "#1f20e4",
    LIGHT_BLUE_COLOR: "#6c8bfc",
    PRIMARY_KILDE_BLUE_COLOR: "var(--kilde-blue)",
    LIGHT_KILDE_BLUE_COLOR: "#12b3dd94",
    SINGPASS_REDIRECT_URL:
      "https://test.api.myinfo.gov.sg/serviceauth/myinfo-com/v2/authorize",
    SINGPASS_AUD: "https://test.api.myinfo.gov.sg/com/v4/person",
    SINGPASS_CODE_CC_METHOD: "S256",
    SINGPASS_RESPONSE_TYPE: "code",
    RIDIRECT_TO_VUE_URL: "https://test2-investor.kilde.sg",
    VIEW_IMG: "https://dev.kilde.sg/api/guest/view",
    GOOGLE_USERINFO_URI: 'https://www.googleapis.com/oauth2/v2/userinfo',
  };
} else if (window.location.host === "dev.kilde.sg") {
  module.exports = {
    NODE_ENV: "DEV",
    NODE_VERSION: process.env.REACT_APP_VERSION,
    API_BASE_URL: "https://dev.kilde.sg",
    PRIMARY_BLUE_COLOR: "#1f20e4",
    LIGHT_BLUE_COLOR: "#6c8bfc",
    PRIMARY_KILDE_BLUE_COLOR: "var(--kilde-blue)",
    LIGHT_KILDE_BLUE_COLOR: "#12b3dd94",
    SINGPASS_REDIRECT_URL:
      "https://test.api.myinfo.gov.sg/serviceauth/myinfo-com/v2/authorize",
    SINGPASS_AUD: "https://test.api.myinfo.gov.sg/com/v4/person",
    SINGPASS_CODE_CC_METHOD: "S256",
    SINGPASS_RESPONSE_TYPE: "code",
    RIDIRECT_TO_VUE_URL: "https://test2-investor.kilde.sg",
    VIEW_IMG: "https://dev.kilde.sg/api/guest/view",
    GOOGLE_USERINFO_URI: 'https://www.googleapis.com/oauth2/v2/userinfo',
  };
} else if (window.location.host === "staging.kilde.sg") {
  module.exports = {
    NODE_ENV: "DEV",
    NODE_VERSION: process.env.REACT_APP_VERSION,
    API_BASE_URL: "https://staging.kilde.sg",
    PRIMARY_BLUE_COLOR: "#1f20e4",
    LIGHT_BLUE_COLOR: "#6c8bfc",
    PRIMARY_KILDE_BLUE_COLOR: "var(--kilde-blue)",
    LIGHT_KILDE_BLUE_COLOR: "#12b3dd94",
    SINGPASS_REDIRECT_URL:
      "https://test.api.myinfo.gov.sg/serviceauth/myinfo-com/v2/authorize",
    SINGPASS_AUD: "https://test.api.myinfo.gov.sg/com/v4/person",
    SINGPASS_CODE_CC_METHOD: "S256",
    SINGPASS_RESPONSE_TYPE: "code",
    RIDIRECT_TO_VUE_URL: "https://test-investor.kilde.sg",
    VIEW_IMG: "https://staging.kilde.sg/api/guest/view",
    GOOGLE_USERINFO_URI: 'https://www.googleapis.com/oauth2/v2/userinfo',
  };
} else if (window.location.host === "app.kilde.sg") {
  module.exports = {
    NODE_ENV: "PRODUCTION",
    NODE_VERSION: process.env.REACT_APP_VERSION,
    API_BASE_URL: "https://app.kilde.sg",
    PRIMARY_BLUE_COLOR: "#1f20e4",
    LIGHT_BLUE_COLOR: "#6c8bfc",
    PRIMARY_KILDE_BLUE_COLOR: "var(--kilde-blue)",
    LIGHT_KILDE_BLUE_COLOR: "#12b3dd94",
    SINGPASS_REDIRECT_URL:
      "https://api.myinfo.gov.sg/com/v4/authorize",
    SINGPASS_AUD: "https://test.api.myinfo.gov.sg/com/v4/person",
    SINGPASS_CODE_CC_METHOD: "S256",
    SINGPASS_RESPONSE_TYPE: "code",
    RIDIRECT_TO_VUE_URL: "https://investor.kilde.sg",
    VIEW_IMG: "https://app.kilde.sg/api/guest/view",
    GOOGLE_USERINFO_URI: 'https://www.googleapis.com/oauth2/v2/userinfo',
  };
}
