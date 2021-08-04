import { createSlice } from "@reduxjs/toolkit";

const now = {
  quarter: Math.ceil((new Date().getMonth() + 1) / 3),
  year: new Date().getFullYear(),
}

export const quarterSwitchSlice = createSlice({
  name: "quarterSwitch",
  initialState: {
    quarterData: now,
  },
  reducers: {
    setQuarterData: (state, action) => {
      state.quarterData = action.payload;
    },
    resetQuarterData: (state) => {
      state.quarterData = now;
    },
    
  },
});

export default quarterSwitchSlice.reducer;

export const selectQuarterData = (state) => state.quarterSwitch.quarterData;

export const { setQuarterData,resetQuarterData } = quarterSwitchSlice.actions;
