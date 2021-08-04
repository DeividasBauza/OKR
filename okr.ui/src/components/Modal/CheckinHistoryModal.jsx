import React from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { useDispatch, useSelector } from 'react-redux';
import { selectHistoryModalState, setHistoryModalOpen } from '../../redux/reducers/checkinHistorySlice';

const useStyles = makeStyles(() => ({
  modal: {
    outline: 0,
    display: "flex",
    flexDirection: "column"
  },
  paper: {
    outline: 0,
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    marginTop: 200,
  },
  history: {
    overflow: 'auto',
    maxHeight: 500,
  },
  customButton: {
    width: "350px",
    outline: 0,
    padding: 15,
    fontSize: "18px",
    border: "1px solid transparent",
    backgroundColor: "#ff3454",
    color: "white",
    fontWeight: "bold",
    borderRadius: "0 0 20px 20px",
    opacity: 1,
    boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
    transition: "all .3s ease-in-out",
    "&:hover": {
      backgroundColor: "rgb(219, 63, 110)",
      cursor: "pointer"
    },
  }, 
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.8em',
      marginLeft:"-17px",
      zIndex:1,
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.2)',
      outline: '1px solid slategrey'
    }
  }
}));

const CheckinHistoryModal = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector(selectHistoryModalState)
  const handleClose = () => {
    dispatch(setHistoryModalOpen(false));
  }
  return (
  <>
    {open && <div>
      <Modal
        className={classes.modal}
        open={props.isOpen}
        onClose={props.onClose}
      >
        <Fade in={props.isOpen}>
          <div className={classes.paper}>
            <div>
              <div className={classes.history}>
                {props.element}
              </div>
            </div>
            <div>
              <button 
              className={classes.customButton}
              onClick={handleClose}
              >
                Close
                </button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>}
    </>
  );
}

CheckinHistoryModal.propTypes = {
  element: PropTypes.element,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
}

export default CheckinHistoryModal;