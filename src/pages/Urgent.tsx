import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, PhoneCall, Siren, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageTransition, EASE, staggerContainer, staggerItem } from "@/components/m3allem/PageTransition";
import { BottomNav } from "@/components/m3allem/BottomNav";
import { ContactSheet } from "@/components/m3allem/ContactSheet";
import { Button } from "@/components/ui/button";
import { CATEGORIES, categoryById } from "@/data/categories";
import { useAuth } from "@/contexts/AuthContext";
import { createUrgentRequest, fetchMyListing, fetchUrgentRequests, markUrgentSolved } from "@/lib/api";
import type { CategoryId, UrgentRequest } from "@/types";
import { cn } from "@/lib/utils";

/**
 * 🚨 Urgent board: clients publish an urgent problem; artisans whose craft
 * matches see it here and contact the client directly.
 */
export default function Urgent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, role, displayName } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [contact, setContact] = useState<{ name: string; phone: string } | null>(null);

  const { data: requests } = useQuery({ queryKey: ["urgent"], queryFn: fetchUrgentRequests });
  const { data: myListing } = useQuery({
    queryKey: ["my-listing", user?.id],
    queryFn: () => fetchMyListing(user!.id),
    enabled: Boolean(user) && role === "artisan",
  });

  // Artisans see open problems in their craft; clients see their own posts too.
  const { feed, mine } = useMemo(() => {
    const all = requests ?? [];
    const mine = user ? all.filter((r) => r.clientId === user.id) : [];
    let feed = all.filter((r) => r.status === "open" && r.clientId !== user?.id);
    if (role === "artisan" && myListing) feed = feed.filter((r) => r.category === myListing.category);
    return { feed, mine };
  }, [requests, user, role, myListing]);

  const solve = async (id: string) => {
    try {
      await markUrgentSolved(id);
      queryClient.invalidateQueries({ queryKey: ["urgent"] });
    } catch {
      toast.error(t("common.error"));
    }
  };

  return (
    <PageTransition className="min-h-dvh bg-background pb-28">
      <header className="bg-hero rounded-b-[2rem] px-5 pb-8 pt-safe">
        <div className="mx-auto max-w-lg">
          <h1 className="mt-8 flex items-center gap-2 text-2xl font-black text-primary-foreground">
            <Siren className="h-6 w-6 text-secondary" />
            {t("urgent.title")}
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/70">{t("urgent.subtitle")}</p>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-6 px-5 pt-6">
        {/* Client: publish a problem */}
        {role !== "artisan" && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (!user) {
                toast.info(t("urgent.mustLogin"));
                navigate("/login");
                return;
              }
              setCreateOpen(true);
            }}
            className="w-full rounded-2xl bg-gold-gradient p-5 text-lg font-black text-primary shadow-gold"
          >
            {t("urgent.createButton")}
          </motion.button>
        )}

        {/* My posts (client) */}
        {mine.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-black">{t("urgent.myPosts")}</h2>
            <div className="space-y-3">
              {mine.map((r) => (
                <UrgentCard key={r.id} request={r} own onSolve={() => solve(r.id)} />
              ))}
            </div>
          </section>
        )}

        {/* Open feed */}
        <section>
          <h2 className="mb-3 text-lg font-black">{t("urgent.openFeed")}</h2>
          {feed.length === 0 ? (
            <div className="rounded-3xl bg-muted p-8 text-center">
              <Siren className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 font-black">
                {role === "artisan" ? t("urgent.emptyArtisan") : t("urgent.empty")}
              </p>
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="initial" animate="enter" className="space-y-3">
              {feed.map((r) => (
                <UrgentCard
                  key={r.id}
                  request={r}
                  onContact={() => setContact({ name: r.clientName, phone: r.clientPhone })}
                />
              ))}
            </motion.div>
          )}
        </section>
      </div>

      <CreateUrgentSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onPublished={() => queryClient.invalidateQueries({ queryKey: ["urgent"] })}
        clientName={displayName ?? ""}
        clientId={user?.id ?? ""}
      />
      {contact && <ContactSheet name={contact.name} phone={contact.phone} open onClose={() => setContact(null)} />}
      <BottomNav />
    </PageTransition>
  );
}

