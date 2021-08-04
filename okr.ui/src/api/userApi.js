import {
  setFavorites,
  fetchAzureUsers,
  removeFavoriteUsers,
  addFavoriteUser,
} from "../redux/reducers/userSlice";
import {
  AZURE_USERS_ENDPOINT,
  FAVORITE_USERS_ENDPOINT,
} from "../constants/endpoint";
import { acquireToken } from "../app/msalClient";
import { enqueueSnackbar } from "../redux/reducers/toastCardSlice";

export const favoriteUsersFetch = (id) => async (dispatch) => {
  const token = await acquireToken();
  fetch(FAVORITE_USERS_ENDPOINT + "/" + id, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  })
    .then((resp) => resp.json())
    .then((data) => dispatch(setFavorites(data)));
};

export const azureUsersFetch = () => async (dispatch) => {
  const token = await acquireToken();
  fetch(AZURE_USERS_ENDPOINT, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  })
    .then((resp) => resp.json())
    .then((data) => 
    dispatch(fetchAzureUsers(data)));
}

export const removeFavorites = (users) => async (dispatch) => {
  const token = await acquireToken();
  fetch(FAVORITE_USERS_ENDPOINT, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(users),
  })
  .then((resp) => resp.json())
  .then((data) => {
    if (data.errors[0]) {
      data.errors.map((error) => {
        dispatch(
          enqueueSnackbar({
            message: error,
            options: {
              variant: "error",
            },
          })
        );
      });
    } else {
      dispatch(removeFavoriteUsers(users));
      dispatch(
        enqueueSnackbar({
          message: data.value,
          options: {
            variant: "success",
          },
        })
      );
    }
  });
   
};

export const addFavorite = (favorite) => async (dispatch) => {
  const token = await acquireToken();
  fetch(FAVORITE_USERS_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(favorite),
  }).then((resp) => resp.json())
  .then((data) => {
    if (data.errors[0]) {
      data.errors.map((error) => {
        dispatch(
          enqueueSnackbar({
            message: error,
            options: {
              variant: "error",
            },
          })
        );
      });
    } else {
      dispatch(addFavoriteUser(favorite));
      dispatch(
        enqueueSnackbar({
          message: data.value,
          options: {
            variant: "success",
          },
        })
      );
    }
  });
};
