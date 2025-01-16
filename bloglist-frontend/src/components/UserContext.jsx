import { createContext, useReducer } from "react";

export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return action.user;
    case CLEAR_USER:
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null);
  return <UserContext.Provider value={[user, userDispatch]}>{props.children}</UserContext.Provider>;
};

export default UserContext;