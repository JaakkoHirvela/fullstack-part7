import { Box, Button, TextField, Typography } from "@mui/material";

const LoginForm = ({ onSubmit, username, password, setUsername, setPassword }) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2, // Add spacing between elements
      }}
    >
      <Typography variant="h4">
        Log in
      </Typography>
      <TextField
        sx={{ marginRight: 1 }}
        value={username}
        name="username"
        data-testid="username"
        onChange={({ target }) => setUsername(target.value)}
      />
      <TextField
        sx={{ marginRight: 1 }}
        type="password"
        value={password}
        name="password"
        data-testid="password"
        onChange={({ target }) => setPassword(target.value)}
      />
      <Button variant="outlined" type="submit">login</Button>
    </Box>
  );
};

export default LoginForm;
