import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function ButtonEx(props) {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Button 
      style={props.style}
      variant={props.variant} 
      color={props.color}
      disabled={props.disabled} 
      onClick={props.onClick}>
      {props.label}
      </Button>
    </div>
  );
}

ButtonEx.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
}

ButtonEx.defaultProps = {
  label: 'default Button',
  variant: 'contained'
}