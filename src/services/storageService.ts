import { PizzaShop, PizzaReview, UserLocation } from '../types/pizza';

const STORAGE_KEYS = {
  PIZZA_SHOPS: 'pizzaradar_cached_shops_v1',
  USER_REVIEWS: 'pizzaradar_user_reviews_v1',
  LAST_LOCATION: 'pizzaradar_last_location_v1',
  LAST_CACHE_TIME: 'pizzaradar_last_cache_time_v1',
  PENDING_SYNC_REVIEWS: 'pizzaradar_pending_reviews_v1',
} as const;

export interface CacheMetadata {
  shopCount: number;
  reviewCount: number;
  lastUpdated: number | null;
  hasOfflineData: boolean;
}

/**
 * Safely reads from localStorage with JSON parsing and fallback
 */
function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[PizzaRadar Storage] Error reading key "${key}":`, err);
    return fallback;
  }
}

/**
 * Safely writes to localStorage
 */
function writeStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[PizzaRadar Storage] Error writing key "${key}":`, err);
  }
}

/**
 * Loads cached pizza shops, merging any locally stored user reviews
 */
export function loadCachedShops(fallbackShops: PizzaShop[]): {
  shops: PizzaShop[];
  lastCachedAt: number | null;
  fromCache: boolean;
} {
  const cached = readStorage<PizzaShop[] | null>(STORAGE_KEYS.PIZZA_SHOPS, null);
  const customReviewsMap = readStorage<Record<string, PizzaReview[]>>(
    STORAGE_KEYS.USER_REVIEWS,
    {}
  );
  const lastTime = readStorage<number | null>(STORAGE_KEYS.LAST_CACHE_TIME, null);

  const baseShops = cached && cached.length > 0 ? cached : fallbackShops;

  // Merge any locally saved reviews for every shop
  const enrichedShops = baseShops.map((shop) => {
    const localReviews = customReviewsMap[shop.id] || [];
    if (localReviews.length === 0) return shop;

    // Filter out duplicates by review id
    const existingIds = new Set(shop.userReviews.map((r) => r.id));
    const uniqueLocal = localReviews.filter((r) => !existingIds.has(r.id));
    const combinedReviews = [...uniqueLocal, ...shop.userReviews];

    // Recalculate rating with user reviews
    const totalReviewCount = Math.max(shop.userRatingCount, combinedReviews.length);

    return {
      ...shop,
      userReviews: combinedReviews,
      userRatingCount: totalReviewCount,
    };
  });

  return {
    shops: enrichedShops,
    lastCachedAt: lastTime,
    fromCache: Boolean(cached && cached.length > 0),
  };
}

/**
 * Persists the current list of pizza shops into localStorage
 */
export function persistShops(shops: PizzaShop[]): void {
  if (!shops || shops.length === 0) return;
  writeStorage(STORAGE_KEYS.PIZZA_SHOPS, shops);
  writeStorage(STORAGE_KEYS.LAST_CACHE_TIME, Date.now());
}

/**
 * Persists a new or updated review for a shop
 */
export function saveReviewForShop(
  shopId: string,
  review: PizzaReview,
  isOffline: boolean = false
): void {
  const reviewsMap = readStorage<Record<string, PizzaReview[]>>(
    STORAGE_KEYS.USER_REVIEWS,
    {}
  );

  const existing = reviewsMap[shopId] || [];
  // Prepend new review
  reviewsMap[shopId] = [review, ...existing.filter((r) => r.id !== review.id)];
  writeStorage(STORAGE_KEYS.USER_REVIEWS, reviewsMap);

  if (isOffline) {
    const pending = readStorage<Array<{ shopId: string; review: PizzaReview }>>(
      STORAGE_KEYS.PENDING_SYNC_REVIEWS,
      []
    );
    pending.push({ shopId, review });
    writeStorage(STORAGE_KEYS.PENDING_SYNC_REVIEWS, pending);
  }
}

/**
 * Retrieves cached user location
 */
export function loadCachedLocation(): UserLocation | null {
  return readStorage<UserLocation | null>(STORAGE_KEYS.LAST_LOCATION, null);
}

/**
 * Persists user location to cache
 */
export function persistLocation(loc: UserLocation): void {
  if (!loc || !loc.lat || !loc.lng) return;
  writeStorage(STORAGE_KEYS.LAST_LOCATION, loc);
}

/**
 * Returns cache statistics and health
 */
export function getCacheStats(): CacheMetadata {
  const shops = readStorage<PizzaShop[]>(STORAGE_KEYS.PIZZA_SHOPS, []);
  const reviewsMap = readStorage<Record<string, PizzaReview[]>>(
    STORAGE_KEYS.USER_REVIEWS,
    {}
  );
  const lastTime = readStorage<number | null>(STORAGE_KEYS.LAST_CACHE_TIME, null);

  let totalLocalReviews = 0;
  for (const shopId in reviewsMap) {
    totalLocalReviews += reviewsMap[shopId].length;
  }

  return {
    shopCount: shops.length,
    reviewCount: totalLocalReviews,
    lastUpdated: lastTime,
    hasOfflineData: shops.length > 0 || totalLocalReviews > 0,
  };
}

/**
 * Clears the offline cache if user requests a full reset
 */
export function clearAllCache(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PIZZA_SHOPS);
    localStorage.removeItem(STORAGE_KEYS.USER_REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.LAST_CACHE_TIME);
    localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC_REVIEWS);
  } catch (err) {
    console.warn('[PizzaRadar Storage] Error clearing cache:', err);
  }
}
