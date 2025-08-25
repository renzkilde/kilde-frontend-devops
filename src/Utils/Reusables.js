import { useEffect, useState } from "react";
import ROUTES from "../Config/Routes";

import Cookies from "js-cookie";

import { COMPANY, INSIGHTS, INVESTOR_CATEGORY, PLATFORM, REGTANK_ERROR_MESSAGES, WHY_KILDE } from "./Constant";
import { britishFormatDate, checkStepStatus, redirectToVue } from "./Helpers";
import { Button, notification, Tag, Tooltip } from "antd";
import { formatDistanceToNow } from "date-fns";

// Gray Icons
import General_icon from "../Assets/Images/SVGs/gray_icon/IconSet.svg";
import Getting_start_icon from "../Assets/Images/SVGs/gray_icon/IconSet-1.svg";
import Verif_sec_icon from "../Assets/Images/SVGs/gray_icon/IconSet-2.svg";
import Investing_icon from "../Assets/Images/SVGs/gray_icon/IconSet-3.svg";
import Auto_invest_icon from "../Assets/Images/SVGs/gray_icon/IconSet-4.svg";
import Taxation_icon from "../Assets/Images/SVGs/gray_icon/IconSet-5.svg";

// Blue Icons
import General_blue_icon from "../Assets/Images/SVGs/blue_icon/IconSet.svg";
import Getting_start_blue_icon from "../Assets/Images/SVGs/blue_icon/IconSet-1.svg";
import Verif_sec_blue_icon from "../Assets/Images/SVGs/blue_icon/IconSet-2.svg";
import Investing_blue_icon from "../Assets/Images/SVGs/blue_icon/IconSet-3.svg";
import Auto_invest_blue_icon from "../Assets/Images/SVGs/blue_icon/IconSet-4.svg";
import Taxation_blue_icon from "../Assets/Images/SVGs/blue_icon/IconSet-5.svg";
import Help_desk_key from "../Assets/Images/SVGs/help_desk_key.svg";
import Help_desk_blue_key from "../Assets/Images/SVGs/help_desk_key_blue.svg";
import Tax_key from "../Assets/Images/SVGs/Tax_black.svg";
import Tax_blue from "../Assets/Images/SVGs/Tax_blue.svg";

import { Grid } from "antd";

const { useBreakpoint } = Grid;

export function validatePassword(password) {
  var re = /[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/;
  return re.test(password);
}

export function camelCaseSting(string) {
  if (!string) return "";

  return string.replace(/([^(]+)(\(([^)]+)\))?/, (_, main, paren, inner) => {
    const cleanedMain = main.replace(/_/g, " ").toLowerCase().trim();
    const finalMain =
      cleanedMain.charAt(0).toUpperCase() + cleanedMain.slice(1);

    if (paren) {
      const cleanedInner = inner.replace(/_/g, " ").toLowerCase().trim();
      return `${finalMain} (${cleanedInner})`;
    }

    return finalMain;
  });
}

export function getCountryNameByCode(countryList, code) {
  const country = countryList?.find((country) => country?.key === code);
  return country ? country?.value : null;
}

export function handleFinish(user, navigate) {
  if (user?.investorStatus === "ACTIVE") {
    redirectToVue();
  } else {
    if (
      checkStepStatus(user?.waitingVerificationSteps, "QUESTIONNAIRE") === false
    ) {
      if (user?.investorType === "INDIVIDUAL") {
        navigate(ROUTES.INDIVIDUAL_VERIFICATION);
      } else {
        navigate(ROUTES.ORGANIZATION_VERIFICATION);
      }
    } else {
      navigate(ROUTES.VERIFICATION);
    }
  }
}

export const getTransformedCountries = (countries) => {
  const transformed = countries?.map((country) => ({
    key: country.code,
    value: country.name,
  }));
  transformed?.unshift({ key: "ALL", value: "All countries" });

  return transformed;
};

export const getTransformedIndustries = (industries) => {
  const transformed = industries?.map((industry) => ({
    key: industry.code,
    value: industry.name,
  }));
  transformed?.unshift({ key: "ALL", value: "All industries" });

  return transformed;
};

export const getTransformedProductTypes = (products) => {
  const transformed = products?.map((product) => ({
    key: product.code,
    value: product.name,
  }));
  transformed?.unshift({ key: "ALL", value: "All product type" });

  return transformed;
};

export const getTransformedLoanOriginator = (originators) => {
  const transformed = originators?.map((originator) => ({
    key: originator.code,
    value: originator.name,
  }));
  transformed?.unshift({ key: "ALL", value: "All originators" });

  return transformed;
};

export const generateErrorMessages = (codes) => {
  return codes.map((code) => REGTANK_ERROR_MESSAGES[code]);
};

export const formatDateWithTime = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

export const britishFormatDateWithTime = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
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

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const isPM = hours >= 12;
  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, "0");

  const formattedDate = `${day} ${month} ${year} ${formattedHours}:${minutes} ${isPM ? "PM" : "AM"
    }`;

  return formattedDate;
};

export const SupportChatButton = () => {
  const getUser = Cookies.get("user");
  const user = getUser && JSON.parse(getUser);
  return (
    <div
      data-tf-popover="rSEPG1V2"
      data-tf-opacity="100"
      data-tf-iframe-props="title=Kilde Customer Support Chat"
      data-tf-transitive-search-params
      data-tf-button-color="#0445AF"
      data-tf-medium="snippet"
      data-tf-hidden={`email=${user?.email},investor_number=${user?.number}`}
      style={{ all: "unset" }}
    />
  );
};

export const stepperRedirection = (user) => {
  if (
    user?.vwoFeatures?.identityVerificationSystem?.idvSystemToUse ===
    "veriff" &&
    checkStepStatus(user?.waitingVerificationSteps, "IDENTITY_VERIFICATION") ===
    false
  ) {
    return 2;
  } else {
    return 2;
  }
};

