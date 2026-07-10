# المعلّم — M3allem

A luxury, trust-based **PWA marketplace for Moroccan handymen** (بلومبي، تريسيان، نجار، صباغ…), fully localized in **Moroccan Darija** (Arabic script, RTL).

## ✨ Features

- **Darija-first i18n** — every string lives in [`src/locales/darija.json`](src/locales/darija.json); edit that file to update any text. RTL is applied automatically from the language config in `src/i18n/index.ts`.
- **Supabase Auth** — Google OAuth + Moroccan phone number (+212) with 6-digit OTP verification.
- **Framer Motion everywhere** — blur-fade page transitions, bottom-sheet modals, magic-move tab bar, staggered lists, springy micro-interactions.
- **Verified badge system** — artisans upload CIN (ID) photos to a private storage bucket; approval flips the ✓ badge via a DB trigger.
- **Reviews** — 5-star rating + Darija text reviews, one per client per artisan, with automatic rating aggregation.
- **Smart search** — free text + craft category chips + geolocation distance radius (haversine client-side, `nearby_artisans` RPC server-side) + verified-only filter + sort by distance/rating.
- **Installable PWA** — manifest (RTL, Arabic), offline-cached shell and fonts via `vite-plugin-pwa`.

## 🚀 Getting started

```sh
npm install
npm run dev
```

Without configuration the app runs in **demo mode**: sample artisans/reviews, simulated Google login, and phone OTP that accepts the code `123456` — so you can browse the full experience immediately.

## 🔌 Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor (tables, RLS, triggers, private `id-documents` bucket, nearby-search RPC).
3. **Google OAuth**: Authentication → Providers → Google → add your OAuth client ID/secret, and add your site URL to the redirect allowlist.
4. **Phone OTP**: Authentication → Providers → Phone → enable, and connect an SMS provider (Twilio / Vonage / MessageBird).
5. Copy `.env.example` to `.env` and fill in:

```sh
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 🗂 Structure

```
src/
├── locales/darija.json      # ALL app text — edit Darija here
├── i18n/                    # i18next setup + RTL direction handling
├── contexts/AuthContext.tsx # Google OAuth + phone OTP (+ demo fallback)
├── lib/
│   ├── supabase.ts          # client (demo mode when env vars missing)
│   ├── api.ts               # data layer: artisans, reviews, verification
│   └── geo.ts               # haversine distance
├── components/m3allem/      # SearchBar, ArtisanCard, VerifiedBadge,
│                            # StarRating, ReviewModal, BottomNav, transitions
├── pages/                   # Welcome, Login, Home, ArtisanProfile,
│                            # Profile, Verification
└── data/                    # craft categories + demo dataset
supabase/schema.sql          # full database schema with RLS
```

## 🛠 Stack

React 18 · TypeScript · Vite · Tailwind CSS (shadcn/ui) · Framer Motion · Supabase (Auth / Postgres / Storage) · TanStack Query · i18next · vite-plugin-pwa
