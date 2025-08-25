import API_ROUTES from "../Config/ApiRoutes";
import { EMPTY_ARRAY, REQUEST_METHODS } from "../Utils/Constant";
import { apiHandler } from "../Utils/Helpers";

export const fetchVeriffURL = async (data) => {
  try {
    const url = API_ROUTES.VERIFF.VERIFF_URL;
    const result = await apiHandler(REQUEST_METHODS.POST, url, data);
    return result;
  } catch {
    return EMPTY_ARRAY;
  }
};