export const formatCamelCaseToTitle = (str) => {
  const words = str?.replace(/([A-Z])/g, " $1").trim();
  return words
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatCurrency = (currencySymbol, value) => {
  const formatter = new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  let formattedValue = formatter.format(value).replace("$", "").trim();
  if (value < 0) {
    formattedValue = `-${currencySymbol}${formattedValue.slice(1)}`;
  } else {
    formattedValue = `${currencySymbol}${formattedValue}`;
  }

  if (formattedValue.includes(".") && !formattedValue.includes("..")) {
    const decimalIndex = formattedValue.indexOf(".");
    const decimalPart = formattedValue.slice(decimalIndex + 1);
    if (decimalPart.length === 1) {
      formattedValue += "0";
    }
  }

  return formattedValue;
};

export const getFilenameDetails = (filename) => {
  const lastDotIndex = filename.lastIndexOf(".");
  const fileFormat =
    lastDotIndex !== -1 ? filename.substring(lastDotIndex) : "";

  const baseName =
    lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;

  if (baseName.length > 20) {
    return `${baseName.substring(0, 20)}...${fileFormat}`;
  } else {
    return filename;
  }
};

export const resetJivoChat = () => {
  let clearHistory = () => {
    if (window.jivo_api) {
      window.jivo_api.clearHistory();
    } else {
      console.log("jivo_api is not available");
    }
  };

  clearHistory();
};

export const showMessageWithCloseIcon = (text) => {
  notification.success({
    description: text,
    showProgress: true,
  });
};

export const showMessageWithCloseIconError = (text) => {
  notification.error({
    description: text,
    showProgress: true,
    onClose: () => {
      console.log("Notification closed");
    },
  });
};

export const formatString = (input) => {
  return input
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function isNonDBSSingaporeBank(swiftCode) {
  const bankCode = swiftCode?.substring(0, 4);
  const countryCode = swiftCode?.substring(4, 6);
  if (countryCode === "SG" && bankCode !== "DBSS") {
    return true;
  }
  return false;
}

export const notificationMessageCorrection = (message) => {
  const messageMap = {
    "Onbarding step PERSONAL_DETAILS: COMPLETED":
      "Your personal details has been submitted successfully.",
    "Onbarding step QUESTIONNAIRE: COMPLETED":
      "Your investor type has been updated successfully.",
    "Onbarding step PROOF_OF_ACCREDITATION: COMPLETED":
      "Your proof of accreditation has been submitted successfully.",
    "Onbarding step DOCUMENTS: COMPLETED":
      "Your proof of address has been submitted successfully",
    "Onbarding step SECOND_FACTOR_AUTHENTICATION: COMPLETED":
      "Second factor authentication has been set up successfully.",
  };
  return messageMap[message] || message;
};

export const Timestamp = (timestamp) => {
  const singaporeTime = new Date(timestamp);
  const utcTime = new Date(singaporeTime.getTime() - 8 * 60 * 60 * 1000); // Singapore is UTC+8
  const localOffset = new Date().getTimezoneOffset() * 60 * 1000;
  const localTime = new Date(utcTime.getTime() - localOffset);
  const formattedTime = formatDistanceToNow(localTime, { addSuffix: true });

  return formattedTime;
};

export const generalInformation = [
  {
    header: "What is KILDE?",
    description:
      "KILDE is a trusted and regulated investment platform designed to help individuals grow their wealth safely and strategically. We help individuals, financial professionals, businesses, and institutions in connecting them to high-quality private credit deals that provide reliable monthly income, often yielding returns significantly higher than traditional bank offerings.<br/><br/>Our platform is user-friendly, and our expert advisors are always available to provide guidance and support. Whether you're new to private credit or a seasoned investor, we ensure a straightforward and transparent experience.<br/><br/>At KILDE, we are committed to making smart, accessible, and rewarding investments available to all.",
  },
  {
    header: "How do KILDE investments compare to other types of investment?",
    description: `KILDE investments:
      <ul>
      <li>Outperform traditional fixed-income investments </li>
      <li>Provide regular stable income with opportunities to exit</li>
       <li>Are backed by real recoverable assets</li>
        <li>Provide peace of mind for you as an investor because KILDE holds a Singapore Capital Market Services (CMS) licence</li>
        </ul>
        The unique combination of strong performance, income stability, liquidity, and lower risk makes KILDE investments stand out.<br/><br/>
Here’s a deeper look at our approach, with a comparison to other available products in the market:
<br/><br/>
        Performance
        <ul>
      <li>KILDE offers 11%–15% annualised returns with steady monthly or quarterly payouts—balancing performance with income stability.</li>
      <li>Bank Deposits & Bonds yield 1%–6% annually with lower risk, but limited growth.</li>
       <li>Stocks may deliver higher returns but are volatile and subject to market and economic swings.</li>
        <li>Cryptocurrency is highly unpredictable, with sharp price swings and no asset-backed security.</li>
        </ul>
        Capital protection
         <ul>
      <li>KILDE prioritizes risk mitigation: in the event of a default, our investors are first in line to receive repayment. Our senior-secured debentures, backed by the loan portfolios of borrowers, are typically supported by 1.6 times the value of the investment, providing a cushion against potential losses. </li>
     <li>Do note that capital is not guaranteed.</li>
        </ul>
        Regular stable income
         <ul>
      <li>Whereas most investment products rely on capital appreciation i.e. growth of value over time, KILDE gives investors consistent monthly or quarterly cash income - ideal for investors looking for regular income payouts.</li>
     
        </ul>
       Early Withdrawal Capability
         <ul>
      <li>Most KILDE investments offer early withdrawal options every 3-6 months, providing greater liquidity compared to traditional private credit funds. Please review the early withdrawal schedule for each investment to understand the available options.</li>
     
        </ul>
         Backed by Cash Collateral
         <ul>
      <li>Backed by Cash Collateral</li>
     <li>KILDE has maintained a 0% default rate since 2021, owing to our rigorous credit screening and continuous financial monitoring.</li>
     <li>While High-Yield Bonds and P2P Lending offer similar returns, they lack the structured collateral protections provided by KILDE, potentially exposing investors to default risks.</li>
     <li>Crypto and speculative investments carry significant downside risks, with no underlying security or asset backing.</li>
    
        </ul>
          Regulatory oversight & investor protection
         <ul>
     <li>Unlike unregulated private offerings, KILDE operates under Singapore’s Capital Market Services (CMS) and Financial Advisory (FAA) licence, ensuring compliance with strict financial regulations</li>
        </ul>
`,
  },
  {
    header: "How does investing with KILDE work?",
    description:
      "Investors can view live deals directly on the platform and access each one to proceed with their investment. Upon investment, they will be issued debt securities (debentures).<br/><br/>KILDE oversees the entire investment process, including deal arrangement, collection of interest payments from borrowers, distribution of interest to investors, providing regular updates, managing investor withdrawals, and handling the finalization of investments upon maturity.",
  },
  {
    header: "How is KILDE different?",
    description: `
  <p>
  KILDE acts as the sole intermediary between investors and the institutions it funds, reducing costs compared to traditional models that involve multiple intermediaries, each charging fees. Our end-to-end platform streamlines operations, allowing us to pass on more of the interest earned directly to investors.
  </p>
  <p>We use advanced AI tools to assess the risk of payment defaults, approving only about 9% of potential borrowers who meet our strict criteria. In the unlikely event of a default, KILDE can enforce the collateral securing the deal, typically by managing or selling the institution’s loan portfolio, reducing risks for investors. To date, all interest and principal from KILDE-funded institutions have been paid as expected, demonstrating our strong risk management approach. </p>
  KILDE also offers additional benefits:

  <ul>
    <li>
     It democratizes access to investments that were previously unavailable to private investors, broadening investment opportunities for a wider audience.
    </li>
    <li>
    The institutions we fund often provide financial support to underserved individuals, helping improve economic opportunities for them and their families.
    </li>
  
  </ul>
`,
  },
  {
    header: "Is KILDE licensed?",
    description: `Yes, KILDE PTE LTD is incorporated in Singapore under registration no. 201929587K and holds a <a href="https://eservices.mas.gov.sg/fid/institution/detail/236644-KILDE-PTE-LTD" target="_blank" rel="noopener noreferrer">Capital Markets Services Licence (CMS101016)</a> issued by the Monetary Authority of Singapore to deal in capital markets products under the Securities and Futures Act (Cap. 289). KILDE is also an Exempt Financial Adviser under the Financial Advisory Act.`,
  },
  {
    header: "What happens if KILDE decides to cease operations?",
    description:
      "In the unlikely event that KILDE decides to cease operations, we will stop accepting new investments and cancel the issuance of new debentures. The platform will continue to operate until all investments have matured and all investors have received their due payments.",
  },
];

export const gettingStarted = [
  {
    header: "Who can invest with KILDE?",
    description: `Kilde is able to onboard Accredited Investors, Expert Investors, businesses and financial institutions as outlined by the Singapore's Securities and Futures Act (SFA) and its associated regulations.
     <p> 1. Individual/Accredited Investors</p>
      <p>   
        Individual/Accredited Investors are individuals who meet specific wealth or income criteria. They are considered sophisticated investors subject to fewer regulatory protections than retail investors.
      </p>
      <p>An individual qualifies as an Accredited Investor if they meet at least one of the following conditions:<p/>
      <ul>
        <li>Income: earned income of at least SGD 300,000 in the past 12 months </li>
        <li>Net Personal Assets: at least SGD 2 million, including primary residence (capped at SGD 1 million)</li>
        <li>Net Financial Assets: at least SGD 1 million in cash, deposits, investment products, or other acceptable financial instruments</li>
      </ul>
     To be treated as an Accredited Investor, an individual must opt-in to be treated as such.
      <br />
      <p>2. Expert Investors</p>
      <p>Expert Investors are individuals who are considered to have sufficient expertise in financial investments to not require the same level of regulatory safeguards as retail investors.</p>
      An individual qualifies as an Individual/Expert Investor if:

       <ul>
        <li>Their business involves the acquisition and disposal of investment products (whether as principal or agent), for example they are a proprietary trader, fund manager, or investment analyst</li>
        <li>They are licensed or regulated under the SFA or Financial Advisers Act (FAA), for example, they are a fund manager, or investment professional registered with the Monetary Authority of Singapore (MAS)</li>
        <li>They are an employee of a financial institution whose role relates to investment management or financial advisory activities. This may include directors, partners, and senior executives of investment firms who oversee fund management or advisory services</li>
      </ul>
     Unlike Accredited Investors, Expert Investors do not need to meet specific wealth or income thresholds. Instead, their classification is based on their professional expertise and role.
      <p>3. Corporate/Accredited Investor</p>
      <p>Corporate/Accredited Investors are businesses which meet specific wealth or income criteria. They are considered sophisticated investors subject to fewer regulatory protections than retail investors.</p>
     A business qualifies as a Corporate/Accredited Investor if it meets either of the following conditions:
      <ul>
        <li>Net Assets: at least SGD 10 million in total net assets</li>
        <li>Net Financial Assets: at least SGD 1 million in cash, deposits, or investment securities</li>
      </ul>
    Unlike individual investors, Corporate/Accredited Investors do not need to opt-in to being treated as an Accredited Investor.
      <p>4. Institutional Investors</p>
      <p>Institutional investors are typically large financial institutions or entities that meet specific legal criteria. They are granted the broadest access to financial markets with minimal regulatory protection.</p>
      Institutional Investors are:
        <ul>
        <li>Banks, finance companies, and insurers licensed under Singapore laws</li>
        <li>Capital market services licence holders, such as fund managers and brokerages</li>
         <li>Investment companies and pension funds</li>
         <li>Sovereign wealth funds and government agencies</li>
         <li>Entities fully owned by an institutional investor</li>
      </ul>
Institutional Investors do not need to opt in to be treated as such: they are automatically classified based on their nature.
<br/><br/>
The KILDE platform guides each investor through the onboarding process according to their classification.`,
  },

  {
    header: "What documents do I need to provide before I can invest?",
    description: `
      <div style="max-width: 100%; overflow-x: auto;">
      <p>To create an account with Kilde and begin investing, you need to provide the following types of documents:</p>
        <table style="border-collapse: collapse; width: 100%; border: 1px solid black; box-sizing: border-box;">
          <tr>
              <th style="border: 1px solid black; padding: 8px; text-align: left;">Investor type</th>
              <th style="border: 1px solid black; padding: 8px; text-align: left;">Identification card and proof of address</th>
              <th style="border: 1px solid black; padding: 8px; text-align: left;">Proof of income/wealth or payslips</th>
              <th style="border: 1px solid black; padding: 8px; text-align: left;">Proof of professional expertise</th>
              <th style="border: 1px solid black; padding: 8px; text-align: left;">Proof of business activities/ licences</th>
          </tr>
          <tr>
              <td style="border: 1px solid black; padding: 8px;">Individual/Accredited</td>
              <td style="border: 1px solid black; padding: 8px;">Yes</td>
              <td style="border: 1px solid black; padding: 8px;">Yes</td>
              <td style="border: 1px solid black; padding: 8px;">NA</td>
              <td style="border: 1px solid black; padding: 8px;">NA</td>
          </tr>
          <tr>
              <td style="border: 1px solid black; padding: 8px;">Individual/Expert</td>
              <td style="border: 1px solid black; padding: 8px;">Yes</td>
              <td style="border: 1px solid black; padding: 8px;">NA</td>
              <td style="border: 1px solid black; padding: 8px;">Yes</td>
              <td style="border: 1px solid black; padding: 8px;">Yes</td>
          </tr>
          <tr>
              <td style="border: 1px solid black; padding: 8px;">Corporate/Accredited</td>
              <td style="border: 1px solid black; padding: 8px;">Yes</td>
              <td style="border: 1px solid black; padding: 8px;">Yes</td>
              <td style="border: 1px solid black; padding: 8px;">NA</td>
              <td style="border: 1px solid black; padding: 8px;">NA</td>
          </tr>
          <tr>
              <td style="border: 1px solid black; padding: 8px;">Corporate/Institutional</td>
              <td style="border: 1px solid black; padding: 8px;">Yes</td>
              <td style="border: 1px solid black; padding: 8px;">NA</td>
              <td style="border: 1px solid black; padding: 8px;">NA</td>
              <td style="border: 1px solid black; padding: 8px;">Yes</td>
          </tr>
        </table>
      </div>
      <br/>
     The Onboarding section of the KILDE platform guides you on which documents are required for each case, and our team is always ready to support you for a smooth onboarding experience.
    `,
  },
  {
    header: "How do I deposit funds in my KILDE account?",
    description: `Upon completion of your onboarding, you will receive your account details and step-by-step instructions on how to deposit funds into your KILDE account.<br/><br/> KILDE partners with a third-party escrow agent to oversee all financial transactions. Investors’ funds are held in an escrow account managed by Perpetual (Asia) Limited, a licensed trust company in Singapore. This segregated structure ensures that client assets are always separate from KILDE’s operations, offering an additional layer of transparency and protection.<br/><br/>Please note the following important details regarding fund transfers: <br/>
    <ol>
    <li>If you make a payment from a DBS personal bank account, the funds will be reflected in your KILDE wallet within one hour.</li>
    <li>Transfers from other Singapore-based banks, whether via bank transfer or PayNow, are generally reflected immediately in your wallet.</li>
    </ol>
    PayNow transfers from DBS and non-DBS bank accounts usually reflect almost instantly unless otherwise stated.<br/><br/>
    In rare cases, there may be slight delays due to external banking system factors (e.g., app maintenance or interbank processing times).`,
  },

  {
    header: "How do I withdraw funds from my KILDE account?",
    description:
      "You can request a partial or full withdrawal of funds from your account at any time via the KILDE platform dashboard. Please note that depending on the destination country, it may take several business days for the payment to be processed and reach you.",
  },
  {
    header: "Which currency should I use to deposit funds?",
    description:
      "We accept deposits in USD, SGD, and EUR. If you wish to invest in USD but wish to deposit in SGD or EUR, you can easily request a currency exchange on the KILDE dashboard.The exchange rate used would be the DBS preferential rates.",
  },
];

export const verificationAndSecurity = [
  {
    header: "Who can join?",
    description: `To invest in the platform you must complete the onboarding process and
        have available funds in the escrow account. You can choose to invest
        either by manually selecting available debentures or leaving the
        investment to our automatic matching mechanism. Tranches of debentures
        will be offered regularly at our platform and you must purchase the
        debentures during the subscription period. Manual investment: You can
        select which debentures you would like to purchase. You can compare
        debenture details such as term, interest rate, and alternative lender
        information to determine which debentures you prefer. Automated
        investment: Relying on the Auto-Invest tool, you can define criteria
        that allow the system to automatically purchase the debentures matching
        those determined criteria.`,
  },
];

export const investing = [
  {
    header: "How do I start investing?",
    description: `You can invest manually or set up automatic investments by creating your own investment strategy. Do note that once each deal has raised the funds it needs, it will close for further investment, and you will be unable to invest in it further unless an existing investor redeems the deal early.`,
  },
  {
    header: "How do I choose between deals?",
    description:
      "This largely depends on an investor’s investment preference which could be influenced by factors such as geographical exposure, return rates, tenure and currency of choice. At Kilde, we host deals that are denominated in SGD, USD and EUR.<br/><br/>Additionally, we provide essential documents, including the Information Memorandum for each deal, ensuring investors have a comprehensive understanding of the investment. You can also reach out to your respective relationship manager for a proposal.	",
  },
  {
    header: "What is the minimum I can invest?",
    description:
      "We do not impose a minimum investment requirement; however, please note that each bond is denominated in units of 100 USD, SGD, or EUR, depending on the currency of the respective tranches. For meaningful returns on investment, we recommend a minimum investment of 10,000 USD, SGD, or EUR.",
  },
  {
    header: "Can I cancel my investment?",
    description: `There are two stages in the investment process: "Committed" and "Settled." Until 6:00 PM SGT on any business day, you’re free to cancel the investment if you change your mind. At 6:00 PM SGT each business day, all committed investments are reviewed and confirmed. Once settled, your investment becomes active and is no longer cancellable. Depending on the specific deal, you may still be able to request an early withdrawal through the platform after settlement.`,
  },
  {
    header: "When do I get paid interest?",
    description:
      "An investor can refer to the “Next interest payment” available on the respective deal pages. Received interest payments can be either reinvested or withdrawn. The frequency of interest payments varies by deal, with most paying either monthly or quarterly.",
  },
  {
    header: "How is interest calculated?",
    description:
      "All interest rates are expressed as annual figures. Daily interest is calculated as annual interest/365.",
  },
  {
    header: "What fees are applicable?",
    description:
      "KILDE charges a fee of 0.5% p.a. on total investments outstanding. The fee is deducted pro-rata from the regular payments made to you.",
  },
  {
    header: "How long is my investment “locked-in”?",
    description:
      "Investments typically have a fixed tenure of 12 to 36 months, but many deals offer early withdrawal options that may shorten your investment period. For specific early withdrawal dates, kindly refer to the respective deal pages.",
  },

  {
    header: "How can I monitor my investments?",
    description:
      "The KILDE platform provides a user-friendly dashboard that allows you to easily monitor and manage your investments at any time.",
  },
  {
    header:
      "What happens if an institution funded by KILDE goes out of business?",
    description:
      "KILDE maintains a rigorous risk management process, accepting only about one in ten borrowing institutions that approach the platform. To date, none of the accepted institutions have defaulted or gone out of business. Our team conducts continuous credit risk assessments and actively monitors changes in risk.<br/><br/>In the event that a KILDE-funded institution goes out of business, KILDE can enforce the collateral securing the deal by taking control of the institution's loan portfolio. This allows us to either manage, sell, or wind down the portfolio, which may include recovering collateral from the institution's end-customers. While capital recovery cannot be fully guaranteed, KILDE is well-positioned to take decisive action to maximize the recovery of investors’ funds.",
  },
];

export const autoInvest = [
  {
    header: "What is Auto-Invest?",
    description:
      "Auto-Invest helps investors diversify their investments through multiple deals that meet a predetermined criteria or investment strategy. Investors create their own investment strategy by selecting the desirable terms, interest rates, institutions to fund, and countries for investment.<br/><br/>The platform will then automatically allocate future investments based on this strategy, eliminating the need for repeated analysis and frequent platform visits. <br/><br/>Do note that manual investments take priority over autoinvestments.",
  },
  {
    header: "How does Auto-Invest work?",
    description:
      "Once your investment strategy is set up and sufficient funds are available in your wallet, Auto-Invest will automatically allocate accordingly to your strategy.<br/>Auto-Invest can be deactivated or reactivated at any time.",
  },
  {
    header: "How to create my Auto-Invest portfolio?",
    description: `Navigate to the Auto-Invest tab on the Investments page. Click "Create Strategy" and select your desired investment criteria. Allocate the funds, and the platform will then automatically filter the available deals, purchase those which meet your investment strategy, and add them to an investment portfolio for you.`,
  },
  {
    header: "Can I stop Auto-Invest?",
    description:
      "Yes, you can edit, deactivate and delete strategies at any time via the Auto-Invest settings. Investments made to date with Auto-Invest will remain unaffected.",
  },
  {
    header: "Can I invest manually while using Auto-Invest?",
    description:
      "Yes, you can still invest your funds manually using the Auto-Invest tool as long as you have enough funds available.",
  },
  {
    header: "Are there any extra fees for using Auto-Invest?",
    description:
      "Auto-Invest is a free tool provided by the platform to help promote diversification, saving you valuable time and effort in managing your investments.",
  },
];

export const taxation = [
  {
    header: "What is Withholding Tax (WHT)?",
    description:
      "Withholding tax refers to the tax deducted at source on certain payments made to non-residents of Singapore. It is designed to ensure that non-residents fulfill their tax obligations on Singapore-sourced income.</br></br>In Singapore, entities such as KILDE are legally required to withhold a portion of payments made to non-residents and remit it directly to the Inland Revenue Authority of Singapore (IRAS). The withholding tax rate varies depending on factors such as the recipient's country of residence and the existence of a tax treaty between Singapore and that country.</br></br>For KILDE investors, withholding tax may apply to interest payments from Singapore-based entities, though not all deals are subject to this tax.",
  },
  {
    header: "Does the Withholding Tax (WHT) apply to Singaporeans?",
    description:
      "No, withholding tax does not apply to payments made to residents of Singapore.",
  },
  {
    header: "Which deals on the KILDE platform attract withholding tax?",
    description: `Withholding tax will apply if:<br />
      <ol>
      <li>The issuer of the debenture is based in Singapore, or</li>
      <li>The debenture is issued from a Singapore-based Special Purpose Vehicle (SPV)</li>
      </ol>
      For deals where the issuer is not based in Singapore and the debenture is not issued from a Singapore-based SPV, withholding tax will not apply.`,
  },

  {
    header: "How do I pay withholding tax?",
    description:
      "KILDE will withhold the applicable tax from your interest payments at the appropriate rate and remit it directly to the Inland Revenue Authority of Singapore (IRAS) on your behalf.",
  },
  {
    header: "How do I know how much is the WHT?",
    description: `<p>
  The withholding tax rate varies depending on factors such as the recipient's country of residence and the existence of a tax treaty between Singapore and that country. You can refer to those rates <a href="https://taxsummaries.pwc.com/singapore/corporate/withholding-taxes" target="_blank" rel="noopener noreferrer">here</a>.
</p>`,
  },
  {
    header: "Can I have more details on tax guidance?",
    description: `<p>For detailed guidance on the tax treatment of interest income for individuals in Singapore, please refer to the Inland Revenue Authority of Singapore (IRAS) webpage titled "Interest." This resource provides comprehensive information on taxable and non-taxable interest, including examples and reporting requirements.<br/><br/>You can access this guidance directly <a href="https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/what-is-taxable-what-is-not/interest" target="_blank" rel="noopener noreferrer">here.</a> <br/><br/>Please note that while this page offers valuable insights, it may not explicitly reference Section 13(1)(zh) of the Income Tax Act. For specific legal provisions, consulting the Income Tax Act or seeking professional tax advice is recommended.`,
  },
];

export const loginSecurityBasics = [
  {
    header: "What are the different ways to log in to Kilde securely?",
    description: `You can log in using:<br/>
    <ul>
      <li><b>Biometric Login (Passkey)</b> — Use Face ID, fingerprint, or your device passcode.<br/>
       ✅ It’s the fastest and most secured option. No passwords, no OTPs.</li>
      <li><b>Email + Password + OTP</b> — Use a one-time code from SMS or Google Authenticator.</li>
    </ul>
    Both options are secure — feel free to choose what works best for you.<br/>
    If you're looking for the smoothest experience, we recommend giving Passkey a try.`,
  },
  {
    header: "What is a Passkey?",
    description: `A Passkey lets you log in using Face ID, fingerprint, or device security—without a password. It’s secure, phishing-resistant, and syncs across all devices via Google, Apple, or Microsoft.`,
  },
  {
    header: "Is a Passkey the same as 2FA?",
    description: `Yes — and more. A Passkey combines:<br/>
    <ul>
      <li>Something you have (your device)</li>
      <li>Something you are (your biometric, like Face ID or fingerprint)</li>
    </ul>
    It meets—and exceeds—2FA standards, without needing a password.`,
  },
  {
    header: "Why do I need to set up Passkey or 2FA before investing?",
    description: `For your safety, investing means handling real funds and financial data. We’re required to secure that access with strong authentication.<br/>
    You must enable one of these before investing:<br/>
    ✅ Biometric login (Passkey)<br/>
    ✅ 2FA (SMS or Authenticator App)<br/>
    Email and password alone are not secure enough.`,
  },
  {
    header: "Why do I need to secure my account?",
    description: `To protect your personal information, financial data, and investment history. Even if someone knows your password, they won’t get access without your fingerprint or a verified OTP.`,
  },
  {
    header: "How do I set up a Passkey?",
    description: `Just click “Set up Passkey” in the app. You'll be prompted to:<br/>
    <ul>
      <li>Verify your identity (via SMS or your existing 2FA setup)</li>
      <li>Authenticate using your device (fingerprint, Face ID, or passcode)</li>
    </ul>
    That’s it. No more OTPs or passwords the next time you log in.`,
  },
  {
    header: "Why do I need to verify before setting up a Passkey?",
    description: `This one-time verification step ensures that it’s really you. It keeps your account safe, especially because Passkey is such a powerful login method.<br/>
    If you already have 2FA set up → You’ll verify using that method.<br/>
    If not → We’ll verify with an SMS code (you’ll provide your number).`,
  },
  {
    header: "How do I set up SMS or Authenticator OTP?",
    description: `Go to your Security Settings:<br/>
    <ul>
      <li>Choose SMS and enter your phone number</li>
      <li>OR choose Google Authenticator and scan the QR code</li>
    </ul>`,
  },
  {
    header: "Can I switch between SMS and Authenticator?",
    description: `Yes—you can update your method anytime in Security Settings. For your protection, we may ask you to verify your identity again.`,
  },
  {
    header: "Can I use both Passkey and 2FA?",
    description: `Yes—and we recommend it. Using both adds an extra layer of security and ensures you can still access your account if one method isn’t available.`,
  },
  {
    header: "Can I remove or rename a Passkey?",
    description: `Yes. Head to Security Settings to manage your Passkeys per device.`,
  },
  {
    header: "What if I lose access to my Passkey?",
    description: `You can still log in with:<br/>
    <ul>
      <li>Email + Password + SMS code (if set up)</li>
      <li>Email + Password + Authenticator App (if set up)</li>
    </ul>
    We automatically set this up when you enable Passkey, so you’re never locked out.`,
  },
  {
    header: "What if I lose access to my 2FA device?",
    description: `You can still log in with your Passkey, then reconfigure your 2FA.<br/>
    If you don’t have Passkey either, contact sales@kilde.sg or your Relationship Manager for recovery.`,
  },
  {
    header: "I deleted my Passkey from my phone. Now what?",
    description: `Try logging in using:<br/>
    <ul>
      <li>Your email + password + SMS/Authenticator OTP (based on what you set up)</li>
    </ul>
    If that fails, follow our recovery instructions or contact sales@kilde.sg or your Relationship Manager for recovery.`,
  },
  {
    header: "Why can’t I use my desktop Passkey on mobile?",
    description: `
    Passkeys are stored based on where you choose:<br/>
    <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px;">Storage Method</th>
        <th style="border: 1px solid #ccc; padding: 8px;">Works Across Devices?</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Google / Apple / Microsoft Account</td>
        <td style="border: 1px solid #ccc; padding: 8px;">✅ Yes, if signed into same account</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Local Device Only</td>
        <td style="border: 1px solid #ccc; padding: 8px;">❌ No – tied to that device</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">USB / Security Key</td>
        <td style="border: 1px solid #ccc; padding: 8px;">✅ Yes, if physically plugged in</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Browser Profile</td>
        <td style="border: 1px solid #ccc; padding: 8px;">❌ Only works in same browser</td>
      </tr>
    </table>
    <p style="margin-top: 10px;">✅ To use Passkey on multiple devices, we recommend syncing via Google/Apple/Microsoft.</p>
  `,
  },
  {
    header: "Can I use Passkey on public Wi-Fi?",
    description: `Yes—Passkeys are safe even on public networks. Your login is verified on your device, so nothing sensitive is sent over Wi‑Fi.`,
  },
  {
    header: "Why did I see “No account found with this Passkey”?",
    description: `This can happen if:<br/>
    <ul>
      <li>The Passkey was removed or reset on your device</li>
      <li>You’re signed into a different browser or user profile</li>
    </ul>
    To continue, log in using your email, password, and OTP—then set up your Passkey again if needed.`,
  },
  {
    header: "What are the security levels on the Kilde platform?",
    description: `
    <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px;">Security Level</th>
        <th style="border: 1px solid #ccc; padding: 8px;">What It Means</th>
        <th style="border: 1px solid #ccc; padding: 8px;">How to Improve</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Low</td>
        <td style="border: 1px solid #ccc; padding: 8px;">You’re using only your email and password -- that may not be secure enough.</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Protect your account by adding 2FA or Passkey (Face ID or fingerprint).</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">Moderate</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Great start! You’ve enabled one secure method, but adding both Passkey and 2FA gives you stronger protection.</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Add a Passkey for stronger security and backup access.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">High</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Your account is secured with both Passkey and a verified 2FA method—SMS or Authenticator.</td>
        <td style="border: 1px solid #ccc; padding: 8px;">Your account is now extra secure — nice work!</td>
      </tr>
    </table>
    <p style="margin-top: 10px;">We recommend everyone reach High Security before investing — it gives you both smooth access and reliable recovery options if needed.</p>
  `,
  },
];

export const withholdingTaxFaq = [
  {
    header: "What is Withholding Tax (WHT)?",
    description: `Withholding tax refers to the tax deducted at source on certain payments made to non-residents of Singapore. It is designed to ensure that non-residents fulfil their tax obligations on Singapore-sourced income.<br/><br/>
    In Singapore, entities such as KILDE are legally required to withhold a portion of payments made to non-residents and remit it directly to the Inland Revenue Authority of Singapore (IRAS).<br/><br/>
    The withholding tax rate varies depending on factors such as the recipient's country of residence and the existence of a tax treaty between Singapore and that country.<br/><br/>
    For KILDE investors, withholding tax may apply to interest payments from Singapore-based entities, though not all deals are subject to this tax.`,
  },
  {
    header: "Does the Withholding Tax (WHT) apply to Singaporeans?",
    description: `No, withholding tax does not apply to payments made to residents of Singapore.`,
  },
  {
    header: "Which deals on the KILDE platform attract withholding tax?",
    description: `Withholding tax will apply if:<br/>
    <ol>
      <li>The issuer of the debenture is based in Singapore, or</li>
      <li>The debenture is issued from a Singapore-based Special Purpose Vehicle (SPV)</li>
    </ol>
    For deals where the issuer is not based in Singapore and the debenture is not issued from a Singapore-based SPV, withholding tax will not apply.`,
  },
  {
    header: "How do I pay withholding tax?",
    description: `KILDE will withhold the applicable tax from your interest payments at the appropriate rate and remit it directly to the Inland Revenue Authority of Singapore (IRAS) on your behalf.`,
  },
  {
    header: "How do I know how much is WHT?",
    description: `The WHT rate for interest income is usually 15%. However, depending on factors such as the recipient's country of tax residence and the existence of a tax treaty between Singapore and that country, the recipient can enjoy a reduced rate of WHT.<br/><br/>
    You can refer to those rates here — <a href="https://taxsummaries.pwc.com/singapore/corporate/withholding-taxes" target="_blank">Singapore - Corporate - Withholding taxes</a>.<br/><br/>
    To enjoy the reduced rate of WHT, the recipient must provide a Certificate of Residence (COR) to KILDE, which KILDE files with Singapore IRAS.`,
  },
  {
    header: "Can I have more details on tax guidance?",
    description: `For detailed guidance on the tax treatment of interest income for individuals in Singapore, please refer to the Inland Revenue Authority of Singapore (IRAS) webpage titled "Interest". This resource provides comprehensive information on taxable and non-taxable interest, including examples and reporting requirements.<br/><br/>
    You can access this guidance directly <a href="http://iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/what-is-taxable-what-is-not/interest" target="_blank">here.</a><br/><br/>
    Please note that while this page offers valuable insights, it may not explicitly reference Section 13(1)(zh) of the Income Tax Act. For specific legal provisions, consulting the Income Tax Act or seeking professional tax advice is recommended.`,
  },
  {
    header:
      "What is Certificate of Residence or Certificate of Tax Residence (COR)?",
    description: `COR is a document that certifies the country of tax residence. This is required to be submitted every year to enjoy the benefit of tax treaties between Singapore and other countries.<br/><br/>
    It is important to note that the country of tax residence might be different from the country of residence. The country of tax residence is determined based on the tax laws and regulations of the country you reside in. Individuals who travel to other countries for various reasons are most affected by this. So, it is important to check your Tax residency every year, depending on the tax laws of your country of residence.<br/><br/>
    To enjoy a reduced rate of WHT, you have to submit a COR even if the tax residence is the same as your residency and any other documents confirming your residency are not sufficient.`,
  },
  {
    header: "What are the requirements for a valid COR?",
    description: `According to IRAS, a COR should have the below details to be considered valid:<br/>
    <ol>
      <li>Be certified by the foreign tax authority of the non-resident.</li>
      <li>Be in English. If the COR is not in English, please obtain an English-translated copy.</li>
      <li>Clearly state that:
        <ol type="A">
          <li>The non-resident company is a resident of the foreign country/region for DTA purposes and</li>
          <li>The year(s) that the COR is applicable for.</li>
        </ul>
      </li>
    </ol>`,
  },
  {
    header: "How can I get the Certificate of Tax Residence (COR)?",
    description: `At the end of each year, you can apply for a COR in the respective country’s tax website where the recipient is a resident. The residential status of the recipient can be determined in accordance with the tax laws of the country where he usually lives or works. In most of the countries you can apply for COR only after the end of the year (after 31st December).<br/><br/>
    You can navigate to the portals here to apply for COR here:<br/><br/>
    <table style="border-collapse: collapse; width: 100%;">
      <tr><th style="border: 1px solid #ccc; padding: 8px;">Country</th><th style="border: 1px solid #ccc; padding: 8px;">Website</th><th style="border: 1px solid #ccc; padding: 8px;">Estimated Time</th></tr>
      <tr><td style="border: 1px solid #ccc; padding: 8px;">UAE</td><td style="border: 1px solid #ccc; padding: 8px;"><a href="https://tax.gov.ae/en/services/issuance.of.tax.certificates.aspx" target="_blank">Federal Tax Authority - Issuance Of Tax Certificates (Tax Residency And Commercial Activities Certificates)</a></td><td style="border: 1px solid #ccc; padding: 8px;">10–15 Business days</td></tr>
      <tr><td style="border: 1px solid #ccc; padding: 8px;">Malaysia</td><td style="border: 1px solid #ccc; padding: 8px;"><a href="https://mytax.hasil.gov.my/" target="_blank">MyTax</a></td><td style="border: 1px solid #ccc; padding: 8px;">10–15 Business days</td></tr>
      <tr><td style="border: 1px solid #ccc; padding: 8px;">Germany</td><td style="border: 1px solid #ccc; padding: 8px;"><a href="https://verwaltung.bund.de/leistungsverzeichnis/EN/leistung/99102057022000" target="_blank">Bundesportal | Applying for a certificate of residence under a treaty to avoid double taxation</a></td><td style="border: 1px solid #ccc; padding: 8px;">Up to 1 month</td></tr>
      <tr><td style="border: 1px solid #ccc; padding: 8px;">Czech Republic</td><td style="border: 1px solid #ccc; padding: 8px;"><a href="https://ipc.gov.cz/en/forms-and-documents/certificate-of-residence/" target="_blank">Certificate of Residence - ipc.gov.cz</a></td><td style="border: 1px solid #ccc; padding: 8px;">Up to 1 month</td></tr>
      <tr><td style="border: 1px solid #ccc; padding: 8px;">Saudi Arabia</td><td style="border: 1px solid #ccc; padding: 8px;"><a href="https://zatca.gov.sa/en/eServices/Pages/eServices_084.aspx" target="_blank">Tax Residency Certificate</a></td><td style="border: 1px solid #ccc; padding: 8px;">5 minutes</td></tr>
    </table>`,
  },
  {
    header: "What are my options at KILDE regarding COR & WHT?",
    description: `At KILDE, you can choose between two options:<br/><br/>
    <b>Option 1:</b> If you are certain that you will be able to provide the COR after the end of the year you can opt for a reduced rate of WHT and you will be required to provide the COR after the year end but before the end of February. (eg. for the year 2025, you will have to provide the COR to Kilde between January 01, 2026 to February 28, 2026).<br/><br/>
    <b>Option 2:</b>You can choose not to provide COR, in this case you will have to pay 15% WHT.`,
  },
  {
    header:
      "What happens if I don’t get the Certificate of Tax Residence (COR) after year-end?",
    description: `If you have opted to provide COR and hence, a reduced rate of WHT will be deducted and paid to IRAS, Singapore. After the end of the year, if you are not able to provide the COR, you will be required to pay the balance WHT (total WHT to be paid is 15%), and additionally, IRAS may charge a penalty of 5% on WHT. (For example, if you have opted for a reduced tax rate of 5% and if you do not provide COR at the year end, you will be charged to pay the remaining 10% WHT and IRAS may also charge a penalty of 5% on WHT.)`,
  },
  {
    header:
      "Can I submit any other document instead of Certificate of Tax Residence (COR)?",
    description: `No, IRAS strictly monitors the forms submitted and according to IRAS, you can only submit a COR and it should adhere to the requirements of IRAS.<br/><br/>
    It is important to note that other proof of residence like a residential card or tax paid challans etc.. are not considered a valid proof of tax residence.`,
  },
];

export const marketMakerFaq = [
  {
    header: "How can I redeem purchased bonds early",
    description: `You can redeem the purchased bonds before maturity at the set early redemption date (capital call date) at the same price you subscribed to the bond. You will receive all coupons up to the date of redemption.<br/><br/>
     Selling your bond to the Market Maker allows you to redeem your investment at any time before maturity, instead of waiting for the scheduled capital call or maturity date.`,
  },
  {
    header: "Who is the Market Maker?",
    description: `Market Maker, a registered private limited company and shareholder of Kilde, purchases bonds from Kilde’s investors at a fixed discounted price.`,
  },
  {
    header: "Which bonds can I sell to the Market Maker?",
    description: `Not all bonds are eligible. Bonds must be from issuers approved by the Market Maker. The “Sell Today” option for such bonds is available on the tranche page. We will also display a “Market Maker” badge to identify eligible tranches easily.<br/><br/>
    If a tranche is eligible for sale to the Market Maker, you will see a "Sell today" option inside your portfolio’s “Early Redemption Request” section. If the Market Maker has insufficient liquidity or the tranche is not approved, the sell option will be disabled.`,
  },
  {
    header: "What is “Available Liquidity”?",
    description: `Available Liquidity is the total amount of funds the Market Maker currently has to buy back bonds across all eligible issuers. You must lower the amount if your sell request exceeds the available liquidity.`,
  },
  {
    header: "How is the sale price calculated?",
    description: `<p>Your sale price is based on:</p>
      <ul>
        <li>The Face value of the <b>purchase debenture</b> (your invested principal).</li>
        <li><b>The discount rate </b> is calculated using a fixed daily discount rate of  (0.11%) × number of days until the applicable capital call date.</li>
        <li><b>Accrued interest.</b></li>
      </ul>
      <ul>
        <li>Discount per debenture = Face value × Discount rate</li>
        <li>Price per debenture = Face value – Discount per debenture</li>

        <li>Purchase price = Number of debenture × Price per debenture</li>

        <li>Final value (Total amount) = Purchase price + Total accrued interest</li>
      </ul>`,
  },
  {
    header: "How does the capital call notice period affect the discount?",
    description: `<p>
    <ul>
      <li>If you sell <b>before</b> the notice period ends → the discount is based on the next capital call date.</li><br/><br/>
      <li>If you sell <b>after</b> the notice period ends → the discount is based on the following capital call date.</li>.
    </ul>
    </p>`,
  },
  {
    header: "Can I cancel my selling request?",
    description: `Yes, you can cancel it before the settlement date. Once cancelled, the liquidity will be restored to the pool.`,
  },
  {
    header: "When will I receive the funds after selling?",
    description: `The funds will be credited to your account on the next settlement date/time during working days at the end of the same day or the next day.`,
  },
  {
    header: "What documents do I receive after the sale?",
    description: `You will receive a <b>Note of Acceptance (NOA)</b> confirming the sale. A standard buy/sell agreement will also be available on the platform for your reference. You can read before you make a sell order.`,
  },
  {
    header: "Are there any limits on how much I can sell?",
    description: `<p>Yes, the maximum amount is lower or equal to:</p>
      <ul>
        <li>Your total invested amount in that tranche.</li>
        <li>The current available liquidity in the pool.</li>
      </ul>`,
  },
  {
    header: "If the issuer has defaulted on its obligations, can I still sell the bonds to the Market Maker?",
    description: `If the issuer is in default distress, all tranches of the issuer will be deemed ineligible for sale to the Market Maker.`,
  },
];


export const Icons = {
  gray: {
    General: General_icon,
    GettingStarted: Getting_start_icon,
    VerificationSecurity: Verif_sec_icon,
    Investing: Investing_icon,
    AutoInvest: Auto_invest_icon,
    Taxation: Taxation_icon,
  },
  blue: {
    General: General_blue_icon,
    GettingStarted: Getting_start_blue_icon,
    VerificationSecurity: Verif_sec_blue_icon,
    Investing: Investing_blue_icon,
    AutoInvest: Auto_invest_blue_icon,
    Taxation: Taxation_blue_icon,
  },
};

export const helpDeskItems = [
  {
    value: 1,
    label: "General Information",
    activeIcon: General_blue_icon,
    defaultIcon: General_icon,
  },
  {
    value: 2,
    label: "Getting Started",
    activeIcon: Getting_start_blue_icon,
    defaultIcon: Getting_start_icon,
  },
  // {
  //   value: 3,
  //   label: "Verification and Security",
  //   activeIcon: Verif_sec_blue_icon,
  //   defaultIcon: Verif_sec_icon,
  // },
  {
    value: 3,
    label: "Investing",
    activeIcon: Investing_blue_icon,
    defaultIcon: Investing_icon,
  },
  {
    value: 4,
    label: "Auto-Invest",
    activeIcon: Auto_invest_blue_icon,
    defaultIcon: Auto_invest_icon,
  },
  {
    value: 5,
    label: "Security",
    activeIcon: Help_desk_blue_key,
    defaultIcon: Help_desk_key,
  },
  {
    value: 6,
    label: "Withholding Tax",
    // activeIcon: Tax_key,
    // defaultIcon: Tax_blue,
    activeIcon: Taxation_blue_icon,
    defaultIcon: Taxation_icon,
  },
  {
    value: 7,
    label: "Market Maker",
    activeIcon: Tax_key,
    defaultIcon: Tax_blue,
  },
];

export const formatAccountNumberwithStar = (accountNumber) => {
  const maskedPart = "*".repeat(accountNumber.length - 4);
  const lastFourDigits = accountNumber.slice(-4);
  const fullMaskedNumber = maskedPart + lastFourDigits;
  const formattedNumber = fullMaskedNumber.replace(/(.{4})(?=.)/g, "$1 ");
  return (
    <span>
      {formattedNumber.split(" ").map((group, index) => (
        <span
          key={index}
          style={{
            marginRight: "8px",
            marginTop: "5px",
            display: "inline-block",
            wordBreak: "break-word",
          }}
        >
          {group}
        </span>
      ))}
    </span>
  );
};

export const formatAccountNumber = (accountNumber) => {
  const formattedNumber = accountNumber.replace(/(\d{4})(?=\d)/g, "$1 ");

  return (
    <span>
      {formattedNumber.split(" ").map((group, index) => (
        <span
          key={index}
          style={{
            marginRight: "8px",
            marginTop: "5px",
            display: "inline-block",
            wordBreak: "break-word",
          }}
        >
          {group}
        </span>
      ))}
    </span>
  );
};

export const highlightMatch = (text, searchValue) => {
  if (!searchValue) return text;

  // Escape special regex characters in searchValue
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const safeSearchValue = escapeRegExp(searchValue);

  const regex = new RegExp(`(${safeSearchValue})`, "gi");

  const container = document.createElement("div");
  container.innerHTML = text;

  const anchors = container.querySelectorAll("a");
  anchors.forEach((anchor) => {
    anchor.removeAttribute("style");

    const span = anchor.querySelector("span");
    if (span) {
      const textBeforeSpan = anchor.childNodes;
      for (let i = 0; i < textBeforeSpan.length; i++) {
        if (textBeforeSpan[i].nodeType === Node.TEXT_NODE) {
          anchor.removeChild(textBeforeSpan[i]);
          break;
        }
      }
    }
  });

  container.innerHTML = container.innerHTML.replace(regex, (match) => {
    return `<span class="highlight">${match}</span>`;
  });

  return container.innerHTML;
};

export const bankOptions = [
  "DBS Bank",
  "OCBC Bank",
  "UOB Bank",
  "Bank of Singapore",
  "Citibank Singapore Limited",
  "Citibank,N.A.",
  // "HSBC Bank",
  // "Standard Chartered",
  "BNP Paribas",
  "RHB Singapore",
  "Bank of China Limited",
  "CIMB Bank Berhad",
  "Deutsche Bank AG",
  "Maybank Singapore Limited",
  "Malayan Banking Berhad",

  "Hsbc Bank (Singapore) Limited",
  "The Hongkong and Shanghai Banking C",
  "Standard Chartered Bank (Singapore)",
  "Standard Chartered Bank",
];

export const bankSwiftCodes = {
  "DBS Bank": "DBSSSGSG",
  "OCBC Bank": "OCBCSGSG",
  "UOB Bank": "UOVBSGSG",
  "Bank of Singapore": "INGPSGSG",
  "Citibank Singapore Limited": "CITISGSL",
  "Citibank,N.A.": "CITISGSG",
  // "HSBC Bank": "HSBCSGSG",
  // "Standard Chartered": "SCBLSG22",
  "BNP Paribas": "BNPASGSG",
  "RHB Singapore": "RHBBSGSG",
  "Bank of China Limited": "BKCHSGSG",
  "CIMB Bank Berhad": "CIBBSGSG",
  "Deutsche Bank AG": "DEUTSGSG",
  "Maybank Singapore Limited": "MBBESGS2",
  "Malayan Banking Berhad": "MBBESGSG",

  "Hsbc Bank (Singapore) Limited": "HSBCSGS2",
  "The Hongkong and Shanghai Banking C": "HSBCSGSG",
  "Standard Chartered Bank (Singapore)": "SCBLSG22",
  "Standard Chartered Bank": "SCBLSGSG",
};

export const currencies = ["ALL", "USD", "SGD", "EUR"];

export const dealStatus = ["all", "new", "active", "past"];

export const dealStatusLabels = (dealStatus) => {
  switch (dealStatus) {
    case "new":
      return "New Deals";
    case "active":
      return "Active Deals";
    case "past":
      return "Past Deals";
    default:
      return "All Deals";
  }
};

export const rating = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
];

export const trancheRatingsObject = (trancheRatings) =>
  trancheRatings?.map((rating) => ({
    label: rating,
    value: rating,
  }));

export const trancheInterestObject = (trancheInterest) =>
  trancheInterest?.map((rating) => ({
    label: rating,
    value: rating,
  }));

export const sortRatingsByOrder = (ratings) => {
  const gradeOrder = [
    "A+",
    "A",
    "A-",
    "BB-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D",
  ];
  const orderMap = new Map(gradeOrder.map((grade, index) => [grade, index]));

  if (!Array.isArray(ratings)) return [];

  return [...ratings].sort((a, b) => {
    return (
      (orderMap.get(a.label) ?? Infinity) - (orderMap.get(b.label) ?? Infinity)
    );
  });
};

export const Tranchecolumns = [
  {
    title: "Tranche number / Borrower",
    dataIndex: "TrancheNumber",
  },
  {
    title: "",
    dataIndex: "Blank",
  },
  {
    title: "Currency",
    dataIndex: "Currency",
  },
  {
    title: "Rating",
    dataIndex: "Rating",
  },
  {
    title: "Interest rate",
    dataIndex: "InterestRate",
  },
  {
    title: "Interest frequency",
    dataIndex: "InterestFrequency",
  },
  {
    title: "Available to invest",
    dataIndex: "AvailableInvest",
  },
  {
    title: "Outstanding principal",
    dataIndex: "OutstandingPrincipal",
  },
  {
    title: "Maturity",
    dataIndex: "MaturityDate",
  },
  {
    title: "",
    dataIndex: "RightArrow",
  },
];

export const formatTrancheData = (
  user,
  list,
  navigate,
  investorClickedTranche
) => {
  return list?.map((index) => ({
    key: index?.trancheNumber,
    Country:
      index?.countries?.length > 0
        ? index?.countries.map((countryCode, idx) => (
          <span
            key={idx}
            style={{ filter: "drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.10))" }}
            className={`mb-5 ml-5 mt-0 fi fi-${countryCode.toLowerCase()}`}
          />
        ))
        : "-",
    TrancheNumber: (
      <div
        onClick={async () => {
          const payload = {
            eventType: "TRANCHE_VIEW",
            pageUrl: `${window.location.origin}/tranche-invest/${index?.uuid}`,
            details: { id: index?.trancheNumber },
          };
          await investorClickedTranche(payload);
          navigate(`${ROUTES.TRANCH_INVEST}/${index?.uuid}`);
        }}
        className="cursor-pointer"
      >
        <p className="m-0">{index?.trancheNumber}</p>
        <h3 className="m-0">{index?.details?.title}</h3>
      </div>
    ),
    Blank: (
      <div>
        {index?.capitalCallFrequency !== 0 && (
          <Tag color="default" className="tranche-tag">
            {" "}
            Early redemption _{" "}
            {getPaymentFrequencyHeading(
              index?.paymentPeriodInTerms,
              index?.capitalCallFrequency
            )}
          </Tag>
        )}
        <br />
        <Tag color="default" className="tranche-tag">
          {index?.collateral[0] === "Unsecured" ? (
            "Unsecured"
          ) : (
            <Tooltip title="If a borrowing institution goes out of business, investors holding senior debt are first priority to get paid. Senior debt is also backed by assets which can be sold to repay what's owed.">
              <span>Senior secured</span>
            </Tooltip>
          )}
        </Tag>
      </div>
    ),
    Currency: index?.currencyCode,
    Rating: index?.creditRating,
    InterestRate: formatCurrency("", index?.interestRate) + "%",
    InterestFrequency: formatPeriod(index?.paymentPeriodInTerms),
    AvailableInvest: formatCurrency(
      index?.currencyCode === "USD"
        ? "$"
        : index?.currencyCode === "SGD"
          ? "S$"
          : "€",
      index?.principalAvailable
    ),
    OutstandingPrincipal: formatCurrency(
      index?.currencyCode === "USD"
        ? "$"
        : index?.currencyCode === "SGD"
          ? "S$"
          : "€",
      index?.principalSettled
    ),
    MaturityDate: britishFormatDate(index?.maturityDate),
    RightArrow: (
      <Button
        title="Invest"
        style={{
          width: "auto",
          cursor:
            user?.investorStatus !== "ACTIVE" ||
              index?.principalAvailable <= 0 ||
              index?.trancheStatus !== "ISSUED"
              ? "not-allowed"
              : "pointer",
        }}
        disabled={
          user?.investorStatus !== "ACTIVE" ||
          index?.principalAvailable <= 0 ||
          index?.trancheStatus !== "ISSUED"
        }
        className={
          user?.investorStatus !== "ACTIVE" ||
            index?.principalAvailable <= 0 ||
            index?.trancheStatus !== "ISSUED"
            ? "invest-buttoncard-table-disabled"
            : "invest-buttoncard-table"
        }
        onClick={() => navigate(`${ROUTES.TRANCH_INVEST}/${index?.uuid}`)}
      >
        Invest
      </Button>
    ),
  }));
};

export function clearAllCookiesForDomain(domain) {
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();
    document.cookie = `${cookieName}=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  });
}

export function removeFundAndRecordTag() {
  localStorage.removeItem("showFundTranches");
  localStorage.removeItem("recordTag");
  localStorage.removeItem("currencyCode");
  Cookies.remove("referral_code");
}

export function clearUserSession() {
  const keepKeys = [
    "currency",
    "hasPasskey",
    "availableDevices",
    "skip2FAPrompt",
    "showFundTranches",
    "recordTag",
    "lastLoginMethod",
  ];
  const keysToRemove = [];

  // Safely collect keys to remove
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !keepKeys.includes(key)) {
      keysToRemove.push(key);
    }
  }

  // Remove unwanted keys
  keysToRemove.forEach(function (key) {
    localStorage.removeItem(key);
  });

  // Clear specified cookies
  const cookieNames = [
    "sid",
    "auth_inv_token",
    "userUid",
    "singpass_code",
    "XSRF-TOKEN",
    "verificationToken",
    "systemId",
    "user",
  ];

  cookieNames.forEach(function (cookie) {
    Cookies.remove(cookie);
  });

  // Optional third-party cleanup
  if (typeof resetJivoChat === "function") {
    resetJivoChat();
  }
}

export const addUnderscoreBeforeText = (filename) => {
  const parts = filename.split("_");
  return parts.length > 1 ? parts[0] : filename;
};

export const formatAddress = (regadd) => {
  if (!regadd) return "";

  const { block, unit, street, floor, building, postal, country } = regadd;

  let addressParts = [];

  if (block?.value) {
    addressParts.push(`Block ${block.value}`);
  }
  if (floor?.value && unit?.value) {
    addressParts.push(`#${floor.value}-${unit.value}`);
  } else if (unit?.value) {
    addressParts.push(`#${unit.value}`);
  }
  if (building?.value) {
    addressParts.push(building.value);
  }
  if (street?.value) {
    addressParts.push(street.value);
  }
  if (postal?.value) {
    addressParts.push(` ${postal.value}`);
  }
  if (country?.desc) {
    addressParts.push(country.desc);
  }
  return addressParts.join(", ");
};

