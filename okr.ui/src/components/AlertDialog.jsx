import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";

const AlertDialog = (props) => {
  return (
    <div>
      <Dialog
        open={props.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onDecline} style={{ color: "#ff3454" }} autoFocus>
            {props.declineText}
          </Button>
          <Button onClick={props.onConfirm} style={{ color: "#2c29de"}}>
            {props.confirmText}
          </Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}

AlertDialog.propTypes = {
    message: PropTypes.string,
    title: PropTypes.string,
    confirmText: PropTypes.string,
    declineText: PropTypes.string,
    isOpen: PropTypes.bool,
    onConfirm: PropTypes.func,
    onDecline: PropTypes.func
}

export default AlertDialog;