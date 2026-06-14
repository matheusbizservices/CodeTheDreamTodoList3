import DOMPurify from 'dompurify';

export const TODO_TITLE_MAX_LENGTH = 100;

// strip whitespace and any HTML/script content before it ever
// touches state or the API
export function sanitizeTodoTitle(title) {
  if (typeof title !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(title.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

// shared validation so the form and the edit row agree on what counts
// as a usable todo title: non-empty after sanitizing, and within the
// max length so the UI and the API stay in sync
export function isValidTodoTitle(title) {
  const cleaned = sanitizeTodoTitle(title);
  return cleaned !== '' && cleaned.length <= TODO_TITLE_MAX_LENGTH;
}

export function getTodoTitleError(title) {
  const cleaned = sanitizeTodoTitle(title);

  if (cleaned === '') {
    return 'Todo title cannot be empty.';
  }

  if (cleaned.length > TODO_TITLE_MAX_LENGTH) {
    return `Todo title must be ${TODO_TITLE_MAX_LENGTH} characters or fewer.`;
  }

  return '';
}
