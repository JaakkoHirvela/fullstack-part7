import { useContext } from "react";
import UserContext from "../components/UserContext";

export const useUserValue = () => {
  const context = useContext(UserContext);
  return context[0];
};

export const useUserDispatch = () => {
  const context = useContext(UserContext);
  return context[1];
};
