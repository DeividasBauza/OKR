import React from "react";
import PropTypes from "prop-types";
import LinearProgress  from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";
import "./ProgressBar.scss";

export default function ProgressBar({progress}) {
    return (
        <div className="progress-bar">
            <Tooltip classes={{ tooltip: "progress-bar__tooltip", arrow: "progress-bar__tooltip-arrow" }} 
            title={`${Math.round(progress)}% overall progress`} arrow>
                <div className="progress-bar__block">
                    <LinearProgress className="progress-bar__slide" variant="determinate" value={progress} color="secondary"/>
                </div>
            </Tooltip>
        </div>
    );
}

ProgressBar.propTypes = {
  progress: PropTypes.number
};

ProgressBar.defaultProps = {
  progress: 0
};