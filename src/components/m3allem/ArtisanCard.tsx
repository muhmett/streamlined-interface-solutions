import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Artisan } from "@/types";
import { categoryById } from "@/data/categories";
import { VerifiedBadge } from "./VerifiedBadge";
import { staggerItem } from "./PageTransition";

export function ArtisanCard({ artisan }: { artisan: Artisan }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const category = categoryById(artisan.category);
  const CategoryIcon = category.icon;

  return (
    <motion.button
      variants={staggerItem}
      whileHover={{ y: -3, boxShadow: "var(--shadow-elevated)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/artisan/${artisan.id}`)}
      className="w-full rounded-2xl bg-card p-4 text-start shadow-card ring-1 ring-border/60"
    >
      <div className="flex items-center gap-4">
        {/* Avatar with category glyph fallback */}
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-brand-emerald-soft text-primary">
            {artisan.avatarUrl ? (
              <img src={artisan.avatarUrl} alt={artisan.name} className="h-full w-full object-cover" />
            ) : (
              <CategoryIcon className="h-7 w-7" />
            )}
          </div>
          {artisan.isVerified && (
            <VerifiedBadge size="sm" className="absolute -bottom-1 -start-1 rounded-full bg-card p-0.5 shadow-card" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-extrabold">{artisan.name}</h3>
          </div>
          <p className="text-sm font-semibold text-primary">{t(category.labelKey)}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <b className="text-foreground">{artisan.rating.toFixed(1)}</b>
              {t("artisan.reviewCount", { count: artisan.reviewCount })}
            </span>
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="h-3.5 w-3.5" />
              {artisan.distanceKm != null
                ? t("common.awayFromYou", { distance: artisan.distanceKm })
                : artisan.city}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
