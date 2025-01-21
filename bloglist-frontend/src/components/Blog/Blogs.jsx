import { useEffect, useRef } from "react";
import { useDeleteBlogMutation, useLikeBlogMutation, useNewBlogMutation } from "../../services/blogsMutations";
import { NotificationType, setNotification, useNotificationDispatch } from "../../utils/notificationUtils";
import BlogForm from "./BlogForm";
import Togglable from "../Togglable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import blogService from "../../services/blogs";
import Blog from "./Blog";

const Blogs = ({ user }) => {
  const blogFormRef = useRef();
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
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

  const afterNewBlog = () => blogFormRef.current.toggleVisibility();
  const newBlogMutation = useNewBlogMutation(queryClient, user, notificationDispatch, afterNewBlog);
  const likeBlogMutation = useLikeBlogMutation(queryClient, user, notificationDispatch);
  const deleteBlogMutation = useDeleteBlogMutation(queryClient, user, notificationDispatch);

  return (
    <div>
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

export default Blogs;
