import { Badge } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const STATUS_COLORS = {
  PENDING: 'yellow',
  APPROVED: 'blue',
  REJECTED: 'red',
  IN_TRANSIT: 'grape',
  COMPLETED: 'green',
};

const ReturnStatusBadge = ({ status, size = 'md' }) => {
  const { t } = useTranslation('returns');

  return (
    <Badge
      color={STATUS_COLORS[status] || 'gray'}
      variant="light"
      size={size}
    >
      {t(`status.${status}`, status)}
    </Badge>
  );
};

export default ReturnStatusBadge;
