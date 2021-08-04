import { createSlice } from "@reduxjs/toolkit";

export const drawerSlice = createSlice({
  name: "drawer",

  initialState: {
    drawerStatus: false,
    edit: false,
  },

  reducers: {
    changeDrawerStatus: (state, action) => {
      state.drawerStatus = action.payload;
    },
    setEdit: (state, action) => {
      state.edit = action.payload;
    }
  },
});

export default drawerSlice.reducer;

export const selectDrawerStatus = (state) => state.drawer.drawerStatus;
export const selectEdit = (state) => state.drawer.edit;
export const { changeDrawerStatus, setEdit } = drawerSlice.actions;
