import {
  setEntityDocument,
  setCorporateInfo,
} from "../Reducer/KycOrganization";

export const setEntityDocumentDetails = (data, dispatch) => {
  dispatch(setEntityDocument(data));
};

export const setCorporateInfoDetails = (data, dispatch) => {
  dispatch(setCorporateInfo(data));
};
