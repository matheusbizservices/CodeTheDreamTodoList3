import { useState, useEffect, useCallback } from 'react';

import TodoForm from './TodoForm';
import TodoList from './TodoList/TodoList';
import SortBy from '../../shared/SortBy';
import FilterInput from '../../shared/FilterInput';
import useDebounce from '../../utils/useDebounce';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState('creationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const [dataVersion, setDataVersion] = useState(0);

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const invalidateCache = useCallback(() => {
    setDataVersion((prev) => prev + 1);
  }, []);

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  const fetchTodos = useCallback(async () => {
    setIsTodoListLoading(true);

    try {
      const paramsObject = {
        sortBy,
        sortDirection,
      };

      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
      }

      const params = new URLSearchParams(paramsObject);

      const response = await fetch(`/api/tasks?${params}`, {
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
      setFilterError('');
    } catch (fetchError) {
      if (
        debouncedFilterTerm ||
        sortBy !== 'creationDate' ||
        sortDirection !== 'desc'
      ) {
        setFilterError(`Error filtering/sorting todos: ${fetchError.message}`);
      } else {
        setError(`Error fetching todos: ${fetchError.message}`);
      }
    } finally {
      setIsTodoListLoading(false);
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch sets loading/error state by design
      fetchTodos();
    }
  }, [token, fetchTodos]);

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
      invalidateCache();
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

      invalidateCache();
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

      invalidateCache();
    } catch (updateError) {
      setTodoList((prevList) =>
        prevList.map((todoItem) =>
          todoItem.id === editedTodo.id ? originalTodo : todoItem
        )
      );
      setError(`Error: ${updateError.message}`);
    }
  };

  const handleResetFilters = () => {
    setFilterTerm('');
    setSortBy('creationDate');
    setSortDirection('desc');
    setFilterError('');
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

      {filterError && (
        <div role="alert">
          <p>{filterError}</p>
          <button type="button" onClick={() => setFilterError('')}>
            Clear Filter Error
          </button>
          <button type="button" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading...</p>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </div>
  );
}

export default TodosPage;
