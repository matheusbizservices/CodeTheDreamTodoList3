import React, { useState } from 'react';
import './App.css';

import TodoList from './TodoList';
import TodoForm from './TodoForm';

// static sample todos so the app comes preloaded with items
const todos = [
  { id: 1, title: 'review resources' },
  { id: 2, title: 'take notes' },
  { id: 3, title: 'code out app' }
];

function App() {
  const [todoList, setTodoList] = useState(todos);

  // handles adding a new todo into state
  const addTodo = (todoTitle) => {
    // using Date.now because it's quick and easy
    // might swap this out later if duplicate ids ever become an issue
    const newTodoItem = {
      id: Date.now(),
      title: todoTitle
    };

    // putting newest item at the top
    setTodoList((oldList) => [newTodoItem, ...oldList]);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>

      {/* passing addTodo down so form can update state */}
      <TodoForm onAddTodo={addTodo} />

      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
