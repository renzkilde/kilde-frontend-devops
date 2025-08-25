import {
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
} from "../Reducer/KycIndividual";

export const setIdentifyProofDetails = (data, dispatch) => {
  dispatch(setIdentity(data));
};

export const setInvestorIdentificationDetails = (data, dispatch) => {
  dispatch(setInvestorIdentification(data));
};

export const setAddressPhoneDetails = (data, dispatch) => {
  dispatch(setAddressPhone(data));
};

export const setLegalSigners = (data, dispatch) => {
  dispatch(setLegalSign(data));
};

export const setPersonalInfoDetails = (data, dispatch) => {
  dispatch(setPersonalInfo(data));
};

export const setDocSubmissionDetails = (data, dispatch) => {
  dispatch(setDocSubmission(data));
};

export const setLivenessDetails = (data, dispatch) => {
  dispatch(setLiveness(data));
};

export const setIdentityVerificationResponse = (data, dispatch) => {
  dispatch(setIdentityResponse(data));
};

export const setStatusCheckResponse = (data, dispatch) => {
  dispatch(setStatusCheck(data));
};

export const setPersonalData = (data, dispatch) => {
  dispatch(setPeronalDetails(data));
};
