import { Alert } from "@mui/material";
import { useNotificationValue } from "../utils/notificationUtils";

const NotificationBar = () => {
  const notification = useNotificationValue();

  if (notification) {
    return <Alert severity={notification.type}>{notification.message}</Alert>;
  }
  return null;
};

export default NotificationBar;
