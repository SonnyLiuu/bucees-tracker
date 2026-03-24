import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import apiClient from "../../../config/apiClient";
import styles from "./styles.module.css";

const EmailVerify = () => {
  const [status, setStatus] = useState("loading");
  const params = useParams();
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;

    const verifyEmailUrl = async () => {
      try {
        await apiClient.get(`/api/auth/register/${params.id}/verify/${params.token}`);
        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };

    verifyEmailUrl();
  }, [params.id, params.token]);

  if (status === "loading") {
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <h1>Verifying email...</h1>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <h1>Verification link is invalid or expired.</h1>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>Verified successfully.</h1>
        <p>You may close this tab now.</p>
      </div>
    </main>
  );
};

export default EmailVerify;
