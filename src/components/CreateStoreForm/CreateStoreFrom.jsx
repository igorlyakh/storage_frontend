import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateStoreMutation } from '../../store/api/api';
import styles from './styles.module.scss';

const CreateStoreForm = () => {
  const [createStore] = useCreateStoreMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async data => {
    try {
      await createStore(data).unwrap();
      reset();
      toast.success('Store created!');
    } catch (error) {
      toast.error(error.data?.message || error.message);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h2>Create New Store</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>Store Name</label>
          <input
            className={errors.name ? styles.errorInput : ''}
            {...register('name', {
              required: 'Store name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
              maxLength: { value: 50, message: 'Name is too long' },
            })}
            placeholder="e.g. Store-1"
          />
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name.message}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Create Store'}
        </button>
      </form>
    </div>
  );
};

export default CreateStoreForm;
