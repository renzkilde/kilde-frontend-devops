import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { stepperRedirection } from "../../Utils/Reusables";

const getUserFromCookies = () => {
  const getUserDetail = Cookies.get("user");
  return getUserDetail === undefined ? null : JSON.parse(getUserDetail);
};

const userRedux = {};
const fallbackUser = getUserFromCookies();
const user = Object.keys(userRedux).length !== 0 ? userRedux : fallbackUser;

const userInitialState = {
  country: {},
  current: stepperRedirection(user),
  currency: "USD",
};

const common = createSlice({
  name: "commonLists",
  initialState: userInitialState,
  reducers: {
    countryList: (state, action) => {
      return { ...state, country: { ...action.payload } };
    },
    currentState: (state, action) => {
      return { ...state, current: action.payload };
    },
    selectedCurrency: (state, action) => {
      return { ...state, currency: action.payload };
    },
  },
});

export const { countryList, currentState, selectedCurrency } = common.actions;

export default common.reducer;
