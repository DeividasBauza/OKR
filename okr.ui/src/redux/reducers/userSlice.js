import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "users",

  initialState: {
    azureUsers: [],
    favorites: [],
  },

  reducers: {
    fetchAzureUsers: (state, action) => {
      state.azureUsers = action.payload;
    },
    removeFavoriteUsers: (state, action) => {
      const userIds = action.payload.map(user => user.favouriteUserId);
      state.favorites = state.favorites.filter(user => !userIds.includes(user.id));
    },
    addFavoriteUser: (state, action) => {
      const user = state.azureUsers.find(user => user.id === action.payload.favouriteUserId);
      state.favorites = [...state.favorites, user];
    },
    setFavorites: (state, action) => {
         state.favorites = state.azureUsers.filter(user=> action.payload.includes(user.id));
    }
  },
});

export default userSlice.reducer;
export const selectAzureUsers = (state) => state.users.azureUsers;
export const selectFavoriteUsers = (state) => state.users.favorites;
export const { fetchAzureUsers, addFavoriteUser, setFavorites, removeFavoriteUsers } = userSlice.actions;
