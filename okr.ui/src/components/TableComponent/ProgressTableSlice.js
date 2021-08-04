import { createSlice } from "@reduxjs/toolkit"
export const progressTableSlice = createSlice({
    name: "progressTable",
    initialState: {
        columns: [
            { id: 'displayName', label: 'Name' },
            { id: 'objectives', label: 'Objectives', type: "number" },
            { id: 'progress', label: 'Progress', type: "number", postfix: "%" },
            { id: 'lastCheckIn', label: 'Last check in', type: "date"}
        ],

        rows: [],
    },
    reducers: {
        setProgressTableData: (state, action) =>{
            state.rows = action.payload;
        },
    },
});

export default progressTableSlice.reducer;
export const {
    setProgressTableData
  } = progressTableSlice.actions;
export const selectColumns = state => state.progressTable.columns;
export const selectRows = state => state.progressTable.rows;
  

  