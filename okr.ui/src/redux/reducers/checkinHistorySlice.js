import { createSlice } from "@reduxjs/toolkit";

export const checkinHistorySlice = createSlice({
  name: "history",

  initialState: {
    checkinCreated: false,
    modalOpen: false
  },
  reducers: {
    setHistoryModalOpen: (state, action) =>{
      state.modalOpen = action.payload
    },
    setCheckinCreated: (state, action) =>{
      state.checkinCreated = action.payload;
    },
  }
});

export default checkinHistorySlice.reducer;
export const selectHistoryModalState = (state) => state.checkinHistory.modalOpen;
export const selectCheckinCreated = (state) => state.checkinHistory.checkinCreated;

export const { setHistoryModalOpen, setCheckinCreated } = checkinHistorySlice.actions;
