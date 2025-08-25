import Subscription_fees from "../../../Assets/Images/Icons/subscription_fees_tx.svg";
import Deposit from "../../../Assets/Images/Icons/deposit_tx.svg";
import Withdraw_request from "../../../Assets/Images/Icons/withdraw_request_tx.svg";
import Withdraw from "../../../Assets/Images/Icons/withdraw_tx.svg";
import Repaid from "../../../Assets/Images/Icons/repaid_tx.svg";
import Settlement from "../../../Assets/Images/Icons/settlement_tx.svg";
import Internal_ts from "../../../Assets/Images/Icons/internal_ts_tx.svg";
import Referral_payment from "../../../Assets/Images/Icons/referral_payment_tx.svg";
import Repayment from "../../../Assets/Images/Icons/repayment_tx.svg";
import Currency_exchange from "../../../Assets/Images/Icons/currency_exchange_tx.svg";
import Fee from "../../../Assets/Images/Icons/fee_tx.svg";

export const txStatusMap = {
    "Subscription (Principal)": {
        className: "subscription",
        icon: Subscription_fees,
        label: "Subscription (Principal)",
    },
    "Subscription (Accrued interest)": {
        className: "subscription",
        icon: Subscription_fees,
        label: "Subscription (Accrued interest)",
    },
    "Subscription (Fee)": {
        className: "subscription",
        icon: Subscription_fees,
        label: "Subscription (Fee)",
    },
    "SUBSCRIPTION (PRINCIPAL_DISCOUNT)": {
        className: "subscription",
        icon: Subscription_fees,
        label: "Subscription (Principal Discount)",
    },
    Deposit: {
        className: "deposit",
        icon: Deposit,
        label: "Deposit",
    },
    "Withdrawal request": {
        className: "widthdrawal-request",
        icon: Withdraw_request,
        label: "Withdrawal request",
    },
    REPAID: {
        type: "txType",
        className: "repaid",
        icon: Repaid,
        label: "Repaid",
    },
    WITHDRAW: {
        type: "txType",
        className: "withdraw",
        icon: Withdraw,
        label: "Withdraw",
    },
    "Settlement (Principal)": {
        className: "settlement",
        icon: Settlement,
        label: "Settlement (Principal)",
    },
    "Settlement (Fee)": {
        className: "settlement",
        icon: Settlement,
        label: "Settlement (Fee)",
    },
    "Settlement (Accrued interest)": {
        className: "settlement",
        icon: Settlement,
        label: "Settlement (Accrued interest)",
    },
    "Repayment (Interest)": {
        className: "repayment",
        icon: Repayment,
        label: "Repayment (Interest)",
    },
    "Repayment (Principal)": {
        className: "repayment",
        icon: Repayment,
        label: "Repayment (Principal)",
    },
    "REPAYMENT (WHT)": {
        className: "repayment",
        icon: Repayment,
        label: "Repayment (WHT)",
    },
    "Currency exchange request": {
        className: "currency-exchange",
        icon: Currency_exchange,
        label: "Currency exchange",
    },
    "Currency exchange (in)": {
        className: "currency-exchange",
        icon: Currency_exchange,
        label: "Currency exchange (incoming)",
    },
    "Currency exchange (out)": {
        className: "currency-exchange",
        icon: Currency_exchange,
        label: "Currency exchange (outgoing)",
    },
    REFERRAL_PAYMENT: {
        type: "txType",
        className: "referral-payment",
        icon: Referral_payment,
        label: "Referral payment",
    },
    INTERNAL_TRANSFER: {
        type: "txType",
        className: "internal-transfer",
        icon: Internal_ts,
        label: "Internal transfer",
    },
    "FEE (INVESTOR_MANAGEMENT_FEE)": {
        className: "fee",
        icon: Fee,
        label: "FEE (INVESTOR_MANAGEMENT_FEE)",
    },
    "Reward Granting": {
        className: "fee",
        icon: Fee,
        label: "Reward Granting",
    },
    BANK_CHARGES: {
        type: "txType",
        className: "currency-exchange",
        icon: Currency_exchange,
        label: "Bank Charges",
    },
    WITHDRAW_BANK_CHARGES: {
        type: "txType",
        className: "currency-exchange",
        icon: Currency_exchange,
        label: "Bank Charges",
    },
    "Reward Revoking": {
        className: "fee",
        icon: Fee,
        label: "Reward Revoking",
    },
    "INVESTMENT_SALE (ACCRUED_INTEREST)": {
        className: "settlement",
        icon: Settlement,
        label: "Investment Sale (Accrued interest)",
    },
    "INVESTMENT_SALE (PRINCIPAL_DISCOUNT)": {
        className: "settlement",
        icon: Settlement,
        label: "Investment Sale (Principal Discount)",
    },
    "INVESTMENT_SALE (PRINCIPAL)": {
        className: "settlement",
        icon: Settlement,
        label: "Investment Sale (Principal)",
    },
};
