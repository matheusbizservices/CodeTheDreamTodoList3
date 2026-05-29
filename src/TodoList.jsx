import React from 'react';
import TodoListItem from './TodoListItem';

function TodoList({ todoList }) {
  // extra check just in case
  if (!todoList || todoList.length === 0) {
    return <p>No todos yet.</p>;
  }

  return (
    <ul>
      {todoList.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
