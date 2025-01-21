import { Link } from "react-router-dom";
import useUsers from "../../hooks/useUsers";

const Users = ({}) => {
  const users = useUsers();

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users &&
          users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Users;
