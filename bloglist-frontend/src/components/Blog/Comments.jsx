import { useState } from "react";
import { useCommentBlogMutation } from "../../services/blogsMutations";
import { TextField, Typography, Button, List, ListItem, ListItemIcon } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

const Comments = ({ blog }) => {
  const [comment, setComment] = useState("");
  const commentMutation = useCommentBlogMutation();

  const onSubmit = (event) => {
    event.preventDefault();
    commentMutation.mutate({ blogId: blog.id, content: comment });
    setComment("");
  };

  return (
    <>
      <Typography variant="h6">Comments</Typography>
      <form onSubmit={onSubmit}>
        <TextField label="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
        <Button type="submit">add comment</Button>
      </form>
      <List>
        {blog.comments.map((comment, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <CircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body1">{comment}</Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Comments;
