import axios from "axios";
import { notification } from "antd";
import { ErrorResponse } from "./ErrorResponse.js";
import GlobalVariabels from "../Utils/GlobalVariabels.js";
import { countries } from "countries-list";
import Cookies from "js-cookie";
import { isAuthenticated } from "../Config/authService.js";

export const apiHandler = async (
  method,
  url,
  requestBody = {},
  page = null,
  limit = null
) => {
  try {
    const Headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    let baseURL = GlobalVariabels.NODE_ENV === "DEV" ? `${url}` : `${url}`;

    if (page) {
      baseURL = `${baseURL}?page=${page}&limit=${limit}`;
    }

    const data = {
      method,
      url: baseURL,
      headers: Headers,
      data: JSON.stringify(requestBody),
      withCredentials: true,
    };

    return axios(data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);

        let err;
        if (error?.response?.data?.status === 403) {
          Cookies.remove("auth_inv_token");
          window.location.href = "/login";
        } else if (
          error?.response?.status === 524 ||
          error?.response?.data?.status === 504
        ) {
          notification.error({
            type: "info",
            description:
              "We encountered an issue with your subscription. Please try again or reach out to us at sales@kilde.sg.",
          });
        } else if (error?.response?.status === 401) {
          if (
            error?.response?.data?.error === "Invalid SMS verification code"
          ) {
            notification.error({
              type: "error",
              description: "Please enter a valid OTP.",
              message: "Invalid OTP",
            });
          } else {
            notification.error({
              type: "error",
              description: "Unauthorized access. Please log in to continue.",
            });
          }
        } else if (error?.response?.status === 400) {
          if (
            error?.response?.data?.fieldErrors?.verificationCode ===
            "INVALID_CODE"
          ) {
            notification.error({
              type: "error",
              description: "Please enter a valid OTP.",
              message: "Invalid OTP",
            });
          } else if (
            error?.response?.data?.fieldErrors?.code === "INVALID_CODE"
          ) {
            notification.error({
              type: "error",
              description: "Please enter a valid OTP.",
              message: "Invalid OTP",
            });
          }
        } else if (
          error?.response?.data?.error ===
          "Passkey not found for the investor. Invalid Request."
        ) {
          notification.error({
            type: "error",
            description: "Please try a different login method.",
            message: "Passkey Not Found",
          });
        } else if (error?.response?.status === 404) {
          notification.error({
            type: "error",
            description: "Requested resource not found.",
          });
        } else if (error?.response?.status === 429) {
          notification.error({
            type: "error",
            description:
              "You're making requests too quickly. Please try again later.",
          });
        } else if (error?.response?.status === 408) {
          notification.error({
            type: "error",
            description:
              "Request timed out. Please check your connection and try again.",
          });
        } else if (
          error?.response?.data?.error === "Internal Server Error" ||
          error?.response?.status === 502
        ) {
          notification.error({
            type: "error",
            message: "Oops! Something happened.",
            description:
              "We're on it! If this continues, please contact support at sales@kilde.sg.",
          });
        } else if (
          error?.response?.data?.error ===
          "Account not found for given current account number"
        ) {
          notification.error({
            type: "error",
            message: "Account Not Found",
            description:
              "No account was found for the provided current account number. Please verify the account number and try again.",
          });
        } else if (
          Object.keys(error?.response?.data?.fieldErrors)?.length > 0 ||
          error.response?.data?.fieldErrors?.length > 0
        ) {
          err = error?.response?.data?.fieldErrors;
        } else {
          err = error?.response?.data?.errors;
        }
        ErrorResponse(err);
        return error?.response?.data;
      });
  } catch (error) {
    return error;
  }
};

