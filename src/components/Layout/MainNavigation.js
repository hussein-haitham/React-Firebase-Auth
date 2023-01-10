import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../Store/AuthContext";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const { isLoggedIn, Logout } = useContext(AuthContext);
  const history = useHistory();
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          <li>{!isLoggedIn && <Link to="/auth">Login</Link>}</li>
          <li>{isLoggedIn && <Link to="/profile">Profile</Link>}</li>
          <li>
            {isLoggedIn && (
              <button
                onClick={() => {
                  Logout();
                  history.push("/");
                }}
              >
                Logout
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
