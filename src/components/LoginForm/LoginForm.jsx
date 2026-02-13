import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../store/api/api';
import styles from './styles.module.scss';

const LoginForm = () => {
  const [login] = useLoginMutation();
  const { register, handleSubmit, reset } = useForm();

  const handler = async formData => {
    const { data } = await login(formData);
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(data => {
        handler(data);
        reset();
      })}
      className={styles.form}
    >
      <label className={styles.wrapper}>
        <span>Username:</span>
        <input
          type="text"
          placeholder="Enter your username"
          className={styles.input}
          name="username"
          {...register('username')}
        />
      </label>
      <label className={styles.wrapper}>
        <span>Password:</span>
        <input
          type="password"
          placeholder="Enter your password"
          className={styles.input}
          name="password"
          {...register('password')}
        />
      </label>
      <button
        className={styles.btn}
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
