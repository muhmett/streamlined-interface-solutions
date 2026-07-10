import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, Clock, MapPin, Phone, Star, Wrench, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageTransition, EASE, staggerContainer, staggerItem } from "@/components/m3allem/PageTransition";
import { VerifiedBadge } from "@/components/m3allem/VerifiedBadge";
import { StarRating } from "@/components/m3allem/StarRating";
import { ReviewModal } from "@/components/m3allem/ReviewModal";
import { ContactSheet } from "@/components/m3allem/ContactSheet";
import { PortfolioGrid } from "@/components/m3allem/PortfolioGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createJob, fetchArtisan, fetchPortfolio, fetchReviews } from "@/lib/api";
import { categoryById } from "@/data/categories";
import { useAuth } from "@/contexts/AuthContext";
import type { Artisan } from "@/types";

export default function ArtisanProfile() {
  const { id = "" } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  const { data: artisan, isLoading } = useQuery({
    queryKey: ["artisan", id],
    queryFn: () => fetchArtisan(id),
  });
  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReviews(id),
    enabled: Boolean(id),
  });
  const { data: portfolio } = useQuery({
    queryKey: ["portfolio", id],
    queryFn: () => fetchPortfolio(id),
    enabled: Boolean(id),
  });

  if (isLoading || !artisan) {
    return (
      <PageTransition className="min-h-dvh bg-background p-5 pt-16">
        <Skeleton className="mx-auto h-28 w-28 rounded-3xl" />
        <Skeleton className="mx-auto mt-4 h-6 w-40 rounded-lg" />
        <Skeleton className="mt-8 h-32 w-full rounded-2xl" />
      </PageTransition>
    );
  }

  const category = categoryById(artisan.category);
  const CategoryIcon = category.icon;

  const openReview = () => {
    if (!user) {
      toast.info(t("reviews.mustLogin"));
      navigate("/login");
      return;
    }
    setReviewOpen(true);
  };

  return (
    <PageTransition className="min-h-dvh bg-background pb-32">
      {/* Hero */}
      <div className="bg-hero rounded-b-[2.5rem] px-5 pb-16 pt-safe">
        <div className="mx-auto max-w-lg">
          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ArrowRight className="h-4 w-4 ltr:rotate-180" />
            {t("common.back")}
          </button>
        </div>
      </div>

      <div className="mx-auto -mt-14 max-w-lg px-5">
        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="rounded-3xl bg-card p-6 text-center shadow-elevated ring-1 ring-border/60"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-brand-emerald-soft text-primary">
            {artisan.avatarUrl ? (
              <img src={artisan.avatarUrl} alt={artisan.name} className="h-full w-full object-cover" />
            ) : (
              <CategoryIcon className="h-10 w-10" />
            )}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black">{artisan.name}</h1>
          </div>
          <p className="font-bold text-primary">{t(category.labelKey)}</p>
          {artisan.isVerified && <VerifiedBadge className="mt-2" />}
          <p className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {artisan.distanceKm != null
              ? t("common.awayFromYou", { distance: artisan.distanceKm })
              : artisan.city}
          </p>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-border rtl:divide-x-reverse">
            <Stat
              icon={<Star className="h-4 w-4 fill-secondary text-secondary" />}
              value={artisan.rating.toFixed(1)}
              label={t("artisan.reviewCount", { count: artisan.reviewCount })}
            />
            <Stat
              icon={<Briefcase className="h-4 w-4 text-primary" />}
              value={String(artisan.jobsDone)}
              label={t("artisan.jobsDone", { count: artisan.jobsDone })}
            />
            <Stat
              icon={<Clock className="h-4 w-4 text-primary" />}
              value={String(artisan.yearsExperience)}
              label={t("artisan.yearsExp", { count: artisan.yearsExperience })}
            />
          </div>
        </motion.div>

        {/* Bio */}
        {artisan.bio && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
            className="mt-6"
          >
            <h2 className="mb-2 text-lg font-black">{t("artisan.about")}</h2>
            <p className="rounded-2xl bg-card p-4 leading-relaxed text-muted-foreground shadow-card ring-1 ring-border/60">
              {artisan.bio}
            </p>
          </motion.section>
        )}

        {/* Portfolio — الشغل ديالو بحال انسطا */}
        {portfolio && portfolio.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
            className="mt-6"
          >
            <h2 className="mb-3 text-lg font-black">{t("portfolio.gridTitle")}</h2>
            <PortfolioGrid posts={portfolio} />
          </motion.section>
        )}

        {/* Reviews */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black">{t("artisan.reviews")}</h2>
            <button onClick={openReview} className="text-sm font-bold text-primary underline-offset-4 hover:underline">
              {t("reviews.title")} ⭐
            </button>
          </div>

          {!reviews || reviews.length === 0 ? (
            <div className="rounded-2xl bg-muted p-6 text-center text-sm font-semibold text-muted-foreground">
              {t("artisan.noReviews")}
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="initial" animate="enter" className="space-y-3">
              {reviews.map((review) => (
                <motion.article
                  key={review.id}
                  variants={staggerItem}
                  className="rounded-2xl bg-card p-4 shadow-card ring-1 ring-border/60"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold">{review.authorName}</p>
                    <StarRating value={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground/60">
                    {new Date(review.createdAt).toLocaleDateString(i18n.language === "ary" ? "ar-MA" : undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      {/* Sticky contact bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 260, damping: 24 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/90 pb-safe backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-lg gap-3 px-5 py-3">
          <Button
            variant="outline"
            className="h-12 flex-1 gap-2 rounded-2xl font-black"
            onClick={() => setContactOpen(true)}
          >
            <Phone className="h-5 w-5" />
            {t("artisan.call")}
          </Button>
          <Button
            className="h-12 flex-[1.4] gap-2 rounded-2xl bg-gold-gradient font-black text-primary shadow-gold hover:opacity-90"
            onClick={() => {
              if (!user) {
                toast.info(t("jobs.mustLogin"));
                navigate("/login");
                return;
              }
              setRequestOpen(true);
            }}
          >
            <Wrench className="h-5 w-5" />
            {t("jobs.requestService")}
          </Button>
        </div>
      </motion.div>

      <ReviewModal
        artisan={artisan}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onSubmitted={() => queryClient.invalidateQueries({ queryKey: ["reviews", id] })}
      />
      <ContactSheet name={artisan.name} phone={artisan.phone} open={contactOpen} onClose={() => setContactOpen(false)} />
      <RequestJobSheet artisan={artisan} open={requestOpen} onClose={() => setRequestOpen(false)} />
    </PageTransition>
  );
}

/** Bottom-sheet that files a service request → shows up in both histories. */
function RequestJobSheet({ artisan, open, onClose }: { artisan: Artisan; open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { user, displayName } = useAuth();
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await createJob({
        artisan,
        clientId: user.id,
        clientName: displayName ?? t("profile.guest"),
        clientPhone: phone.trim(),
        description: description.trim(),
      });
      toast.success(t("jobs.requestSent"));
      queryClient.invalidateQueries({ queryKey: ["jobs", user.id] });
      setDescription("");
      onClose();
    } catch {
      toast.error(t("common.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-card p-6 pb-safe shadow-elevated"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-black">{t("jobs.requestTitle", { name: artisan.name })}</h2>
              <button onClick={onClose} aria-label={t("common.close")} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-2 mt-5 text-sm font-bold text-muted-foreground">{t("jobs.requestDescLabel")}</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("jobs.requestDescPlaceholder")}
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-background p-3 outline-none focus:ring-2 focus:ring-secondary/60"
            />

            <p className="mb-2 mt-3 text-sm font-bold text-muted-foreground">{t("auth.phoneLabel")}</p>
            <input
              dir="ltr"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
              placeholder="+2126XXXXXXXX"
              className="w-full rounded-2xl border border-border bg-background p-3 font-bold tracking-wider outline-none focus:ring-2 focus:ring-secondary/60"
            />

            <Button
              onClick={send}
              disabled={busy}
              className="mt-5 h-13 w-full rounded-2xl bg-gold-gradient py-4 text-base font-black text-primary shadow-gold hover:opacity-90"
            >
              {busy ? t("common.loading") : t("jobs.sendRequest")}
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-1">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-lg font-black">{value}</span>
      </div>
      <span className="text-center text-[11px] leading-tight text-muted-foreground">{label}</span>
    </div>
  );
}
