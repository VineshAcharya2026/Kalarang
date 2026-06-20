import type { Collection } from '../types';

export type SeedCollection = Omit<Collection, 'id'>;
export type SeedProduct = {
  name: string;
  slug: string;
  collectionSlug: string;
  fabric: string;
  work: string;
  border: string;
  texture: string;
  occasions: string[];
  colors: string[];
  mrp: number;
  salePrice: number;
  images: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  inStock: boolean;
};

export const SEED_COLLECTIONS: SeedCollection[] = [
  {
    name: 'Banarasi Silk',
    slug: 'banarasi-silk',
    coverImage:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    order: 1,
    isActive: true,
    description: 'Heritage Banarasi brocade with rich zari work and timeless motifs.',
  },
  {
    name: 'Kanjivaram Silk',
    slug: 'kanjivaram-silk',
    coverImage:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    order: 2,
    isActive: true,
    description: 'Temple-inspired Kanjivaram weaves with contrast borders and pure silk body.',
  },
  {
    name: 'Organza & Georgette',
    slug: 'organza-georgette',
    coverImage:
      'https://images.unsplash.com/photo-1610030469854-2c069b3f3b90?auto=format&fit=crop&w=600&q=80',
    order: 3,
    isActive: true,
    description: 'Lightweight organza and georgette sarees for graceful drape and occasion wear.',
  },
  {
    name: 'Chanderi Cotton',
    slug: 'chanderi-cotton',
    coverImage:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    order: 4,
    isActive: true,
    description: 'Handloom Chanderi cotton-silk blends with delicate buti and sheer texture.',
  },
  {
    name: 'Designer Party Wear',
    slug: 'designer-party-wear',
    coverImage:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    order: 5,
    isActive: true,
    description: 'Contemporary designer sarees crafted for festive evenings and celebrations.',
  },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: 'Crimson Zari Banarasi Brocade',
    slug: 'crimson-zari-banarasi-brocade',
    collectionSlug: 'banarasi-silk',
    fabric: 'Pure Silk',
    work: 'Zari Jaal Brocade',
    border: 'Broad Brocade Border',
    texture: 'Rich and smooth',
    occasions: ['Wedding', 'Festive'],
    colors: ['Crimson', 'Gold'],
    mrp: 22000,
    salePrice: 18499,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    isFeatured: true,
    isNewArrival: true,
    inStock: true,
  },
  {
    name: 'Temple Border Kanjivaram',
    slug: 'temple-border-kanjivaram',
    collectionSlug: 'kanjivaram-silk',
    fabric: 'Pure Kanjivaram Silk',
    work: 'Temple Motif Weave',
    border: 'Contrast Temple Border',
    texture: 'Structured drape',
    occasions: ['Wedding', 'Temple'],
    colors: ['Maroon', 'Gold'],
    mrp: 28000,
    salePrice: 23999,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    ],
    isFeatured: true,
    isNewArrival: false,
    inStock: true,
  },
  {
    name: 'Pearl White Organza Saree',
    slug: 'pearl-white-organza-saree',
    collectionSlug: 'organza-georgette',
    fabric: 'Organza',
    work: 'Sequin Embellishment',
    border: 'Scalloped Edge',
    texture: 'Sheer and airy',
    occasions: ['Festive', 'Gifting'],
    colors: ['Pearl White', 'Silver'],
    mrp: 14500,
    salePrice: 11999,
    images: [
      'https://images.unsplash.com/photo-1610030469854-2c069b3f3b90?auto=format&fit=crop&w=800&q=80',
    ],
    isFeatured: true,
    isNewArrival: true,
    inStock: true,
  },
  {
    name: 'Handloom Chanderi Floral',
    slug: 'handloom-chanderi-floral',
    collectionSlug: 'chanderi-cotton',
    fabric: 'Chanderi Cotton Silk',
    work: 'Handwoven Buti',
    border: 'Minimal Zari Border',
    texture: 'Light and breathable',
    occasions: ['Office', 'Casual'],
    colors: ['Sage Green', 'Ivory'],
    mrp: 9800,
    salePrice: 8499,
    images: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    ],
    isFeatured: true,
    isNewArrival: false,
    inStock: true,
  },
  {
    name: 'Emerald Linen Festive Saree',
    slug: 'emerald-linen-festive-saree',
    collectionSlug: 'designer-party-wear',
    fabric: 'Linen Blend',
    work: 'Contemporary Zari Lines',
    border: 'Designer Cut Border',
    texture: 'Matte with subtle sheen',
    occasions: ['Festive', 'Party'],
    colors: ['Emerald', 'Gold'],
    mrp: 16500,
    salePrice: 13999,
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    ],
    isFeatured: true,
    isNewArrival: true,
    inStock: true,
  },
];
