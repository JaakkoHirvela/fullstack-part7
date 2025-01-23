import { Link } from "react-router-dom";

const NavigationMenu = ({ children }) => {
  return (
    <nav style={{ gap: 10, padding: 10, display: "flex", backgroundColor: "lightgray" }}>
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      {children}
    </nav>
  );
};

export default NavigationMenu;
