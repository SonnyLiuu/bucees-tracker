import AuthBrandPanel from "./AuthBrandPanel";
import AuthModeToggle from "./AuthModeToggle";
import styles from "./AuthShell.module.css";

const AuthShell = ({
  activeTabId,
  children,
  description,
  mode,
  onModeChange,
  title,
}) => {
  return (
    <main className={styles.page}>
      <div className={styles.pageInner}>
        <AuthModeToggle mode={mode} onModeChange={onModeChange} />

        <section className={styles.card}>
          <div className={styles.brandStage} key={`brand-${mode}`}>
            <AuthBrandPanel description={description} title={title} />
          </div>
          <div
            aria-labelledby={activeTabId}
            className={styles.formPanel}
            id="auth-panel"
            role="tabpanel"
          >
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthShell;
