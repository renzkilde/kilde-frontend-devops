import { createSlice } from "@reduxjs/toolkit";

const InvestorInitialState = {
  tranche: [],
  capital: [],
  bondSell: [],
};

const investorSlice = createSlice({
  name: "investor",
  initialState: InvestorInitialState,
  reducers: {
    setTranche: (state, action) => {
      return { ...state, tranche: { ...action.payload } };
    },
    setCapitals: (state, action) => {
      return { ...state, capital: { ...action.payload } };
    },
    setBondSells: (state, action) => {
      return { ...state, bondSell: { ...action.payload } };
    },
  },
});

export const { setTranche, setCapitals, setBondSells } = investorSlice.actions;

export default investorSlice.reducer;
