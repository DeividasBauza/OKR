import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setActive } from "../redux/reducers/activeUserSlice";
import { NavLink } from 'react-router-dom';
import { useHistory } from "react-router";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Fade from '@material-ui/core/Fade'
import { useMsal } from "@azure/msal-react";


import "../styles/layout/nav.scss";

import { selectLoggedInUser } from "../redux/reducers/loginSlice";
import SearchComponent from "../components/Search/SearchComponent.jsx";


// This nav is a placeholder, reference point.
// Functionality to be updated once the design is clear, all required components exits.

export default function Nav() {
  const { instance, accounts } = useMsal();
  const dispatch = useDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const loggedInUser = useSelector(selectLoggedInUser);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const open = Boolean(anchorEl);

  const handleSetActive = (user) => {
    dispatch(setActive(user));
    history.push("/dashboard");
  };
  const goToLoggedInUsersDashboard = () => {
    dispatch(setActive(loggedInUser));
  }

  return (
    <nav className="nav">
        <div className="nav__main">
            <div className="nav__search">
              <SearchComponent onChange={(user) => handleSetActive(user)} />
            </div>
            <div className="nav__nav-links">
              <NavLink className="nav__link" to="/dashboard" activeClassName="active" onClick={goToLoggedInUsersDashboard}>Dashboard</NavLink>
              <NavLink className="nav__link" to="/check-in" activeClassName="active">Check-in</NavLink>
            </div>
            {loggedInUser.displayName ?
            <div className="nav__account" onClick={() => handleSetActive(loggedInUser)}>
              <span>{loggedInUser.displayName}</span>
            </div> :
            "Loading..."
            }
            <div className="nav__extend">
                <MoreHorizIcon aria-controls="menu" aria-haspopup="true" onClick={handlePopoverOpen}/>
                <Popover
                  disableScrollLock={true}
                  id="mouse-over-popover"
                  open={open}
                  anchorEl={anchorEl}
                  style={{left:-15}}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 0 }}
                  // Try setting horizontal to right
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  <div className="nav__popup">
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </div>
                </Popover>
            </div>
        </div>
    </nav>
  )
}