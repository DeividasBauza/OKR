import React, { useEffect, useState } from "react";
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from "../../components/RadioGroup/RadioGroup";
import TextField from "@material-ui/core/TextField"
import "./CheckInComponent.scss";
import { useDispatch, useSelector } from "react-redux";
import CheckinHistoryComponent from "../CheckinHistoryComponent/CheckinHistoryComponent";
import { Prompt } from 'react-router';

import { setDirtyState } from './CheckInSlice.js';
import { selectDirtyState } from './CheckInSlice.js';

import { InputNumeric } from "../InputNumeric/InputNumeric";
import { createCheckinItem } from "../../api/objectiveApi";
import { selectObjectiveWithHistory } from "../../redux/reducers/objectiveSlice";

import ButtonLoader from "../../components/ButtonLoader/ButtonLoader.jsx";

const CheckInComponent = () => {
  const objectiveWithHistory = useSelector(selectObjectiveWithHistory);
  const [objective, setObjective] = useState({});
  const [message, setMessage] = useState("");
  const dirtyState = useSelector(selectDirtyState);

  const dispatch = useDispatch();
  const [updateFlag, setUpdateFlag] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setObjective({ ...objectiveWithHistory });
    setMessage("");
    setUpdateFlag(true);
  }, [objectiveWithHistory])

  useEffect(() => {
    dispatch(setDirtyState(
      JSON.stringify(objective) !== JSON.stringify(objectiveWithHistory)
      || message !== ""));
    return () => dispatch(setDirtyState(false));
  }, [objective, message, objectiveWithHistory, dispatch])

  const handleSwitchChange = (newValue, i) => {
    const copyKeyResult = [...objective.keyResults];
    copyKeyResult[i] = {
      ...copyKeyResult[i], value: newValue === true ? 1 : 0
    }
    setObjective({ ...objective, keyResults: copyKeyResult });
  }
  const handleSliderStop = (newValue, i) => {
    const copyKeyResult = [...objective.keyResults];
    copyKeyResult[i] = {
      ...copyKeyResult[i], value: newValue
    }
    setObjective({ ...objective, keyResults: copyKeyResult });
  }
  const handleTextFieldChange = (newValue, i) => {
    const copyKeyResult = [...objective.keyResults];
    copyKeyResult[i] = {
      ...copyKeyResult[i], value: newValue
    }
    setObjective({ ...objective, keyResults: copyKeyResult });
  }
  const handleOnTrackChange = (newValue, i) => {
    setObjective({ ...objective, onTrack: getNewValue(newValue) });
  }

  const getNewValue = (value) => {
    switch (value) {
      case "On track": return true;
      case "Off track": return false;
      default: return null;
    }
  }

  const createCheckin = () => {
    const results = objective.keyResults.map(keyResult => ({
      ...{},
      description: keyResult.description,
      value: keyResult.value,
      id: keyResult.id,
      type: keyResult.type
    }));
    const historyItem = {
      keyResultValues: results,
      checkInDate: null,
      objectiveId: objectiveWithHistory.id,
      onTrack: objective.onTrack,
      message: message.trim() === "" ? "" : message
    }
    dispatch(createCheckinItem(historyItem));
  }

  const setEditField = (type, index, currentValue, maxValue) => {
    switch (type) {
      case "Numeric":
        return (
              <InputNumeric
                onChange={(value) => handleTextFieldChange(value, index)}
                className="check-in-component__input"
                variant="outlined"
                placeholder={`Enter a value (Target: ${maxValue})`}
                value={currentValue}
                inputProps={{ maxLength: 150, max: maxValue, min: 0, width: "70%" }}
              />
        )
      case "Percentage":
        return (
          <Slider
            step={1}
            defaultValue={currentValue}
            valueLabelDisplay="auto"
            onChangeCommitted={(e, newValue) => { handleSliderStop(newValue, index) }}
          />
        );
      case "Completion":
        return (
          <>
            <FormControl className="check-in-component__toggle">
              <FormControlLabel
                control={<Switch checked={currentValue === 1 ? true : false} onChange={(e) => handleSwitchChange(e.target.checked, index)} color="primary" />}
                label="Complete"
              />
            </FormControl>
          </>
        );
      default:
        return;
    }
  }
  async function handleValidSubmit(e) {
    setLoading(true);
    e.preventDefault();
    createCheckin();
    await setUpdateFlag(false);
    dispatch(setDirtyState(false));
  }

  return (
    <div className="checkin">
      <Prompt
        when={
          dirtyState && updateFlag
        }
        message='You have unsaved changes, are you sure you want to leave?'
      />
      <div className="checkin__column1">
        
        {objective.id && <form className="checkin__check-in-component" onSubmit={(e) => handleValidSubmit(e)}>
        <div className="checkin__column1__description">{objective.description}</div>
          {objective.keyResults.map((element, index) => {
            return (
              <div key={element.id} className="checkin__check-in-component__key-value">
                <div htmlFor="" className="checkin__check-in-component__label"><label>{element.description}</label></div>
                {setEditField(element.type, index, element.value, element.maxValue)}
              </div>
            )
          })}
          <RadioGroup row
            value={objective.onTrack === null ? "None" : objective.onTrack ? "On track" : "Off track"}
            elements={["On track", "Off track", "None"]}
            onChange={value => {
              handleOnTrackChange(value);
            }}
          />
          <div htmlFor="" className="checkin__check-in-component__label"><label>Message</label></div>
          <TextField
            onChange={(e) => {
              setMessage(e.target.value);

            }}
            value={message}
            className="checkin__check-in-component__text-field"
            variant="outlined"
            multiline
            label="Enter a message"
            inputProps={{ maxLength: 300, rows: 6 }}
          />
          <ButtonLoader type="submit" variant="contained" color="primary" loading={loading} label={"Check in"} />
        </form>}
      </div>
      <div className="checkin__column2">
        <CheckinHistoryComponent />
      </div>
    </div>
  );
}
export default CheckInComponent;