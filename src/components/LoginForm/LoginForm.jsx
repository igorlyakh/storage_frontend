import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/api/api';
import { setData } from '../../store/userSlice/userSlice';
import styles from './styles.module.scss';

const LoginForm = () => {
  const [login] = useLoginMutation();
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  const handler = async formData => {
    const { data } = await login(formData);
    dispatch(setData(data));
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
