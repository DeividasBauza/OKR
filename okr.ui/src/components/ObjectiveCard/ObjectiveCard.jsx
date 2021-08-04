import React, { useEffect, useState } from "react";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ScheduleIcon from '@material-ui/icons/Schedule';
import LinearProgress from '@material-ui/core/LinearProgress';
import DoneIcon from '@material-ui/icons/Done';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from "prop-types";
import "./objective-card.scss";
import Popover from '@material-ui/core/Popover';
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveUser } from "../../redux/reducers/activeUserSlice";
import { selectLoggedInUser } from "../../redux/reducers/loginSlice";
import AlertDialog from "../../components/AlertDialog";
import { setHistoryModalOpen } from "../../redux/reducers/checkinHistorySlice";
import Fade from "@material-ui/core/Fade";
import { setSingleObjective, setNewObjectiveModalOpen } from "../../redux/reducers/objectiveSlice";
import { updateObjectiveState, deleteObjective, fetchObjectiveWithCheckinHistory } from "../../api/objectiveApi";
export default function ObjectiveCard(props) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [anchorEl, setAnchorEl] = React.useState(null);
    const activeUser = useSelector(selectActiveUser);
    const loggedInUser = useSelector(selectLoggedInUser);
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            setProgress(props.objective.progress);
            setReady(true);
        }, 1)
    }, [props])

    const handleEdit = () => {
        dispatch(setSingleObjective(props.objective));
        dispatch(setNewObjectiveModalOpen(true));
        handleClose();
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteObjective(props.objective.id));
        setModalStatus(false);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeState = () => {
        dispatch(updateObjectiveState(props.objective.id, props.objective.closed));
        handleClose();
    }
    const handleHistoryOpen = () => {
        dispatch(fetchObjectiveWithCheckinHistory(props.objective.id))
        dispatch(setHistoryModalOpen(true));
        handleClose();
    }

    const isItMe = () => {
        return activeUser === loggedInUser;
    }
    const history = useHistory();

    function getObjectiveLabel(type, value) {
        switch (type) {
            case "Numeric":
                return value;
            case "Percentage":
                return value + "%";
            case "Completion":
                return value ? <DoneIcon className="objective-card__complete" /> : <DoneIcon className="objective-card__cached" />;
            default:
                return;
        }
    }

    function getObjectivePercentage(type, value, maxValue) {
        switch (type) {
            case "Numeric":
                return 100 / maxValue * value;
            case "Percentage":
                return value;
            case "Completion":
                return value === 1 ? 100 : 0;
            default:
                return;
        }
    }

    const calculateDaysPassed = () => {
        let timeString = "";

        if (!props.objective.lastCheckIn) return "No check-ins";

        const differenceInTime = (new Date().getTime()) - (new Date(props.objective.lastCheckIn).getTime());
        let differenceInDays = Math.floor((differenceInTime / (1000 * 3600 * 24)));
        differenceInDays = Math.abs(differenceInDays);

        if (differenceInDays === 0) {
            return "Today";
        }

        if (differenceInDays < 8) {
            timeString = differenceInDays;
            timeString += differenceInDays === 1 ? " day" : " days";
        } else if (differenceInDays < 29) {
            const weeks = Math.floor(differenceInDays / 7);
            timeString = weeks;
            timeString += weeks === 1 ? " week" : " weeks";
        } else if (differenceInDays < 365) {
            const months = Math.floor(differenceInDays / 29);
            timeString = months;
            timeString += months === 1 ? " month" : " months";
        } else {
            const years = Math.floor(differenceInDays / 366);
            timeString = years;
            timeString += years === 1 ? " year" : " years";
        }

        return timeString + " ago";
    }

    const checkinMissed = () => {
        const weekDaysMap = new Map([["Monday", 1], ["Tuesday", 2], ["Wednesday", 3], ["Thursday", 4], ["Friday", 5], ["Saturday", 6], ["Sunday", 7]]);
        const today = new Date();
        const dayOfTheWeekToday = today.getUTCDay() == 0 ? 7 : today.getUTCDay();
        const dayToCheckin = weekDaysMap.get(props.objective.checkInEvery);
        const isDayBefore = dayOfTheWeekToday <= dayToCheckin;
        const dateOfCheckInEvery = new Date(today.setDate(today.getDate() - (dayOfTheWeekToday - dayToCheckin)));
        const dateToCheckin = isDayBefore ? new Date(dateOfCheckInEvery.setDate(dateOfCheckInEvery.getDate() - 7)): dateOfCheckInEvery;

        if (props.objective.lastCheckIn === null) {
            return new Date(dateToCheckin).toISOString().split("T")[0] > new Date(props.objective.startDate).toISOString().split("T")[0];
        }
        return new Date(props.objective.lastCheckIn).toISOString().split("T")[0] < new Date(dateToCheckin).toISOString().split("T")[0];
    }

    const getOnTrackTitle = () => {
        return props.objective.onTrack ? "On track" : props.objective.onTrack === null ? '' : "Off track";
    }
    const getDescription = (description) => {
        let message = description.substring(0, 35).split(" ");
        if (message.length === 1) {
            return message.join().substring(0, 35) + "...";
        }
        message.pop();
        return message.join(" ") + "...";
    }
    const getResultDescription = (description) => {
        let message = description.substring(0, 28).split(" ");
        if (message.length === 1) {
            return message.join().substring(0, 28) + "...";
        }
        message.pop();
        return message.join(" ") + "...";
    }
    return (
        <div className="objective-card">
            <div className="objective-card__heading">
                <div className="objective-card__info">
                    <div className="objective-card__user">
                        <div className="objective-card__account-circle" />
                        {props.userName}
                    </div>
                    <Tooltip
                        title={checkinMissed() ? "Check-in is due" : ""}
                        arrow
                        placement="top"
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 250 }}
                    >
                        <div className={`objective-card__time ${checkinMissed() ? "missed" : ""}`}>
                            {!props.objective.closed && <ScheduleIcon fontSize="inherit" />}
                            <span className="objective-card__time-text">{props.objective.closed ? 'Closed' : calculateDaysPassed()}</span>
                        </div>
                    </Tooltip>
                    <Tooltip
                        title={getOnTrackTitle()}
                        arrow
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 500 }}>
                        <div className={`objective-card__date ${props.objective.onTrack === false ? 'off-track' : ''}`}>
                            {monthNames[new Date(props.objective.startDate).getMonth()]}
                            -
                            {props.objective.endDate ? monthNames[new Date(props.objective.endDate).getMonth()] : "None"}
                        </div>
                    </Tooltip>
                    <div className="objective-card__extend">
                        <MoreVertIcon aria-controls="menu" aria-haspopup="true" onClick={(e) => setAnchorEl(e.currentTarget)} />
                        <Popover id="menu" anchorEl={anchorEl} open={Boolean(anchorEl)} disableScrollLock={true}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 0 }}
                            style={{ left: "16px" }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}>
                            {isItMe() ? <>
                                {props.objective.closed &&
                                    <MenuItem onClick={handleHistoryOpen}>Check-in history</MenuItem>}
                                {!props.objective.closed &&
                                    <>
                                        <MenuItem onClick={() => { history.push(`/checkin-confirm/${props.objective.id}`) }}>Check-in</MenuItem>
                                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                        <MenuItem onClick={() => {
                                            setModalStatus(true);
                                            setAnchorEl(null);
                                        }}>Delete</MenuItem>
                                    </>}
                                <MenuItem onClick={handleChangeState}>
                                    {props.objective.closed ? 'Reopen' : 'Close'}
                                </MenuItem>
                            </>
                                :
                                <MenuItem onClick={handleHistoryOpen}>Check-in history</MenuItem>}
                        </Popover>
                    </div>
                </div>

                {props.objective.description.length > 35 ?
                    (<Tooltip
                        arrow
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 500 }}
                        title={<span style={{ fontSize: "16px" }}
                        >
                            {props.objective.description}</span>}>
                        <div className="objective-card__name pointer">{getDescription(props.objective.description)}</div>
                    </Tooltip>)
                    :
                    (<div className="objective-card__name">{props.objective.description}</div>)}

                <Tooltip title={props.objective.progress + "%"}
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 300 }}
                    arrow>
                    <LinearProgress className="objective-card__slide" variant="determinate" value={progress} color="secondary" />
                </Tooltip>
            </div>
            <div className="objective-card__key-results">
                {props.objective.keyResults.map((result, index) => (
                    <div className="objective-card__row" key={index}>
                        <Tooltip
                            title={result.type === "Numeric" ? `Target: ${result.maxValue}` : ''}
                            classes={{ tooltip: "objective-card__row__tooltip", arrow: "objective-card__row__arrow" }}
                            arrow
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 300 }}>
                            <div className="objective-card__circle">
                                <CircularProgress className="objective-card__top-circle" variant="determinate" value={!ready ? 0 : getObjectivePercentage(result.type, result.value, result.maxValue)}></CircularProgress>
                                <CircularProgress className="objective-card__bottom-circle" variant="determinate" value={100}></CircularProgress>
                                <span className="objective-card__circle-text">{getObjectiveLabel(result.type, result.value, result)}</span>
                            </div>
                        </Tooltip>
                        {result.description.length > 28 ?
                            (<Tooltip
                                arrow
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 300 }}
                                title={<span style={{ fontSize: "16px" }}

                                >{result.description}</span>}>
                                <span className="objective-card__text pointer">{getResultDescription(result.description)}</span>
                            </Tooltip>) : (
                                <span className="objective-card__text">{result.description}</span>
                            )}


                    </div>
                ))}
            </div>
            <AlertDialog
                isOpen={modalStatus}
                message="Objective is going to be deleted. Do you want to proceed?"
                confirmText="Yes"
                declineText="No"
                title="OKR says:"
                onConfirm={handleDeleteConfirm}
                onDecline={() => setModalStatus(false)}
            />
        </div>
    );
}

ObjectiveCard.propTypes = {
    objective: PropTypes.object,
    userName: PropTypes.string,
};