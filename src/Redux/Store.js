import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Reducer/User";
import kycIndividualReducer from "./Reducer/KycIndividual";
import commonReducer from "./Reducer/common";
import kycOrganizationReducer from "./Reducer/KycOrganization";
import DashboardReducer from "./Reducer/Dashboard";
import DashboardsReducer from "./Reducer/Dashboards";
import WalletReducer from './Reducer/Wallet'
import InvestorReducer from './Reducer/investor'

const rootReducer = {
  user: userReducer,
  kycIndividual: kycIndividualReducer,
  common: commonReducer,
  kycOrganization: kycOrganizationReducer,
  dashboard: DashboardReducer,
  wallet: WalletReducer,
  dashboards: DashboardsReducer,
  investor: InvestorReducer
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