export const commitApiHandler = async (
  method,
  url,
  requestBody = {},
  page = null,
  limit = null
) => {
  try {
    const Headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    let baseURL = GlobalVariabels.NODE_ENV === "DEV" ? `${url}` : `${url}`;

    if (page) {
      baseURL = `${baseURL}?page=${page}&limit=${limit}`;
    }

    const data = {
      method,
      url: baseURL,
      headers: Headers,
      data: JSON.stringify(requestBody),
    };

    return axios(data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err", error);
        let err;
        if (error?.response?.data?.status === 403) {
          Cookies.remove("auth_inv_token");
          window.location.href = "/login";
        } else if (
          error?.response?.data?.errors[0] === "You have pending reservations"
        ) {
          notification.error({
            type: "info",
            description:
              "You have pending reservations that need to be completed.",
          });
        } else if (error?.response?.status === 400) {
          notification.error({
            type: "info",
            description:
              "We encountered an issue with your subscription. Please try again or reach out to us at",
          });
        } else if (
          error?.response?.status === 524 ||
          error?.response?.data?.status === 524 ||
          error?.response?.data?.status === 520 ||
          error?.response?.status === 520 ||
          error?.response?.status === 504
        ) {
          notification.error({
            type: "info",
            description:
              "We're processing your investment, which may take a little longer than usual due to its substantial size.Please refresh the page in a few minutes for an update.",
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else if (
          error?.response?.data?.error === "Internal Server Error" ||
          error?.response?.status === 502
        ) {
          notification.error({
            type: "error",
            message: "Oops! Something happened.",
            description:
              "We're on it! If this continues, please contact support at sales@kilde.sg.",
          });
        } else if (
          Object.keys(error?.response?.data?.fieldErrors)?.length > 0 ||
          error.response?.data?.fieldErrors?.length > 0
        ) {
          err = error?.response?.data?.fieldErrors;
        } else {
          err = error?.response?.data?.errors;
        }
        ErrorResponse(err);
        return error?.response?.data;
      });
  } catch (error) {
    return error;
  }
};

export const getNotificationApiHandler = async (
  method,
  url,
  requestBody = {},
  page = null,
  limit = null
) => {
  try {
    const Headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };

    let baseURL = GlobalVariabels.NODE_ENV === "DEV" ? `${url}` : `${url}`;

    if (page) {
      baseURL = `${baseURL}?page=${page}&limit=${limit}`;
    }

    const data = {
      method,
      url: baseURL,
      headers: Headers,
      data: JSON.stringify(requestBody),
    };

    return axios(data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        let err;
        if (error?.response?.data?.status === 403) {
          Cookies.remove("auth_inv_token");
          window.location.href = "/login";
        } else if (
          error?.response?.status === 524 ||
          error?.response?.data?.status === 504
        ) {
          notification.error({
            type: "info",
            description:
              "We encountered an issue with your subscription. Please try again or reach out to us at sales@kilde.sg.",
          });
        } else if (error?.response?.status === 401) {
          notification.error({
            type: "error",
            description: "Unauthorized access. Please log in to continue.",
          });
        } else if (error?.response?.status === 404) {
          notification.error({
            type: "error",
            description: "Requested resource not found.",
          });
        } else if (error?.response?.status === 429) {
          notification.error({
            type: "error",
            description:
              "You're making requests too quickly. Please try again later.",
          });
        } else if (error?.response?.status === 408) {
          notification.error({
            type: "error",
            description:
              "Request timed out. Please check your connection and try again.",
          });
        } else if (
          error?.response?.data?.error === "Internal Server Error" ||
          error?.response?.status === 502
        ) {
          notification.error({
            type: "error",
            message: "Oops! Something happened.",
            description:
              "We're on it! If this continues, please contact support at sales@kilde.sg.",
          });
        } else if (
          error?.response?.data?.error ===
          "Account not found for given current account number"
        ) {
          notification.error({
            type: "error",
            message: "Account Not Found",
            description:
              "No account was found for the provided current account number. Please verify the account number and try again.",
          });
        } else if (
          Object.keys(error?.response?.data?.fieldErrors)?.length > 0 ||
          error.response?.data?.fieldErrors?.length > 0
        ) {
          err = error?.response?.data?.fieldErrors;
        } else {
          err = error?.response?.data?.errors;
        }
        ErrorResponse(err);
        return error?.response?.data;
      });
  } catch (error) {
    return error;
  }
};

export const dowloadReports = async (
  method,
  url,
  requestBody = {},
  page = null,
  limit = null
) => {
  try {
    let baseURL = GlobalVariabels.NODE_ENV === "DEV" ? `${url}` : `${url}`;

    if (page) {
      baseURL = `${baseURL}?page=${page}&limit=${limit}`;
    }
    return axios
      .post(baseURL, requestBody, { responseType: "arraybuffer" })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        let err;
        if (error?.response?.data?.status === 403) {
          Cookies.remove("auth_inv_token");
          window.location.href = "/login";
        } else if (error?.response?.data?.error === "Internal Server Error") {
          notification.error({
            type: "error",
            message: "Oops! Something happened.",
            description:
              "We're on it! If this continues, please contact support at sales@kilde.sg.",
          });
        } else if (
          Object.keys(error?.response?.data?.fieldErrors)?.length > 0 ||
          error.response?.data?.fieldErrors?.length > 0
        ) {
          err = error?.response?.data?.fieldErrors;
        } else {
          err = error?.response?.data?.errors;
        }
        ErrorResponse(err);
        return error?.response?.data;
      });
  } catch (error) {
    return error;
  }
};

