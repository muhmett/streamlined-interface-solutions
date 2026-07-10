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

export interface Category {
  id: CategoryId;
  /** i18n key under "categories.*" — the label always comes from the locale file. */
  labelKey: string;
  icon: LucideIcon;
}

export const CATEGORIES: Category[] = [
  { id: "plumbing", labelKey: "categories.plumbing", icon: Wrench },
  { id: "electricity", labelKey: "categories.electricity", icon: Zap },
  { id: "carpentry", labelKey: "categories.carpentry", icon: Hammer },
  { id: "painting", labelKey: "categories.painting", icon: Paintbrush },
  { id: "masonry", labelKey: "categories.masonry", icon: BrickWall },
  { id: "ac", labelKey: "categories.ac", icon: Wind },
  { id: "cleaning", labelKey: "categories.cleaning", icon: Sparkles },
  { id: "gardening", labelKey: "categories.gardening", icon: Flower2 },
  { id: "welding", labelKey: "categories.welding", icon: Flame },
  { id: "locksmith", labelKey: "categories.locksmith", icon: KeyRound },
];

export const categoryById = (id: CategoryId): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
