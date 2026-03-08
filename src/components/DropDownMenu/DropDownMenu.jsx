import { ArrowDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const DropdownMenu = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={styles.container}
      ref={menuRef}
    >
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {title}
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
          <ArrowDown
            size={18}
            strokeWidth={2}
          />
        </span>
      </button>

      {isOpen && (
        <ul className={styles.dropdown}>
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => setIsOpen(false)}
            >
              <Link
                to={item.to}
                className={styles.dropdownLink}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
