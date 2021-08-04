import { createSlice } from "@reduxjs/toolkit"

export const toastCardSlice = createSlice({
  name: "toastCard",
  initialState: {
    notifications: []
  },
  reducers: {
    enqueueSnackbar: (state, action) => {
      state.notifications = [
        ...state.notifications,
        {
            message: action.payload.message,
            key: new Date().getTime() + Math.random(),
            options: action.payload.options ? 
            {
              variant: action.payload.options.variant ? action.payload.options.variant : "info",
              ...action.payload.options
            } 
            : { variant: "info" }
        }
      ];
    },
    closeSnackbar: (state, action) => {
      state.notifications = state.notifications.map(notification => ((notification.key === action.payload) ? { ...notification, dismissed: true } : { ...notification }));
    },
    removeSnackbar: (state, action) => {
      state.notifications = state.notifications.filter(notification => notification.key !== action.payload);
    },
  },
});

export const { enqueueSnackbar, closeSnackbar, removeSnackbar } = toastCardSlice.actions;

export const selectNotifications = state => state.toastCard.notifications;

export default toastCardSlice.reducer;