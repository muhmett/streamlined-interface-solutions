import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, ClipboardList, Siren, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageTransition, EASE, staggerContainer, staggerItem } from "@/components/m3allem/PageTransition";
import { BottomNav } from "@/components/m3allem/BottomNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyJobs, fetchMyListing, fetchReviews, fetchUrgentRequests } from "@/lib/api";
import type { Job } from "@/types";
import { cn } from "@/lib/utils";

/* Chart ink. Written as CSS custom properties so both themes follow the
   design tokens without a second palette. Magnitude is one hue, light→dark. */
const RAMP = ["hsl(45 96% 78%)", "hsl(45 96% 66%)", "hsl(45 96% 54%)", "hsl(43 96% 45%)", "hsl(40 96% 36%)"];
const MARK = "hsl(43 96% 47%)";
const GRID = "hsl(var(--border))";
const INK_MUTED = "hsl(var(--muted-foreground))";

/** لوحة القيادة — the artisan's numbers, all derived from real records. */
export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const { data: listing } = useQuery({
    queryKey: ["my-listing", user?.id],
    queryFn: () => fetchMyListing(user!.id),
    enabled: Boolean(user),
  });
  const { data: jobs } = useQuery({
    queryKey: ["jobs", user?.id],
    queryFn: () => fetchMyJobs(user!.id),
    enabled: Boolean(user),
  });
  const { data: reviews } = useQuery({
    queryKey: ["reviews", listing?.id],
    queryFn: () => fetchReviews(listing!.id),
    enabled: Boolean(listing),
  });
  const { data: urgent } = useQuery({ queryKey: ["urgent"], queryFn: fetchUrgentRequests });

  const stats = useMemo(() => {
    const mine = (jobs ?? []).filter((j) => j.artisanId === listing?.id || j.clientId !== user?.id);
    const completed = mine.filter((j) => j.status === "completed");
    const pending = mine.filter((j) => j.status === "requested").length;
    const leads = (urgent ?? []).filter(
      (u) => u.status === "open" && (!listing || u.category === listing.category),
    ).length;
    const rating = listing?.rating ?? 0;
    return { completed: completed.length, pending, leads, rating, jobs: mine };
  }, [jobs, listing, urgent, user]);

  // Completed jobs bucketed into the last 6 months.
  const monthly = useMemo(() => {
    const locale = i18n.language === "ar" ? "ar-MA" : i18n.language === "fr" ? "fr-FR" : "en-GB";
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleDateString(locale, { month: "short" });
      const count = stats.jobs.filter((j: Job) => {
        const ref = j.completedAt ?? j.createdAt;
        const jd = new Date(ref);
        return (
          j.status === "completed" &&
          jd.getFullYear() === d.getFullYear() &&
          jd.getMonth() === d.getMonth()
        );
      }).length;
      return { label, count };
    });
  }, [stats.jobs, i18n.language]);

  // Pipeline: how requests move through the funnel (real statuses).
  const pipeline = useMemo(
    () =>
      (["requested", "accepted", "completed"] as const).map((s) => ({
        label: t(`jobs.status${s[0].toUpperCase()}${s.slice(1)}`).replace(/[⏳🔧✓]/g, "").trim(),
        count: stats.jobs.filter((j: Job) => j.status === s).length,
      })),
    [stats.jobs, t],
  );

  const ratingBreakdown = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => ({
        star,
        label: t("dashboard.stars", { count: star }),
        count: (reviews ?? []).filter((r) => r.rating === star).length,
      })),
    [reviews, t],
  );

  const hasData = stats.jobs.length > 0 || (reviews?.length ?? 0) > 0;

  if (user && role !== "artisan") {
    return (
      <PageTransition className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 pb-28">
        <p className="text-center text-lg font-black">{t("dashboard.noAccess")}</p>
        <Button onClick={() => navigate("/artisan-setup")} className="rounded-xl font-black">
          {t("role.artisan")}
        </Button>
        <BottomNav />
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-dvh bg-background pb-28">
      <header className="bg-hero rounded-b-[2rem] px-5 pb-10 pt-safe">
        <div className="mx-auto max-w-2xl">
          <h1 className="mt-8 text-2xl font-black text-primary-foreground">{t("dashboard.title")}</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">{t("dashboard.subtitle")}</p>
        </div>
      </header>

      <div className="mx-auto -mt-6 max-w-2xl space-y-6 px-5">
        {/* KPI tiles */}
        <motion.div variants={staggerContainer} initial="initial" animate="enter" className="grid grid-cols-2 gap-3">
          <StatTile icon={Briefcase} label={t("dashboard.kpiJobs")} value={stats.completed} accent />
          <StatTile icon={Star} label={t("dashboard.kpiRating")} value={stats.rating} decimals={1} />
          <StatTile icon={ClipboardList} label={t("jobs.statusRequested").replace("⏳", "").trim()} value={stats.pending} />
          <StatTile icon={Siren} label={t("urgent.openFeed")} value={stats.leads} />
        </motion.div>

        {!hasData && (
          <p className="rounded-2xl bg-muted p-5 text-center text-sm font-semibold text-muted-foreground">
            {t("dashboard.empty")}
          </p>
        )}

        {/* Jobs per month — single series, direct labels for contrast relief */}
        <ChartCard title={t("dashboard.jobsChart")} hint={t("dashboard.jobsChartHint")}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly} margin={{ top: 18, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: INK_MUTED, fontSize: 12, fontWeight: 700 }}
              />
              <YAxis hide allowDecimals={false} />
              <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill={MARK} maxBarSize={38}>
                <LabelList
                  dataKey="count"
                  position="top"
                  className="fill-foreground"
                  style={{ fontWeight: 800, fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pipeline — magnitude across stages */}
        <ChartCard title={t("jobs.title")}>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={pipeline} margin={{ top: 12, right: 12, left: 12, bottom: 0 }}>
              <defs>
                <linearGradient id="pipelineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={MARK} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={MARK} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: INK_MUTED, fontSize: 11, fontWeight: 700 }}
              />
              <YAxis hide allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke={MARK}
                strokeWidth={2}
                fill="url(#pipelineFill)"
                dot={{ r: 4, fill: MARK, stroke: "hsl(var(--card))", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Rating breakdown — sequential ramp, one hue light→dark */}
        <ChartCard title={t("dashboard.ratingBreakdown")}>
          <RatingBars rows={ratingBreakdown} />
        </ChartCard>

        <Button
          variant="outline"
          className="h-12 w-full rounded-2xl font-black"
          onClick={() => listing && navigate(`/artisan/${listing.id}`)}
          disabled={!listing}
        >
          {t("dashboard.openProfile")}
        </Button>
      </div>

      <BottomNav />
    </PageTransition>
  );
}

/* ---------------- pieces ---------------- */

/**
 * Rating distribution: one hue, light→dark by star count (magnitude, so a
 * sequential ramp — not categorical). Counts are direct-labelled, which also
 * covers the contrast relief the yellow marks need against a white surface.
 */
function RatingBars({ rows }: { rows: { star: number; label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="space-y-2.5">
      {rows.map((row, i) => (
        <div key={row.star} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-xs font-bold text-muted-foreground">{row.label}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${Math.round((row.count / max) * 100)}%` }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.07 }}
              className="h-full rounded-full"
              style={{ backgroundColor: RAMP[4 - i] }}
            />
          </div>
          <span className="w-6 shrink-0 text-end text-xs font-black tabular-nums">{row.count}</span>
        </div>
      ))}
    </div>
  );
}

function ChartCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: EASE }}
      className="rounded-3xl bg-card p-4 shadow-card ring-1 ring-border/60"
    >
      <h2 className="text-base font-black">{title}</h2>
      {hint && <p className="mb-3 mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className={cn("overflow-x-auto", !hint && "mt-3")}>{children}</div>
    </motion.section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-foreground px-3 py-2 text-background shadow-elevated">
      <p className="text-[11px] font-bold opacity-70">{label}</p>
      <p className="text-lg font-black tabular-nums">{payload[0].value}</p>
    </div>
  );
}

/** KPI tile with a count-up that runs when it scrolls into view. */
function StatTile({
  icon: Icon,
  label,
  value,
  decimals = 0,
  accent = false,
}: {
  icon: typeof Star;
  label: string;
  value: number;
  decimals?: number;
  accent?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 900, 1);
      setShown(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-3xl p-4 shadow-card ring-1 ring-border/60",
        accent ? "bg-gold-gradient text-primary" : "bg-card",
      )}
    >
      <Icon className={cn("h-5 w-5", accent ? "text-primary" : "text-secondary")} />
      <p className="mt-3 text-3xl font-black tabular-nums">{shown.toFixed(decimals)}</p>
      <p className={cn("mt-0.5 text-xs font-bold leading-tight", accent ? "text-primary/70" : "text-muted-foreground")}>
        {label}
      </p>
    </motion.div>
  );
}
