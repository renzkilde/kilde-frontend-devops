import API_ROUTES from "../Config/ApiRoutes";
import { EMPTY_ARRAY, REQUEST_METHODS } from "../Utils/Constant";
import { apiHandler } from "../Utils/Helpers";

export const addBankApi = async (data) => {
    try {
        const url = API_ROUTES.WALLET.ADD_BANK;
        const result = await apiHandler(
            REQUEST_METHODS.POST,
            url,
            data
        );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const updateBankApi = async (data) => {
    try {
        const url = API_ROUTES.WALLET.UPDATE_BANK_ACCOUNT;
        const result = await apiHandler(
            REQUEST_METHODS.POST,
            url,
            data
        );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const GetBankAccountApi = async () => {
    try {
        const url = `${API_ROUTES.WALLET.GET_BANK_ACCOUNT}?page=1&pageSize=2`;
        const result = await apiHandler(
            REQUEST_METHODS.GET,
            url,
            {}
        );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const GetWithdrawalRequestListApi = async (filterPayload) => {
    try {
        const url = `${API_ROUTES.WALLET.GET_WITHDRAWAL_REQUEST}?page=${filterPayload?.page}&pageSize=${filterPayload?.pageSize}`;
        const result = await apiHandler(
            REQUEST_METHODS.GET,
            url,
            {}
        );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const RequestWithdrawalApi = async (data) => {
    try {
        const url = API_ROUTES.WALLET.REQUEST_WITHDRAWAL;
        const result = await apiHandler(
            REQUEST_METHODS.POST,
            url,
            data
        );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const CancelWithdrawalApi = async (data) => {
    try {
        const url = API_ROUTES.WALLET.CANCEL_WITHDRAWAL_REQUEST;
        const result = await apiHandler(
            REQUEST_METHODS.POST,
            url,
            data
        );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};

export const getCurrencyExchangeList = async (filterPayload) => {
    try {
        const url = `${API_ROUTES.WALLET.CURRENCY_EXCHANGE_LIST}?page=${filterPayload?.page}&pageSize=${filterPayload?.pageSize}`
        const result = await apiHandler(
            REQUEST_METHODS.GET,
            url,
        );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};