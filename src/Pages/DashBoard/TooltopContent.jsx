import React from "react";
import ROUTES from "../../Config/Routes";
import { useNavigate } from "react-router-dom";
import Arrow_up_right from "../../Assets/Images/SVGs/arrow-up-right.svg";

export const walletWithdrawRequestListTooltipContent = (
  <div style={{ fontSize: 12 }}>
    "Processed" indicates that your payout request has been handled by kilde's
    bank platform, so your funds are on the way. However, the actual crediting
    of the funds will depend on the receiving beneficiary bank.
  </div>
);

export const walletTooltipContent = (
  <div style={{ fontSize: 12 }}>
    The funds available in your account to invest.
  </div>
);

export const TATooltipContent = (
  <div style={{ fontSize: 12 }}>
    The current value of your account with us. This is the sum of your
    outstanding investments, plus your funds committed to investments, plus
    funds available in your account to invest.
  </div>
);

export const committedTooltipContent = (
  <div style={{ fontSize: 12 }}>
    Your funds committed to an investment but not yet invested. Funds are
    invested on the same day, Monday to Friday, at 18.00 SGT, except on public
    holidays.
  </div>
);

export const investmentsTooltipContent = (
  <div style={{ fontSize: 12 }}>
    The value of your outstanding investments, including interest due but not
    yet received by your account.
  </div>
);

export const netAverageProfitabilityTooltip = (
  <div style={{ fontSize: 12 }}>
    The effective annual return on all your investments. The calculation
    includes all interest payments, capital sums returned, and applicable
    fees/charges.
  </div>
);

export const interestAccruedTooltip = (
  <div style={{ fontSize: 12 }}>
    The total interest received to date from your outstanding investments.
  </div>
);

export const interestForecastTooltip = (
  <div style={{ fontSize: 12 }}>
    The total future interest payments due from your outstanding investments.
  </div>
);

export const feesExpenseTooltip = (
  <div style={{ fontSize: 12 }}>
    The total fees paid on your outstanding investments.
  </div>
);

export const accruedInterestExpenseTooltip = (
  <div style={{ fontSize: 12 }}>
    Expense related to the sum of the daily interest payments accumulated since
    the last coupon payment until the subsequent settlement date of the
    outstanding investment(s).This amount is charged from investors to allow
    them to receive in full the future coupon payments.
  </div>
);

export const totalIncomeTooltip = (
  <div style={{ fontSize: 12 }}>
    The interest net of fees/expenses you can expect to receive from your
    investment over its full term. This is the sum of interest already received
    by you, plus forecast interest, less fees expenses and accrued interest
    expenses.
  </div>
);

export const showLifetimeIncomeTooltip = (
  <div style={{ fontSize: 12 }}>
    See income from all your investments, both past and outstanding.
  </div>
);

// export const downloadDocTooltipContent = (
//   <div style={{ fontSize: 12 }}>
//     All documents you can find and download in Document Center↗️
//   </div>
// );

export const DownloadDocTooltipContent = () => {
  const navigate = useNavigate();

  return (
    <div className="tooltip-text-account-statement">
      All documents you can find and download in{" "}
      <span
        style={{
          textDecoration: "underline",
          cursor: "pointer",
          fontWeight: 500,
        }}
        onClick={(e) => {
          e.stopPropagation();
          navigate(ROUTES.YOUR_INVESTMENT_TERMS, {
            state: { fromAccountStatement: true },
          });
        }}
      >
        Document Center <img src={Arrow_up_right} alt="Arrow_up_right" />
      </span>
    </div>
  );
};

export const capitalCallLimitCapTooltip = (percentage) => (
  <div style={{ fontSize: 12 }}>
    Investors can redeem up to {percentage}% of the outstanding principal of
    this tranche at each redemption date. While full redemption requests are
    allowed, they will be processed on a first-come, first-served basis, subject
    to the tranche’s redemption limit.
  </div>
);
