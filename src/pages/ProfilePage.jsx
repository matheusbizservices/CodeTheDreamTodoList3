import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { email, token } = useAuth();

  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError('');

        const options = {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        };

        const response = await fetch('/api/tasks', options);

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        const todos = data.tasks;

        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (statsError) {
        setError(`Error loading statistics: ${statsError.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionPercent =
    todoStats.total > 0
      ? Math.round((todoStats.completed / todoStats.total) * 100)
      : 0;

  return (
    <div>
      <h2>Profile</h2>

      <section className={styles.section}>
        <h3>Account</h3>
        <p>Email: {email}</p>
        <p>Status: Logged in</p>
      </section>

      <section className={styles.section}>
        <h3>Todo Stats</h3>

        {loading && <p className={styles.loading}>Loading stats...</p>}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <ul className={styles.statsList}>
            <li>Total todos: {todoStats.total}</li>
            <li>Completed: {todoStats.completed}</li>
            <li>Active: {todoStats.active}</li>
            {todoStats.total > 0 && (
              <li>Completion rate: {completionPercent}%</li>
            )}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
