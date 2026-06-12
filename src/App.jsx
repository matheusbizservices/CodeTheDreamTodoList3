import { useState } from 'react';
import './App.css';

import Header from './shared/Header';
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  return (
    <div className="App">
      <Header
        email={email}
        token={token}
        onSetEmail={setEmail}
        onSetToken={setToken}
      />

      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon onSetEmail={setEmail} onSetToken={setToken} />
      )}
    </div>
  );
}

export default App;
