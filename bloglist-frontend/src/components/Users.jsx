import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { NotificationType, setNotification, useNotificationDispatch } from "../utils/notificationUtils";
import userService from "../services/users";

const Users = ({}) => {
  const notificationDispatch = useNotificationDispatch();
  const result = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return userService.getAll();
    },
    retry: 1,
  });
  const { data: users, error, isLoading, isError } = result;

  useEffect(() => {
    if (isLoading) {
      setNotification(notificationDispatch, "Loading users...", NotificationType.INFO);
    } else if (isError) {
      setNotification(notificationDispatch, "Failed to load users: " + error.message, NotificationType.ERROR);
    } else if (users) {
      setNotification(notificationDispatch, "Users loaded", NotificationType.SUCCESS);
    }
  }, [isLoading, isError]);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default Users;
