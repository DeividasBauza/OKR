import React from 'react';
import { useSelector } from "react-redux";

import { selectDrawerStatus } from "./Drawer/DrawerSlice.js";

import "../styles/layout/main-container.scss";
import PropTypes from "prop-types";

export default function MainContainer(props) {
    const drawerStatus = useSelector(selectDrawerStatus);
  
    return (
        <div  className={`main-container ${drawerStatus ? "active" : ""}`}>
            {props.children}
        </div>
    );
}
MainContainer.propTypes = {
    children: PropTypes.element
}