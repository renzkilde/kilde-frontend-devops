import { createSlice } from "@reduxjs/toolkit";

const kycInitialState = {
  kycIndividual: {
    investorIdentification: {},
    identifyVerification: {},
    livenessCheck: {},
    addressPhone: {},
    legalSigner: {},
    personalInfo: {},
    document: {},
    liveness: {},
    identityResponse: {},
    regtankStatusCheck: {},
    personalDetails: {},
  },
};

const kycIndividual = createSlice({
  name: "kycIndividual",
  initialState: kycInitialState.kycIndividual,
  reducers: {
    setIdentity: (state, action) => {
      return { ...state, identifyVerification: action.payload };
    },
    setAddressPhone: (state, action) => {
      const { data, validator } = action.payload;
      return {
        ...state,
        addressPhone: {
          data: { ...state.addressPhone.data, ...data },
          validator: { ...state.addressPhone.validator, ...validator },
        },
      };
    },
    setLegalSign: (state, action) => {
      const { data, validator } = action.payload;
      return {
        ...state,
        legalSigner: {
          data: { ...state.legalSigner.data, ...data },
          validator: { ...state.legalSigner.validator, ...validator },
        },
      };
    },
    setPersonalInfo: (state, action) => {
      const { data, validator } = action.payload;
      return {
        ...state,
        personalInfo: {
          data: { ...state.personalInfo.data, ...data },
          validator: { ...state.personalInfo.validator, ...validator },
        },
      };
    },
    setInvestorIdentification: (state, action) => {
      return { ...state, investorIdentification: action.payload };
    },
    setDocSubmission: (state, action) => {
      return { ...state, document: action.payload };
    },
    setLiveness: (state, action) => {
      return { ...state, liveness: action.payload };
    },
    setIdentityResponse: (state, action) => {
      return { ...state, identityResponse: action.payload };
    },
    setStatusCheck: (state, action) => {
      return { ...state, livenessCheck: action.payload };
    },
    setPeronalDetails: (state, action) => {
      return { ...state, personalDetails: action.payload };
    },
  },
});

export const {
  setIdentity,
  setAddressPhone,
  setLegalSign,
  setPersonalInfo,
  setInvestorIdentification,
  setDocSubmission,
  setLiveness,
  setIdentityResponse,
  setStatusCheck,
  setPeronalDetails,
} = kycIndividual.actions;

export default kycIndividual.reducer;
