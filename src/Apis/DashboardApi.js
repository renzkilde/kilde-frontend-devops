import API_ROUTES from "../Config/ApiRoutes";
import { EMPTY_ARRAY, REQUEST_METHODS } from "../Utils/Constant";
import {
  apiHandler,
  commitApiHandler,
  dowloadReports,
  TrancheAcceptancedowload,
} from "../Utils/Helpers";

export const TranchListing = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.TRANCH_LISTING;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const PastTranchListing = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.PAST_TRANCHE_LISTING;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const NewTranchListing = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.NEW_TRANCHE_LISTING;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const InvestTranche = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.INVEST_TRANCHE;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const trancheAcceptanceDownload = async (data) => {
  try {
    const url = `${API_ROUTES.DASHBOARD.TRANCHE_NO_OF_ACCEPTANCE}?trancheUuid=${data.trancheId}&amount=${data.amount}`;
    const result = await TrancheAcceptancedowload(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const bondSellPurchaseConditionDownload = async (data) => {
  try {
    const url = `${API_ROUTES.DASHBOARD.BOND_PURCHASE_CONDITION_DOWNLOAD}?trancheUuid=${data.trancheId}&amount=${data.amount}`;
    const result = await TrancheAcceptancedowload(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const RequestCurrencyExchange = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.CURRENCY_EXCHANGE;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const DashboardApi = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.DASHBOARD;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const Invest = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.INVEST;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const CommitInvest = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.COMMIT_INVEST;
    const result = await commitApiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const CancelInvest = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.CANCEL_INVEST;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const CapitalCallList = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.CAPITAL_CALL_REQUEST_LIST;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const BondSellList = async (trancheId) => {
  try {
    const url = `/api/investor/tranche/${trancheId}/sell-orders`;
    const result = await apiHandler(REQUEST_METHODS.GET, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const CapitalCallRequest = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.CAPITAL_CALL_REQUEST;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

// bnd sell request
export const bondSellRequest = async (tracheId, data) => {
  try {
    const url = `/api/investor/tranche/${tracheId}/calculate-sell-offer`;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const finalBondSellRequest = async (tracheId, data) => {
  try {
    const url = `/api/investor/tranche/${tracheId}/submit-sell-order`;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const CancelCapitalCallRequest = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.CANCEL_CAPITAL_CALL;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const CancelBondCallRequest = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.CANCEL_BOND_SELL;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const InvestmentSummary = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.INVESTMENT_SUMMARY;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const ReservedInvestmentsSummary = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.RESERVED_INVESTMENT;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const cancelReservedInvestmentsSummary = async (data) => {
  try {
    const url = `/api/investor/tranche/${data?.trancheUuid}/cancel-reservation`;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const approvedReservedInvestmentsSummary = async (data) => {
  try {
    const url = `/api/investor/tranche/${data?.trancheUuid}/settle-reservation`;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const UnsubscribeTranche = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.TRANCHE_UNSUBSCRIBE;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const AccountStatementSummary = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.ACCOUNT_STATEMENT_SUMMARY;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const AccountStatementSummaryDownload = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.ACCOUNT_STATEMENT_SUMMARY_DOWNLOAD;
    const result = await dowloadReports(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const AccountStatementDownloadPdf = async (data) => {
  try {
    const url = API_ROUTES.DASHBOARD.ACCOUNT_STATEMENT_SUMMARY_DOWNLOAD_PDF;
    const result = await dowloadReports(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};

export const CancelReservationBond = async (data) => {
  try {
    const url = `/api/investor/tranche/${data?.trancheId}/cancel-reservation`;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
export const ReservationBond = async (data) => {
  try {
    const url = `/api/investor/tranche/${data?.trancheId}/settle-reservation`;
    const result = await apiHandler(REQUEST_METHODS.POST, url, {});
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
