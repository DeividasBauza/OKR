import React, { useEffect, useState } from "react";
import TableComponent from "../components/TableComponent/TableComponent";
import {
  selectColumns,
  selectRows,
} from "../components/TableComponent/CheckinTableSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../redux/reducers/loginSlice";
import { Container } from "@material-ui/core";
import CheckInComponent from "../components/CheckInComponent/CheckInComponent";
import "../styles/pages/checkin.scss";

import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { setDirtyState } from '../components/CheckInComponent/CheckInSlice.js';
import { selectDirtyState } from '../components/CheckInComponent/CheckInSlice.js';
import { selectObjectives, selectObjectiveWithHistory, setObjectives, setObjectiveWithHistory } from "../redux/reducers/objectiveSlice";
import { fetchObjectives, fetchObjectiveWithCheckinHistory } from "../api/objectiveApi";
import { selectCheckinCreated, setCheckinCreated  } from "../redux/reducers/checkinHistorySlice";
import { getCheckinTableData } from "../api/tablesApi";
import { selectFavoriteUsers } from "../redux/reducers/userSlice";

export default function CheckIn() {
  const loggedInUser = useSelector(selectLoggedInUser);
  const dirtyState = useSelector(selectDirtyState);
  const objective = useSelector(selectObjectiveWithHistory);
  const [dropdownValue, setDropdownValue] = useState("");
  const objectives = useSelector(selectObjectives).filter((o) => !o.closed);
  const checkinCreated = useSelector(selectCheckinCreated);
  const favoriteUsers = useSelector(selectFavoriteUsers);
  const dispatch = useDispatch();

  const checkinTable = {
    columns: useSelector(selectColumns),
    rows: useSelector(selectRows),
  };
  const handleObjectiveChange = (objective) => {
    dispatch(fetchObjectiveWithCheckinHistory(objective.id));
  }

  useEffect(() => {
      dispatch(getCheckinTableData());
  }, [favoriteUsers, dispatch])

  useEffect(()=>{
    dispatch(fetchObjectives());
    dispatch(setObjectiveWithHistory({}));
    return () => dispatch(setObjectives([]));
  },[dispatch])

  useEffect(()=>{
    if(checkinCreated === true){
       setDropdownValue("");
       dispatch(setCheckinCreated(false));
       window.scrollTo(0, 0);
    }
  }, [checkinCreated]);

  const getDropdownOption = (option) => {
    if(option.length>55){
       let message = option.substring(0, 40).split(" ");
       if (message.length===1){
        return message.join().substring(0,40) + "...";
    }
      message.pop();
      return message.join(" ") + "...";
    }
    else return option;
  };

  return (
    <Container style={{ paddingBottom: "20px", textAlign: "left" }}>
      <div className="container">
        <h1 className="container__dropdown-label">Check-in for:</h1>
        <div className="container__dropdown">
          {loggedInUser.id && (
            <FormControl style={{ width: "100%" }} variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                {objectives.length === 0
                  ? "You don't have open objectives"
                  : "Select an objective"}
              </InputLabel>
              {objectives && (
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                    transitionDuration: 0,
                  }}
                  onChange={(e) => {
                    let response = true;
                    if (dirtyState) {
                      response = window.confirm(
                        "Are you sure you want to leave? Unsaved progress will be lost"
                      );
                    }

                    if (response) {
                      handleObjectiveChange(e.target.value);
                      dispatch(setDirtyState(false));
                      return setDropdownValue(e.target.value);
                    }
                  }}
                  value={dropdownValue}
                  options={objectives}
                  label={
                    objectives.length === 0
                      ? "You don't have open objectives"
                      : "Select an objective"
                  }
                  disabled={objectives.length === 0}
                >
                    {objectives.map((option, i) => {
                    return (
                        <MenuItem value={option} key={i}>
                        {getDropdownOption(option.description)}
                      </MenuItem>
                    );
                  })}
                 
                  
                </Select>
              )}
            </FormControl>
          )}
        </div>
      </div>
      {objective.id && <CheckInComponent />}
      <TableComponent
        columns={checkinTable.columns}
        rows={checkinTable.rows}
        header="Check-in activity"
      />
    </Container>
  );
}
