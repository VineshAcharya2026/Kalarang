export interface ColorFamily {
  name: string;
  swatch: string;
  shades: string[];
}

export const COLOR_FAMILIES: ColorFamily[] = [
  {
    name: 'Red',
    swatch: '#7A1C2E',
    shades: ['Crimson', 'Maroon', 'Rose'],
  },
  {
    name: 'Gold',
    swatch: '#B8860B',
    shades: ['Gold', 'Mustard'],
  },
  {
    name: 'Green',
    swatch: '#2D6A4F',
    shades: ['Emerald', 'Sage Green'],
  },
  {
    name: 'Blue',
    swatch: '#1B3A5C',
    shades: ['Navy', 'Teal'],
  },
  {
    name: 'Neutrals',
    swatch: '#F5F0E8',
    shades: ['Pearl White', 'Ivory', 'Cream'],
  },
  {
    name: 'Purple',
    swatch: '#5B2C6F',
    shades: ['Violet', 'Plum'],
  },
];
