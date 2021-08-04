import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({

  name: "login",
  initialState: {
    loggedInUser: 
    {
      displayName: "",
    },
  },
    reducers: {
      login: (state, action) =>{
        state.loggedInUser = action.payload;
      },
      logout: state => {
        state.loggedInUser = null;
      }
  },
});

export default loginSlice.reducer;

export const selectLoggedInUser = (state) => state.login.loggedInUser;

export const { login, logout } = loginSlice.actions;
