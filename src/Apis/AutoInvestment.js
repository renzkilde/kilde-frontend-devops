import API_ROUTES from "../Config/ApiRoutes";
import { EMPTY_ARRAY, REQUEST_METHODS } from "../Utils/Constant";
import { apiHandler, dowloadReports } from "../Utils/Helpers";


export const AutoInvestmentListing = async (data) => {
    try {
        const url = API_ROUTES.AUTO_INVESTMENT.AUTO_INVESTMENT_LISTING;
        const result = await apiHandler(REQUEST_METHODS.POST, url, data);
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const getStratergySettings = async (data) => {
    try {
        const url = API_ROUTES.AUTO_INVESTMENT.STRATERGY_SETTINGS;
        const result = await apiHandler(REQUEST_METHODS.POST, url, data);
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const getAvailableInvestment = async (data) => {
    try {
        const url = API_ROUTES.AUTO_INVESTMENT.GET_AVAILABLE_INVESTMENT;
        const result = await apiHandler(REQUEST_METHODS.POST, url, data);
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const createStratergy = async (data) => {
    try {
        const url = API_ROUTES.AUTO_INVESTMENT.CREATE_STRATERGY;
        const result = await apiHandler(REQUEST_METHODS.POST, url, data);
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const editStrategy = async (data) => {
    try {
        const url = API_ROUTES.AUTO_INVESTMENT.EDIT_STRATEGY;
        const result = await apiHandler(REQUEST_METHODS.POST, url, data);
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const getStrategy = async (uuid) => {
    try {
        const url = `${API_ROUTES.AUTO_INVESTMENT.EDIT_STRATEGY}/${uuid}`;
        const result = await apiHandler(REQUEST_METHODS.GET, url, {});
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const deleteStrategy = async (data) => {
    try {
        const url = `${API_ROUTES.AUTO_INVESTMENT.EDIT_STRATEGY}/${data?.uuid}`;
        const result = await apiHandler(REQUEST_METHODS.POST, url, {});
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const pauseStrategy = async (data) => {
    try {
        const url = `${API_ROUTES.AUTO_INVESTMENT.EDIT_STRATEGY}/${data?.uuid}/pause`;
        const result = await apiHandler(REQUEST_METHODS.POST, url, {});
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const activateStrategy = async (data) => {
    try {
        const url = `${API_ROUTES.AUTO_INVESTMENT.EDIT_STRATEGY}/${data?.uuid}/activate`;
        const result = await apiHandler(REQUEST_METHODS.POST, url, {});
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const stratergyAcceptanceDownload = async (data) => {
    try {
        const url = API_ROUTES.AUTO_INVESTMENT.STRATEGY_ACCEPTANCE_DOWNLOAD;
        const result = await dowloadReports(REQUEST_METHODS.POST, url, data, );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};