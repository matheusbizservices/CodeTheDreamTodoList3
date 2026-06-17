function Header({ email, token, onSetEmail, onSetToken }) {
  const handleLogOff = () => {
    onSetEmail('');
    onSetToken('');
  };

  return (
    <header>
      <h1>Todo List</h1>

      {token && (
        <div>
          <span>{email}</span>
          <button type="button" onClick={handleLogOff}>
            Log Off
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
