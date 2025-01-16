import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import loginService from "./services/login";
import NotificationBar from "./components/NotificationBar";
import LoginForm from "./components/LoginForm";
import { NotificationType, setNotification, useNotificationDispatch } from "./utils/notificationUtils";
import UserContext, { CLEAR_USER, SET_USER } from "./components/UserContext";
import Blogs from "./components/Blogs";
import Users from "./components/Users";

const App = () => {
  const [user, userDispatch] = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const notificationDispatch = useNotificationDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: SET_USER, user });
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loginData = await loginService.login({ username, password });
      const decodedToken = jwtDecode(loginData.token);
      loginData.id = decodedToken.id;
      window.localStorage.setItem("loggedUser", JSON.stringify(loginData));
      setNotification(notificationDispatch, "Logged in successfully as " + loginData.name, NotificationType.SUCCESS);
      userDispatch({ type: SET_USER, user: loginData });
      setUsername("");
      setPassword("");
    } catch (error) {
      setNotification(notificationDispatch, "Wrong username or password", NotificationType.ERROR);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    userDispatch({ type: CLEAR_USER });
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in</h2>
        <NotificationBar />
        <LoginForm
          onSubmit={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    );
  }
  return (
    <div>
      <h2>blogs</h2>
      <NotificationBar />
      <div style={{ paddingBottom: "10px" }}>Logged in as {user.name}</div>
      <button onClick={handleLogout}>
        logout
      </button>
      <Router>
        <Routes>
          <Route path="/" element={<Blogs user={user} />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
