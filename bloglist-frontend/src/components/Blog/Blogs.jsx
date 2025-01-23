import { useRef } from "react";
import { useNewBlogMutation } from "../../services/blogsMutations";
import BlogForm from "./BlogForm";
import Togglable from "../Togglable";
import Blog from "./Blog";
import useBlogs from "../../hooks/useBlogs";
import { Link } from "react-router-dom";

const Blogs = () => {
  const blogFormRef = useRef();
  const blogs = useBlogs();

  const afterNewBlog = () => blogFormRef.current.toggleVisibility();
  const newBlogMutation = useNewBlogMutation(afterNewBlog);

  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={newBlogMutation.mutate} />
      </Togglable>
      {blogs &&
        blogs
          .sort((l, r) => r.likes - l.likes) // Sort in descending order.
          .map((blog) => (
            <Link key={blog.id} to={`/blogs/${blog.id}`}>
              <Blog key={blog.id} blog={blog} />
            </Link>
          ))}
    </div>
  );
};

export default Blogs;