export const TrancheAcceptancedowload = async (
  method,
  url,
  requestBody = {},
  page = null,
  limit = null
) => {
  try {
    let baseURL = GlobalVariabels.NODE_ENV === "DEV" ? `${url}` : `${url}`;

    if (page) {
      baseURL = `${baseURL}?page=${page}&limit=${limit}`;
    }
    return axios({
      method: method,
      url: baseURL,
      data: requestBody,
      responseType: "arraybuffer",
    })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        let err;
        if (error?.response?.data?.status === 403) {
          Cookies.remove("auth_inv_token");
          window.location.href = "/login";
        } else if (error?.response?.data?.error === "Internal Server Error") {
          notification.error({
            type: "error",
            message: "Oops! Something happened.",
            description:
              "We're on it! If this continues, please contact support at sales@kilde.sg.",
          });
        } else if (
          Object.keys(error?.response?.data?.fieldErrors)?.length > 0 ||
          error.response?.data?.fieldErrors?.length > 0
        ) {
          err = error?.response?.data?.fieldErrors;
        } else {
          err = error?.response?.data?.errors;
        }
        ErrorResponse(err);
        return error?.response?.data;
      });
  } catch (error) {
    return error;
  }
};

export const withoutTokenApiHandler = async (
  method,
  url,
  requestBody = {},
  page = null,
  limit = null
) => {
  try {
    const Headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    let baseURL = GlobalVariabels.NODE_ENV === "DEV" ? `${url}` : `${url}`;

    if (page) {
      baseURL = `${baseURL}?page=${page}&limit=${limit}`;
    }

    const data = {
      method,
      url: baseURL,
      headers: Headers,
      data: JSON.stringify(requestBody),
    };
    return axios(data)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (error?.response?.data?.error === "no investor found") {
          notification.error({
            type: "error",
            message: "Oops! User not found",
            description:
              "We couldn't find an account associated with this email. Please double-check your email address or create a new account.",
          });
        } else if (error?.response?.data?.error === "wrong credentials") {
          notification.error({
            type: "error",
            message: "Invalid credentials",
            description: "Invalid username or password. Please try again",
          });
        } else if (error?.response?.data?.error === "Too many attempts") {
          notification.error({
            type: "error",
            message: "Please try again later.",
            description:
              "You have exceeded the maximum number of attempts. Please wait for some time before trying again",
          });
        } else if (error?.response?.data?.error === "Internal Server Error") {
          notification.error({
            type: "error",
            message: "Oops! Something happened.",
            description:
              "We're on it! If this continues, please contact support at sales@kilde.sg.",
          });
        } else if (error?.response?.data) {
          ErrorResponse(error?.response?.data?.fieldErrors);
          return error?.response?.data;
        } else {
          return error;
        }
      });
  } catch (error) {
    return error;
  }
};

export const apiHandlerWithResponseType = async (
  method,
  url,
  requestBody = {},
  responseType = "json", // default to 'json', allow 'blob' or others
  page = null,
  limit = null
) => {
  try {
    const Headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    let baseURL = GlobalVariabels.NODE_ENV === "DEV" ? `${url}` : `${url}`;

    if (page) {
      baseURL = `${baseURL}?page=${page}&limit=${limit}`;
    }

    const data = {
      method,
      url: baseURL,
      headers: Headers,
      data: JSON.stringify(requestBody),
      responseType, // 👈 support for blob, json, etc.
    };

    return axios(data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        // You can keep or trim error logic as needed
        console.error("API Error:", error);
        return error?.response;
      });
  } catch (error) {
    console.error("Unhandled API Error:", error);
    return error;
  }
};

export const getCountries = () => {
  const allCountries = Object.keys(countries).map((k) => ({
    key: k,
    value: countries[k].name,
  }));
  allCountries.sort((a, b) => a.value.localeCompare(b.value));
  const singaporeIndex = allCountries.findIndex((item) => item.key === "SG");
  if (singaporeIndex !== -1) {
    const singaporeItem = allCountries[singaporeIndex];
    allCountries.splice(singaporeIndex, 1);
    allCountries.unshift(singaporeItem);
  }

  return allCountries;
};

