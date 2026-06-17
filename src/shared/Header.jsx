import { useAuth } from '../contexts/useAuth';
import Logoff from '../features/Logoff';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      {isAuthenticated && <Logoff />}
    </header>
  );
}

export default Header;