export const formatPeriod = (period) => {
  const periodMap = {
    months: "Monthly",
    years: "Annually",
    quarters: "Quarterly",
  };

  return periodMap[period.toLowerCase()] || period;
};

export const isValidResponse = (obj) => {
  return (
    obj &&
    (!obj.errors || obj.errors.length === 0) &&
    (!obj.fieldErrors || Object.keys(obj.fieldErrors).length === 0)
  );
};

export const getPaymentFrequencyHeading = (
  paymentPeriodInTerms,
  capitalCallFrequency
) => {
  if (paymentPeriodInTerms === "months") {
    if (capitalCallFrequency === 1) return "Monthly";
    if (capitalCallFrequency === 2) return "2 Months";
    if (capitalCallFrequency === 3) return "Quarterly";
    if (capitalCallFrequency === 6) return "Semi-Annually";
    if (capitalCallFrequency === 12) return "Annually";
  } else if (paymentPeriodInTerms === "quarters") {
    if (capitalCallFrequency === 1) return "Quarterly";
    if (capitalCallFrequency === 2) return "Semi-Annually";
    if (capitalCallFrequency === 3) return "3 Quaters";
    if (capitalCallFrequency === 4) return "Annually";
    if (capitalCallFrequency === 6) return "6 Quaters";
    if (capitalCallFrequency === 12) return "12 Quaters";
  } else if (paymentPeriodInTerms === "years") {
    if (capitalCallFrequency === 1) return "Yearly";
    if (capitalCallFrequency === 2) return "2 Years";
    if (capitalCallFrequency === 3) return "3 Years";
    if (capitalCallFrequency === 6) return "6 Years";
    if (capitalCallFrequency === 12) return "12 Years";
  }

  return "No";
};

