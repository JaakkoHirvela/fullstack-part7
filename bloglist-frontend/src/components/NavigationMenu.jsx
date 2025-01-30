import { AppBar, Box, Button, ButtonGroup, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import UserContext, { CLEAR_USER } from "./User/UserContext";
import { useContext } from "react";

const NavigationMenu = () => {
  const [user, userDispatch] = useContext(UserContext);
  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    userDispatch({ type: CLEAR_USER });
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Box sx={{ flexGrow: 1 }} /> {/* This will push the following elements to the right */}
        {/* Spacing properties are multiplied by the theme.spacing value: https://mui.com/system/getting-started/the-sx-prop/*/}
        <Typography sx={{ marginRight: 1 }}>{user.name} logged in</Typography>
        <Button color="secondary" variant="contained" onClick={handleLogout}>
          logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationMenu;

// https://mui.com/system/getting-started/the-sx-prop/
