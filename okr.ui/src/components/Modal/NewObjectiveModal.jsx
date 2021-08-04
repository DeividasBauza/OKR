import React, { useRef } from 'react';
import PropTypes from "prop-types";
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { useDispatch, useSelector } from 'react-redux';
import { selectNewObjectiveModalState, selectObjectiveState, setNewObjectiveModalOpen } from '../../redux/reducers/objectiveSlice';
import NewObjective from '../../pages/NewObjective'
import './NewObjectiveModal.scss'
import CancelPresentationSharpIcon from '@material-ui/icons/CancelPresentationSharp';
import { selectDirtyState, setDirtyState } from '../CheckInComponent/CheckInSlice';
import { alertType, setAlertDialogOpen, setAlertDialogType } from '../../redux/reducers/alertDialogSlice';
import { Tooltip } from '@material-ui/core';

const NewObjectiveModal = (props) => {
  const open = useSelector(selectNewObjectiveModalState)
  const objective = useSelector(selectObjectiveState);
  const dirty = useSelector(selectDirtyState);
  const childRef = useRef();
  const dispatch = useDispatch();

  function handleClose() {
    if (dirty) {
      dispatch(setAlertDialogType(alertType.LEAVE));
      dispatch(setAlertDialogOpen(true));
      return;
    } else {
      dispatch(setNewObjectiveModalOpen(false));
      dispatch(setDirtyState(false));
    }
  }

  const noChanges = !dirty && objective.id;

  return (
    <>
      {open && <div>
        <Modal
          className="modal-container"
          open={props.isOpen}
          onClose={props.onClose}
        >
          <Fade in={props.isOpen}>
            <div className="modal-container__paper">
              <div>
                <div
                  className="modal-container__header"
                >
                  {objective.id ? "Edit objective" : "Create new objective"}
                </div>
              </div>
              <div>
                <div className="modal-container__objective">
                  <NewObjective ref={childRef} />
                </div>
              </div>
              <div>
                <button
                  className="modal-container__button close"
                  onClick={() => handleClose()}>
                  {"CLOSE"}
                </button>
                {noChanges ? (<Tooltip
                TransitionProps={{ timeout: 0 }}
                title={<span style={{fontSize:"16px"}}>No changes to save</span>}>
                  <button
                    className={`modal-container__button create ${noChanges ? 'no-changes' : ''}`}
                    onClick={()=> {}}>
                    {objective.id ? "SAVE" : "CREATE"}
                  </button>
                </Tooltip>) : <button
                  disabled={noChanges}
                  className={`modal-container__button create ${noChanges ? 'no-changes' : ''}`}
                  onClick={() => childRef.current.onSubmit()}>
                  {objective.id ? "SAVE" : "CREATE"}
                </button>
                }

                
              </div>
            </div>
          </Fade>
        </Modal>
      </div>}
    </>
  );
}

NewObjectiveModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
}

export default NewObjectiveModal;