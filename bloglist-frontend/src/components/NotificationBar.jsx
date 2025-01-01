import "../styles/NotificationBar.css";
import PropTypes from "prop-types";

const NotificationBar = ({ notification }) => {
  if (!notification.message) {
    return null;
  }
  return (
    <div className={`notification ${notification.type}`}>
      <p>{notification.message}</p>
    </div>
  );
};

NotificationBar.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default NotificationBar;
