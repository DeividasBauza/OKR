import { createSlice } from "@reduxjs/toolkit";

const defaultObjective = { 
  description: "",
  checkInEvery: "",
  startDate: 0,
  endDate: 0,
  lastCheckIn: null,
  onTrack: null,
  closed: false,
  keyResults: [
    {
      type: "",
      description: "", 
      value: 0, 
      maxValue: null, 
      id: Math.random()
    }
  ],
  checkinHistory: []
};

const formatDate = (date) => {
  const tempDate = new Date(date);
  tempDate.setHours(0, -tempDate.getTimezoneOffset(), 0, 0);
  return tempDate.toISOString().split('T')[0];
};

const formatDateForObjectives = (objectives) => {
  for(let objective of objectives){
    objective.startDate = formatDate(objective.startDate);
    objective.endDate = formatDate(objective.endDate);
    objective.lastCheckIn = objective.lastCheckIn ? formatDate(objective.lastCheckIn) : null;
  }
}

export const objectiveSlice = createSlice({
  name: "objectives",

  initialState: {
    modalOpen: false,
    dashboardLoading: true,
    objectiveUpdated: false,
    objective: defaultObjective,
    objectives: [],
    filteredObjectives: [],
    objectiveWithHistory: defaultObjective,
    loadingSpinner: false,
  },
  reducers: {
    setNewObjectiveModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
    setObjectives: (state, action) => {
      state.objectives = action.payload;
      formatDateForObjectives(state.objectives);
    },
    setSingleObjective: (state, action) => {
      state.objective = action.payload;
    },
    addObjective: (state, action) => {
      state.objectives = [...state.objectives, action.payload];
      formatDateForObjectives(state.objectives);
    },
    deleteObjective: (state, action) => {
      state.objectives = [...state.objectives].filter(objective => objective.id !== action.payload);
    },
    updateObjectives: (state, action) => {
      state.objectives = state.objectives.map((objective) => action.payload.id === objective.id ? action.payload : objective);
      formatDateForObjectives(state.objectives);
    },
    objectiveStateUpdate: (state, action) => {
      state.objectives = state.objectives.map((objective) => 
        objective.id === action.payload.id ? {...objective,closed:action.payload.state} : objective);
    },
    resetObjective: (state) => {
      state.objective = defaultObjective;
    },
    setFiltered: (state, action) =>{
      state.filteredObjectives = action.payload;
    },
    setObjectiveWithHistory: (state, action) =>{
      state.objectiveWithHistory = action.payload;
    },
    setLoadingSpinner: (state, action) => {
      state.loadingSpinner = action.payload;
    },
    setDashboardLoading: (state, action) => {
      state.dashboardLoading = action.payload;
    },
    setObjectiveUpdated: (state, action) => {
      state.objectiveUpdated = action.payload;
    }
  },
});

export const selectNewObjectiveModalState = (state) => state.objectives.modalOpen;
export const selectObjectiveState = (state) => state.objectives.objective;
export const selectObjectives = (state) => state.objectives.objectives;
export const selectObjectiveWithHistory = (state) => state.objectives.objectiveWithHistory;
export const selectFilteredObjectives = (state) => state.objectives.filteredObjectives;
export const selectLoadingSpinner = (state) => state.objectives.loadingSpinner;
export const selectDashboardLoading = (state) => state.objectives.dashboardLoading;
export const selectObjectiveUpdated = (state) => state.objectives.objectiveUpdated;

export const {
  setNewObjectiveModalOpen,
  setObjectives,
  setDashboardLoading,
  setSingleObjective,
  setLoadingSpinner,
  setObjectiveUpdated,
  addObjective,
  deleteObjective,
  updateObjectives,
  setFiltered,
  resetObjective,
  objectiveStateUpdate,
  setObjectiveWithHistory
} = objectiveSlice.actions;

export default objectiveSlice.reducer;
