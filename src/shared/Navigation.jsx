import { NavLink } from 'react-router';
import { useAuth } from '../contexts/useAuth';
import styles from './Navigation.module.css';

function navLinkClassName({ isActive }) {
  return isActive ? `${styles.link} ${styles.linkActive}` : styles.link;
}

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {isAuthenticated && (
          <li>
            <NavLink to="/todos" className={navLinkClassName}>
              Todos
            </NavLink>
          </li>
        )}

        {isAuthenticated && (
          <li>
            <NavLink to="/profile" className={navLinkClassName}>
              Profile
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to="/about" className={navLinkClassName}>
            About
          </NavLink>
        </li>

        {!isAuthenticated && (
          <li>
            <NavLink to="/login" className={navLinkClassName}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
