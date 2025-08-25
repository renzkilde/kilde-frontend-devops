import Axios from "axios";
import API_ROUTES from "../Config/ApiRoutes";
import { get_ga_clientid } from "../Utils/Helpers";

export const PublicEventApi = (data) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const body = {
      gaClientId: get_ga_clientid(),
      action: data,
      category: data,
    };
    let url = API_ROUTES.GA_CLIENT.EVENT;
    Axios.post(url, body, headers)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("Error", error);
  }
};
