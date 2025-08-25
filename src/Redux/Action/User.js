import { setUser } from "../Reducer/User";

export const setUserDetails = (data, dispatch) => {
  dispatch(setUser(data));
};
