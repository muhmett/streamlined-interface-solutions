import { supabase } from "@/lib/supabase";
import { DEMO_ARTISANS, DEMO_REVIEWS } from "@/data/demo-artisans";
import type { Artisan, Review, VerificationStatus } from "@/types";

/**
 * Data-access layer. Every function transparently falls back to the in-memory
 * demo dataset when Supabase isn't configured, so the whole UI stays browsable.
 * Table shapes live in supabase/schema.sql.
 */

// Demo-mode reviews live in module state so newly submitted ones show up.
let demoReviews: Review[] = [...DEMO_REVIEWS];
let demoVerification: VerificationStatus = "none";

const MY_LISTING_KEY = "m3allem.my-listing";

function readLocalListing(): Artisan | null {
  try {
    const raw = localStorage.getItem(MY_LISTING_KEY);
    return raw ? (JSON.parse(raw) as Artisan) : null;
  } catch {
    return null;
  }
}

export async function fetchArtisans(): Promise<Artisan[]> {
  if (!supabase) {
    const mine = readLocalListing();
    return mine ? [mine, ...DEMO_ARTISANS] : DEMO_ARTISANS;
  }
  const { data, error } = await supabase
    .from("artisans")
    .select("*")
    .order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapArtisanRow);
}

export async function fetchArtisan(id: string): Promise<Artisan | null> {
  if (!supabase) {
    const mine = readLocalListing();
    if (mine && mine.id === id) return mine;
    return DEMO_ARTISANS.find((a) => a.id === id) ?? null;
  }
  const { data, error } = await supabase.from("artisans").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapArtisanRow(data) : null;
}

export async function fetchReviews(artisanId: string): Promise<Review[]> {
  if (!supabase) {
    return demoReviews
      .filter((r) => r.artisanId === artisanId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("artisan_id", artisanId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapReviewRow);
}

export async function submitReview(input: {
  artisanId: string;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
}): Promise<void> {
  if (!supabase) {
    demoReviews = [
      {
        id: `demo-${Date.now()}`,
        artisanId: input.artisanId,
        authorId: input.authorId,
        authorName: input.authorName,
        rating: input.rating,
        comment: input.comment,
        createdAt: new Date().toISOString(),
      },
      ...demoReviews,
    ];
    return;
  }
  const { error } = await supabase.from("reviews").insert({
    artisan_id: input.artisanId,
    author_id: input.authorId,
    author_name: input.authorName,
    rating: input.rating,
    comment: input.comment,
  });
  if (error) throw error;
}

export async function fetchVerificationStatus(userId: string): Promise<VerificationStatus> {
  if (!supabase) return demoVerification;
  const { data, error } = await supabase
    .from("verification_requests")
    .select("status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data?.status as VerificationStatus) ?? "none";
}

export async function submitVerification(userId: string, front: File, back: File): Promise<void> {
  if (!supabase) {
    await new Promise((r) => setTimeout(r, 1000));
    demoVerification = "pending";
    return;
  }
  const upload = async (file: File, side: string) => {
    const path = `${userId}/${side}-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase!.storage.from("id-documents").upload(path, file);
    if (error) throw error;
    return path;
  };
  const [frontPath, backPath] = await Promise.all([upload(front, "front"), upload(back, "back")]);
  const { error } = await supabase.from("verification_requests").insert({
    user_id: userId,
    id_front_path: frontPath,
    id_back_path: backPath,
    status: "pending",
  });
  if (error) throw error;
}

/* ---------- the artisan's own listing (فين كيعمر حسابو) ---------- */

export interface MyListingInput {
  name: string;
  category: Artisan["category"];
  city: string;
  phone: string;
  bio: string;
  yearsExperience: number;
  lat: number | null;
  lng: number | null;
}

/** The listing owned by the signed-in user, or null if not created yet. */
export async function fetchMyListing(userId: string): Promise<Artisan | null> {
  if (!supabase) return readLocalListing();
  const { data, error } = await supabase
    .from("artisans")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapArtisanRow(data) : null;
}

/** Create or update the signed-in artisan's public listing. */
export async function saveMyListing(userId: string, input: MyListingInput): Promise<void> {
  if (!supabase) {
    const existing = readLocalListing();
    const listing: Artisan = {
      id: existing?.id ?? `my-${userId}`,
      name: input.name,
      category: input.category,
      city: input.city,
      avatarUrl: existing?.avatarUrl ?? null,
      bio: input.bio,
      phone: input.phone,
      isVerified: existing?.isVerified ?? false,
      rating: existing?.rating ?? 0,
      reviewCount: existing?.reviewCount ?? 0,
      jobsDone: existing?.jobsDone ?? 0,
      yearsExperience: input.yearsExperience,
      lat: input.lat ?? existing?.lat ?? 0,
      lng: input.lng ?? existing?.lng ?? 0,
    };
    localStorage.setItem(MY_LISTING_KEY, JSON.stringify(listing));
    return;
  }
  const row = {
    user_id: userId,
    name: input.name,
    category: input.category,
    city: input.city,
    phone: input.phone,
    bio: input.bio,
    years_experience: input.yearsExperience,
    ...(input.lat != null && input.lng != null ? { lat: input.lat, lng: input.lng } : {}),
  };
  const { data: existing, error: selErr } = await supabase
    .from("artisans")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (selErr) throw selErr;
  const { error } = existing
    ? await supabase.from("artisans").update(row).eq("id", existing.id)
    : await supabase.from("artisans").insert(row);
  if (error) throw error;
}

/* ---------- row mappers (snake_case DB → camelCase app) ---------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArtisanRow(row: any): Artisan {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    city: row.city,
    avatarUrl: row.avatar_url,
    bio: row.bio ?? "",
    phone: row.phone ?? "",
    isVerified: row.is_verified ?? false,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    jobsDone: row.jobs_done ?? 0,
    yearsExperience: row.years_experience ?? 0,
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapReviewRow(row: any): Review {
  return {
    id: row.id,
    artisanId: row.artisan_id,
    authorId: row.author_id,
    authorName: row.author_name,
    rating: row.rating,
    comment: row.comment ?? "",
    createdAt: row.created_at,
  };
}
