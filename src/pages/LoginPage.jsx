import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import styles from './LoginPage.module.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  // if RequireAuth bounced us here, it stashed where we were headed
  const from = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanedEmail = email.trim();

    if (!EMAIL_PATTERN.test(cleanedEmail)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (password.length === 0) {
      setValidationError('Please enter your password.');
      return;
    }

    setValidationError('');
    setIsLoggingOn(true);

    const result = await login(cleanedEmail, password);

    if (!result.success) {
      // server message is generic enough not to leak details, but
      // keep a friendly fallback just in case
      setAuthError(result.error || 'Unable to log in. Please try again.');
    } else {
      setAuthError('');
    }

    setIsLoggingOn(false);
  };

  const errorMessage = validationError || authError;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Log On</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {errorMessage && (
            <p className={styles.error} role="alert">
              {errorMessage}
            </p>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              className={styles.input}
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              className={styles.input}
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              maxLength={128}
              autoComplete="current-password"
              required
            />
          </div>

          <button className={styles.submitButton} type="submit" disabled={isLoggingOn}>
            {isLoggingOn ? 'Logging in...' : 'Log On'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
