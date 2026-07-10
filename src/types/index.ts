export type CategoryId =
  | "plumbing"
  | "electricity"
  | "carpentry"
  | "painting"
  | "masonry"
  | "ac"
  | "cleaning"
  | "gardening"
  | "welding"
  | "locksmith";

export interface Artisan {
  id: string;
  name: string;
  category: CategoryId;
  city: string;
  avatarUrl: string | null;
  bio: string;
  phone: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  jobsDone: number;
  yearsExperience: number;
  lat: number;
  lng: number;
  /** Filled in client-side when the user shares their location (km). */
  distanceKm?: number;
}

export interface Review {
  id: string;
  artisanId: string;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type VerificationStatus = "none" | "pending" | "approved" | "rejected";

export interface SearchFilters {
  query: string;
  category: CategoryId | null;
  maxDistanceKm: number | null;
  verifiedOnly: boolean;
  sortBy: "distance" | "rating";
}
