import { useContext } from "react";
import NotificationContext from "./components/NotificationContext";

export const useNotificationValue = () => {
  const context = useContext(NotificationContext);
  return context[0];
};

export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext);
  return context[1];
};

export const NotificationType = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
});

let timeout = null;

export const setNotification = (dispatch, message, type, duration = 5000) => {
  dispatch({ type: "SET_NOTIFICATION", notification: { message, type } });

  // Clear the previous timeout
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    dispatch({ type: "CLEAR_NOTIFICATION" });
  }, duration);
};
