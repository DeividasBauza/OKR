import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeDrawerStatus, setEdit } from "./DrawerSlice";
import { selectDrawerStatus, selectEdit } from "./DrawerSlice.js";
import { selectLoggedInUser } from "../../redux/reducers/loginSlice";
import "./drawer.scss";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Tooltip from "@material-ui/core/Tooltip";
import Fade from "@material-ui/core/Fade";
import { setActive } from "../../redux/reducers/activeUserSlice";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { useHistory } from "react-router";
import { Button } from "@material-ui/core";
import { selectFavoriteUsers} from "../../redux/reducers/userSlice";
import { removeFavorites } from '../../api/userApi'

export default function Drawer() {
  const [previewStatus, setPreviewStatus] = useState(false);
  const drawerStatus = useSelector(selectDrawerStatus);
  const loggedInUser = useSelector(selectLoggedInUser);
  const favorites = useSelector(selectFavoriteUsers);
  const [toRemove, setToRemove] = useState([]);
  const edit = useSelector(selectEdit);
  const dispatch = useDispatch();
  const history = useHistory();

  const getInitials = (user) => {
    const names = user.displayName.split(" ");
    return names[0].substring(0, 1).toUpperCase() + names[1].substring(0, 1);
  };
  const handleSetActive = (user) => {
    dispatch(setActive(user));
    history.push("/dashboard");
  };
  const handleEditClick = () => {
    dispatch(setEdit(!edit));
  };

  const handleSaveClick = () => {
    if (toRemove.length > 0) {
      const removeList = toRemove.map((user) =>  {return {ownerId:loggedInUser.id, favouriteUserId:user.id}})
      dispatch(removeFavorites(removeList));
    }
    dispatch(setEdit(!edit));
    setToRemove([]);
  };
  const handleCancelClick = () => {
    dispatch(setEdit(!edit));
    setToRemove([]);
  };
  const addToRemoveList = (user) => {
    if (isInTheList(user)) {
      setToRemove([...toRemove.filter((u) => u.id !== user.id)]);
    } else {
      setToRemove([...toRemove, user]);
    }
  };
  const isInTheList = (user) => {
    return toRemove.includes(user);
  };

  return (
    <div
      onMouseMove={(e) => {
        if (!e.target.classList.contains("drawer__pull") && !drawerStatus) {
          setPreviewStatus(true);
        }
      }}
      onMouseLeave={() => {
        setPreviewStatus(false);
        if(!drawerStatus){
          dispatch(setEdit(false));
    setToRemove([]);
        }
      }}
      className={`drawer ${drawerStatus ? "active" : ""} ${
        previewStatus ? "preview" : ""
      }`}
    >
      <div className="drawer__main">
        <div className="drawer__friends">
          <div className="drawer__favorites-header">
            <div style={{ padding: "2px" }}>Favorites</div>
            {edit ? (
              <div>
                <Tooltip
                  title={
                    <span style={{ fontSize: 12, marginTop: "3px" }}>
                      Remove highlited users
                    </span>
                  }
                  arrow
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 500 }}
                >
                  <Button
                    className="drawer__edit-button"
                    onClick={handleSaveClick}
                    style={{ color: "#2C29DE"}}
                  >
                    Save
                  </Button>
                </Tooltip>

                <Button
                  className="drawer__edit-button"
                  onClick={handleCancelClick}
                  style={{ marginRight: "20px", color: "#FF3454" }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Button
                  className="drawer__edit-button"
                  onClick={handleEditClick}
                  style={{ marginRight: "20px", color: "#9F9F9F" }}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
          {loggedInUser && favorites.map((user) => {
            return (
              <div
                onClick={() => handleSetActive(user)}
                key={user.id}
                className={`drawer__single-friend ${isInTheList(user)? 'is-removed':''}`}
              >
                <div className="drawer__account">
                  <span>{getInitials(user)}</span>
                </div>
                <div className="drawer__name">
                  {user.displayName}
                </div>
                <div
                  style={{ display: `${edit ? "block" : "none"}` }}
                  className="drawer__favorite"
                >
                  <Tooltip
                    title={
                      <span style={{ fontSize: 12 }}>
                        {isInTheList(user)
                          ? "Cancel remove"
                          : "Remove from favorites"}
                      </span>
                    }
                    arrow
                    placement="right"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 500 }}
                  >
                    <RemoveCircleOutlineIcon
                      className={`star-icon ${isInTheList(user)? 'marked':''}`}
                      style={{ color: `${isInTheList(user) ? "red" : ""}` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToRemoveList(user);
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="drawer__pull"
        onClick={() => {
          dispatch(changeDrawerStatus(!drawerStatus));
          setPreviewStatus(false);
          dispatch(setEdit(false));
          setToRemove([]);
        }}
      >
        {drawerStatus ? (
          <ChevronLeftIcon className="drawer__chevron" />
        ) : (
          <ChevronRightIcon className="drawer__chevron" />
        )}
      </div>
    </div>
  );
}
