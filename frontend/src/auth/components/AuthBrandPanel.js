import styles from "./AuthShell.module.css";

const AuthBrandPanel = ({ description, title }) => {
  return (
    <aside className={styles.brandPanel}>
      <p className={styles.eyebrow}>Bucee&apos;s Tracker</p>
      <h1 className={styles.brandTitle}>{title}</h1>
      <p className={styles.brandCopy}>{description}</p>
      <div className={styles.brandMeta}>
        <span>Trip logging</span>
        <span>Route history</span>
        <span>Spend insights</span>
      </div>
    </aside>
  );
};

export default AuthBrandPanel;
