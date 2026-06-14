import { useAuth } from '../contexts/useAuth';
import Logoff from '../features/Logoff';
import Navigation from './Navigation';
import styles from './Header.module.css';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Todo List</h1>

      <Navigation />

      {isAuthenticated && <Logoff />}
    </header>
  );
}

export default Header;
