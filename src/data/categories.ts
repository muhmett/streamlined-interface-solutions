import {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  BrickWall,
  Wind,
  Sparkles,
  Flower2,
  Flame,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/types";

/**
 * Craft categories.
 *
 * `photo` points at the Higgsfield-generated tool render for the craft.
 * Two renders are bundled in /public/tools; the rest stream from the
 * generation CDN. Every consumer falls back to `icon` when a photo fails
 * to load (offline, blocked by CSP, expired CDN link), so the UI never
 * breaks — see <CategoryVisual>.
 */
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_38Z6iQ5SZ4Zbbv4qoOMfcP3gcAd";

export interface Category {
  id: CategoryId;
  /** i18n key under "categories.*" — the label always comes from the locale file. */
  labelKey: string;
  icon: LucideIcon;
  photo: string;
}

export const CATEGORIES: Category[] = [
  { id: "plumbing", labelKey: "categories.plumbing", icon: Wrench, photo: "/tools/plumbing.jpg" },
  { id: "electricity", labelKey: "categories.electricity", icon: Zap, photo: "/tools/electricity.jpg" },
  {
    id: "carpentry",
    labelKey: "categories.carpentry",
    icon: Hammer,
    photo: `${CDN}/hf_20260811_181709_ae95ea91-e70e-4962-9626-61d6c8ac6c44.png`,
  },
  {
    id: "painting",
    labelKey: "categories.painting",
    icon: Paintbrush,
    photo: `${CDN}/hf_20260811_181709_ae56dbd3-fe75-425a-b8b6-02c917d9432e.png`,
  },
  {
    id: "masonry",
    labelKey: "categories.masonry",
    icon: BrickWall,
    photo: `${CDN}/hf_20260811_181709_973b9df6-12d3-4905-8cce-7d0debd5bb6d.png`,
  },
  {
    id: "ac",
    labelKey: "categories.ac",
    icon: Wind,
    photo: `${CDN}/hf_20260811_181709_4d9b6f11-5558-4f8f-84db-4a6a29ffbd43.png`,
  },
  {
    id: "cleaning",
    labelKey: "categories.cleaning",
    icon: Sparkles,
    photo: `${CDN}/hf_20260811_181709_14c7d7a4-ef48-48f7-aeae-3bf4b972a4c1.png`,
  },
  {
    id: "gardening",
    labelKey: "categories.gardening",
    icon: Flower2,
    photo: `${CDN}/hf_20260811_181709_f705448e-cd88-4195-aa45-407f45c1f869.png`,
  },
  {
    id: "welding",
    labelKey: "categories.welding",
    icon: Flame,
    photo: `${CDN}/hf_20260811_181710_e7d1ea29-9abc-41af-8d6f-5e7912be537b.png`,
  },
  {
    id: "locksmith",
    labelKey: "categories.locksmith",
    icon: KeyRound,
    photo: `${CDN}/hf_20260811_181709_29d1cf78-72be-4b94-a32e-10037eb2ab45.png`,
  },
];

/** Cinematic hero renders used by the dashboard and the showcase site. */
export const HERO_IMAGES = {
  garage: `${CDN}/hf_20260811_181709_e5264302-c552-4308-bc79-a46cd04f9c59.png`,
  tools: `${CDN}/hf_20260811_181709_174a246c-17ea-48d0-8dc7-3d5370704783.png`,
};

export const categoryById = (id: CategoryId): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
