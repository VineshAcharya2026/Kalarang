import { SEED_COLLECTIONS, SEED_PRODUCTS } from '../data/seedCatalog';
import type { Collection, Product } from '../types';

export interface SeedCatalogDeps {
  collections: Collection[];
  products: Product[];
  addCollection: (data: Omit<Collection, 'id'>) => Promise<string | undefined>;
  addProduct: (
    data: Omit<Product, 'id' | 'createdAt' | 'isDeleted'>
  ) => Promise<string | undefined>;
}

export interface SeedCatalogResult {
  collectionsAdded: number;
  productsAdded: number;
  skipped: boolean;
}

export async function seedCatalog({
  collections,
  products,
  addCollection,
  addProduct,
}: SeedCatalogDeps): Promise<SeedCatalogResult> {
  const slugToId = new Map(collections.map((c) => [c.slug, c.id]));
  let collectionsAdded = 0;

  for (const collection of SEED_COLLECTIONS) {
    if (slugToId.has(collection.slug)) continue;
    const id = await addCollection(collection);
    if (id) {
      slugToId.set(collection.slug, id);
      collectionsAdded += 1;
    }
  }

  const existingSlugs = new Set(products.filter((p) => !p.isDeleted).map((p) => p.slug));
  let productsAdded = 0;

  for (const product of SEED_PRODUCTS) {
    if (existingSlugs.has(product.slug)) continue;

    const collectionId = slugToId.get(product.collectionSlug);
    if (!collectionId) continue;

    const { collectionSlug: _collectionSlug, ...productData } = product;
    await addProduct({ ...productData, collectionId });
    productsAdded += 1;
  }

  return {
    collectionsAdded,
    productsAdded,
    skipped: collectionsAdded === 0 && productsAdded === 0,
  };
}

export const SAMPLE_PRODUCT_COUNT = SEED_PRODUCTS.length;
