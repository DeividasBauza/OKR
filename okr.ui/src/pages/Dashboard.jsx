import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../components/TableComponent/TableComponent";
import {
  selectColumns as selectProgressColumns,
  selectRows as selectProgressRows,
} from "../components/TableComponent/ProgressTableSlice";
import { Grid, Box, Container } from "@material-ui/core";
import ObjectiveCard from "../components/ObjectiveCard/ObjectiveCard.jsx";
import ActiveUserBar from "../components/ActiveUserBar/ActiveUserBar";
import ProgressBar from "../components/ProgressBar/ProgressBar.jsx";
import { selectActiveUser } from "../redux/reducers/activeUserSlice";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { selectLoggedInUser } from "../redux/reducers/loginSlice";
import { CircleToBlockLoading } from 'react-loadingg';
import {
  selectCheckinCreated,
  selectHistoryModalState,
  setCheckinCreated,
  setHistoryModalOpen,
} from "../redux/reducers/checkinHistorySlice";
import {
  selectNewObjectiveModalState,
  setNewObjectiveModalOpen,
  selectObjectives,
  selectFilteredObjectives,
  selectDashboardLoading,
  setDashboardLoading,
  selectObjectiveUpdated,
  setObjectiveUpdated,
  setFiltered
} from "../redux/reducers/objectiveSlice";
import { fetchObjectives } from "../api/objectiveApi";

import "../styles/pages/dashboard.scss";

import { selectDirtyState, setDirtyState } from "../components/CheckInComponent/CheckInSlice";
import CheckinHistoryComponent from "../components/CheckinHistoryComponent/CheckinHistoryComponent";
import CheckinHistoryModal from "../components/Modal/CheckinHistoryModal";
import NewObjectiveModal from "../components/Modal/NewObjectiveModal";

import {
  selectQuarterData,
} from "../redux/reducers/quarterSwitchSlice";
import "../styles/pages/dashboard.scss";
import { selectFavoriteUsers } from "../redux/reducers/userSlice";
import { getProgressTableData } from "../api/tablesApi";
import {
  setAlertDialogOpen,
  setAlertDialogType,
  alertType
} from "../redux/reducers/alertDialogSlice";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

