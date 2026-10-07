/**
 * Computes great-circle distance between two geographic coordinates using Haversine formula
 */
export function computeDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Formats distance in either miles or kilometers
 */
export function formatDistance(
  meters?: number,
  unit: 'miles' | 'km' = 'miles'
): string {
  if (meters === undefined || isNaN(meters)) return '—';

  if (unit === 'miles') {
    const miles = meters / 1609.344;
    if (miles < 0.1) {
      const feet = Math.round(meters * 3.28084);
      return `${feet} ft`;
    }
    return `${miles.toFixed(1)} mi`;
  } else {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  }
}

/**
 * Estimates travel duration if Routes API is not immediately available
 * Assumes city driving avg 22 mph (9.8 m/s) and walking avg 3.1 mph (1.4 m/s)
 */
export function estimateDuration(
  meters: number,
  mode: 'drive' | 'walk' = 'drive'
): number {
  const speed = mode === 'drive' ? 9.8 : 1.4;
  return Math.round(meters / speed);
}

/**
 * Formats duration in human readable minutes/hours
 */
export function formatDuration(seconds?: number): string {
  if (!seconds || isNaN(seconds)) return '—';
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours} hr ${remainingMins} min` : `${hours} hr`;
}

/**
 * Calculates a Wilson-score-like or weighted score balancing high rating and review volume
 * Score out of 100
 */
export function calculateWeightedScore(rating: number, reviewCount: number): number {
  if (!rating) return 0;
  const countFactor = Math.min(Math.log10(Math.max(reviewCount, 1)) / 3.5, 1);
  const base = (rating / 5) * 80;
  const bonus = countFactor * 20;
  return Math.min(Math.round((base + bonus) * 10) / 10, 100);
}
