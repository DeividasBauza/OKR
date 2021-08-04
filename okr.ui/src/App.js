import React, { useEffect, useState } from "react";
import { Slide } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { acquireToken } from "./app/msalClient";
import { login } from "./redux/reducers/loginSlice";
import { selectAzureUsers } from "./redux/reducers/userSlice";
import { setNewObjectiveModalOpen } from "./redux/reducers/objectiveSlice";
import { selectAlertDialogState, setAlertDialogOpen } from "./redux/reducers/alertDialogSlice";
import Nav from "./components/Nav.js";
import CheckIn from "./pages/CheckIn.js";
import Dashboard from "./pages/Dashboard";
import Drawer from "./components/Drawer/Drawer.js";
import AlertDialog from "./components/AlertDialog";
import { azureUsersFetch, favoriteUsersFetch } from "./api/userApi";
import {
  toastCardAutoHideDuration,
  toastCardMaxSnack,
} from "./constants/toastCardGlobalVariables.jsx";
import NewObjective from "./pages/NewObjective.jsx";
import MainContainer from "./components/MainContainer.js";
import ToastCard from "./components/ToastCard";
import "./styles/base/App.scss";
import "./styles/components/App/App.css";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import CheckinConfirmation from "./pages/CheckinConfirm";

import ScrollToTop from "./utils/ScrollToTop";
import { selectDirtyState, setDirtyState } from "./components/CheckInComponent/CheckInSlice";
import { selectAlertDialogType,  alertType } from "./redux/reducers/alertDialogSlice";

function ProtectedRoutes(){
  const azureUsers = useSelector(selectAzureUsers);
  const dirty = useSelector(selectDirtyState);
  const alertDialogOpen = useSelector(selectAlertDialogState);
  const alertDialogType = useSelector(selectAlertDialogType);
  const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(azureUsersFetch());
  }, [dispatch]);

  useEffect(()=>{
    const loginUser = async () => {
    const token = await acquireToken();
    dispatch(login({displayName:token.account.name, id:token.uniqueId}));
    dispatch(favoriteUsersFetch(token.uniqueId));
    }
    if(azureUsers.length>0){
       loginUser();
    }
  }, [azureUsers, dispatch])

  const handleLeaveClick = () => {
    dispatch(setDirtyState(false));
    dispatch(setAlertDialogOpen(false));
    dispatch(setNewObjectiveModalOpen(false));
  };

  useEffect(() => {
    if (dirty) {
      window.onbeforeunload = () => {
        return "Changes will be lost, continue?";
      };
    } else {
      window.onbeforeunload = undefined;
    }
  }, [dispatch, dirty]);

  return (
    <>
      <Nav />
      <div className="main">
        <Drawer />
        <MainContainer>
        <>
          <ScrollToTop />
          <Switch>
            <Route path="/" exact><Dashboard /></Route>
            <Route path="/dashboard"><Dashboard /></Route>
            <Route path="/check-in" exact><CheckIn /></Route>
            <Route path="/checkin-confirm/:id"><CheckinConfirmation /></Route>
            <Route path="/new-objective"><NewObjective /></Route>
            <Route><PageNotFound /></Route>
          </Switch>
          <AlertDialog
            isOpen={alertDialogOpen && alertDialogType===alertType.LEAVE}
            message="You have unsaved changes"
            confirmText="Leave"
            declineText="Stay"
            title="OKR says:"
            onConfirm={() => handleLeaveClick()}
            onDecline={() => dispatch(setAlertDialogOpen(false))}
          />
        </>
        </MainContainer>
      </div>
    </>
  );
}

function UnprotectedRoutes() {
  return (
    <Switch>
      <Route>
        <Login />
      </Route>
    </Switch>
  );
}

const App = () => {
  return (
    <div className="App">
      <SnackbarProvider
        maxSnack={toastCardMaxSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Slide}
        autoHideDuration={toastCardAutoHideDuration}
      >
        <ToastCard />
        <BrowserRouter>
          <AuthenticatedTemplate>
            <ProtectedRoutes />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <UnprotectedRoutes />
          </UnauthenticatedTemplate>
        </BrowserRouter>
      </SnackbarProvider>
    </div>
  );
};

export default App;
