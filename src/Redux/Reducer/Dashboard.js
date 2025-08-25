import { createSlice } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

const userInitialState = {
    filterData: {},
};

const dashboardSlice = createSlice({
    name: "Dashboard",
    initialState: userInitialState.filterData,
    reducers: {
        tranchFilter: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { tranchFilter } = dashboardSlice.actions;

export default combineReducers({
    tranchFilter: dashboardSlice.reducer,
});
