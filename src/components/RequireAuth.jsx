import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import styles from '../pages/StaticPage.module.css';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // send them to login but remember where they were trying to go
      navigate('/login', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated) {
    return (
      <div className={`${styles.page} ${styles.centered}`}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return children;
}

export default RequireAuth;
