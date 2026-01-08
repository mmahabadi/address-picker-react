/**
 * Generates a cache key from URL and options
 */
export function generateCacheKey(url: string, options?: RequestInit): string {
  if (!options || Object.keys(options).length === 0) {
    return url;
  }

  // Sort keys to ensure consistent cache keys
  const sortedOptions: Record<string, unknown> = {};
  const keys = Object.keys(options).sort();
  keys.forEach((key) => {
    sortedOptions[key] = options[key as keyof RequestInit];
  });

  return `${url}::${JSON.stringify(sortedOptions)}`;
}