// export const APP_STORE_LINKS = {
//   IOS: "https://apps.apple.com/us/app/google-authenticator/id388497605",
//   Android:
//     "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&pli=1",
// };

export const useSkeletonCountByBreakpoint = () => {
  const screens = useBreakpoint();

  const getSkeletonCount = () => {
    if (screens.xxl) return 4;
    if (screens.xl) return 3;
    if (screens.lg) return 3;
    if (screens.md) return 2;
    return 1;
  };

  return getSkeletonCount();
};

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

export const APP_STORE_LINKS = {
  IOS: "https://apps.apple.com/us/app/google-authenticator/id388497605",
  Android:
    "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&pli=1",
};

export const truncateText = (text, maxLength = 24) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export const convertMaskedFormat = (maskedPhone) => {
  if (!maskedPhone) return "";
  const last4 = maskedPhone.slice(-4); // Get last 4 digits
  return "xxxxxxx" + last4;
};

export const formatSection = (text) => {
  // Insert space between camelCase words
  const spaced = text.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Capitalize first word, lowercase second (like "Pay slip")
  return spaced.replace(/\b\w+\b/g, (word, index) =>
    index === 0
      ? word.charAt(0).toUpperCase() + word.slice(1)
      : word.toLowerCase()
  );
};

export function updateAuthToken(newToken) {
  const cookieName = "auth_inv_token";

  // Check if the cookie exists
  if (Cookies.get(cookieName)) {
    // Remove the existing cookie
    Cookies.remove(cookieName);
  }

  // Set the new cookie value
  Cookies.set(cookieName, newToken);
}

