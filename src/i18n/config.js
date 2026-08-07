import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enAuth from './locales/en/auth.json';
import enBrands from './locales/en/brands.json';
import enCategories from './locales/en/categories.json';
import enCommon from './locales/en/common.json';
import enNav from './locales/en/nav.json';
import enNotFound from './locales/en/notFound.json';
import enOrders from './locales/en/orders.json';
import enProducts from './locales/en/products.json';
import enSettings from './locales/en/settings.json';
import enRequests from './locales/en/requests.json';
import enStatistics from './locales/en/statistics.json';
import enStores from './locales/en/stores.json';
import enUsers from './locales/en/users.json';
import enValidation from './locales/en/validation.json';
import enWarehouse from './locales/en/warehouse.json';

import heAuth from './locales/he/auth.json';
import heBrands from './locales/he/brands.json';
import heCategories from './locales/he/categories.json';
import heCommon from './locales/he/common.json';
import heNav from './locales/he/nav.json';
import heNotFound from './locales/he/notFound.json';
import heOrders from './locales/he/orders.json';
import heProducts from './locales/he/products.json';
import heSettings from './locales/he/settings.json';
import heRequests from './locales/he/requests.json';
import heStatistics from './locales/he/statistics.json';
import heStores from './locales/he/stores.json';
import heUsers from './locales/he/users.json';
import heValidation from './locales/he/validation.json';
import heWarehouse from './locales/he/warehouse.json';

import ruAuth from './locales/ru/auth.json';
import ruBrands from './locales/ru/brands.json';
import ruCategories from './locales/ru/categories.json';
import ruCommon from './locales/ru/common.json';
import ruNav from './locales/ru/nav.json';
import ruNotFound from './locales/ru/notFound.json';
import ruOrders from './locales/ru/orders.json';
import ruProducts from './locales/ru/products.json';
import ruSettings from './locales/ru/settings.json';
import ruRequests from './locales/ru/requests.json';
import ruStatistics from './locales/ru/statistics.json';
import ruStores from './locales/ru/stores.json';
import ruUsers from './locales/ru/users.json';
import ruValidation from './locales/ru/validation.json';
import ruWarehouse from './locales/ru/warehouse.json';

import { DEFAULT_LANGUAGE, LANGUAGE_CODES, getLanguageDirection } from './languages';

export const defaultNS = 'common';

const resources = {
  en: {
    common: enCommon,
    nav: enNav,
    auth: enAuth,
    orders: enOrders,
    products: enProducts,
    warehouse: enWarehouse,
    requests: enRequests,
    users: enUsers,
    brands: enBrands,
    categories: enCategories,
    stores: enStores,
    statistics: enStatistics,
    settings: enSettings,
    validation: enValidation,
    notFound: enNotFound,
  },
  ru: {
    common: ruCommon,
    nav: ruNav,
    auth: ruAuth,
    orders: ruOrders,
    products: ruProducts,
    warehouse: ruWarehouse,
    requests: ruRequests,
    users: ruUsers,
    brands: ruBrands,
    categories: ruCategories,
    stores: ruStores,
    statistics: ruStatistics,
    settings: ruSettings,
    validation: ruValidation,
    notFound: ruNotFound,
  },
  he: {
    common: heCommon,
    nav: heNav,
    auth: heAuth,
    orders: heOrders,
    products: heProducts,
    warehouse: heWarehouse,
    requests: heRequests,
    users: heUsers,
    brands: heBrands,
    categories: heCategories,
    stores: heStores,
    statistics: heStatistics,
    settings: heSettings,
    validation: heValidation,
    notFound: heNotFound,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: LANGUAGE_CODES,
    fallbackLng: DEFAULT_LANGUAGE,
    load: 'languageOnly',
    defaultNS,
    ns: Object.keys(resources[DEFAULT_LANGUAGE]),
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
    interpolation: {
      escapeValue: false,
    },
    returnEmptyString: false,
    initImmediate: false,
    react: {
      useSuspense: false,
    },
  });

const applyDocumentDirection = lng => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lng;
  document.documentElement.dir = getLanguageDirection(lng);
};

applyDocumentDirection(i18n.resolvedLanguage || DEFAULT_LANGUAGE);
i18n.on('languageChanged', applyDocumentDirection);

export default i18n;
