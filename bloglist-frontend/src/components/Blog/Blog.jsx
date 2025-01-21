import { useState } from "react";
import PropTypes from "prop-types"; 

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const onDeleteClicked = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) handleDelete(blog);
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={hideWhenVisible}>
          view
        </button>
        <button onClick={toggleVisibility} style={showWhenVisible}>
          hide
        </button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
        </p>
        <p>{blog.user.name}</p>
        {blog.user.id === user.id && <button onClick={onDeleteClicked}>remove</button>}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Blog;