export function getMaxOutstandingCurrency(accounts) {
  if (!Array.isArray(accounts) || accounts.length === 0) return "USD";

  const maxOutstanding = accounts.reduce(
    (max, item) => {
      return item.outstandingPrincipal > max.outstandingPrincipal ? item : max;
    },
    { outstandingPrincipal: -Infinity }
  );
  return maxOutstanding?.currencyCode || "USD";
}

export const footerMenuItems = [
  {
    key: "invest",
    label: "Invest",
    children: [
      { key: "individual", label: "Individual Investors", link: INVESTOR_CATEGORY.INDIVIDUAL },
      { key: "family", label: "Family Office", link: INVESTOR_CATEGORY.FAMILY_OFFICE },
      { key: "fund", label: "Mont Kilde Fund ↗", link: INVESTOR_CATEGORY.MONT_KILDE_FUND },
    ],
  },
  {
    key: "why-kilde",
    label: "Why Kilde",
    children: [
      { key: "stats", label: "Statistics", link: WHY_KILDE.STATISTICS },
      { key: "security", label: "Security", link: WHY_KILDE.SECURITY },
      { key: "beat", label: "Beat Inflation", link: WHY_KILDE.BEAT_INFLATION },
      { key: "income", label: "Monthly Passive income", link: WHY_KILDE.MONTHLY_INCOME },
      { key: "put_cash", label: "Put Idle Cash to Work", link: WHY_KILDE.PUT_IDLE_MONEY_TO_WORK },
      { key: "returns", label: "Smoothen Portfolio Returns", link: WHY_KILDE.PORTFOLIO_RETURN },
      { key: "impact", label: "Make an Impact on Lives", link: WHY_KILDE.IMPACT_ON_LIVES },
    ],
  },
  {
    key: "platform",
    label: "Platform",
    children: [
      { key: "how", label: "How it works", link: PLATFORM.HOW_WORK },
      { key: "faq", label: "FAQ", link: PLATFORM.FAQ },
      { key: "glossary", label: "Glossary", link: PLATFORM.GLOSSARY },
      { key: "borrowers", label: "For Borrowers", link: PLATFORM.FOR_BORROWER },
    ],
  },
  {
    key: "company",
    label: "Company",
    children: [
      { key: "about", label: "About Kilde", link: COMPANY.ABOUT },
      { key: "team", label: "Our Team", link: COMPANY.TEAM },
      { key: "contact", label: "Contacts", link: COMPANY.CONTACT },
    ],
  },
  {
    key: "insights",
    label: "Insights",
    children: [
      { key: "insights", label: "Our Insights", link: INSIGHTS.INSIGHT },
      { key: "basics", label: "Basics of Investing", link: INSIGHTS.BASIC_INVESTING },
      { key: "news", label: "Reviews & Comparisons", link: INSIGHTS.REVIEW },
      { key: "press", label: "Kilde in the Press", link: INSIGHTS.KILDE_PRESS },
      { key: "video", label: "Video Hub", link: INSIGHTS.VIDEO_HUB },
    ],
  },
];

