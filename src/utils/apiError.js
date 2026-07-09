const EXACT_MESSAGES = {
  'Wrong password or username!': 'wrongCredentials',
  'Username is already exists!': 'usernameTaken',
  'User is not found!': 'userNotFound',
  'User not found!': 'userNotFound',
  'Access denied': 'accessDenied',
  'Refresh token is missing': 'refreshTokenMissing',
  'Invalid refresh token': 'invalidRefreshToken',
  'Only for admins': 'onlyForAdmins',
  'A store with this name already exists!': 'storeNameExists',
  'Brand already exists': 'brandExists',
  'Brand not found': 'brandNotFound',
  'Category already exists!': 'categoryExists',
  'Category not found!': 'categoryNotFound',
  'Product already exists!': 'productExists',
  'Product not found!': 'productNotFound',
  'Product ID not found': 'productIdNotFound',
  'Products not found': 'productsNotFound',
  'Order already closed': 'orderAlreadyClosed',
  'Order not found!': 'orderNotFound',
  'Order not found': 'orderNotFound',
  'Request not found': 'requestNotFound',
  'Store is required to create an order.': 'storeRequired',
  'Tag is required': 'tagRequired',
  'Not enough item in stock': 'notEnoughItemInStock',
  'Article must be 9 characters long': 'articleLength',
  'Minimum password length is 6 characters!': 'passwordMinLength',
};

const PATTERN_MESSAGES = [
  { regex: /^Not enough stock for (.+)!$/, key: 'notEnoughStock', params: m => ({ name: m[1] }) },
  { regex: /^Not your scope: (.+)$/, key: 'notYourScope', params: m => ({ category: m[1] }) },
  {
    regex: /^You do not have permission: (.+)$/,
    key: 'noPermission',
    params: m => ({ scope: m[1] }),
  },
  {
    regex: /^Store with id (.+) not found!$/,
    key: 'storeNotFoundWithId',
    params: m => ({ id: m[1] }),
  },
  {
    regex: /^User with id: (.+) not found!$/,
    key: 'userNotFoundWithId',
    params: m => ({ id: m[1] }),
  },
];

// Backend keeps stable English messages for its API contract; this maps the
// known ones to the current UI language, falling back to the raw message
// for anything unrecognized (e.g. new backend errors not yet mapped here).
export const translateApiMessage = (t, message) => {
  if (!message || typeof message !== 'string') return message;

  const exactKey = EXACT_MESSAGES[message];
  if (exactKey) return t(`common:apiErrors.${exactKey}`);

  for (const { regex, key, params } of PATTERN_MESSAGES) {
    const match = message.match(regex);
    if (match) return t(`common:apiErrors.${key}`, params(match));
  }

  return message;
};

export const getApiErrorMessage = (t, error, fallbackKey = 'common:feedback.genericError') => {
  const raw = error?.data?.message ?? error?.message;
  const rawMessage = Array.isArray(raw) ? raw[0] : raw;
  if (!rawMessage) return t(fallbackKey);
  return translateApiMessage(t, rawMessage);
};
