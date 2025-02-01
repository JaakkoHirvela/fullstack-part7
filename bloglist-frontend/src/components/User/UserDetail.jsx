import { Link, useParams } from "react-router-dom";
import useUsers from "../../hooks/useUsers";
import { Box, List, ListItem, Paper, Typography } from "@mui/material";

const UserDetails = () => {
  const userId = useParams().id;
  const users = useUsers();
  if (!users) return null;

  const user = users.find((user) => user.id === userId);

  if (!user) return null;

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h5" sx={{ marginTop: 1, borderBottom: 2, maxWidth: 500 }}>
        Blogs by {user.name}
      </Typography>
      <List sx={{ maxWidth: 500 }} component={Paper}>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id} divider sx={{ marginBottom: 1 }}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserDetails;
