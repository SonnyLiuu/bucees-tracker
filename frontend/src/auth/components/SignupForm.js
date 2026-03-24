import { useId, useState } from "react";

import { useSignup } from "../hooks/useSignup";
import AuthField from "./AuthField";
import AuthFormHeader from "./AuthFormHeader";
import styles from "./AuthShell.module.css";

const SignupForm = () => {
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const errorMessageId = useId();
  const successMessageId = useId();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const { signup, error, msg } = useSignup();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signup(data);
  };

  return (
    <>
      <AuthFormHeader
        description="Once you sign up, we will send a verification email to finish setup."
        title="Start with the basics"
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGrid}>
          <AuthField
            autoComplete="given-name"
            id={firstNameId}
            label="First Name"
            name="firstName"
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
            placeholder="First Name"
            required
            type="text"
            value={data.firstName}
          />
          <AuthField
            autoComplete="family-name"
            id={lastNameId}
            label="Last Name"
            name="lastName"
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
            placeholder="Last Name"
            required
            type="text"
            value={data.lastName}
          />
        </div>
        <AuthField
          autoComplete="email"
          describedBy={error ? errorMessageId : undefined}
          id={emailId}
          invalid={Boolean(error)}
          label="Email"
          name="email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="Email"
          required
          type="email"
          value={data.email}
        />
        <AuthField
          autoComplete="new-password"
          describedBy={error ? errorMessageId : undefined}
          id={passwordId}
          invalid={Boolean(error)}
          label="Password"
          name="password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
          placeholder="Password"
          required
          type="password"
          value={data.password}
        />
        {error && (
          <div className={styles.messageError} id={errorMessageId} role="alert">
            {error}
          </div>
        )}
        {msg && (
          <div
            aria-live="polite"
            className={styles.messageSuccess}
            id={successMessageId}
            role="status"
          >
            {msg}
          </div>
        )}
        <button className={styles.submitButton}>Sign Up</button>
      </form>
    </>
  );
};

export default SignupForm;
