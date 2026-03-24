import { useNavigate } from "react-router-dom";

import AuthShell from "./AuthShell";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import styles from "./AuthShell.module.css";

const COPY_BY_MODE = {
  login: {
    description:
      "Pick up where you left off and keep your route history, spending, and stop tracking in one place.",
    title: "Welcome back.",
  },
  signup: {
    description:
      "Create an account to log every stop, build your visit history, and keep all of your Buc-ee's trip data together.",
    title: "Create your account.",
  },
};

const AuthPage = ({ mode }) => {
  const navigate = useNavigate();
  const shellCopy = COPY_BY_MODE[mode];
  const activeTabId = `auth-tab-${mode}`;

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) {
      return;
    }

    navigate(nextMode === "login" ? "/login" : "/signup");
  };

  return (
    <AuthShell
      activeTabId={activeTabId}
      description={shellCopy.description}
      mode={mode}
      onModeChange={handleModeChange}
      title={shellCopy.title}
    >
      <div className={styles.formStage} key={mode}>
        {mode === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    </AuthShell>
  );
};

export default AuthPage;
