import { Link } from "react-router-dom";
import useUsers from "../../hooks/useUsers";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const Users = ({}) => {
  const users = useUsers();

  return (
    <div>
      <Typography variant="h2" sx={{ marginTop: 2, marginBottom: 2 }}>
        Users
      </Typography>
      <TableContainer component="paper">
        <Table sx={{ maxWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell component={Link} to={`/users/${user.id}`}>
                    {user.name}
                  </TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
