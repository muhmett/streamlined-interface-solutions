import { supabase } from "@/lib/supabase";
import { DEMO_ARTISANS, DEMO_REVIEWS } from "@/data/demo-artisans";
import type {
  Artisan,
  Job,
  JobStatus,
  PortfolioPost,
  Review,
  UrgentRequest,
  VerificationStatus,
} from "@/types";

/**
 * Data-access layer. Every function transparently falls back to the in-memory
 * demo dataset when Supabase isn't configured, so the whole UI stays browsable.
 * Table shapes live in supabase/schema.sql.
 */

let demoVerification: VerificationStatus = "none";

// Demo-mode reviews are persisted so seeded history and newly submitted
// reviews survive a page reload, same as jobs and portfolio posts.
const REVIEWS_KEY = "m3allem.reviews";
const readDemoReviews = (): Review[] => [...readLocal<Review>(REVIEWS_KEY), ...DEMO_REVIEWS];

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
    return readDemoReviews()
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
    writeLocal(REVIEWS_KEY, [
      {
        id: `demo-${Date.now()}`,
        artisanId: input.artisanId,
        authorId: input.authorId,
        authorName: input.authorName,
        rating: input.rating,
        comment: input.comment,
        createdAt: new Date().toISOString(),
      },
      ...readLocal<Review>(REVIEWS_KEY),
    ]);
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
    if (!existing) seedDemoHistory(listing);
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

/**
 * Demo mode only: give a freshly created listing a little past history so the
 * dashboard has something to plot. Never runs when Supabase is configured —
 * a live account always starts from its own real records.
 */
function seedDemoHistory(listing: Artisan) {
  const SAMPLE = [
    { name: "أمين", rating: 5, comment: "خدمة نقية والله! جا فالوقت وكمل بسرعة.", monthsAgo: 0 },
    { name: "سلمى", rating: 5, comment: "احترافي ونظيف فالخدمة. كنصح بيه.", monthsAgo: 0 },
    { name: "مهدي", rating: 4, comment: "مزيان، غير تعطل شوية على الموعد.", monthsAgo: 1 },
    { name: "خديجة", rating: 5, comment: "صلح ليا مشكل تعبت معاه بزاف. معلّم بصح!", monthsAgo: 1 },
    { name: "ياسين", rating: 4, comment: "الثمن معقول والخدمة مضبوطة.", monthsAgo: 2 },
    { name: "عمر", rating: 5, comment: "شغل ديال الصنعة، الله يعطيه الصحة.", monthsAgo: 3 },
    { name: "نادية", rating: 3, comment: "لاباس، ولكن خاصو يهلا فالتفاصيل كثر.", monthsAgo: 4 },
  ];
  const at = (monthsAgo: number, day: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo, Math.min(day, 28));
    return d.toISOString();
  };

  const jobs = readLocal<Job>(JOBS_KEY);
  const reviews: Review[] = [];
  SAMPLE.forEach((s, i) => {
    const when = at(s.monthsAgo, 5 + i * 3);
    jobs.push({
      id: `seed-job-${i}`,
      artisanId: listing.id,
      artisanUserId: null,
      artisanName: listing.name,
      artisanPhone: listing.phone,
      clientId: `seed-client-${i}`,
      clientName: s.name,
      clientPhone: "",
      description: "",
      status: "completed",
      createdAt: when,
      completedAt: when,
    });
    reviews.push({
      id: `seed-review-${i}`,
      artisanId: listing.id,
      authorId: `seed-client-${i}`,
      authorName: s.name,
      rating: s.rating,
      comment: s.comment,
      createdAt: when,
    });
  });
  // One request still waiting, so the pipeline chart isn't flat.
  jobs.push({
    id: "seed-job-pending",
    artisanId: listing.id,
    artisanUserId: null,
    artisanName: listing.name,
    artisanPhone: listing.phone,
    clientId: "seed-client-pending",
    clientName: "رشيد",
    clientPhone: "+212600000000",
    description: "بغيت نشوف معاك واحد الخدمة نهار السبت.",
    status: "requested",
    createdAt: new Date().toISOString(),
    completedAt: null,
  });
  writeLocal(JOBS_KEY, jobs);

  writeLocal(REVIEWS_KEY, [...reviews, ...readLocal<Review>(REVIEWS_KEY)]);
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const withStats: Artisan = {
    ...listing,
    rating: Math.round(avg * 10) / 10,
    reviewCount: reviews.length,
    jobsDone: SAMPLE.length,
  };
  localStorage.setItem(MY_LISTING_KEY, JSON.stringify(withStats));
}

/* ---------- jobs: the service history (ليسطوريك ديال الخدمات) ---------- */

const JOBS_KEY = "m3allem.jobs";

function readLocal<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [];
  }
}
const writeLocal = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

