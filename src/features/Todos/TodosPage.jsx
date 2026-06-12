import { useState, useEffect } from 'react';

import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsTodoListLoading(true);

      try {
        const response = await fetch('/api/tasks', {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();

        setTodoList(data.tasks);
      } catch (fetchError) {
        setError(`Error: ${fetchError.message}`);
      } finally {
        setIsTodoListLoading(false);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token]);

  const addTodo = async (todoTitle) => {
    const newTodo = {
      id: Date.now(), // temporary id until the server responds
      title: todoTitle,
      isCompleted: false,
    };

    // putting newest todos first
    setTodoList((prevList) => [newTodo, ...prevList]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: newTodo.title,
          isCompleted: newTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const savedTodo = await response.json();

      setTodoList((prevList) =>
        prevList.map((todoItem) =>
          todoItem.id === newTodo.id ? savedTodo : todoItem
        )
      );
    } catch (addError) {
      setTodoList((prevList) =>
        prevList.filter((todoItem) => todoItem.id !== newTodo.id)
      );
      setError(`Error: ${addError.message}`);
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todoItem) => todoItem.id === id);

    setTodoList((prevList) =>
      prevList.map((todoItem) =>
        todoItem.id === id ? { ...todoItem, isCompleted: true } : todoItem
      )
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }
    } catch (completeError) {
      setTodoList((prevList) =>
        prevList.map((todoItem) =>
          todoItem.id === id ? originalTodo : todoItem
        )
      );
      setError(`Error: ${completeError.message}`);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find(
      (todoItem) => todoItem.id === editedTodo.id
    );

    setTodoList((prevList) =>
      prevList.map((todoItem) =>
        todoItem.id === editedTodo.id ? { ...editedTodo } : todoItem
      )
    );

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
    } catch (updateError) {
      setTodoList((prevList) =>
        prevList.map((todoItem) =>
          todoItem.id === editedTodo.id ? originalTodo : todoItem
        )
      );
      setError(`Error: ${updateError.message}`);
    }
  };

  return (
    <div>
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setError('')}>
            Clear Error
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading...</p>}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;
