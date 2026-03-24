import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import apiClient, { getErrorMessage } from "../../../config/apiClient";
import styles from "./styles.module.css";

const ResetPassword = () => {
	const param = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await apiClient.patch(
        `/api/auth/${param.id}/reset/${param.token}`,
        { password }
      );
      setError("");
      setMsg(data.message);
      navigate("/login");
    } catch (error) {
      setMsg("");
      setError(getErrorMessage(error, "Unable to reset password right now."));
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Cancel?</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Go Back
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Reset Password</h1>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            {msg && <div className={styles.success_msg}>{msg}</div>}
            <button type="submit" className={styles.green_btn}>
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
