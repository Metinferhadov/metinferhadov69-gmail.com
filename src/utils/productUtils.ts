import { Product } from '../types';

/**
 * Deduplicates a list of products ensuring each product appears only once.
 * Removes items that have duplicate IDs or identical unique product data
 * (such as normalized title, category, price, or image).
 */
export const deduplicateProducts = (list: Product[]): Product[] => {
  if (!Array.isArray(list) || list.length === 0) return [];
  const seenIds = new Set<string>();
  const seenSignatures = new Set<string>();
  const uniqueProducts: Product[] = [];

  for (const item of list) {
    if (!item) continue;
    const id = String(item.id || '').trim();
    if (!id) continue;

    // Check 1: Duplicate ID
    if (seenIds.has(id)) {
      continue;
    }

    // Check 2: Duplicate Content / Signature
    const cleanTitle = (item.title || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    const cleanCategory = (item.category || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    const cleanPrice = Number(item.price || 0).toFixed(2);
    const cleanImage = ((item.images && item.images[0]) || (item as any).image || '').trim().toLowerCase();

    // Fingerprints:
    // 1. Exact Title match (if title length >= 3)
    const titleKey = cleanTitle.length >= 3 ? `t:${cleanTitle}` : '';

    // 2. Title + Category + Price match
    const titleCatPriceKey = cleanTitle.length >= 2 ? `tcp:${cleanTitle}___${cleanCategory}___${cleanPrice}` : '';

    // 3. Title + Image match
    const titleImgKey = cleanTitle.length >= 2 && cleanImage ? `ti:${cleanTitle}___${cleanImage}` : '';

    if (titleKey && seenSignatures.has(titleKey)) {
      continue;
    }
    if (titleCatPriceKey && seenSignatures.has(titleCatPriceKey)) {
      continue;
    }
    if (titleImgKey && seenSignatures.has(titleImgKey)) {
      continue;
    }

    // Mark as seen
    seenIds.add(id);
    if (titleKey) seenSignatures.add(titleKey);
    if (titleCatPriceKey) seenSignatures.add(titleCatPriceKey);
    if (titleImgKey) seenSignatures.add(titleImgKey);

    uniqueProducts.push(item);
  }

  return uniqueProducts;
};
