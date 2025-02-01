import { useNavigate, useParams } from "react-router-dom";
import useBlogs from "../../hooks/useBlogs";
import { NotificationType, setNotification, useNotificationDispatch } from "../../utils/notificationUtils";
import { useDeleteBlogMutation, useLikeBlogMutation } from "../../services/blogsMutations";
import { useUserValue } from "../User/UserContext";
import Comments from "./Comments";
import { Box, Button, Card, Divider, Typography } from "@mui/material";

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
      <Card sx={{ marginTop: 2, marginBottom: 2 }}>
        <Typography variant="h5" sx={{ paddingTop: 1, paddingLeft: 1, paddingBottom: 1, backgroundColor: "#f0f0f0" }}>
          {`${blog.title} ${blog.author}`}
        </Typography>
        <Divider sx={{ marginBottom: 1 }} />
        <Typography variant="body1" sx={{ marginLeft: 1 }}>
          <a href={blog.url} target="_blank" onClick={handleLinkClick}>
            {blog.url}
          </a>
        </Typography>
        <Divider sx={{ marginBottom: 1, marginTop: 1 }} />
        <Typography variant="body1" sx={{ marginLeft: 1, marginRight: 1 }}>
          {blog.likes} likes
        </Typography>
        <Divider sx={{ marginBottom: 1, marginTop: 1 }} />
        <Typography sx={{ marginLeft: 1, paddingBottom: 1 }} variant="body1">
          added by {blog.user.name}
        </Typography>
      </Card>
      <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
        <Button variant="contained" onClick={() => likeBlogMutation.mutate(blog)}>
          like
        </Button>
        {blog.user.id === user.id && (
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            remove
          </Button>
        )}
      </Box>
      <Comments blog={blog} />
    </div>
  );
};

export default BlogDetails;
