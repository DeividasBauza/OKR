import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { closeSnackbar as closeToastCard, removeSnackbar, selectNotifications } from "../redux/reducers/toastCardSlice";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";


let displayed = [];

export default function ToastCard() {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id) => {
    displayed = [...displayed.filter(key => id !== key)];
  };

  useEffect(() => {
    notifications.forEach(({ key, message, options = {}, dismissed = false }) => {
        if (dismissed) {
            // dismiss snackbar using notistack
            closeSnackbar(key);
            return;
        }

        // do nothing if snackbar is already displayed
        if (displayed.includes(key)) return;

        // display snackbar using notistack
        enqueueSnackbar(message, {
            key,
            action: (
              <IconButton onClick={() => { dispatch(closeToastCard(key)) }}>
                <CloseIcon/>
              </IconButton>
            ),
            ...options,
            onClose: (event, reason, myKey) => {
                if (options.onClose) {
                    options.onClose(event, reason, myKey);
                }
            },
            onExited: (event, myKey) => {
                // remove this snackbar from redux store
                dispatch(removeSnackbar(myKey));
                removeDisplayed(myKey);
            }
        });

        // keep track of snackbars that we've displayed
        storeDisplayed(key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
}