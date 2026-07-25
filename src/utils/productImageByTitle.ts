/** Exact product-title → free stock image (Unsplash). */
const PRODUCT_IMAGE_BY_TITLE: Record<string, string> = {
  'Crimson Zari Banarasi Brocade':
    'https://images.unsplash.com/photo-1717835943315-b818e90cb2a1?auto=format&fit=crop&w=800&q=80',
  'Temple Border Kanjivaram':
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'Pearl White Organza Saree':
    'https://images.unsplash.com/photo-1678705730064-a7ecbab4b3fb?auto=format&fit=crop&w=800&q=80',
  'Handloom Chanderi Floral':
    'https://images.unsplash.com/photo-1717585679395-bbe39b5fb6bc?auto=format&fit=crop&w=800&q=80',
  'Emerald Linen Festive Saree':
    'https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?auto=format&fit=crop&w=800&q=80',
  'Russian Katan Silk Saree':
    'https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=800&q=80',
};

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

export function getProductImageByTitle(title: string): string | undefined {
  const exact = PRODUCT_IMAGE_BY_TITLE[title.trim()];
  if (exact) return exact;
  const key = Object.keys(PRODUCT_IMAGE_BY_TITLE).find(
    (k) => k.toLowerCase() === title.trim().toLowerCase()
  );
  return key ? PRODUCT_IMAGE_BY_TITLE[key] : undefined;
}

export function resolveProductImages(title: string, existing?: string[]): string[] {
  if (existing && existing.length > 0) return existing;
  const matched = getProductImageByTitle(title);
  return [matched || DEFAULT_PRODUCT_IMAGE];
}
