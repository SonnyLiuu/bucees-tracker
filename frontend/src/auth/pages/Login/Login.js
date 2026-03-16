import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin } from "../../hooks/useLogin";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { API_BASE } from "../../../config/api";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const { login, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(data);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("API_BASE =", API_BASE);
      const response = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Google login failed");
      }

      localStorage.setItem("user", JSON.stringify(json));
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert(err.message);
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
            {error && <div className={styles.error_msg}>{error}</div>}
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
                  alert("Google login failed");
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
