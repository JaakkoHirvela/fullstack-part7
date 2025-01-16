import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import NotificationBar from "./components/NotificationBar";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import { NotificationType, setNotification, useNotificationDispatch } from "./utils/notificationUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UserContext, { CLEAR_USER, SET_USER } from "./components/UserContext";
import { useDeleteBlogMutation, useLikeBlogMutation, useNewBlogMutation } from "./services/mutations";

const App = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  const [user, userDispatch] = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = useRef();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: () => {
      return blogService.getAll();
    },
    retry: 1,
  });

  const { data: blogs, error, isLoading, isError } = result;

  useEffect(() => {
    if (isLoading) {
      setNotification(notificationDispatch, "Loading blogs...", NotificationType.INFO);
    } else if (isError) {
      setNotification(notificationDispatch, "Failed to load blogs: " + error.message, NotificationType.ERROR);
    } else if (blogs) {
      setNotification(notificationDispatch, "Blogs loaded", NotificationType.SUCCESS);
    }
  }, [isLoading, isError]);

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

  const afterNewBlog = () => blogFormRef.current.toggleVisibility();

  const newBlogMutation = useNewBlogMutation(queryClient, user, notificationDispatch, afterNewBlog);
  const likeBlogMutation = useLikeBlogMutation(queryClient, user, notificationDispatch);
  const deleteBlogMutation = useDeleteBlogMutation(queryClient, user, notificationDispatch);

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
    ); // TODO: Clean up the login form.
  }
  return (
    <div>
      <h2>blogs</h2>
      <NotificationBar />
      <div style={{ paddingBottom: "10px" }}>
        Logged in as {user.name}
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={newBlogMutation.mutate} />
      </Togglable>
      {blogs &&
        blogs
          .sort((l, r) => r.likes - l.likes) // Sort in descending order.
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={likeBlogMutation.mutate}
              handleDelete={deleteBlogMutation.mutate}
              user={user}
            />
          ))}
    </div>
  );
};

export default App;
