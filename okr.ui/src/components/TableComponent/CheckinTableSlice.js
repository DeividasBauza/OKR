import { createSlice } from "@reduxjs/toolkit"

const date = new Date().toLocaleString('en-US');
export const checkinTableSlice = createSlice({
    name: "checkin-table",
    initialState: {
        columns: [
            { id: 'name', label: 'Name' },
            { id: 'objective', label: 'Objectives' },
            { id: 'overall', label: 'Overall', postfix: "%"},
            { id: 'change', label: 'Change', postfix: "%" },
            { id: 'checkInDate', label: 'Date', type: "date"}
        ],
        rows: [

        ]
    },
    reducers: {
        setCheckinTableData: (state, action) =>{
            state.rows = action.payload;
        },
    },
});

export const {
    setCheckinTableData
} = checkinTableSlice.actions;

export default checkinTableSlice.reducer;

export const selectColumns = state => state.checkinTable.columns;
export const selectRows = state => state.checkinTable.rows;
  
