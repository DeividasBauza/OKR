import { OBJECTIVES_ENDPOINT } from "../constants/endpoint";
import {
  setObjectives,
  addObjective as objectiveAdd,
  deleteObjective as objectiveDelete,
  updateObjectives,
  objectiveStateUpdate,
  setObjectiveWithHistory,
  setNewObjectiveModalOpen,
  setObjectiveUpdated,
  setLoadingSpinner,
} from "../redux/reducers/objectiveSlice";
import { enqueueSnackbar } from "../redux/reducers/toastCardSlice";
import { acquireToken } from "../app/msalClient";
import { setCheckinCreated } from "../redux/reducers/checkinHistorySlice";
import { setDirtyState } from "../components/CheckInComponent/CheckInSlice";

export const fetchObjectives =
  (ownerId, year = 0, quarter = 0) =>
  async (dispatch) => {
    const token = await acquireToken();
    ownerId = ownerId ? ownerId : token.uniqueId;
    fetch(
      OBJECTIVES_ENDPOINT +
        (year === 0 || quarter === 0
          ? "?ownerId=" + ownerId
          : "?ownerId=" + ownerId + "&year=" + year + "&quarter=" + quarter),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    )
      .then((resp) => resp.json())
      .then((data) => dispatch(setObjectives(data.value)))
      .catch(() =>
        dispatch(
          enqueueSnackbar({
            message: "There was an error while showing objective(s)",
            options: {
              variant: "error",
            },
          })
        )
      );
  };

export const fetchObjectiveWithCheckinHistory =
  (objectiveId) => async (dispatch) => {
    const token = await acquireToken();
    fetch(OBJECTIVES_ENDPOINT + "/" + objectiveId, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => dispatch(setObjectiveWithHistory(data.value)))
      .catch(() =>
        dispatch(
          enqueueSnackbar({
            message: "There was an error while fetching objective",
            options: {
              variant: "error",
            },
          })
        )
      );
  };

export const createCheckinItem = (historyItem) => async (dispatch) => {
  const token = await acquireToken();
  fetch(OBJECTIVES_ENDPOINT + "/" + historyItem.objectiveId + "/checkin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(historyItem),
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (data.errors[0]) {
        dispatch(
          enqueueSnackbar({
            message: data.errors[0],
            options: {
              variant: "error",
            },
          })
        );
      } else {
        dispatch(setObjectiveWithHistory({}));
        dispatch(setCheckinCreated(true));
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

export const editObjective = (objective) => async (dispatch) => {
  const token = await acquireToken();
  fetch(OBJECTIVES_ENDPOINT + "/" + objective.id, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(objective),
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (data.errors[0]) {
        data.errors.map((error) => {
          dispatch(setLoadingSpinner(false));
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
        dispatch(setLoadingSpinner(false));
        dispatch(updateObjectives(data.value));
        dispatch(setNewObjectiveModalOpen(false));
        dispatch(setDirtyState(false));
        dispatch(setObjectiveUpdated(true));
        dispatch(
          enqueueSnackbar({
            message: "Objective updated",
            options: {
              variant: "success",
            },
          })
        );
      }
    });
};

export const addObjective = (objective) => async (dispatch) => {
  const token = await acquireToken();
  fetch(OBJECTIVES_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(objective),
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (data.errors[0]) {
        dispatch(setLoadingSpinner(false));
        dispatch(
          enqueueSnackbar({
            message: data.errors[0],
            options: {
              variant: "error",
            },
          })
        );
      } else {
        dispatch(setObjectiveUpdated(true));
        dispatch(setLoadingSpinner(false));
        dispatch(setNewObjectiveModalOpen(false));
        dispatch(setDirtyState(false));
        dispatch(
          enqueueSnackbar({
            message: "Objective created",
            options: {
              variant: "success",
            },
          })
        );
      }
    });
};

export const updateObjectiveState = (id, state) => async (dispatch) => {
  const token = await acquireToken();
  fetch(OBJECTIVES_ENDPOINT + "/" + id + "/state?closed=" + !state, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
  }).then(dispatch(objectiveStateUpdate({ id, state: !state })));
};

export const deleteObjective = (id) => async (dispatch) => {
  const token = await acquireToken();
  fetch(OBJECTIVES_ENDPOINT + "/" + id, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
  })
    .then((resp) => resp.json())
    .then((data) => dispatch(objectiveDelete(data.value)))
    .catch(() =>
      dispatch(
        enqueueSnackbar({
          message: "There was an error while deleting an objective",
          options: {
            variant: "error",
          },
        })
      )
    );
};
