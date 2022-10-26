const COLORS = [
  '#00FFFF', '#7FFFD4', '#FF7F50', '#6495ED',
  '#DC143C', '#00BFFF', '#1E90FF', '#DAA520',
  '#808080', '#CD5C5C', '#F08080', '#90EE90',
  '#20B2AA', '#87CEFA', '#7B68EE', '#C71585',
  '#6B8E23',
];

const random = (items: any[]) => items[Math.random() * items.length | 0];

export const randomColor = () => random(COLORS);