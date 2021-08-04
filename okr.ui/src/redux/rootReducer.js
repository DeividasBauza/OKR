import { combineReducers } from 'redux';
import drawerReducer from '../components/Drawer/DrawerSlice';
import toastCardReducer from './reducers/toastCardSlice';
import userReducer from './reducers/userSlice';
import loginReducer from './reducers/loginSlice'
import progressTableReducer from '../components/TableComponent/ProgressTableSlice'
import checkinTableReducer from '../components/TableComponent/CheckinTableSlice'
import checkinHistory from '../redux/reducers/checkinHistorySlice'
import objectives from '../redux/reducers/objectiveSlice'
import checkinSliceReducer from '../components/CheckInComponent/CheckInSlice.js'
import quarterSwitchReducer from '../redux/reducers/quarterSwitchSlice'
import alertDialog from '../redux/reducers/alertDialogSlice'
import activeUser from '../redux/reducers/activeUserSlice'

const rootReducer = combineReducers({
  users: userReducer,
  activeUser,
  login: loginReducer,
  drawer: drawerReducer,
  toastCard: toastCardReducer,
  progressTable: progressTableReducer,
  checkinTable: checkinTableReducer,
  checkinHistory,
  objectives,
  alertDialog,
  checkin: checkinSliceReducer,
  quarterSwitch: quarterSwitchReducer
});

export default rootReducer;
