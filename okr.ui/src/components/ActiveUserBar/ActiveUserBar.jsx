import { selectActiveUser, setActive } from '../../redux/reducers/activeUserSlice'
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from 'react';
import { selectLoggedInUser } from '../../redux/reducers/loginSlice';
import './ActiveUserBar.scss'
import QuarterSwitch from '../QuarterSwitch/QuarterSwitch';
import StarIcon from "@material-ui/icons/Star";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import { selectFavoriteUsers } from '../../redux/reducers/userSlice'
import { toastCardVariant } from "../../constants/toastCardGlobalVariables";
import { enqueueSnackbar } from "../../redux/reducers/toastCardSlice";
import { addFavorite, removeFavorites } from '../../api/userApi'
import { resetQuarterData, setQuarterData } from '../../redux/reducers/quarterSwitchSlice';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { selectDashboardLoading, setDashboardLoading } from '../../redux/reducers/objectiveSlice';

const ActiveUserBar = () => {
  const activeUser = useSelector(selectActiveUser);
  const loggedInUser = useSelector(selectLoggedInUser);
  const favorites = useSelector(selectFavoriteUsers);
  const [show, setShow] = useState("By quarter");
  const dashboardLoading = useSelector(selectDashboardLoading);
  const dispatch = useDispatch();
  const handleShowChange = (event, newValue) => {
    if (!newValue || dashboardLoading) {
      return;
    }
    setShow(newValue);
    dispatch(setDashboardLoading(true))
  };
  useEffect(() => {
    if (!activeUser.id || !loggedInUser.id) {
      dispatch(setActive(loggedInUser));
    }
  }, [dispatch, loggedInUser, activeUser])

  useEffect(() => {
    if (show) {
      if (show === "All") {
        dispatch(setQuarterData({ year: 0, quarter: 0 }));
      } else {
        dispatch(resetQuarterData());
      }
    }
  }, [show])

  const itsMe = activeUser.id === loggedInUser.id;

  const isFriend = favorites.map((user) => user.id).includes(activeUser.id);

  const handleFavoriteToggle = () => {
    if (!isFriend) {
      dispatch(addFavorite({ ownerId: loggedInUser.id, favouriteUserId: activeUser.id }));
    } else {
      dispatch(removeFavorites([{ ownerId: loggedInUser.id, favouriteUserId: activeUser.id }]));
    }
  }

  return (
    <div className="active-user-bar">
      <div className="active-user-bar__user-details">
        {activeUser.displayName 
        ?<h1 style={{ margin: "auto" }}>{activeUser.displayName} {itsMe ? '(You)' : ''}</h1>
        : <h1>Loading...</h1>}
        {activeUser.displayName ?
        <Tooltip
          title={
            <span style={{ fontSize: 12 }}>
              {isFriend ? 'Remove from favorites' : 'Add to favorites'}
            </span>
          }
          arrow
          placement="right"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 500 }}
        >
          <StarIcon
            className={isFriend ? "star-icon-favorite" : 'star-icon-not-favorite'}
            style={{ fontSize: "30px", visibility: `${itsMe ? 'hidden' : 'visible'}` }}
            onClick={() => handleFavoriteToggle()}
          />
        </Tooltip>
        : ""
        }

      </div>
      <div className="active-user-bar__switch-and-toggle">
        <div className="active-user-bar__switch-and-toggle toggle">
          <ToggleButtonGroup
          
            exclusive
            value={show}
            onChange={handleShowChange}
          >
            <ToggleButton value="All" style={{ width: 50, padding: "5px" }}>
              All
            </ToggleButton>
            <ToggleButton value="By quarter" style={{ width: 125, padding: "5px" }}>
              By quarter
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="active-user-bar__switch-and-toggle switch" style={{ visibility: `${show === "All" ? 'hidden' : 'visible'}` }}>
          <QuarterSwitch />
        </div>


      </div>

    </div>
  )
}

export default ActiveUserBar;