/* ---------------- cards ---------------- */

function timeAgo(iso: string, t: (k: string, o?: Record<string, unknown>) => string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 2) return t("urgent.justNow");
  if (mins < 60) return t("urgent.minutesAgo", { count: mins });
  if (mins < 60 * 24) return t("urgent.hoursAgo", { count: Math.floor(mins / 60) });
  return t("urgent.daysAgo", { count: Math.floor(mins / (60 * 24)) });
}

function UrgentCard({
  request,
  own = false,
  onContact,
  onSolve,
}: {
  request: UrgentRequest;
  own?: boolean;
  onContact?: () => void;
  onSolve?: () => void;
}) {
  const { t } = useTranslation();
  const category = categoryById(request.category);
  const open = request.status === "open";

  return (
    <motion.article
      variants={staggerItem}
      className={cn(
        "rounded-2xl bg-card p-4 shadow-card ring-1",
        open ? "ring-secondary/70" : "ring-border/60 opacity-75",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold-soft text-foreground">
          <category.icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-extrabold">{t(category.labelKey)}</p>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-black",
                open ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground",
              )}
            >
              {open ? t("urgent.statusOpen") : t("urgent.statusSolved")}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{request.description}</p>
          <p className="mt-1.5 text-xs text-muted-foreground/60">
            {request.city && `📍 ${request.city} · `}
            {timeAgo(request.createdAt, t)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {!own && open && (
          <Button size="sm" className="rounded-xl font-black" onClick={onContact}>
            <PhoneCall className="h-4 w-4" />
            {t("urgent.contactClient")}
          </Button>
        )}
        {own && open && (
          <Button size="sm" variant="outline" className="rounded-xl font-bold" onClick={onSolve}>
            <CheckCircle2 className="h-4 w-4" />
            {t("urgent.markSolved")}
          </Button>
        )}
      </div>
    </motion.article>
  );
}

/* ---------------- create sheet ---------------- */

function CreateUrgentSheet({
  open,
  onClose,
  onPublished,
  clientId,
  clientName,
}: {
  open: boolean;
  onClose: () => void;
  onPublished: () => void;
  clientId: string;
  clientName: string;
}) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  const publish = async () => {
    if (!category || !description.trim()) {
      toast.error(t("urgent.missing"));
      return;
    }
    setBusy(true);
    try {
      await createUrgentRequest({
        clientId,
        clientName,
        clientPhone: phone.trim(),
        category,
        description: description.trim(),
        city: city.trim(),
      });
      toast.success(t("urgent.published"));
      setCategory(null);
      setDescription("");
      setCity("");
      onPublished();
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
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] max-w-lg overflow-y-auto rounded-t-3xl bg-card p-6 pb-safe shadow-elevated"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-black">🚨 {t("urgent.createTitle")}</h2>
              <button onClick={onClose} aria-label={t("common.close")} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-2 mt-5 text-sm font-bold text-muted-foreground">{t("urgent.categoryLabel")}</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors",
                    category === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  <c.icon className="h-4 w-4" />
                  {t(c.labelKey)}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-4 text-sm font-bold text-muted-foreground">{t("urgent.descLabel")}</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("urgent.descPlaceholder")}
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-background p-3 outline-none focus:ring-2 focus:ring-secondary/60"
            />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="mb-2 text-sm font-bold text-muted-foreground">{t("urgent.cityLabel")}</p>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t("urgent.cityPlaceholder")}
                  className="w-full rounded-2xl border border-border bg-background p-3 font-bold outline-none focus:ring-2 focus:ring-secondary/60"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-muted-foreground">{t("auth.phoneLabel")}</p>
                <input
                  dir="ltr"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
                  placeholder="+2126XXXXXXXX"
                  className="w-full rounded-2xl border border-border bg-background p-3 font-bold tracking-wider outline-none focus:ring-2 focus:ring-secondary/60"
                />
              </div>
            </div>

            <Button
              onClick={publish}
              disabled={busy}
              className="mt-5 h-13 w-full rounded-2xl bg-gold-gradient py-4 text-base font-black text-primary shadow-gold hover:opacity-90"
            >
              {busy ? t("common.loading") : t("urgent.publish")}
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
