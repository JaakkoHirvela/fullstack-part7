import { useRef } from "react";
import { useNewBlogMutation } from "../../services/blogsMutations";
import BlogForm from "./BlogForm";
import Togglable from "../Togglable";
import useBlogs from "../../hooks/useBlogs";
import Blog from "./Blog";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const Blogs = () => {
  const blogFormRef = useRef();
  const blogs = useBlogs();

  const afterNewBlog = () => blogFormRef.current.toggleVisibility();
  const newBlogMutation = useNewBlogMutation(afterNewBlog);

  return (
    <div>
      <Typography variant="h2" sx={{ marginTop: 2, marginBottom: 2 }}>
        Blogs
      </Typography>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={newBlogMutation.mutate} />
      </Togglable>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Author</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs &&
              blogs
                .sort((l, r) => r.likes - l.likes) // Sort in descending order.
                .map((blog) => <Blog key={blog.id} blog={blog} />)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Blogs;