export const handleMenuClick = (key) => {
  switch (key) {
    case "individual":
      window.location.href = INVESTOR_CATEGORY.INDIVIDUAL;
      break;
    case "family":
      window.location.href = INVESTOR_CATEGORY.FAMILY_OFFICE;
      break;
    case "fund":
      window.location.href = INVESTOR_CATEGORY.MONT_KILDE_FUND;
      break;
    case "stats":
      window.location.href = WHY_KILDE.STATISTICS;
      break;
    case "security":
      window.location.href = WHY_KILDE.SECURITY;
      break;
    case "beat":
      window.location.href = WHY_KILDE.BEAT_INFLATION;
      break;

    case "income":
      window.location.href = WHY_KILDE.MONTHLY_INCOME;
      break;
    case "put_cash":
      window.location.href = WHY_KILDE.PUT_IDLE_MONEY_TO_WORK;
      break;
    case "returns":
      window.location.href = WHY_KILDE.PORTFOLIO_RETURN;
      break;
    case "impact":
      window.location.href = WHY_KILDE.IMPACT_ON_LIVES;
      break;
    case "endowus":
      window.location.href = WHY_KILDE.COMPARE_KILDE;
      break;
    case "syfe":
      window.location.href = WHY_KILDE.KILDE_VS_SYFE;
      break;
    case "chocolate":
      window.location.href = WHY_KILDE.KILDE_VS_CHOCOLATE;
      break;
    case "stashaway":
      window.location.href = WHY_KILDE.KILDE_VS_STASHAWAY;
      break;
    case "how":
      window.location.href = PLATFORM.HOW_WORK;
      break;
    case "faq":
      window.location.href = PLATFORM.FAQ;
      break;
    case "glossary":
      window.location.href = PLATFORM.GLOSSARY;
      break;
    case "borrowers":
      window.location.href = PLATFORM.FOR_BORROWER;
      break;
    case "about":
      window.location.href = COMPANY.ABOUT;
      break;
    case "team":
      window.location.href = COMPANY.TEAM;
      break;
    case "contact":
      window.location.href = COMPANY.CONTACT;
      break;
    case "basics":
      window.location.href = INSIGHTS.BASIC_INVESTING;
      break;
    case "news":
      window.location.href = INSIGHTS.REVIEW;
      break;
    case "insights":
      window.location.href = INSIGHTS.INSIGHT;
      break;
    case "press":
      window.location.href = INSIGHTS.KILDE_PRESS;
      break;
    case "video":
      window.location.href = INSIGHTS.VIDEO_HUB;
      break;
    default:
      break;
  }
};