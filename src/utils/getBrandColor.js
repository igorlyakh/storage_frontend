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

const colorCache = new Map();
let nextColorIndex = 0;

const getBrandColor = name => {
  if (!name) return 'gray';

  if (colorCache.has(name)) {
    return colorCache.get(name);
  }

  const color = MANTINE_COLORS[nextColorIndex % MANTINE_COLORS.length];

  colorCache.set(name, color);
  nextColorIndex++;

  return color;
};

export default getBrandColor;