function ObjectivesGrid() {

  const activeUser = useSelector(selectActiveUser);
  const loggedInUser = useSelector(selectLoggedInUser);
  const [optionsSelected, setOptionsSelected] = useState("All");
  const [openClosed, setOpenClosed] = useState("All")
  const objectives = useSelector(selectObjectives);
  const [objectivesToRender, setObjectivesToRender] = useState([]);
  const dispatch = useDispatch();
  const checkinCreated = useSelector(selectCheckinCreated);
  const loading = useSelector(selectDashboardLoading);
  const switchData = useSelector(selectQuarterData);
  const objectiveUpdated = useSelector(selectObjectiveUpdated);

 const hasObjectives = objectives.length > 0;
  const hasFilteredObjectives = objectivesToRender.length > 0;
  const getOnTrack = (objective) => {
    if (objective.onTrack === true) return "On track";
    if (objective.onTrack === false) return "Off track";
    if (objective.onTrack === null) return "No track";
  }
  const getStatus = (objective) => {
    if (objective.closed === true) return "Closed";
    if (objective.closed === false) return "Open";
  }
  const filteringDone = openClosed && optionsSelected;

  useEffect(() => {
    if (activeUser.id && switchData !== null && optionsSelected && openClosed) {
      dispatch(setDashboardLoading(true));
      dispatch(fetchObjectives(activeUser.id, switchData.year, switchData.quarter));
      dispatch(setCheckinCreated(false));
    }
  }, [activeUser, switchData.year, switchData.quarter]);

  useEffect(()=>{
    if(objectiveUpdated === true){
      dispatch(setDashboardLoading(true));
      dispatch(setObjectiveUpdated(false));
      dispatch(fetchObjectives(activeUser.id, switchData.year, switchData.quarter));
    }
  },[dispatch, objectiveUpdated])

  useEffect(()=>{
    dispatch(setFiltered(objectivesToRender));
  },[dispatch, objectivesToRender])

  useEffect(() => {
    let toFilter = [...objectives];
    if (filteringDone && objectives) {
      toFilter = openClosed === "All" ? [...toFilter] : [...toFilter.filter(o => openClosed.includes(getStatus(o)))];
      toFilter = optionsSelected === "All" ? [...toFilter] : [...toFilter.filter(o => optionsSelected === getOnTrack(o))];
    }
    setObjectivesToRender([...toFilter]);
    setTimeout(()=>{
       dispatch(setDashboardLoading(false));
    },250)
  }, [optionsSelected, openClosed, objectives]);

  const handleOptionsChange = (event, newValue) => {
    if (!newValue) {
      return;
    }
    setOptionsSelected(newValue);
  }
  const handleOpenClosedChange = (event, newValue) => {
    if (!newValue) {
      return;
    }
    setOpenClosed(newValue);
  }

  const handleObjectiveModalOpen = () => {
    dispatch(setNewObjectiveModalOpen(true));
  };

  const loggedInUserMessage = switchData.year
    ? `You have no objectives for ${switchData.year} Q${switchData.quarter}`
    : "You have no objectives";
  const activeUserMessage = switchData.year
    ? `${activeUser.displayName} has no objectives for ${switchData.year} Q${switchData.quarter}`
    : `${activeUser.displayName} has no objectives`;


  useEffect(() => {
    if (checkinCreated === true) {
      window.scrollTo(0, 0);
    }
  }, [checkinCreated]);

  return (
    <div className="dashboard-container">
      <Grid container alignItems="center">
        <Grid item xs={12} className="dashboard-container__header">
          <div className="dashboard-container__header__header-text">
            Objectives
          </div>
          <div className="dashboard-container__header__content">
            <div className="dashboard-container__header__content__toggles">
              <ToggleButtonGroup
                style={{ margin: "10px 10px 10px 0" }}
                value={openClosed}
                exclusive
                onChange={handleOpenClosedChange}
              >
                <ToggleButton value="All" style={{ width: 90, padding: "5px" }}>
                  All
            </ToggleButton>
                <ToggleButton value="Open" style={{ width: 90, padding: "5px" }}>
                  Open
            </ToggleButton>
                <ToggleButton value="Closed" style={{ width: 90, padding: "5px" }}>
                  Closed
            </ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup
                style={{ margin: "10px 10px 10px 0" }}
                value={optionsSelected}
                exclusive
                onChange={handleOptionsChange}
              >
                <ToggleButton value="All" style={{ width: 90, padding: "5px" }}>
                  All
            </ToggleButton>
                <ToggleButton value="On track" style={{ width: 90, padding: "5px" }}>
                  On track
            </ToggleButton>
                <ToggleButton value="Off track" style={{ width: 90, padding: "5px" }}>
                  Off track
            </ToggleButton>

              </ToggleButtonGroup>
            </div>
            <div>
              {activeUser.id === loggedInUser.id &&
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleObjectiveModalOpen}
                >
                  Objective
            </Button>}
            </div>

          </div>
        </Grid>
      </Grid>
      {hasObjectives && !loading && filteringDone && hasFilteredObjectives && <Grid container spacing={2}>
        {activeUser.id && objectivesToRender.map((objective) =>
          <Grid key={objective.id} item md={4} sm={6} xs={12}>
            <Box height={370}>
              <ObjectiveCard objective={objective} userName={activeUser.displayName} />
            </Box>
          </Grid>
        )}
      </Grid>}
      {loading && <Grid container spacing={2}>
        {[1, 2, 3].map((item) =>
          <Grid key={item} item md={4} sm={6} xs={12}>
            <Box height={100} style={{ position: "relative" }}>
              <CircleToBlockLoading color={"#F50057"} />
            </Box>
          </Grid>
        )}
      </Grid>}

      {!hasObjectives && loading !== null && loading === false && <div className="no-objectives">
        {loggedInUser === activeUser ? loggedInUserMessage : activeUserMessage}
      </div>}
      <div className="no-objectives">
        {!hasFilteredObjectives && hasObjectives && loading !== null && loading === false ? "No objectives matching your filter criteria" : ''}
      </div>


    </div>
  );
}

const Dashboard = () => {
  const favoriteUsers = useSelector(selectFavoriteUsers);
  const progressTable = {
    columns: useSelector(selectProgressColumns),
    rows: useSelector(selectProgressRows),
  };
  const dispatch = useDispatch();
  const historyModalOpen = useSelector(selectHistoryModalState);
  const newObjectiveModalOpen = useSelector(selectNewObjectiveModalState);
  const filteredObjectives = useSelector(selectFilteredObjectives);
  const dirty = useSelector(selectDirtyState);
  const activeUser = useSelector(selectActiveUser);

  useEffect(() => {
      dispatch(getProgressTableData());
  }, [favoriteUsers, dispatch])

  const calculateTotalProgress = () => {
    if (filteredObjectives.length === 0) {
      return 0;
    }
    let totalProgress = 0;
    for (let objective of filteredObjectives) {
      totalProgress += Number(objective.progress);
    }
    return Number((totalProgress / filteredObjectives.length).toFixed(2));
  }


  const handleHistoryClose = () => {
    dispatch(setHistoryModalOpen(false));
  };
  function handleNewObjectiveClose() {
    if (dirty) {
      dispatch(setAlertDialogType(alertType.LEAVE));
      dispatch(setAlertDialogOpen(true));
      return;
    } else {
      dispatch(setNewObjectiveModalOpen(false));
      dispatch(setDirtyState(false));
    }
  }

  return (
    <>
      <Container>
        <ActiveUserBar />
        {activeUser.id && <ProgressBar progress={calculateTotalProgress()} />}
        <ObjectivesGrid />
        <TableComponent props={progressTable.rows} columns={progressTable.columns} rows={progressTable.rows} header="Progress" />
      </Container>
      <CheckinHistoryModal
        isOpen={historyModalOpen}
        element={<CheckinHistoryComponent />}
        onClose={handleHistoryClose}
      />
      <NewObjectiveModal
        isOpen={newObjectiveModalOpen}
        onClose={() => handleNewObjectiveClose()}
      />

    </>
  );
}
export default Dashboard;
