import { useReducer, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';

import TodoForm from '../features/Todos/TodoForm';
import TodoList from '../features/Todos/TodoList/TodoList';
import SortBy from '../shared/SortBy';
import StatusFilter from '../shared/StatusFilter';
import FilterInput from '../shared/FilterInput';
import useDebounce from '../utils/useDebounce';
import { useAuth } from '../contexts/useAuth';
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer';
import styles from './TodosPage.module.css';

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const fetchTodos = useCallback(async () => {
    dispatch({ type: TODO_ACTIONS.FETCH_START });

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

      dispatch({
        type: TODO_ACTIONS.FETCH_SUCCESS,
        payload: { todos: data.tasks },
      });
    } catch (fetchError) {
      const isFilterError =
        debouncedFilterTerm ||
        sortBy !== 'createdAt' ||
        sortDirection !== 'desc';

      dispatch({
        type: TODO_ACTIONS.FETCH_ERROR,
        payload: {
          message: isFilterError
            ? `Error filtering/sorting todos: ${fetchError.message}`
            : `Error fetching todos: ${fetchError.message}`,
          isFilterError,
        },
      });
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token, fetchTodos]);

  const addTodo = async (todoTitle) => {
    const tempTodo = {
      id: Date.now(), // temporary id until the server responds
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: { tempTodo } });

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: tempTodo.title,
          isCompleted: tempTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const savedTodo = await response.json();

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { tempId: tempTodo.id, savedTodo },
      });
    } catch (addError) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          tempId: tempTodo.id,
          message: `Error: ${addError.message}`,
        },
      });
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todoItem) => todoItem.id === id);

    dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: { id } });

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

      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (completeError) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          id,
          originalTodo,
          message: `Error: ${completeError.message}`,
        },
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find(
      (todoItem) => todoItem.id === editedTodo.id
    );

    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: { editedTodo } });

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

      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
    } catch (updateError) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          originalTodo,
          message: `Error: ${updateError.message}`,
        },
      });
    }
  };

  const handleSortByChange = (newSortBy) => {
    dispatch({
      type: TODO_ACTIONS.SET_SORT,
      payload: { sortBy: newSortBy, sortDirection },
    });
  };

  const handleSortDirectionChange = (newSortDirection) => {
    dispatch({
      type: TODO_ACTIONS.SET_SORT,
      payload: { sortBy, sortDirection: newSortDirection },
    });
  };

  const handleFilterChange = (newTerm) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: { filterTerm: newTerm } });
  };

  const handleResetFilters = () => {
    dispatch({ type: TODO_ACTIONS.RESET_FILTERS });
  };

  return (
    <div>
      <h2>Todos</h2>

      {error && (
        <div className={styles.alert} role="alert">
          <p className={styles.alertText}>{error}</p>
          <button
            type="button"
            className={styles.alertButton}
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div className={styles.alert} role="alert">
          <p className={styles.alertText}>{filterError}</p>
          <button
            type="button"
            className={styles.alertButton}
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
            Clear Filter Error
          </button>
          <button
            type="button"
            className={styles.alertButton}
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p className={styles.loading}>Loading todos...</p>}

      <div className={styles.controls}>
        <SortBy
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortByChange={handleSortByChange}
          onSortDirectionChange={handleSortDirectionChange}
        />

        <StatusFilter />

        <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
      </div>

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;
