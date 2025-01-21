import { useParams } from "react-router-dom";
import useUsers from "../../hooks/useUsers";

const UserDetails = () => {
  const userId = useParams().id;
  const users = useUsers();
  if (!users) return null;

  const user = users.find((user) => user.id === userId);

  if (!user) return null;

  return (
    <div>
      {user.name}
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetails;
