import styles from "./AuthShell.module.css";

const AuthModeToggle = ({ mode, onModeChange }) => {
  const isLogin = mode === "login";
  const activeIndex = isLogin ? 0 : 1;

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      onModeChange("login");
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      onModeChange("signup");
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      onModeChange("login");
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      onModeChange("signup");
    }
  };

  return (
    <div className={styles.toggleWrap}>
      <div
        aria-label="Authentication mode"
        className={styles.toggleRail}
        onKeyDown={handleKeyDown}
        role="tablist"
      >
        <span
          aria-hidden="true"
          className={`${styles.toggleThumb} ${
            isLogin ? styles.toggleThumbLogin : styles.toggleThumbSignup
          }`}
        />
        <button
          aria-controls="auth-panel"
          aria-selected={isLogin}
          className={`${styles.toggleOption} ${
            isLogin ? styles.toggleOptionActive : ""
          }`}
          id="auth-tab-login"
          onClick={() => onModeChange("login")}
          role="tab"
          tabIndex={activeIndex === 0 ? 0 : -1}
          type="button"
        >
          Login
        </button>
        <button
          aria-controls="auth-panel"
          aria-selected={!isLogin}
          className={`${styles.toggleOption} ${
            !isLogin ? styles.toggleOptionActive : ""
          }`}
          id="auth-tab-signup"
          onClick={() => onModeChange("signup")}
          role="tab"
          tabIndex={activeIndex === 1 ? 0 : -1}
          type="button"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default AuthModeToggle;
