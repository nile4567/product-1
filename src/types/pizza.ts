export interface PizzaReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  crustScore?: number;
  sauceScore?: number;
  cheeseScore?: number;
}

export interface PizzaShop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  userRatingCount: number;
  priceLevel: number; // 1 to 4
  isOpen: boolean | null;
  openHours?: string[];
  phoneNumber?: string;
  website?: string;
  photoUrl?: string;
  pizzaStyles: string[];
  specialtyPie?: string;
  woodFired?: boolean;
  deliveryAvailable?: boolean;
  takeoutAvailable?: boolean;
  distanceMeters?: number;
  durationSeconds?: number;
  walkDurationSeconds?: number;
  userReviews: PizzaReview[];
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  speed?: number | null;
  heading?: number | null;
  timestamp: number;
  label?: string;
}

export type SortOption =
  | 'weighted_rating'
  | 'highest_rating'
  | 'closest_distance'
  | 'fastest_route'
  | 'most_reviews';

export interface FilterState {
  searchQuery: string;
  minRating: number;
  maxDistanceMiles: number;
  openOnly: boolean;
  selectedStyle: string | null;
  priceLevel: number | null;
  sortBy: SortOption;
  distanceUnit: 'miles' | 'km';
}
