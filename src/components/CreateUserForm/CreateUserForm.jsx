import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateUserMutation, useGetAllStoresQuery } from '../../store/api/api';
import styles from './styles.module.scss';

const CreateUserForm = () => {
  const { data: stores = [], isLoading, isError } = useGetAllStoresQuery();
  const [createUser] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      role: 'STORE',
      storeId: '',
    },
  });

  const selectedRole = useWatch({
    control,
    name: 'role',
  });

  useEffect(() => {
    if (selectedRole !== 'STORE') {
      setValue('storeId', '');
    }
  }, [selectedRole, setValue]);

  const onSubmit = async data => {
    const payload = {
      ...data,
      storeId: data.role === 'STORE' ? data.storeId : null,
    };

    try {
      await createUser(payload).unwrap();
      reset();
      toast.success('User created!');
    } catch (error) {
      toast.error(error.data?.message || error.message);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2>Create New User</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>Username</label>
          <input
            className={errors.username ? styles.errorInput : ''}
            {...register('username', { required: 'Username is required' })}
            placeholder="Enter username"
          />
          {errors.username && (
            <span className={styles.errorMessage}>{errors.username.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            className={errors.password ? styles.errorInput : ''}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
            placeholder="••••••••"
          />
          {errors.password && (
            <span className={styles.errorMessage}>{errors.password.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Access Role</label>
          <select {...register('role')}>
            <option value="ADMIN">ADMIN</option>
            <option value="WAREHOUSE">WAREHOUSE</option>
            <option value="STORE">STORE</option>
          </select>
        </div>

        {selectedRole === 'STORE' && (
          <div className={styles.formGroup}>
            <label>Assigned Store</label>
            <select
              className={errors.storeId ? styles.errorInput : ''}
              {...register('storeId', {
                required: selectedRole === 'STORE' ? 'Please select a store' : false,
                valueAsNumber: true,
              })}
              disabled={isLoading}
            >
              <option value="">-- Choose a store --</option>
              {stores.map(store => (
                <option
                  key={store.id}
                  value={store.id}
                >
                  {store.name}
                </option>
              ))}
            </select>
            {isLoading && <span className={styles.loadingText}>Loading stores...</span>}
            {isError && <span className={styles.errorMessage}>Error loading stores</span>}
            {errors.storeId && (
              <span className={styles.errorMessage}>{errors.storeId.message}</span>
            )}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
