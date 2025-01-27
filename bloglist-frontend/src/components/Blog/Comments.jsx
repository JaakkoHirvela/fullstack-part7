import { useState } from "react";
import { useCommentBlogMutation } from "../../services/blogsMutations";

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
      <h3>comments</h3>

      <form onSubmit={onSubmit}>
        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} name="comment"></input>
        <button type="submit">add comment</button>
      </form>

      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </>
  );
};

export default Comments;
