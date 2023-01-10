import { useState, useRef, useContext } from "react";
import { AuthContext } from "../Store/AuthContext";
import { useHistory } from "react-router-dom";

import LoadingSpinner from "./LoadingSpinner";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [userNameExists, setUserNameExists] = useState(false);

  const history = useHistory();
  const userInputRef = useRef();
  const passwordInputtRef = useRef();
  const authContext = useContext(AuthContext);

  async function checkEmail(email) {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=AIzaSyB-Kkd4NuFEjx0AXCYoYPjXjx6UNmUMEuE",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email,
          continueUri: "http://localhost:3000/auth",
        }),
      }
    );
    const { registered } = await response.json();
    setUserNameExists(registered ? true : false);
  }

  async function loginUser(data) {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB-Kkd4NuFEjx0AXCYoYPjXjx6UNmUMEuE",
        {
          method: "POST",
          body: JSON.stringify({
            email: data.userVal,
            password: data.passwordVal,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) throw new Error();
      else {
        const { idToken, expiresIn } = await response.json();

        authContext.Login(idToken, expiresIn);
        history.push("/profile");
      }
    } catch (error) {
      // console.log(error.message);
    }
    setIsLogging(false);
  }

  async function signUpUser(data) {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB-Kkd4NuFEjx0AXCYoYPjXjx6UNmUMEuE ",
        {
          method: "POST",
          body: JSON.stringify({
            email: data.userVal,
            password: data.passwordVal,
            returnSecureToken: true,
          }),
        }
      );

      const reponseData = await response.json();
      if (response.ok) history.push("profile");
    } catch (error) {}
  }

  const emailBlurHandler = () => {
    if (!isLogin) checkEmail(userInputRef.current.value);
  };

  const switchAuthModeHandler = () => {
    setUserNameExists(false);
    setIsLogin(!isLogin);
  };
  const submitHandler = (event) => {
    event.preventDefault();

    const userVal = userInputRef.current.value;
    const passwordVal = passwordInputtRef.current.value;

    if (isLogin) {
      setIsLogging(true);
      loginUser({ userVal: userVal, passwordVal: passwordVal });
    } else signUpUser({ userVal: userVal, passwordVal: passwordVal });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            onBlur={emailBlurHandler}
            ref={userInputRef}
            type="email"
            id="email"
            required
          />
          {userNameExists && (
            <p style={{ color: "white" }}>🚨 This username already exists </p>
          )}
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            ref={passwordInputtRef}
            type="password"
            id="password"
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLogging ? (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          ) : (
            <LoadingSpinner />
          )}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
