import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin } from "../../hooks/useLogin";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import apiClient, { getErrorMessage } from "../../../config/apiClient";
import { persistAuthSession } from "../../utils/authSession";
import { useAuthContext } from "../../../shared/hooks/useAuthContext";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [googleError, setGoogleError] = useState("");
  const { login, error } = useLogin();
  const { dispatch } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(data);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleError("");

      const { data: authPayload } = await apiClient.post("/api/auth/google", {
          credential: credentialResponse.credential,
      });

      persistAuthSession(authPayload);
      dispatch({ type: "LOGIN", payload: authPayload });
    } catch (err) {
      setGoogleError(getErrorMessage(err, "Google login failed"));
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Welcome to Bucees Tracker!</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              value={data.password}
              required
              className={styles.input}
            />
            {(error || googleError) && (
              <div className={styles.error_msg}>{error || googleError}</div>
            )}
            <button type="submit" className={styles.green_btn}>
              Sign In
            </button>
            <Link to="/forgotpassword" className={styles.forgot_password_link}>
              Forgot Password?
            </Link>
            <div style={{ marginTop: "16px" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setGoogleError("Google login failed");
                }}
              />
            </div>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
          <div className={styles.disclaimer}>
            Disclaimer: This is not an official Bucee's companion app.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
