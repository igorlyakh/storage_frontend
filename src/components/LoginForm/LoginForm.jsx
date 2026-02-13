import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/api/api';
import { setData } from '../../store/userSlice/userSlice';
import styles from './styles.module.scss';

const LoginForm = () => {
  const [login] = useLoginMutation();
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();

  const handler = async formData => {
    try {
      const data = await login(formData).unwrap();
      dispatch(setData(data));
      toast.success(`Welcome, ${data.username}!`);
    } catch (error) {
      toast.error(error.data?.message || error.message);
    } finally {
      reset();
    }
  };

  return (
    <div className={styles.form__wrapper}>
      <form
        onSubmit={handleSubmit(data => {
          handler(data);
        })}
        className={styles.form}
      >
        <label className={styles.wrapper}>
          <span>Username:</span>
          <input
            type="text"
            placeholder="Enter your username"
            className={styles.input}
            {...register('username', {
              required: 'Username is required!',
            })}
          />
        </label>
        <label className={styles.wrapper}>
          <span>Password:</span>
          <input
            type="password"
            placeholder="Enter your password"
            className={styles.input}
            {...register('password', {
              required: 'Password is required!',
              minLength: {
                value: 6,
                message: 'Password must be longer than 6 characters!',
              },
            })}
          />
        </label>
        <button
          className={styles.btn}
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
