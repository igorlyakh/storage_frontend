import { useDirection } from '@mantine/core';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguageDirection } from '../../i18n/languages';

export const useSyncLanguage = () => {
  const { i18n } = useTranslation();
  const { setDirection } = useDirection();

  useEffect(() => {
    const handleLanguageChanged = lng => setDirection(getLanguageDirection(lng));
    i18n.on('languageChanged', handleLanguageChanged);
    setDirection(getLanguageDirection(i18n.resolvedLanguage));

    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, [i18n, setDirection]);
};

export const syncLanguageFromAccount = (i18n, accountLanguage) => {
  if (!accountLanguage) return;
  const code = accountLanguage.toLowerCase();
  if (code !== i18n.resolvedLanguage) {
    i18n.changeLanguage(code);
  }
};
