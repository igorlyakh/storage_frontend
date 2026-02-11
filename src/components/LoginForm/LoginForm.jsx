const LoginForm = () => {
  return (
    <form>
      <label>
        <span>Username:</span>
        <input
          type="text"
          placeholder="Enter your username..."
        />
      </label>
      <label>
        <span>Password:</span>
        <input
          type="password"
          placeholder="Enter your password..."
        />
      </label>
    </form>
  );
};

export default LoginForm;
