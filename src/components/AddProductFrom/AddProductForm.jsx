import { useForm } from 'react-hook-form';
import { productCategories } from './config';
import styles from './styles.module.scss';

const AddProductForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    console.log(data);
    reset();
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add New Product</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
      >
        <label className={styles.labelGroup}>
          <span>Product name</span>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Enter product name"
            {...register('name', { required: 'Product name is required!' })}
          />
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name.message}</span>
          )}
        </label>

        <label className={styles.labelGroup}>
          <span>Category</span>
          <select
            className={styles.selectField}
            {...register('category')}
          >
            {productCategories.map(category => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.labelGroup}>
          <span>Limit (optional)</span>
          <input
            className={styles.inputField}
            type="number"
            placeholder="Enter limit"
            {...register('limitPerOrder')}
          />
        </label>

        <label className={styles.labelGroup}>
          <span>Initial Quantity (optional)</span>
          <input
            className={styles.inputField}
            type="number"
            placeholder="Enter quantity"
            defaultValue={0}
            {...register('initialQuantity')}
          />
        </label>

        <button
          type="submit"
          className={styles.submitBtn}
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
