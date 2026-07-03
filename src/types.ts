// KALARANG - Shared Type Definitions

export interface Product {
  id: string;
  name: string;
  slug: string;
  collectionId: string;
  fabric: string;
  work: string;
  border: string;
  texture: string;
  occasions: string[];
  colors: string[];
  mrp: number;
  salePrice: number;
  images: string[];
  details?: string;
  videoUrl?: string;
  allowAddToCart?: boolean;
  isFeatured: boolean;    // maps to core isFeatured
  isNewArrival: boolean;  // maps to core isNewArrival
  inStock: boolean;
  isDeleted: boolean;
  createdAt: any;         // Firestore Timestamp or Date
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  coverImage: string;
  order: number;
  isActive: boolean;
  description?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  color: string;
  image: string;
  qty: number;
  price: number;
}

export interface Order {
  id?: string;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  discountPercent?: number;
  shippingCharges: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: any;         // Firestore Timestamp
}

export interface Banner {
  id: string;
  imageUrl: string;
  headline: string;
  subtext: string;
  ctaLabel: string;
  ctaLink: string;
  isActive: boolean;
}

export interface HeroVideo {
  id: string;
  videoUrl: string;
  title: string;
  subtitle?: string;
  isActive: boolean;
  createdAt: any;
}

export interface Settings {
  storeName: string;
  whatsappNumber: string;
  announcementBar: {
    enabled: boolean;
    text: string;
  };
  freeShippingThreshold: number;
  firstOrderDiscount?: {
    enabled: boolean;
    percent: number;
  };
}
