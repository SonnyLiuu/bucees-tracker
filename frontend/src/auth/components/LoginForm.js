import { useId, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

import apiClient, { getErrorMessage } from "../../config/apiClient";
import { useAuthContext } from "../../shared/hooks/useAuthContext";
import { useLogin } from "../hooks/useLogin";
import { persistAuthSession } from "../utils/authSession";
import AuthField from "./AuthField";
import AuthFormHeader from "./AuthFormHeader";
import styles from "./AuthShell.module.css";

const LoginForm = () => {
  const emailId = useId();
  const passwordId = useId();
  const messageId = useId();
  const [data, setData] = useState({ email: "", password: "" });
  const [googleError, setGoogleError] = useState("");
  const { login, error } = useLogin();
  const { dispatch } = useAuthContext();
  const combinedError = error || googleError;

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    <>
      <AuthFormHeader
        description="Use your email and password or continue with Google."
        title="Sign in to your account"
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <AuthField
          autoComplete="email"
          describedBy={combinedError ? messageId : undefined}
          id={emailId}
          invalid={Boolean(combinedError)}
          label="Email"
          name="email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="Email"
          required
          type="email"
          value={data.email}
        />
        <AuthField
          autoComplete="current-password"
          describedBy={combinedError ? messageId : undefined}
          id={passwordId}
          invalid={Boolean(combinedError)}
          label="Password"
          name="password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
          placeholder="Password"
          required
          type="password"
          value={data.password}
        />
        {combinedError && (
          <div className={styles.messageError} id={messageId} role="alert">
            {combinedError}
          </div>
        )}
        <button type="submit" className={styles.submitButton}>
          Sign In
        </button>
        <Link to="/forgotpassword" className={styles.secondaryLink}>
          Forgot Password?
        </Link>
        <div className={styles.googleWrap}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setGoogleError("Google login failed");
            }}
          />
        </div>
      </form>
    </>
  );
};

export default LoginForm;
