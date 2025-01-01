import PropTypes from "prop-types";

const LoginForm = ({ onSubmit, username, password, setUsername, setPassword }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        username <input type="text" value={username} name="username" data-testid="username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password <input type="password" value={password} name="password" data-testid="password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
};

export default LoginForm;
