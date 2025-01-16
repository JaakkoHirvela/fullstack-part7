import { createContext, useReducer } from "react";

export const SET_NOTIFICATION = "SET_NOTIFICATION";
export const CLEAR_NOTIFICATION = "CLEAR_NOTIFICATION";

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
