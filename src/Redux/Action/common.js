import { countryList, currentState, selectedCurrency } from "../Reducer/common";

export const getCountryList = (data, dispatch) => {
  dispatch(countryList(data));
};

export const setCurrentSate = (data, dispatch) => {
  dispatch(currentState(data));
};
export const selectedCurrencyState = (data, dispatch) => {
  dispatch(selectedCurrency(data));
};
