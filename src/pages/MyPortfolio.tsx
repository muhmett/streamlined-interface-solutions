import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Camera, ImagePlus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageTransition, EASE, staggerContainer, staggerItem } from "@/components/m3allem/PageTransition";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { addPortfolioPost, deletePortfolioPost, fetchMyListing, fetchPortfolio } from "@/lib/api";
import { cn } from "@/lib/utils";

/** Where the artisan posts photos of his work — بحال انسطا. */
export default function MyPortfolio() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [composerOpen, setComposerOpen] = useState(false);

  const { data: listing } = useQuery({
    queryKey: ["my-listing", user?.id],
    queryFn: () => fetchMyListing(user!.id),
    enabled: Boolean(user),
  });
  const { data: posts } = useQuery({
    queryKey: ["portfolio", listing?.id],
    queryFn: () => fetchPortfolio(listing!.id),
    enabled: Boolean(listing),
  });

  const remove = async (id: string) => {
    try {
      await deletePortfolioPost(id);
      toast.success(t("portfolio.deleted"));
      queryClient.invalidateQueries({ queryKey: ["portfolio", listing?.id] });
    } catch {
      toast.error(t("common.error"));
    }
  };

  return (
    <PageTransition className="min-h-dvh bg-background pb-12">
      <header className="bg-hero rounded-b-[2rem] px-5 pb-8 pt-safe">
        <div className="mx-auto max-w-lg">
          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary-foreground/80"
          >
            <ArrowRight className="h-4 w-4 ltr:rotate-180" />
            {t("common.back")}
          </button>
          <h1 className="mt-4 text-2xl font-black text-primary-foreground">📸 {t("portfolio.title")}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-5 pt-6">
        {!listing ? (
          <div className="rounded-3xl bg-muted p-8 text-center">
            <p className="font-black">{t("portfolio.needListing")}</p>
            <Button onClick={() => navigate("/artisan-setup")} className="mt-4 rounded-xl font-black">
              {t("setup.title")}
            </Button>
          </div>
        ) : (
          <>
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setComposerOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-gradient p-4 font-black text-primary shadow-gold"
            >
              <ImagePlus className="h-5 w-5" />
              {t("portfolio.add")}
            </motion.button>

            {!posts || posts.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-muted p-6 text-center text-sm font-semibold text-muted-foreground">
                {t("portfolio.emptyOwn")}
              </p>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="enter"
                className="mt-6 grid grid-cols-2 gap-3"
              >
                {posts.map((post) => (
                  <motion.figure
                    key={post.id}
                    variants={staggerItem}
                    className="overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-border/60"
                  >
                    <img src={post.imageUrl} alt={post.caption} className="aspect-square w-full object-cover" />
                    <figcaption className="flex items-start justify-between gap-2 p-3">
                      <span className="min-w-0 text-xs font-bold leading-relaxed">{post.caption || "…"}</span>
                      <button
                        onClick={() => remove(post.id)}
                        aria-label={t("portfolio.delete")}
                        className="shrink-0 rounded-lg p-1 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </figcaption>
                  </motion.figure>
                ))}
              </motion.div>
            )}

            <Composer
              open={composerOpen}
              onClose={() => setComposerOpen(false)}
              artisanId={listing.id}
              onPublished={() => queryClient.invalidateQueries({ queryKey: ["portfolio", listing.id] })}
            />
          </>
        )}
      </div>
    </PageTransition>
  );
}

function Composer({
  open,
  onClose,
  artisanId,
  onPublished,
}: {
  open: boolean;
  onClose: () => void;
  artisanId: string;
  onPublished: () => void;
}) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  const pick = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const publish = async () => {
    if (!file) return;
    setBusy(true);
    try {
      await addPortfolioPost(artisanId, file, caption.trim());
      toast.success(t("portfolio.published"));
      setFile(null);
      setPreview(null);
      setCaption("");
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
              <h2 className="text-xl font-black">{t("portfolio.add")}</h2>
              <button onClick={onClose} aria-label={t("common.close")} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <label
              className={cn(
                "mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
                preview ? "border-secondary" : "border-border hover:border-secondary/60",
                preview ? "p-0" : "p-10",
              )}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
              />
              {preview ? (
                <img src={preview} alt="" className="max-h-64 w-full object-cover" />
              ) : (
                <>
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-bold text-muted-foreground">{t("portfolio.choosePhoto")}</span>
                </>
              )}
            </label>
            {preview && (
              <p className="mt-2 text-center text-xs font-bold text-muted-foreground">{t("portfolio.changePhoto")} ← 👆</p>
            )}

            <p className="mb-2 mt-4 text-sm font-bold text-muted-foreground">{t("portfolio.captionLabel")}</p>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={t("portfolio.captionPlaceholder")}
              rows={2}
              className="w-full resize-none rounded-2xl border border-border bg-background p-3 outline-none focus:ring-2 focus:ring-secondary/60"
            />

            <Button
              onClick={publish}
              disabled={!file || busy}
              className="mt-4 h-13 w-full rounded-2xl bg-gold-gradient py-4 text-base font-black text-primary shadow-gold hover:opacity-90"
            >
              {busy ? t("common.loading") : t("portfolio.publish")}
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
