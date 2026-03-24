import { NavLink, useNavigate } from "react-router-dom";
import { useLogout } from "../../../auth/hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

import "./NavLinks.css";

const NavLinks = (props) => {
  const { user } = useAuthContext();

  const { logout } = useLogout();

  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">Stats</NavLink>
      </li>
      <li>
        <NavLink to="/trips">Trips</NavLink>
      </li>
      <li>
        <button className="LogoutButton" onClick={handleClick}>
          Logout
        </button>
      </li>
    </ul>
  );
};

export default NavLinks;
