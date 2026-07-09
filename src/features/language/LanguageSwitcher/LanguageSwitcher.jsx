import { Menu, UnstyledButton } from '@mantine/core';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { SUPPORTED_LANGUAGES } from '../../../i18n/languages';
import { useUpdateLanguageMutation } from '../../../store/api/api';
import { tokenSelector } from '../../../store/selectors/selectors';

const LanguageSwitcher = ({ color = 'gray.0' }) => {
  const { i18n, t } = useTranslation('common');
  const token = useSelector(tokenSelector);
  const [updateLanguage] = useUpdateLanguageMutation();

  const currentLanguage =
    SUPPORTED_LANGUAGES.find(language => language.code === i18n.resolvedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const handleSelect = async code => {
    if (code === i18n.resolvedLanguage) return;

    await i18n.changeLanguage(code);

    if (token) {
      try {
        await updateLanguage(code.toUpperCase()).unwrap();
      } catch {
        toast.error(t('language.changeError'));
      }
    }
  };

  return (
    <Menu
      trigger="hover"
      openDelay={50}
      closeDelay={200}
      shadow="md"
      width={160}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          c={color}
          aria-label={t('language.label')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px' }}
        >
          <Languages size={16} />
          {currentLanguage.code.toUpperCase()}
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {SUPPORTED_LANGUAGES.map(language => (
          <Menu.Item
            key={language.code}
            fw={language.code === currentLanguage.code ? 700 : 400}
            onClick={() => handleSelect(language.code)}
          >
            {language.nativeLabel}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSwitcher;
