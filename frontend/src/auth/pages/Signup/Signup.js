import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";

import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { signup, error, msg } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(data);
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Returning User?</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Sign In
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create an Account!</h1>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
              value={data.firstName}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              value={data.lastName}
              required
              className={styles.input}
            />
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
            {msg && <div className={styles.success_msg}>{msg}</div>}
            <button className={styles.green_btn}>Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
