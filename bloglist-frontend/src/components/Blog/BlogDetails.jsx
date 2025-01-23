import { useNavigate, useParams } from "react-router-dom";
import useBlogs from "../../hooks/useBlogs";
import { NotificationType, setNotification, useNotificationDispatch } from "../../utils/notificationUtils";
import { useDeleteBlogMutation, useLikeBlogMutation } from "../../services/blogsMutations";
import { useUserValue } from "../User/UserContext";

const BlogDetails = () => {
  const blogId = useParams().id;
  const user = useUserValue();
  const navigate = useNavigate();
  const notificationDispatch = useNotificationDispatch();
  const likeBlogMutation = useLikeBlogMutation();
  const deleteBlogMutation = useDeleteBlogMutation();
  const blogs = useBlogs();
  if (!blogs) return null;

  const blog = blogs.find((blog) => blog.id === blogId);

  if (!blog) return null;

  const handleLinkClick = (event) => {
    if (!blog.url.startsWith("http") && !blog.url.startsWith("https")) {
      event.preventDefault();
      setNotification(notificationDispatch, "Invalid URL", NotificationType.ERROR);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog);
      navigate("/");
    }
  };

  return (
    <div>
      <h3>{blog.title}</h3>
      <a href={blog.url} target="_blank" onClick={handleLinkClick}>
        {blog.url}
      </a>
      <div>
        {blog.likes} likes <button onClick={() => likeBlogMutation.mutate(blog)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      <div>{blog.user.id === user.id && <button onClick={handleDelete}>remove</button>}</div>
    </div>
  );
};

export default BlogDetails;
