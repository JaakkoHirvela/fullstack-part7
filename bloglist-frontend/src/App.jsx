import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import loginService from "./services/login";
import NotificationBar from "./components/NotificationBar";
import LoginForm from "./components/LoginForm";
import { NotificationType, setNotification, useNotificationDispatch } from "./utils/notificationUtils";
import UserContext, { CLEAR_USER, SET_USER } from "./components/User/UserContext";
import Blogs from "./components/Blog/Blogs";
import Users from "./components/User/Users";
import UserDetails from "./components/User/UserDetail";
import BlogDetails from "./components/Blog/BlogDetails";
import NavigationMenu from "./components/NavigationMenu";
import { Button, Typography } from "@mui/material";

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

  if (user === null) {
    return (
      <div>
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
    <Router>
      <NavigationMenu />
      <NotificationBar />
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
