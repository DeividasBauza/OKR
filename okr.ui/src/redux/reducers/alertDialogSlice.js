import { createSlice } from "@reduxjs/toolkit";

export const alertType = {
	LEAVE: "leave",
	DELETE: "delete",
}

export const alertDialogSlice = createSlice({
  name: "alertDialog",

  initialState: {
    modalOpen: false,
    type: alertType.LEAVE,
  },
  reducers: {
    setAlertDialogOpen: (state, action) => {
      state.modalOpen = action.payload
    },
    setAlertDialogType: (state, action) => {
      state.type = action.payload
    }
  },
});

export default alertDialogSlice.reducer;

export const selectAlertDialogState = (state) => state.alertDialog.modalOpen;

export const selectAlertDialogType = (state) => state.alertDialog.type;

export const { setAlertDialogOpen, setAlertDialogType } = alertDialogSlice.actions;