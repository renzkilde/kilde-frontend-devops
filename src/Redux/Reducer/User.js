import { createSlice } from "@reduxjs/toolkit";

const userInitialState = {
  userData: {},
};

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState.userData,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
