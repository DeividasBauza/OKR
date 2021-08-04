import { createSlice } from "@reduxjs/toolkit";

export const activeUserSlice = createSlice({
  name: "activeUser",
  initialState: {
    activeUser: { },
  },
    reducers: {
      setActive: (state, action) =>{
        state.activeUser = action.payload;
      }
  },
});

export default activeUserSlice.reducer;

export const selectActiveUser = (state) => state.activeUser.activeUser;

export const { setActive } = activeUserSlice.actions;