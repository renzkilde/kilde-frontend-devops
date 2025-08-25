import { createSlice } from "@reduxjs/toolkit";

const kycOrganizationInitialState = {
  kycOrganization: {
    corporateInformation: {},
    entityDocument: {},
  },
};

const kycOrganization = createSlice({
  name: "kycOrganization",
  initialState: kycOrganizationInitialState.kycOrganization,
  reducers: {
    setEntityDocument: (state, action) => {
      return { ...state, entityDocument: action.payload };
    },

    setCorporateInfo: (state, action) => {
      const { data, validator } = action.payload;
      return {
        ...state,
        corporateInformation: {
          data: { ...state.corporateInformation.data, ...data },
          validator: { ...state.corporateInformation.validator, ...validator },
        },
      };
    },
  },
});

export const { setEntityDocument, setCorporateInfo } = kycOrganization.actions;

export default kycOrganization.reducer;
