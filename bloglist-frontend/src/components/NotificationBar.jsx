import "../styles/NotificationBar.css";
import { useNotificationValue } from "../utils";

const NotificationBar = () => {
  const notification = useNotificationValue();

  if (notification) {
    return (
      <div className={`notification ${notification.type}`}>
        {notification.message}
      </div>
    );
  }
  return null;
};

export default NotificationBar;
