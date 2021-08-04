import { setProgressTableData } from "../components/TableComponent/ProgressTableSlice";
import { setCheckinTableData } from "../components/TableComponent/CheckinTableSlice.js";
import { CHECKIN_TABLE_ENDPOINT, PROGRESS_TABLE_ENDPOINT }  from '../constants/endpoint'
  import { acquireToken } from "../app/msalClient";



export const getProgressTableData = () => async (dispatch) => {
  const token = await acquireToken();
  fetch(PROGRESS_TABLE_ENDPOINT + "?id=" + token.uniqueId, {
    method: "GET",
    headers: { "content-type": "application/json",
    "Authorization" : `Bearer ${token.accessToken}`
   },
  })
  .then((response) => response.json())
  .then((data)=>{
    dispatch(setProgressTableData(data.value))
  });
}


export const getCheckinTableData = () => async (dispatch) => {
  const token = await acquireToken();
  fetch(CHECKIN_TABLE_ENDPOINT + "?id=" + token.uniqueId, {
    method: "GET",
    headers: { "content-type": "application/json",
    "Authorization" : `Bearer ${token.accessToken}`
   },
  })
  .then((response) => response.json())
  .then((data)=>{
    dispatch(setCheckinTableData(data.value));
  });
}
