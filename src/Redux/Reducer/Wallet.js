import { createSlice } from "@reduxjs/toolkit";

const walletInitialState = {
  bankAccount: {},
  withDrawRequest: [],
  bankInfoModal: false,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState: walletInitialState,
  reducers: {
    setAccoount: (state, action) => {
      return { ...state, bankAccount: { ...action.payload } };
    },
    setWithdrawRequest: (state, action) => {
      return {
        ...state,
        withDrawRequest: [...(action.payload || [])],
      };
    },
    setOpenBankInfoModal: (state, action) => {
      return { ...state, bankInfoModal: action.payload };
    },
  },
});

export const { setAccoount, setWithdrawRequest, setOpenBankInfoModal } =
  walletSlice.actions;

export default walletSlice.reducer;
