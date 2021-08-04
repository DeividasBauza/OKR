import React from "react";
import { CircularProgress, Button } from "@material-ui/core";
import PropTypes from "prop-types";
import "./ButtonLoader.scss";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2C29DE",
    }
  },
});

export default function ButtonLoader(props) {
  return (
    <ThemeProvider theme={theme}>
      <div className="button-loader">
        <Button 
            style={props.style}
            type={props.type}
            variant={props.variant}
            color={props.color}
            disabled={props.loading} 
            onClick={props.onClick}>
            {props.label}
        </Button>
        {props.loading && <CircularProgress size={24} className="button-loader__progress" />}
      </div>
    </ThemeProvider>
  );
}

ButtonLoader.propTypes = {
  style: PropTypes.object,
  type: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func
}

ButtonLoader.defaultProps = {
  label: "default Button",
  variant: "contained",
  color: "primary"
}