import { AccStatementFilter, DashboardData, setTransactionData } from "../Reducer/Dashboards";

export const setDasboardData = (data, dispatch) => {
    dispatch(DashboardData(data));
};

export const setAccStatementFilter = (data, dispatch) => {
    dispatch(AccStatementFilter(data));
};

export const setTransactionList = (data, dispatch) => {
    dispatch(setTransactionData(data));
};