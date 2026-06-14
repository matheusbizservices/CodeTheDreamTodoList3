import styles from './TextInputWithLabel.module.css';

// reusable labelled text input. In React 19 ref is just a regular prop,
// so we accept it and forward it to the underlying <input> so callers
// like TodoForm can focus the field.
function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  onBlur,
  value,
  ref,
  maxLength,
  placeholder,
  error,
}) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={elementId}>
        {labelText}
      </label>

      <input
        ref={ref}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        type="text"
        id={elementId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete="off"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${elementId}-error` : undefined}
      />

      {error && (
        <p id={`${elementId}-error`} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default TextInputWithLabel;
