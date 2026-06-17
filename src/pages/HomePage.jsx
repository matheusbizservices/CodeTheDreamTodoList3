import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import styles from './StaticPage.module.css';

function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`${styles.page} ${styles.centered}`}>
      <p>Redirecting...</p>
    </div>
  );
}

export default HomePage;
