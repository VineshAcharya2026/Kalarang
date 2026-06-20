import { SEED_COLLECTIONS, SEED_PRODUCTS } from '../data/seedCatalog';

export interface SeedCatalogDeps {
  collectionsCount: number;
  productsCount: number;
  addCollection: (data: Omit<import('../types').Collection, 'id'>) => Promise<string | undefined>;
  addProduct: (
    data: Omit<import('../types').Product, 'id' | 'createdAt' | 'isDeleted'>
  ) => Promise<string | undefined>;
}

export interface SeedCatalogResult {
  collectionsAdded: number;
  productsAdded: number;
  skipped: boolean;
}

export async function seedCatalog({
  collectionsCount,
  productsCount,
  addCollection,
  addProduct,
}: SeedCatalogDeps): Promise<SeedCatalogResult> {
  if (collectionsCount > 0 || productsCount > 0) {
    return { collectionsAdded: 0, productsAdded: 0, skipped: true };
  }

  const slugToId = new Map<string, string>();

  for (const collection of SEED_COLLECTIONS) {
    const id = await addCollection(collection);
    if (id) {
      slugToId.set(collection.slug, id);
    }
  }

  let productsAdded = 0;

  for (const product of SEED_PRODUCTS) {
    const collectionId = slugToId.get(product.collectionSlug);
    if (!collectionId) continue;

    const { collectionSlug: _collectionSlug, ...productData } = product;
    await addProduct({ ...productData, collectionId });
    productsAdded += 1;
  }

  return {
    collectionsAdded: slugToId.size,
    productsAdded,
    skipped: false,
  };
}
