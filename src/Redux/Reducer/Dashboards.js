import { createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

const dashboardInitialState = {
    dashboardRes: [],
    accStatementFilterData: {},
    transactionData: [],
};

const dashboardsSlice = createSlice({
    name: "Dashboard",
    initialState: dashboardInitialState,
    reducers: {
        DashboardData: (state, action) => {
            return { ...state, dashboardRes: action.payload };
        },
        AccStatementFilter: (state, action) => {
            return { ...state, accStatementFilterData: action.payload };
        },
        setTransactionData: (state, action) => {
            return {
                ...state, transactionData:
                    { ...action.payload }

            };
        },
    },
});

export const { DashboardData, AccStatementFilter, setTransactionData } = dashboardsSlice.actions;

export default combineReducers({
    DashboardData: dashboardsSlice.reducer,
});
