import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  Login: (token) => {},
  Logout: () => {},
});

function AuthContextProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const isLogged = token ? true : false;

  const loginHandler = (token, tokenExpiry) => {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", tokenExpiry);
    setToken(token);
  };
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");

    setToken(null);
  };

  const contextValue = {
    token: token,
    isLoggedIn: isLogged,
    Login: loginHandler,
    Logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthContextProvider;
