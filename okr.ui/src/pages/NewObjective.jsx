import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import TextField from "@material-ui/core/TextField";
import RepeatComponent from "../components/Repeat/RepeatComponent.jsx";
import DropDown from "../components/DropDown.jsx";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "../redux/reducers/toastCardSlice.js";
import "../styles/pages/new-objective.scss";
import { selectLoggedInUser } from "../redux/reducers/loginSlice.js";
import { selectObjectiveState, resetObjective, selectLoadingSpinner, setLoadingSpinner } from "../redux/reducers/objectiveSlice.js";
import { setDirtyState } from "../components/CheckInComponent/CheckInSlice.js";
import { addObjective, editObjective as editObjectiveInBack } from "../api/objectiveApi";
import { Modal } from "@material-ui/core";
import { LoopCircleLoading } from 'react-loadingg';

const NewObjective = forwardRef((props, ref) => {
  const [objective, setObjective] = useState({});//do not touch this
  const objectiveState = useSelector(selectObjectiveState);
  const [description, setDescription] = useState("");
  const [checkInEvery, setCheckIn] = useState("");
  const [repeatData, setRepeatData] = useState([{}]);
  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);
  const [startDateDisabled, setStartDateDisabled] = useState(false);
  const loggedInUser = useSelector(selectLoggedInUser);
  const loading = useSelector(selectLoadingSpinner);
  const dispatch = useDispatch();
  useImperativeHandle(ref, () => ({
    onSubmit() {
      handleSubmit();
    },
  }));

  useEffect(() => {
    if (objectiveState.id) {
      setDescription(objectiveState.description);
      setCheckIn(objectiveState.checkInEvery);
      setRepeatData([...objectiveState.keyResults]);
      setStartDate(objectiveState.startDate);
      setEndDate(objectiveState.endDate);
      setStartDateDisabled(true);
    }
    return () => {
      dispatch(resetObjective());
    }
  }, [objectiveState, dispatch]);

  function validateForm() {
    if (description.trim() === "") {
      return false;
    }
    for (let value of repeatData) {
      if (
        value.description.trim() === "" ||
        value.type.trim() === "" ||
        value.maxValue < 1 ||
        value.maxValue > 2147483647
      ) {
        return false;
      }
    }
    if (endDate <= 0 || startDate <= 0 || !checkInEvery) {
      return false;
    }
    return true;
  }
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = () => {
    if (validateForm()) {
      if (objectiveState.id) {
        dispatch(setLoadingSpinner(true));
        editObjective();
      }
      else {
        dispatch(setLoadingSpinner(true));
        createObjective();
      }
    } else {
      dispatch(
        enqueueSnackbar({
          message: "Please fill up all fields",
          options: {
            variant: "error",
          },
        })
      );
    }
  };

  const isDirty = () => {
    dispatch(setDirtyState(validateDirtyState()));
  };

  const validateDirtyState = () => {
    if (objectiveState.id) {
      return (description !== objectiveState.description ||
        checkInEvery !== objectiveState.checkInEvery ||
        JSON.stringify(repeatData) !== JSON.stringify(objectiveState.keyResults) ||
        startDate !== objectiveState.startDate ||
        endDate !== objectiveState.endDate
      );
    }
    return (description.length > 0 ||
      checkInEvery ||
      repeatData.length !== 1 ||
      repeatData[0].type ||
      repeatData[0].description ||
      repeatData[0].maxValue ||
      startDate ||
      endDate
      ? true
      : false
    );
  };

  const editObjective = () => {
    repeatData.map(function (item) {
      if (typeof item.id == 'number') {
        delete item.id;
      }
      return item;
    });
    const newObjective = {
      id: objectiveState.id,
      description: description,
      checkInEvery: checkInEvery,
      startDate,
      endDate,
      keyResults: repeatData,
      ownerId: loggedInUser.id
    };
    dispatch(editObjectiveInBack(newObjective));
  };
  const createObjective = () => {
    repeatData.map(function (item) {
      delete item.id;
      return item;
    });

    const newObjective = {
      description: description,
      checkInEvery: checkInEvery,
      startDate,
      endDate,
      onTrack: null,
      keyResults: repeatData,
      closed: false,
      ownerId: loggedInUser.id,
      checkinHistory: [],
    };
    dispatch(addObjective(newObjective));
  };
  return (<>
    {objectiveState &&
      <div className="new-objective">
        <form className="new-objective__form">
          <div className="new-objective__objective-cont">
            <div className="new-objective__title">Objective</div>
            <TextField
              value={description}
              inputProps={{ maxLength: 150 }}
              fullWidth
              variant="outlined"
              label="Description"
              onChange={(e) => {
                setDescription(e.target.value);
                isDirty();
              }}
            />
          </div>
          <div className="new-objective__objective-cont">
            <div className="new-objective__title">Key results</div>
            <RepeatComponent
              onChange={(data) => {
                setRepeatData(data);
                isDirty();
              }}
              options={["Percentage", "Numeric", "Completion"]}
              inputLabel="Description"
              dropdownLabel="Select a type"
              numericInputLabel="Target"
              keyResults={[...objectiveState.keyResults]}
            />
          </div>
          <div className="new-objective__check-in">
            <div className="new-objective__title">Check in every</div>
            <div className="new-objective__dropdown">
              <DropDown
                value={checkInEvery}
                onChange={(value) => {
                  setCheckIn(value);
                  isDirty();
                }}
                variant="outlined"
                options={[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ]}
              />
            </div>
          </div>
          <div className="new-objective__date-inputs">
            <TextField
              value={startDate}
              className="new-objective__date-input"
              onChange={(e) => {
                setStartDate(e.target.value);
                isDirty();
              }}
              label="Start date *"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: today,
                max: endDate,
              }}
            />
            <TextField
              value={endDate}
              className="new-objective__date-input"
              onChange={(e) => {
                setEndDate(e.target.value);
                isDirty();
              }}
              label="End date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: startDate ? startDate : today,
              }}
            />
          </div>
        </form>
      </div>}
    <Modal
      open={loading}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <LoopCircleLoading />
    </Modal>
  </>
  );
});
export default NewObjective;