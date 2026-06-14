import { useState } from 'react';

import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import {
  isValidTodoTitle,
  sanitizeTodoTitle,
  getTodoTitleError,
  TODO_TITLE_MAX_LENGTH,
} from '../../../utils/todoValidation';
import styles from './TodoListItem.module.css';

function TodoListItem(props) {
  const { todo, onCompleteTodo, onUpdateTodo } = props;

  const [isEditing, setIsEditing] = useState(false);

  // local state while editing title
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  const [touched, setTouched] = useState(false);

  const handleUpdate = (event) => {
    event.preventDefault();

    // extra safety check
    if (!isEditing) {
      return;
    }

    setTouched(true);

    const cleanedTitle = sanitizeTodoTitle(workingTitle);

    if (isValidTodoTitle(cleanedTitle)) {
      onUpdateTodo({
        ...todo,
        title: cleanedTitle,
      });

      setIsEditing(false);
      setTouched(false);
    }
  };

  const handleCancel = () => {
    // reset changes if user cancels
    setWorkingTitle(todo.title);
    setTouched(false);
    setIsEditing(false);
  };

  const errorMessage = touched ? getTodoTitleError(workingTitle) : '';

  return (
    <li className={styles.item}>
      <form className={styles.form} onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`edit-${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={(e) => setWorkingTitle(e.target.value)}
              onBlur={() => setTouched(true)}
              maxLength={TODO_TITLE_MAX_LENGTH}
              error={errorMessage}
            />

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleUpdate}
                disabled={!isValidTodoTitle(workingTitle)}
              >
                Save
              </button>

              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className={styles.row}>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
              aria-label={`Mark "${todo.title}" as ${
                todo.isCompleted ? 'active' : 'completed'
              }`}
            />

            <button
              type="button"
              className={`${styles.title} ${
                todo.isCompleted ? styles.completed : ''
              }`}
              onClick={() => setIsEditing(true)}
            >
              {todo.title}
            </button>
          </div>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
