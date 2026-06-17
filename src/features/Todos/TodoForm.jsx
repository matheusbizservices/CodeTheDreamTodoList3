import { useState, useRef } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import {
  isValidTodoTitle,
  sanitizeTodoTitle,
  getTodoTitleError,
  TODO_TITLE_MAX_LENGTH,
} from '../../utils/todoValidation';
import styles from './TodoForm.module.css';

function TodoForm(props) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [touched, setTouched] = useState(false);

  const inputRef = useRef();

  const handleAddTodo = (event) => {
    event.preventDefault();

    setTouched(true);

    const cleanedTitle = sanitizeTodoTitle(workingTodoTitle);

    if (isValidTodoTitle(cleanedTitle)) {
      props.onAddTodo(cleanedTitle);

      setWorkingTodoTitle('');
      setTouched(false);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const errorMessage = touched ? getTodoTitleError(workingTodoTitle) : '';

  return (
    <form className={styles.form} onSubmit={handleAddTodo}>
      <div className={styles.field}>
        <TextInputWithLabel
          ref={inputRef}
          elementId="todoTitle"
          labelText="New Todo"
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(e.target.value)}
          onBlur={() => setTouched(true)}
          maxLength={TODO_TITLE_MAX_LENGTH}
          placeholder="What needs to be done?"
          error={errorMessage}
        />
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!isValidTodoTitle(workingTodoTitle)}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
