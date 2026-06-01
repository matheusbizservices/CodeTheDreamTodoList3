import React, { useRef } from 'react';

function TodoForm(props) {
  const inputRef = useRef();

  const handleAddTodo = (event) => {
    // don't want the form to refresh the page
    event.preventDefault();

    // send the typed value up to App so it can update state
    props.onAddTodo(inputRef.current.value);

    // clear the field after adding
    inputRef.current.value = '';
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo:</label>
      <input
        ref={inputRef}
        type="text"
        id="todoTitle"
        name="todoTitle"
        placeholder="Todo text"
        required
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
