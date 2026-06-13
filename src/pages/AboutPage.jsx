function AboutPage() {
  return (
    <div>
      <h2>About This App</h2>
      <p>
        This is a todo list app built as part of the Code the Dream React
        course. It lets a logged in user add, complete, edit, sort, and
        filter their own tasks.
      </p>

      <h3>Features</h3>
      <ul>
        <li>Email/password login with session based auth</li>
        <li>Add, complete, and edit todos with optimistic updates</li>
        <li>Sort todos by creation date or title</li>
        <li>Search/filter todos by title (debounced)</li>
        <li>Filter todos by status using the URL (all/active/completed)</li>
        <li>Profile page with todo stats</li>
      </ul>

      <h3>Technologies Used</h3>
      <ul>
        <li>React</li>
        <li>React Router</li>
        <li>Vite</li>
      </ul>
    </div>
  );
}

export default AboutPage;
