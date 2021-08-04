import { createSlice } from "@reduxjs/toolkit"

export const checkinSlice = createSlice({
    name: "checkin",
    initialState: {
        dirtyState: false
    },
    reducers: {
        setDirtyState: (state, action) => {
            state.dirtyState = action.payload;
        }
    },
});

export default checkinSlice.reducer;

export const selectDirtyState = (state) => state.checkin.dirtyState;
export const { setDirtyState } = checkinSlice.actions;
