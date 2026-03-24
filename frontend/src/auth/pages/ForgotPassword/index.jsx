import { useState } from "react";
import { Link } from "react-router-dom";
import apiClient, { getErrorMessage } from "../../../config/apiClient";
import styles from "./styles.module.css";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [msg, setMsg] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await apiClient.post("/api/auth/forgot", { email });
			setError("");
			setMsg(data.message);
		} catch (error) {
			setMsg("");
			setError(getErrorMessage(error, "Unable to send reset email right now."));
		}
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					<h1>Remember?</h1>
					<Link to="/login">
						<button type="button" className={styles.white_btn}>
							Go Back
						</button>
					</Link>
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Forgot Password</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={(e)=>setEmail(e.target.value)}
							value={email}
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

export default ForgotPassword;
