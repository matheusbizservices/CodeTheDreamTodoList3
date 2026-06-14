import { Link } from 'react-router';
import styles from './StaticPage.module.css';

function NotFoundPage() {
  return (
    <div className={`${styles.page} ${styles.centered}`}>
      <h2>404 - Page Not Found</h2>
      <p>We couldn't find the page you were looking for.</p>

      <ul className={styles.linkList}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/todos">Todos</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </div>
  );
}

export default NotFoundPage;
