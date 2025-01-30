import { Link, useParams } from "react-router-dom";
import useUsers from "../../hooks/useUsers";
import { Box, Divider, List, ListItem, Typography } from "@mui/material";

const UserDetails = () => {
  const userId = useParams().id;
  const users = useUsers();
  if (!users) return null;

  const user = users.find((user) => user.id === userId);

  if (!user) return null;

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h4" gutterBottom>
        {user.name}
      </Typography>
      <Typography variant="h5" sx={{ borderBottom: 1, marginBottom: 1, maxWidth: 500 }}>
        Added blogs
      </Typography>
      <List sx={{ maxWidth: 500 }}>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id} sx={{ borderBottom: 1, marginBottom: 1 }} component={Link} to={`/blogs/${blog.id}`}>
            {blog.title}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserDetails;
