import { tranchFilter } from "../Reducer/Dashboard";

export const setTranchFilter = (data, dispatch) => {
    dispatch(tranchFilter(data));
};
