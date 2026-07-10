import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LocateFixed, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageTransition, EASE, staggerContainer, staggerItem } from "@/components/m3allem/PageTransition";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/data/categories";
import { useAuth } from "@/contexts/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { fetchMyListing, saveMyListing } from "@/lib/api";
import type { CategoryId } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Where an artisan fills in his public listing (فين كيعمر حسابو) so clients
 * can find him in search and on the map. Also used to edit it later.
 */
export default function ArtisanSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, displayName, setRole } = useAuth();
  const { position, status: geoStatus, locate } = useGeolocation();

  const { data: existing } = useQuery({
    queryKey: ["my-listing", user?.id],
    queryFn: () => fetchMyListing(user!.id),
    enabled: Boolean(user),
  });

  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [years, setYears] = useState(1);
  const [saving, setSaving] = useState(false);

  // Prefill: existing listing wins, else what we know from auth.
  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setCategory(existing.category);
      setCity(existing.city);
      setPhone(existing.phone);
      setBio(existing.bio);
      setYears(existing.yearsExperience || 1);
    } else {
      if (displayName && !name) setName(displayName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing, displayName]);

  const hasLocation = Boolean(position) || Boolean(existing && (existing.lat !== 0 || existing.lng !== 0));

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!name.trim() || !category || !city.trim() || !phone.trim()) {
      toast.error(t("setup.missingFields"));
      return;
    }
    setSaving(true);
    try {
      await saveMyListing(user.id, {
        name: name.trim(),
        category,
        city: city.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        yearsExperience: years,
        lat: position?.lat ?? null,
        lng: position?.lng ?? null,
      });
      setRole("artisan");
      queryClient.invalidateQueries({ queryKey: ["artisans"] });
      queryClient.invalidateQueries({ queryKey: ["my-listing", user.id] });
      toast.success(t("setup.saved"));
      navigate("/home", { replace: true });
    } catch {
      toast.error(t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition className="min-h-dvh bg-background pb-12">
      <header className="bg-hero rounded-b-[2.5rem] px-6 pb-10 pt-safe">
        <div className="mx-auto max-w-md">
          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary-foreground/80"
          >
            <ArrowRight className="h-4 w-4 ltr:rotate-180" />
            {t("common.back")}
          </button>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-6 text-3xl font-black text-primary-foreground"
          >
            {existing ? t("setup.editTitle") : t("setup.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-2 text-sm leading-relaxed text-primary-foreground/75"
          >
            {t("setup.subtitle")}
          </motion.p>
        </div>
      </header>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="enter"
        className="mx-auto max-w-md space-y-6 px-6 pt-6"
      >
        {/* Name */}
        <Field label={t("setup.nameLabel")}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("setup.namePlaceholder")}
            className="w-full rounded-2xl border border-border bg-card p-4 font-bold shadow-card outline-none focus:ring-2 focus:ring-primary/40"
          />
        </Field>

        {/* Craft */}
        <Field label={t("setup.categoryLabel")}>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-2xl border p-3 text-sm font-bold transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-card"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50",
                  )}
                >
                  <c.icon className="h-5 w-5 shrink-0" />
                  {t(c.labelKey)}
                </motion.button>
              );
            })}
          </div>
        </Field>

        {/* City */}
        <Field label={t("setup.cityLabel")}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("setup.cityPlaceholder")}
            className="w-full rounded-2xl border border-border bg-card p-4 font-bold shadow-card outline-none focus:ring-2 focus:ring-primary/40"
          />
        </Field>

        {/* Phone */}
        <Field label={t("setup.phoneLabel")}>
          <div dir="ltr" className="flex items-center overflow-hidden rounded-2xl border border-border bg-card shadow-card focus-within:ring-2 focus-within:ring-primary/40">
            <span className="flex items-center gap-1.5 border-e border-border bg-muted px-3.5 py-4 text-sm font-black text-muted-foreground">
              <Phone className="h-4 w-4" />
            </span>
            <input
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
              placeholder="+2126XXXXXXXX"
              className="w-full bg-transparent px-3 py-4 font-bold tracking-wider outline-none placeholder:text-muted-foreground/40"
            />
          </div>
        </Field>

        {/* Bio */}
        <Field label={t("setup.bioLabel")}>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t("setup.bioPlaceholder")}
            rows={4}
            className="w-full resize-none rounded-2xl border border-border bg-card p-4 shadow-card outline-none focus:ring-2 focus:ring-primary/40"
          />
        </Field>

        {/* Years of experience */}
        <Field label={t("setup.yearsLabel")}>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 shadow-card" dir="ltr">
            <Stepper onClick={() => setYears((y) => Math.max(1, y - 1))} symbol="−" />
            <span className="flex-1 text-center text-2xl font-black text-primary">{years}</span>
            <Stepper onClick={() => setYears((y) => Math.min(50, y + 1))} symbol="+" />
          </div>
        </Field>

        {/* Location */}
        <Field label={t("setup.locationLabel")}>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={locate}
            disabled={geoStatus === "locating"}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border-2 border-dashed p-4 text-start transition-colors",
              hasLocation ? "border-primary bg-brand-emerald-soft" : "border-border bg-card hover:border-primary/50",
            )}
          >
            <LocateFixed
              className={cn(
                "h-6 w-6 shrink-0",
                hasLocation ? "text-primary" : "text-muted-foreground",
                geoStatus === "locating" && "animate-spin",
              )}
            />
            <span className="min-w-0">
              <span className={cn("block text-sm font-extrabold", hasLocation && "text-primary")}>
                {hasLocation ? t("setup.locationSet") : t("search.useMyLocation")}
              </span>
              <span className="block text-xs text-muted-foreground">{t("setup.locationHint")}</span>
            </span>
          </motion.button>
          {geoStatus === "denied" && (
            <p className="mt-2 text-xs font-semibold text-destructive">{t("search.locationDenied")}</p>
          )}
        </Field>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-14 w-full rounded-2xl bg-gold-gradient text-base font-black text-primary shadow-gold hover:opacity-90"
        >
          {saving ? t("common.loading") : t("setup.save")}
        </Button>
      </motion.div>
    </PageTransition>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div variants={staggerItem}>
      <label className="mb-2 block text-sm font-bold text-muted-foreground">{label}</label>
      {children}
    </motion.div>
  );
}

function Stepper({ onClick, symbol }: { onClick: () => void; symbol: string }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-xl font-black text-foreground"
    >
      {symbol}
    </motion.button>
  );
}
