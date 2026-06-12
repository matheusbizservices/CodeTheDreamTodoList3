import './App.css';

import Header from './shared/Header';
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';
import { useAuth } from './contexts/useAuth';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      <Header />

      {isAuthenticated ? <TodosPage /> : <Logon />}
    </div>
  );
}

export default App;