/** Jobs where the user is the client OR the artisan. */
export async function fetchMyJobs(userId: string): Promise<Job[]> {
  if (!supabase) {
    const myListingId = readLocalListing()?.id;
    return readLocal<Job>(JOBS_KEY)
      .filter((j) => j.clientId === userId || (myListingId && j.artisanId === myListingId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .or(`client_id.eq.${userId},artisan_user_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapJobRow);
}

export async function createJob(input: {
  artisan: Artisan;
  clientId: string;
  clientName: string;
  clientPhone: string;
  description: string;
}): Promise<void> {
  if (!supabase) {
    const jobs = readLocal<Job>(JOBS_KEY);
    jobs.unshift({
      id: `job-${Date.now()}`,
      artisanId: input.artisan.id,
      artisanUserId: null,
      artisanName: input.artisan.name,
      artisanPhone: input.artisan.phone,
      clientId: input.clientId,
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      description: input.description,
      status: "requested",
      createdAt: new Date().toISOString(),
      completedAt: null,
    });
    writeLocal(JOBS_KEY, jobs);
    return;
  }
  const { error } = await supabase.from("jobs").insert({
    artisan_id: input.artisan.id,
    artisan_name: input.artisan.name,
    artisan_phone: input.artisan.phone,
    client_id: input.clientId,
    client_name: input.clientName,
    client_phone: input.clientPhone,
    description: input.description,
    status: "requested",
  });
  if (error) throw error;
}

export async function updateJobStatus(jobId: string, status: JobStatus): Promise<void> {
  const completedAt = status === "completed" ? new Date().toISOString() : null;
  if (!supabase) {
    const jobs = readLocal<Job>(JOBS_KEY).map((j) =>
      j.id === jobId ? { ...j, status, completedAt: completedAt ?? j.completedAt } : j,
    );
    writeLocal(JOBS_KEY, jobs);
    return;
  }
  const { error } = await supabase
    .from("jobs")
    .update({ status, ...(completedAt ? { completed_at: completedAt } : {}) })
    .eq("id", jobId);
  if (error) throw error;
}

/* ---------- urgent requests (المشاكل العاجلة) ---------- */

const URGENT_KEY = "m3allem.urgent";

export async function fetchUrgentRequests(): Promise<UrgentRequest[]> {
  if (!supabase) {
    return readLocal<UrgentRequest>(URGENT_KEY).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const { data, error } = await supabase
    .from("urgent_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []).map(mapUrgentRow);
}

export async function createUrgentRequest(input: {
  clientId: string;
  clientName: string;
  clientPhone: string;
  category: UrgentRequest["category"];
  description: string;
  city: string;
}): Promise<void> {
  if (!supabase) {
    const posts = readLocal<UrgentRequest>(URGENT_KEY);
    posts.unshift({
      id: `urg-${Date.now()}`,
      ...input,
      status: "open",
      createdAt: new Date().toISOString(),
    });
    writeLocal(URGENT_KEY, posts);
    return;
  }
  const { error } = await supabase.from("urgent_requests").insert({
    client_id: input.clientId,
    client_name: input.clientName,
    client_phone: input.clientPhone,
    category: input.category,
    description: input.description,
    city: input.city,
    status: "open",
  });
  if (error) throw error;
}

export async function markUrgentSolved(id: string): Promise<void> {
  if (!supabase) {
    writeLocal(
      URGENT_KEY,
      readLocal<UrgentRequest>(URGENT_KEY).map((u) => (u.id === id ? { ...u, status: "solved" as const } : u)),
    );
    return;
  }
  const { error } = await supabase.from("urgent_requests").update({ status: "solved" }).eq("id", id);
  if (error) throw error;
}

/* ---------- portfolio (بوسطات المعلّم بحال انسطا) ---------- */

const PORTFOLIO_KEY = "m3allem.portfolio";

export async function fetchPortfolio(artisanId: string): Promise<PortfolioPost[]> {
  if (!supabase) {
    return readLocal<PortfolioPost>(PORTFOLIO_KEY)
      .filter((p) => p.artisanId === artisanId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const { data, error } = await supabase
    .from("portfolio_posts")
    .select("*")
    .eq("artisan_id", artisanId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPortfolioRow);
}

export async function addPortfolioPost(artisanId: string, file: File, caption: string): Promise<void> {
  const imageUrl = await compressImage(file);
  if (!supabase) {
    const posts = readLocal<PortfolioPost>(PORTFOLIO_KEY);
    posts.unshift({
      id: `post-${Date.now()}`,
      artisanId,
      imageUrl,
      caption,
      createdAt: new Date().toISOString(),
    });
    writeLocal(PORTFOLIO_KEY, posts);
    return;
  }
  // Upload the compressed image to the public portfolio bucket.
  const blob = await (await fetch(imageUrl)).blob();
  const path = `${artisanId}/${Date.now()}.jpg`;
  const { error: upErr } = await supabase.storage.from("portfolio").upload(path, blob, {
    contentType: "image/jpeg",
  });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from("portfolio").getPublicUrl(path);
  const { error } = await supabase.from("portfolio_posts").insert({
    artisan_id: artisanId,
    image_url: pub.publicUrl,
    caption,
  });
  if (error) throw error;
}

export async function deletePortfolioPost(id: string): Promise<void> {
  if (!supabase) {
    writeLocal(
      PORTFOLIO_KEY,
      readLocal<PortfolioPost>(PORTFOLIO_KEY).filter((p) => p.id !== id),
    );
    return;
  }
  const { error } = await supabase.from("portfolio_posts").delete().eq("id", id);
  if (error) throw error;
}

/** Downscale to ≤720px JPEG data-URL — small enough for demo localStorage. */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 720;
      const ratio = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/* ---------- row mappers (snake_case DB → camelCase app) ---------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapJobRow(row: any): Job {
  return {
    id: row.id,
    artisanId: row.artisan_id,
    artisanUserId: row.artisan_user_id ?? null,
    artisanName: row.artisan_name ?? "",
    artisanPhone: row.artisan_phone ?? "",
    clientId: row.client_id,
    clientName: row.client_name ?? "",
    clientPhone: row.client_phone ?? "",
    description: row.description ?? "",
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUrgentRow(row: any): UrgentRequest {
  return {
    id: row.id,
    clientId: row.client_id,
    clientName: row.client_name ?? "",
    clientPhone: row.client_phone ?? "",
    category: row.category,
    description: row.description ?? "",
    city: row.city ?? "",
    status: row.status,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPortfolioRow(row: any): PortfolioPost {
  return {
    id: row.id,
    artisanId: row.artisan_id,
    imageUrl: row.image_url,
    caption: row.caption ?? "",
    createdAt: row.created_at,
  };
}

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
