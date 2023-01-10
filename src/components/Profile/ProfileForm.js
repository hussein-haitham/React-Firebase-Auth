import classes from "./ProfileForm.module.css";
import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../Store/AuthContext";

function ProfileForm() {
  const { token } = useContext(AuthContext);
  const newPasswordRef = useRef();
  const history = useHistory();

  async function changePassword(newPassword) {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB-Kkd4NuFEjx0AXCYoYPjXjx6UNmUMEuE",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: token,
            password: newPassword,
            returnSecureToken: false,
          }),
          headers: { "Content-type": "application/json " },
        }
      );
      if (!response.ok) {
        throw new Error();
      } else {
        history.push("/auth");
      }
    } catch (error) {}
  }

  const submitHandler = (event) => {
    event.preventDefault();

    changePassword(newPasswordRef.current.value);
  };
  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input ref={newPasswordRef} type="password" id="new-password" />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
