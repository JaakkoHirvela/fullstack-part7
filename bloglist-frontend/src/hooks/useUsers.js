import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";
import { useNotificationDispatch, NotificationType, setNotification } from "../utils/notificationUtils";
import { useEffect } from "react";

const useUsers = () => {
  const notificationDispatch = useNotificationDispatch();
  const query = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    retry: 1,
  });
  const { isLoading, isError, error, data: users } = query;

  useEffect(() => {
    if (isLoading) {
      setNotification(notificationDispatch, "Loading users...", NotificationType.INFO);
    } else if (isError) {
      setNotification(notificationDispatch, "Failed to load users: " + error.message, NotificationType.ERROR);
    } else if (users) {
      setNotification(notificationDispatch, "Users loaded", NotificationType.SUCCESS);
    }
  }, [isLoading, isError]);

  return users;
};

export default useUsers;
