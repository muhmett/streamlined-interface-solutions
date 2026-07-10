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

export type JobStatus = "requested" | "accepted" | "completed" | "cancelled";

/** A service engagement between a client and an artisan (ليسطوريك). */
export interface Job {
  id: string;
  artisanId: string;
  artisanUserId: string | null;
  artisanName: string;
  artisanPhone: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  description: string;
  status: JobStatus;
  createdAt: string;
  completedAt: string | null;
}

/** An urgent problem published by a client (مشكل عاجل). */
export interface UrgentRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  category: CategoryId;
  description: string;
  city: string;
  status: "open" | "solved";
  createdAt: string;
}

/** A work photo the artisan posts on his profile (بحال انسطا). */
export interface PortfolioPost {
  id: string;
  artisanId: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  category: CategoryId | null;
  maxDistanceKm: number | null;
  verifiedOnly: boolean;
  sortBy: "distance" | "rating";
}
