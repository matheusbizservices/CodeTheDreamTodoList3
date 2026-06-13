import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/useAuth';

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
    return <p>Redirecting to login...</p>;
  }

  return children;
}

export default RequireAuth;
