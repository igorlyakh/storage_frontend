const RETURN_QR_PREFIX = 'RETURN:';

export const encodeReturnQr = id => `${RETURN_QR_PREFIX}${id}`;

export const decodeReturnQr = text => {
  const trimmed = text.trim();
  return trimmed.startsWith(RETURN_QR_PREFIX)
    ? trimmed.slice(RETURN_QR_PREFIX.length)
    : trimmed;
};
