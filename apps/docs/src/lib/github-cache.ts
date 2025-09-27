interface CacheItem<T> {
  data: T;
  timestamp: number;
}

/**
 * Get cached data from localStorage with TTL check
 */
export function getCachedData<T>(key: string, ttlMs: number): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const item: CacheItem<T> = JSON.parse(cached);

    // Check if cache is expired
    if (Date.now() - item.timestamp > ttlMs) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  } catch {
    // Handle JSON parse errors or other localStorage issues
    return null;
  }
}

/**
 * Set data to localStorage cache with timestamp
 */
export function setCachedData<T>(key: string, data: T): void {
  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch {
    // Handle localStorage quota exceeded or other errors
    // Silently fail - cache is not critical
  }
}

/**
 * Fetch data with localStorage caching
 */
export async function fetchWithCache<T>(
  url: string,
  cacheKey: string,
  ttlMs: number,
): Promise<T> {
  // Try to get cached data first
  const cached = getCachedData<T>(cacheKey, ttlMs);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const data = await response.json();

  // Cache the result
  setCachedData(cacheKey, data);

  return data;
}
