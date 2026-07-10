import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LocateFixed, Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CATEGORIES } from "@/data/categories";
import type { SearchFilters } from "@/types";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EASE } from "./PageTransition";

interface SearchBarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  geoStatus: "idle" | "locating" | "granted" | "denied";
  onRequestLocation: () => void;
}

/**
 * Smart search: free-text query + slide-down filter panel with craft
 * category, geolocation distance radius, verified-only and sorting.
 */
export function SearchBar({ filters, onChange, geoStatus, onRequestLocation }: SearchBarProps) {
  const { t } = useTranslation();
  const [panelOpen, setPanelOpen] = useState(false);

  const activeFilterCount =
    (filters.category ? 1 : 0) + (filters.maxDistanceKm ? 1 : 0) + (filters.verifiedOnly ? 1 : 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder={t("search.placeholder")}
            className="w-full rounded-2xl border border-border bg-card py-3.5 pe-4 ps-12 font-semibold shadow-card outline-none transition-shadow placeholder:font-normal placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setPanelOpen((o) => !o)}
          className={cn(
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-card transition-colors",
            panelOpen || activeFilterCount > 0
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground",
          )}
          aria-label={t("search.filters")}
        >
          {panelOpen ? <X className="h-5 w-5" /> : <SlidersHorizontal className="h-5 w-5" />}
          {!panelOpen && activeFilterCount > 0 && (
            <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-black text-secondary-foreground">
              {activeFilterCount}
            </span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="space-y-5 rounded-2xl border border-border bg-card p-4 shadow-card">
              {/* Category chips */}
              <div>
                <p className="mb-2 text-sm font-bold text-muted-foreground">{t("search.category")}</p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <FilterChip
                    active={filters.category === null}
                    onClick={() => onChange({ ...filters, category: null })}
                  >
                    {t("search.allCategories")}
                  </FilterChip>
                  {CATEGORIES.map((c) => (
                    <FilterChip
                      key={c.id}
                      active={filters.category === c.id}
                      onClick={() => onChange({ ...filters, category: filters.category === c.id ? null : c.id })}
                    >
                      <c.icon className="h-4 w-4" />
                      {t(c.labelKey)}
                    </FilterChip>
                  ))}
                </div>
              </div>

              {/* Distance radius — needs geolocation */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-muted-foreground">{t("search.maxDistance")}</p>
                  <span className="text-sm font-black text-primary">
                    {filters.maxDistanceKm ? `${filters.maxDistanceKm} ${t("common.km")}` : t("search.anyDistance")}
                  </span>
                </div>
                {geoStatus === "granted" ? (
                  <Slider
                    value={[filters.maxDistanceKm ?? 50]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={([v]) => onChange({ ...filters, maxDistanceKm: v >= 50 ? null : v })}
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 rounded-xl font-bold"
                    disabled={geoStatus === "locating"}
                    onClick={onRequestLocation}
                  >
                    <LocateFixed className={cn("h-4 w-4", geoStatus === "locating" && "animate-spin")} />
                    {geoStatus === "denied" ? t("search.locationDenied") : t("search.useMyLocation")}
                  </Button>
                )}
              </div>

              {/* Verified only + sort */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{t("search.verifiedOnly")}</p>
                <Switch
                  checked={filters.verifiedOnly}
                  onCheckedChange={(v) => onChange({ ...filters, verifiedOnly: v })}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-muted-foreground">{t("search.sortBy")}</p>
                <div className="flex gap-2">
                  <FilterChip
                    active={filters.sortBy === "rating"}
                    onClick={() => onChange({ ...filters, sortBy: "rating" })}
                  >
                    {t("search.sortRating")}
                  </FilterChip>
                  <FilterChip
                    active={filters.sortBy === "distance"}
                    onClick={() => {
                      if (geoStatus !== "granted") onRequestLocation();
                      onChange({ ...filters, sortBy: "distance" });
                    }}
                  >
                    {t("search.sortDistance")}
                  </FilterChip>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-card"
          : "bg-muted text-muted-foreground hover:bg-brand-emerald-soft hover:text-primary",
      )}
    >
      {children}
    </motion.button>
  );
}
