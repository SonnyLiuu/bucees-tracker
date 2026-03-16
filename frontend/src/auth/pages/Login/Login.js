import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const { login, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(data);
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
