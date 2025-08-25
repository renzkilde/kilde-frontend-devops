import Cookies from "js-cookie";

export const isAuthenticated = () => {
  const auth_inv_token = Cookies.get("auth_inv_token");
  if (auth_inv_token) {
    return true;
  } else {
    return false;
  }
};
