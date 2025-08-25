import { setTranche, setCapitals,setBondSells } from "../Reducer/investor";

export const setTrancheResponse = (data, dispatch) => {
    dispatch(setTranche(data));
};

export const setCapitalRequests = (data, dispatch) => {
    dispatch(setCapitals(data));
};
export const setBondSellRequests = (data, dispatch) => {
    dispatch(setBondSells(data));
};

