import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { fetchObjectiveWithCheckinHistory } from "../api/objectiveApi";
import CheckInComponent from "../components/CheckInComponent/CheckInComponent";
import { selectCheckinCreated } from "../redux/reducers/checkinHistorySlice";
import { selectLoggedInUser } from "../redux/reducers/loginSlice";
import { selectObjectiveWithHistory } from "../redux/reducers/objectiveSlice";
import '../styles/pages/checkin-confirm.scss'

const CheckinConfirmation = () => {
  const loggedInUser = useSelector(selectLoggedInUser);
  const objective = useSelector(selectObjectiveWithHistory);
  const checkinCreated = useSelector(selectCheckinCreated);
  const id = useParams().id;
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchObjectiveWithCheckinHistory(id));
  }, [dispatch, id]);
  useEffect(()=>{
    if(checkinCreated === true){
      history.push("/dashboard");
    }
  },[checkinCreated, history]);

  return (
    <div>
      <div className="confirm-header">
        Confirm checkin information
      </div>
      {loggedInUser.id && objective.id && (
        <CheckInComponent />
      )}
    </div>
  );
};
export default CheckinConfirmation;