export const getBase64 = (file) => {
  return new Promise((resolve) => {
    let baseURL = "";
    let reader = new FileReader();
    reader?.readAsDataURL(file);
    reader.onload = () => {
      baseURL = reader?.result;
      resolve(baseURL);
    };
  });
};

export const checkStepStatus = (data, step) => {
  const StepStatus = data?.includes(step);
  return StepStatus;
};

export function get_ga_clientid() {
  var cookie = {};
  document.cookie.split(";").forEach(function (el) {
    var splitCookie = el.split("=");
    var key = splitCookie[0].trim();
    var value = splitCookie[1];
    cookie[key] = value;
  });
  return cookie["_ga"]?.substring(6);
}

export function redirectToVue(appToRedirect, navigate) {
  if (appToRedirect === "react") {
    navigate("/dashboard");
  } else {
    let originalCookies = document.cookie;
    function parseCookies(cookiesString) {
      return cookiesString.split("; ").reduce(function (acc, cookie) {
        var parts = cookie.split("=");
        acc[parts[0]] = parts[1];
        return acc;
      }, {});
    }

    function setCookies(cookiesObject, domain) {
      for (var cookieName in cookiesObject) {
        if (cookiesObject.hasOwnProperty(cookieName)) {
          document.cookie =
            cookieName +
            "=" +
            cookiesObject[cookieName] +
            "; domain=" +
            domain +
            "; path=/;";
        }
      }
    }

    var parsedCookies = parseCookies(originalCookies);
    setCookies(parsedCookies, ".kilde.sg");
    if (appToRedirect === "vue") {
      window.location.href = `${GlobalVariabels.RIDIRECT_TO_VUE_URL}/redirect`;
    } else if (appToRedirect === "react") {
      window.location.href = `${GlobalVariabels.API_BASE_URL}/dashboard`;
    } else {
      window.location.href = `${GlobalVariabels.RIDIRECT_TO_VUE_URL}/redirect`;
    }
  }
}

export const getPasswordStrength = (password) => {
  if (password?.length < 6) {
    return 0;
  } else if (password?.length < 8) {
    return 30;
  } else if (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    password?.length >= 10 &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/.test(password)
  ) {
    return 100;
  } else {
    return 60;
  }
};

export const britishFormatDate = (inputDate) => {
  const date = new Date(inputDate);
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const saveUTMUrlToCookie = () => {
  const setCookie = (name, value, days) => {
    const expires = value
      ? `expires=${new Date(Date.now() + days * 864e5).toUTCString()}`
      : `expires=${new Date(0).toUTCString()}`;
    // No domain attribute for localhost
    document.cookie = `${name}=${encodeURIComponent(
      value || ""
    )}; ${expires}; path=/`;
  };

  const getCookie = (name) => {
    const cookieArr = document.cookie.split("; ");
    const cookie = cookieArr.find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  const urlParams = new URLSearchParams(window.location.search);
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "original_referrer",
  ];

  // Save UTM parameters to cookies
  utmKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      setCookie(key, value, 7); // Save only if a value exists
    }
  });

  // Handle referrer
  const referrer = document.referrer;
  const domainPattern = /kilde\.sg/;
  const domainPattern2 = /myinfo\.gov\.sg/;
  const originalReferrer = getCookie("original_referrer");

  // Save referrer only if it's external and not already saved
  if (
    referrer &&
    !domainPattern.test(referrer) &&
    !domainPattern2.test(referrer) &&
    !originalReferrer
  ) {
    setCookie("original_referrer", referrer, 7);
  }
};

export const generateUTMURLAndReferrer = (hj) => {
  const getCookie = (name) => {
    const cookieArr = document.cookie.split("; ");
    const cookie = cookieArr.find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];
  const baseUrl = window.location.origin + window.location.pathname;

  // Build UTM query params from cookies
  const queryParams = utmKeys
    .map((key) => {
      const value = getCookie(key);
      return value ? `${key}=${encodeURIComponent(value)}` : null;
    })
    .filter(Boolean)
    .join("&");

  // Append Hotjar ID (`hj`) if provided
  const hjParam = hj ? `&hj=${encodeURIComponent(hj)}` : "";

  // Get original_referrer from cookies
  const originalReferrer = getCookie("original_referrer");

  const combinedURL = queryParams
    ? `${baseUrl}?${queryParams}${hjParam}`
    : `${baseUrl}?${hjParam}`;

  return {
    combinedURL,
    originalReferrer,
  };
};

