import './App.css'

function App() {
  const todoList = [
    { id: 1, title: 'review resources' },
    { id: 2, title: 'take notes' },
    { id: 3, title: 'code out app' }
  ]

  return (
    <div>
      <h1>My Todos</h1>
      <ul>
        {todoList.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
import { useState } from 'react';
import './App.css';

import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);

  // adds new todo item into state
  const addTodo = (todoTitle) => {
    const newTodo = {
      id: Date.now(), // quick id solution for now
      title: todoTitle,
      isCompleted: false
    };

    // putting newest todos first
    setTodoList((prevList) => [newTodo, ...prevList]);
  };

  // marks todo as completed
  const completeTodo = (id) => {
    const updatedTodoList = todoList.map((todoItem) => {
      if (todoItem.id === id) {
        return { ...todoItem, isCompleted: true };
      }
      return todoItem;
    });

    setTodoList(updatedTodoList);
  };

  // updates todo title after editing
  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todoItem) => {
      if (todoItem.id === editedTodo.id) {
        return { ...editedTodo };
      }
      return todoItem;
    });

    setTodoList(updatedTodos);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  )
}

export default App
