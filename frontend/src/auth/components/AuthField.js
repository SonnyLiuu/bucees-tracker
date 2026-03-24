import styles from "./AuthShell.module.css";

const AuthField = ({
  autoComplete,
  describedBy,
  id,
  invalid = false,
  label,
  name,
  onChange,
  placeholder,
  required = false,
  type,
  value,
}) => {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={describedBy}
        aria-invalid={invalid}
        autoComplete={autoComplete}
        className={styles.input}
        id={id}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </div>
  );
};

export default AuthField;
