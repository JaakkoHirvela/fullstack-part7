import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import NotificationBar from "./components/NotificationBar";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import { NotificationType, setNotification, useNotificationDispatch } from "./utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const App = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: () => {
      console.log("fetching blogs");
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
      setUser(user);
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
      setUser(loginData);
      setUsername("");
      setPassword("");
    } catch (error) {
      setNotification(notificationDispatch, "Wrong username or password", NotificationType.ERROR);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const newBlogMutation = useMutation({
    mutationFn: (newBlog) => blogService.create(newBlog, user.token),
    onSuccess: (data, variables) => {
      const newBlog = variables;
      queryClient.invalidateQueries(["blogs"]);
      setNotification(notificationDispatch, `A new blog ${newBlog.title} by ${newBlog.author} added`, NotificationType.SUCCESS);
      blogFormRef.current.toggleVisibility();
    },
    onError: (error) => {
      const { error: errorMessage } = error.response.data;
      setNotification(notificationDispatch, `Failed to create blog: ${errorMessage}`, NotificationType.ERROR);
    },
  });

  const likeBlogMutation = useMutation({
    mutationFn: (blog) => blogService.update({ ...blog, likes: blog.likes + 1 }, user.token),
    onSuccess: (data, variables) => {
      const likedBlog = variables;

      // Update the blog in the cache.
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => (blog.id === likedBlog.id ? { ...blog, likes: blog.likes + 1 } : blog))
      );
      setNotification(notificationDispatch, `Blog ${likedBlog.title} liked!`, NotificationType.SUCCESS);
    },
    onError: (error) => {
      const { error: errorMessage } = error.response.data;
      setNotification(notificationDispatch, `Failed to like blog: ${errorMessage}`, NotificationType.ERROR);
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: (deletedBlog) => blogService.deleteBlog(deletedBlog.id, user.token),
    onSuccess: (data, variables) => {
      const deletedBlog = variables;
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((blog) => blog.id !== deletedBlog.id)
      );
      setNotification(notificationDispatch, `Blog ${deletedBlog.title} deleted!`, NotificationType.SUCCESS);
    },
    onError: (error) => {
      const { error: errorMessage } = error.response.data;
      setNotification(notificationDispatch, `Failed to delete blog: ${errorMessage}`, NotificationType.ERROR);
    },
  });

  if (user === null) {
    return (
      <div>
        <h2>Log in</h2>
        <NotificationBar />
        <LoginForm onSubmit={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword} />
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
            <Blog key={blog.id} blog={blog} handleLike={likeBlogMutation.mutate} handleDelete={deleteBlogMutation.mutate} user={user} />
          ))}
    </div>
  );
};

export default App;
