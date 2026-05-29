import React, { useState } from 'react';
import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

// just keeping these here for now instead of fetching from somewhere
const todos = [
  { id: 1, title: 'review resources' },
  { id: 2, title: 'take notes' },
  { id: 3, title: 'code out app' }
];

function App() {
  const [todoList, setTodoList] = useState(todos);

  return (
    <div className="App">
      <h1>Todo List</h1>

      {/* form section */}
      <TodoForm />

      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