export const redirectAfterLoginAnd2FA = (navigate) => {
  if (isAuthenticated()) {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});

    const redirectUrl = cookies.redirectTrancheUrl;

    if (redirectUrl) {
      document.cookie = `redirectTrancheUrl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`; // Clear the cookie
      return navigate(decodeURIComponent(redirectUrl));
    }
  }
};

export const getUserCurrentLocation = async () => {
  fetch(
    `https://api.geoapify.com/v1/ipinfo?apiKey=${process.env.REACT_APP_GEOIPIFY_API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      const countryCode = data?.country?.iso_code;
      if (countryCode === "AE") {
        localStorage.setItem("currency", "AED");
      }
    })
    .catch((err) => console.error("Geoapify error:", err));
};

export async function getOSAndBrowser() {
  const ua = navigator.userAgent;
  const screenSize = `${window.screen.width}x${window.screen.height}`;
  const uaPlatform = navigator.userAgentData?.platform || navigator.platform;

  // OS detection
  let os = "Unknown OS";
  if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS";
  } else if (/Android/i.test(ua)) {
    os = "Android";
  } else if (/Win/i.test(uaPlatform)) {
    os = "Windows";
  } else if (/Mac/i.test(uaPlatform) && !/iPhone|iPad|iPod/i.test(ua)) {
    os = "macOS";
  } else if (/Linux/i.test(uaPlatform)) {
    os = "Linux";
  }

  // Browser detection
  let browser = "Unknown Browser";

  // iOS WebKit-based browsers
  if (/CriOS/i.test(ua)) {
    browser = "Chrome";
  } else if (/FxiOS/i.test(ua)) {
    browser = "Firefox";
  } else if (/EdgiOS/i.test(ua)) {
    browser = "Edge";
  } else if (/OPiOS/i.test(ua)) {
    browser = "Opera";
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = "Safari";
  } else if (navigator.brave && (await navigator.brave.isBrave())) {
    browser = "Brave";
  } else if (/Edg\//i.test(ua)) {
    browser = "Edge";
  } else if (/OPR\//i.test(ua)) {
    browser = "Opera";
  } else if (/Chrome/i.test(ua) && !/Edg\//i.test(ua) && !/OPR\//i.test(ua)) {
    browser = "Chrome";
  } else if (/Firefox/i.test(ua)) {
    browser = "Firefox";
  } else if (/MSIE|Trident/i.test(ua)) {
    browser = "Internet Explorer";
  }

  return `${os}, ${browser} (${screenSize})`;
}

export function updateUserCookie(profileResponse) {
  const cookieName = "user";
  const cookiePath = "/";
  const baseDomain = ".kilde.sg"; // explicitly target all subdomains
  const cookieValue = JSON.stringify(profileResponse);

  // Get cookie on current domain
  const currentDomainCookie = Cookies.get(cookieName);
  const baseDomainCookie = Cookies.get(cookieName, { domain: baseDomain });

  // Remove cookie from current subdomain (e.g., app.kilde.sg)
  if (currentDomainCookie) {
    Cookies.remove(cookieName, { path: cookiePath });
  }

  // Remove cookie from base domain (i.e., shared across all subdomains)
  if (baseDomainCookie) {
    Cookies.remove(cookieName, { path: cookiePath, domain: baseDomain });
  }

  // Set cookie scoped to base domain so it's accessible from all subdomains
  Cookies.set(cookieName, cookieValue, {
    path: cookiePath,
    domain: baseDomain,
    sameSite: "Lax",
    // secure: true, // uncomment this if your site uses HTTPS
  });
}

export function extractOSAndBrowser(descriptor) {
  const match = descriptor.match(/^(.+?), (.+?) \(/);
  if (match) {
    return `${match[1]}, ${match[2]}`;
  }
  return descriptor; // fallback if format doesn't match
}

export function getDeviceNamesFromPasskeys(passkeyList) {
  if (!Array.isArray(passkeyList)) return [];

  return passkeyList.map((item) => item.device).filter(Boolean);
}

export async function isCurrentDeviceMatched(allowedDevices) {
  const currentDevice = await getOSAndBrowser();
  return allowedDevices.includes(currentDevice);
}
