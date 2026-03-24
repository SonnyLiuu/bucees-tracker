import styles from "./AuthShell.module.css";

const AuthFormHeader = ({ description, title }) => {
  return (
    <div className={styles.formHeader}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default AuthFormHeader;
