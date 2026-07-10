import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LocateFixed, Maximize2, Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Artisan } from "@/types";
import type { LatLng } from "@/lib/geo";
import { bearingDeg } from "@/lib/geo";
import { categoryById } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { EASE } from "./PageTransition";
import { cn } from "@/lib/utils";

interface ProximityMapProps {
  artisans: Artisan[];
  userPos: LatLng | null;
  geoStatus: "idle" | "locating" | "granted" | "denied";
  onRequestLocation: () => void;
}

/**
 * Radar-style proximity map: the client sits at the center and artisans are
 * plotted by true bearing and distance (log scale so near and far both read).
 * Fully self-contained SVG — no tile server or API key needed. Tapping a
 * marker opens a mini card; the expand button opens a fullscreen version.
 */
export function ProximityMap({ artisans, userPos, geoStatus, onRequestLocation }: ProximityMapProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Artisan | null>(null);

  // Ask for the geolocation permission before the map can render.
  if (!userPos) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-dashed border-primary/40 bg-brand-emerald-soft/60 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <LocateFixed className={cn("h-5 w-5", geoStatus === "locating" && "animate-spin")} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold">{t("map.needLocation")}</p>
          {geoStatus === "denied" && (
            <p className="mt-0.5 text-xs text-muted-foreground">{t("search.locationDenied")}</p>
          )}
        </div>
        <Button size="sm" className="rounded-xl font-black" disabled={geoStatus === "locating"} onClick={onRequestLocation}>
          {t("map.enable")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-hero shadow-card ring-1 ring-border/60">
        <RadarSvg
          artisans={artisans}
          userPos={userPos}
          selectedId={selected?.id ?? null}
          onSelect={(a) => setSelected((cur) => (cur?.id === a.id ? null : a))}
          className="h-52 w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="rounded-full bg-foreground/25 px-3 py-1 text-xs font-bold text-primary-foreground backdrop-blur-sm">
            {t("map.subtitle")}
          </span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setExpanded(true)}
            aria-label={t("map.expand")}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-xl bg-card text-primary shadow-card"
          >
            <Maximize2 className="h-4 w-4" />
          </motion.button>
        </div>
        <SelectedCard artisan={selected} compact />
      </div>

      {/* Fullscreen map */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="bg-hero fixed inset-0 z-50 flex flex-col pt-safe"
          >
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-black text-primary-foreground">{t("map.title")}</h2>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setExpanded(false)}
                aria-label={t("common.close")}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
            <RadarSvg
              artisans={artisans}
              userPos={userPos}
              selectedId={selected?.id ?? null}
              onSelect={(a) => setSelected((cur) => (cur?.id === a.id ? null : a))}
              className="min-h-0 w-full flex-1"
              showRingLabels
            />
            <div className="p-4 pb-safe">
              <SelectedCard artisan={selected} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- radar rendering ---------------- */

const R_MAX = 92;

/** Round a ring distance to a friendly value (1, 2, 5, 10, 25, 50, 100…). */
function niceKm(km: number): number {
  const steps = [1, 2, 3, 5, 10, 15, 25, 50, 75, 100, 150, 200, 300, 500];
  return steps.reduce((best, s) => (Math.abs(s - km) < Math.abs(best - km) ? s : best), steps[0]);
}

function RadarSvg({
  artisans,
  userPos,
  selectedId,
  onSelect,
  className,
  showRingLabels = false,
}: {
  artisans: Artisan[];
  userPos: LatLng;
  selectedId: string | null;
  onSelect: (a: Artisan) => void;
  className?: string;
  showRingLabels?: boolean;
}) {
  const { t } = useTranslation();

  const { markers, rings } = useMemo(() => {
    const placeable = artisans.filter((a) => a.lat !== 0 || a.lng !== 0);
    const maxKm = Math.max(5, ...placeable.map((a) => a.distanceKm ?? 0));
    const scale = (km: number) => (Math.log1p(km) / Math.log1p(maxKm)) * R_MAX;
    return {
      markers: placeable.map((a) => {
        const d = a.distanceKm ?? 0;
        const theta = (bearingDeg(userPos, a) * Math.PI) / 180;
        const r = scale(d);
        return { artisan: a, x: r * Math.sin(theta), y: -r * Math.cos(theta) };
      }),
      rings: [0.25, 0.55, 1].map((f) => {
        const km = niceKm(maxKm * f);
        return { r: scale(km), km };
      }),
    };
  }, [artisans, userPos]);

  return (
    <svg viewBox="-110 -110 220 220" className={className} role="img" aria-label={t("map.title")}>
      {/* distance rings */}
      {rings.map((ring) => (
        <g key={ring.r}>
          <circle
            r={ring.r}
            fill="none"
            stroke="hsl(40 40% 97% / 0.22)"
            strokeWidth="0.8"
            strokeDasharray="2.5 3"
          />
          {showRingLabels && (
            <text
              x="2"
              y={-ring.r + 5.5}
              fill="hsl(40 40% 97% / 0.55)"
              fontSize="5.5"
              fontWeight="700"
              direction="rtl"
            >
              {t("map.kmRing", { km: ring.km })}
            </text>
          )}
        </g>
      ))}

      {/* user at the center */}
      <motion.circle
        r="7"
        fill="hsl(43 72% 58% / 0.35)"
        animate={{ r: [7, 13, 7], opacity: [0.6, 0.15, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle r="3.6" fill="hsl(43 72% 58%)" stroke="hsl(40 40% 97%)" strokeWidth="1.2" />
      {showRingLabels && (
        <text y="18" textAnchor="middle" fill="hsl(40 40% 97% / 0.85)" fontSize="6" fontWeight="800">
          {t("map.youAreHere")} 📍
        </text>
      )}

      {/* artisan markers */}
      {markers.map(({ artisan, x, y }, i) => {
        const Icon = categoryById(artisan.category).icon;
        const isSelected = selectedId === artisan.id;
        return (
          <motion.g
            key={artisan.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 * i, type: "spring", stiffness: 300, damping: 18 }}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(artisan)}
          >
            <circle
              cx={x}
              cy={y}
              r={isSelected ? 12 : 9.5}
              fill="hsl(40 33% 97%)"
              stroke={artisan.isVerified ? "hsl(43 72% 55%)" : "hsl(168 30% 55%)"}
              strokeWidth={isSelected ? 2.2 : 1.4}
            />
            <Icon
              x={x - (isSelected ? 6.5 : 5)}
              y={y - (isSelected ? 6.5 : 5)}
              width={isSelected ? 13 : 10}
              height={isSelected ? 13 : 10}
              color="hsl(168 55% 21%)"
              strokeWidth={2.4}
            />
          </motion.g>
        );
      })}
    </svg>
  );
}

/* ---------------- selected artisan mini card ---------------- */

function SelectedCard({ artisan, compact = false }: { artisan: Artisan | null; compact?: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {artisan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={cn(compact && "absolute inset-x-3 bottom-3")}
        >
          <button
            onClick={() => navigate(`/artisan/${artisan.id}`)}
            className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-start shadow-elevated"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black">{artisan.name}</p>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-bold text-primary">{t(categoryById(artisan.category).labelKey)}</span>
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  {artisan.rating.toFixed(1)}
                </span>
                {artisan.distanceKm != null && (
                  <span>{t("common.awayFromYou", { distance: artisan.distanceKm })}</span>
                )}
              </p>
            </div>
            <span className="shrink-0 rounded-xl bg-primary px-3 py-2 text-xs font-black text-primary-foreground">
              {t("map.openProfile")}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
