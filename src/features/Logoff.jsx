import { useAuth } from '../contexts/useAuth';

function Logoff() {
  const { email, logout } = useAuth();

  const handleLogOff = async () => {
    await logout();
    // not bothering to show an error here - either way the user
    // ends up logged out locally and back at the login form
  };

  return (
    <div>
      <span>{email}</span>
      <button type="button" onClick={handleLogOff}>
        Log Off
      </button>
    </div>
  );
}

export default Logoff;
