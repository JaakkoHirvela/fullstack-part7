import { createContext, useReducer } from "react";
import { CLEAR_NOTIFICATION, SET_NOTIFICATION } from "../constants";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return action.notification; 
    case CLEAR_NOTIFICATION:
      return null;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
