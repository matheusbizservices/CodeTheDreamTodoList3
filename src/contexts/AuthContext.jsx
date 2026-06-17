import { useState } from 'react';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const login = async (loginEmail, password) => {
    try {
      const response = await fetch('/api/users/logon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: loginEmail, password }),
      });

      const data = await response.json();

      if (response.status === 200 && data.name && data.csrfToken) {
        setEmail(data.name);
        setToken(data.csrfToken);
        return { success: true };
      }

      return {
        success: false,
        error: `Authentication failed: ${data?.message}`,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error: ${error.name} | ${error.message}`,
      };
    }
  };

  const logout = async () => {
    if (!token) {
      setEmail('');
      setToken('');
      return { success: true };
    }

    try {
      const response = await fetch('/api/users/logoff', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': token },
        credentials: 'include',
      });

      setEmail('');
      setToken('');

      if (!response.ok) {
        return { success: false, error: 'Logoff request failed' };
      }

      return { success: true };
    } catch (error) {
      // clear local state either way - no point staying "logged in"
      // locally if the server call blew up
      setEmail('');
      setToken('');
      return { success: false, error: `Error: ${error.message}` };
    }
  };

  const value = {
    email,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
