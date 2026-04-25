// Список приятных цветов из палитры Mantine
const MANTINE_COLORS = [
  'blue',
  'cyan',
  'grape',
  'indigo',
  'lime',
  'orange',
  'pink',
  'red',
  'teal',
  'violet',
];

const getBrandColor = name => {
  if (!name) return 'gray';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % MANTINE_COLORS.length;
  return MANTINE_COLORS[index];
};

export default getBrandColor;
