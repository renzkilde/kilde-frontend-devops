import {
  setAccoount,
  setWithdrawRequest,
  setOpenBankInfoModal,
} from "../Reducer/Wallet";

export const setAccountDetails = (data, dispatch) => {
  dispatch(setAccoount(data));
};

export const setWithdrawRequestList = (data, dispatch) => {
  dispatch(setWithdrawRequest(data));
};

export const setBankInfoModal = (data, dispatch) => {
  dispatch(setOpenBankInfoModal(data));
};
