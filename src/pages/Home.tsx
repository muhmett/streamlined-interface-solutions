import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { PageTransition, staggerContainer, staggerItem } from "@/components/m3allem/PageTransition";
import { SearchBar } from "@/components/m3allem/SearchBar";
import { ArtisanCard } from "@/components/m3allem/ArtisanCard";
import { BottomNav } from "@/components/m3allem/BottomNav";
import { CATEGORIES } from "@/data/categories";
import { fetchArtisans } from "@/lib/api";
import { useGeolocation } from "@/hooks/useGeolocation";
import { distanceKm } from "@/lib/geo";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import type { SearchFilters } from "@/types";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  category: null,
  maxDistanceKm: null,
  verifiedOnly: false,
  sortBy: "rating",
};

export default function Home() {
  const { t } = useTranslation();
  const { displayName } = useAuth();
  const { position, status: geoStatus, locate } = useGeolocation();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  const { data: artisans, isLoading } = useQuery({
    queryKey: ["artisans"],
    queryFn: fetchArtisans,
  });

  // Once we have a position, default to distance sorting.
  useEffect(() => {
    if (position) setFilters((f) => ({ ...f, sortBy: "distance" }));
  }, [position]);

  const results = useMemo(() => {
    if (!artisans) return [];
    let list = artisans.map((a) =>
      position ? { ...a, distanceKm: distanceKm(position, a) } : a,
    );

    const q = filters.query.trim();
    if (q) {
      list = list.filter(
        (a) =>
          a.name.includes(q) ||
          a.city.includes(q) ||
          a.bio.includes(q) ||
          t(`categories.${a.category}`).includes(q),
      );
    }
    if (filters.category) list = list.filter((a) => a.category === filters.category);
    if (filters.verifiedOnly) list = list.filter((a) => a.isVerified);
    if (filters.maxDistanceKm && position) {
      list = list.filter((a) => (a.distanceKm ?? Infinity) <= filters.maxDistanceKm!);
    }

    return list.sort((a, b) =>
      filters.sortBy === "distance" && position
        ? (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
        : b.rating - a.rating,
    );
  }, [artisans, filters, position, t]);

  return (
    <PageTransition className="min-h-dvh bg-background pb-28">
      {/* Header */}
      <header className="bg-hero rounded-b-[2rem] px-5 pb-6 pt-safe">
        <div className="mx-auto max-w-lg">
          <p className="mt-6 text-sm font-semibold text-primary-foreground/70">
            {displayName ? t("home.greeting", { name: displayName }) : t("home.greetingGuest")}
          </p>
          <h1 className="mt-1 text-2xl font-black text-primary-foreground">{t("home.whatDoYouNeed")}</h1>
          <div className="mt-5">
            <SearchBar filters={filters} onChange={setFilters} geoStatus={geoStatus} onRequestLocation={locate} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-5">
        {/* Category rail */}
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-black">{t("home.categories")}</h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="enter"
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          >
            {CATEGORIES.map((c) => {
              const active = filters.category === c.id;
              return (
                <motion.button
                  key={c.id}
                  variants={staggerItem}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFilters((f) => ({ ...f, category: active ? null : c.id }))}
                  className="flex shrink-0 flex-col items-center gap-2"
                >
                  <span
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-2xl shadow-card transition-colors",
                      active
                        ? "bg-primary text-primary-foreground ring-2 ring-secondary"
                        : "bg-card text-primary ring-1 ring-border/60",
                    )}
                  >
                    <c.icon className="h-7 w-7" />
                  </span>
                  <span className={cn("text-xs font-bold", active ? "text-primary" : "text-muted-foreground")}>
                    {t(c.labelKey)}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </section>

        {/* Results */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black">
              {position ? t("home.nearYou") : t("home.topRated")}
            </h2>
            {geoStatus !== "granted" && (
              <button onClick={locate} className="text-xs font-bold text-primary underline-offset-4 hover:underline">
                {t("search.useMyLocation")} 📍
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-muted p-8 text-center"
            >
              <p className="text-lg font-black">{t("home.noResults")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("home.tryDifferent")}</p>
            </motion.div>
          ) : (
            <motion.div variants={staggerContainer} initial="initial" animate="enter" className="space-y-3">
              {results.map((a) => (
                <ArtisanCard key={a.id} artisan={a} />
              ))}
            </motion.div>
          )}
        </section>
      </div>

      <BottomNav />
    </PageTransition>
  );
}
