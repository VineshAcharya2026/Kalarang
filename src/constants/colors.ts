export interface ColorFamily {
  name: string;
  swatch: string;
  shades: string[];
}

/** Main shop-by-colour families used on the homepage and for product colour tags. */
export const COLOR_FAMILIES: ColorFamily[] = [
  {
    name: 'Red',
    swatch: '#B91C1C',
    shades: ['Red', 'Crimson', 'Maroon'],
  },
  {
    name: 'Blue',
    swatch: '#1B3A5C',
    shades: ['Blue', 'Navy', 'Teal'],
  },
  {
    name: 'Green',
    swatch: '#2D6A4F',
    shades: ['Green', 'Emerald', 'Sage Green'],
  },
  {
    name: 'Yellow',
    swatch: '#D4A017',
    shades: ['Yellow', 'Gold', 'Mustard'],
  },
  {
    name: 'White',
    swatch: '#F5F0E8',
    shades: ['White', 'Pearl White', 'Ivory'],
  },
  {
    name: 'Black',
    swatch: '#1C1008',
    shades: ['Black', 'Charcoal'],
  },
  {
    name: 'Orange',
    swatch: '#C45C26',
    shades: ['Orange', 'Rust', 'Coral'],
  },
];

export const MAIN_COLORS = COLOR_FAMILIES.map((family) => family.name);
