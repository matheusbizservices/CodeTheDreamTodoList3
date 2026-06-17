import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';

function Logon() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoggingOn(true);

    const result = await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
    } else {
      setAuthError('');
    }

    setIsLoggingOn(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {authError && <p role="alert">{authError}</p>}

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button type="submit" disabled={isLoggingOn}>
        {isLoggingOn ? 'Logging in...' : 'Log On'}
      </button>
    </form>
  );
}

export default Logon;
