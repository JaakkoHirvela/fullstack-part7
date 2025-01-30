import { useState } from "react";
import PropTypes from "prop-types";
import { Button, TextField } from "@mui/material";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({ title: "", author: "", url: "" });
  };
  const textFieldStyle = { marginBottom: 1 };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            sx={textFieldStyle}
            label="title"
            required
            data-testid="title"
            value={newBlog.title}
            name="title"
            onChange={handleBlogChange}
          />
        </div>
        <div>
          <TextField
            sx={textFieldStyle}
            label="author"
            required
            data-testid="author"
            value={newBlog.author}
            name="author"
            onChange={handleBlogChange}
          />
        </div>
        <div>
          <TextField
            sx={textFieldStyle}
            label="url"
            required
            data-testid="url"
            value={newBlog.url}
            name="url"
            onChange={handleBlogChange}
          />
        </div>
        <Button variant="contained" type="submit">
          create
        </Button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
