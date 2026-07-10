import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { StarRating } from "./StarRating";
import { EASE } from "./PageTransition";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Artisan } from "@/types";

interface ReviewModalProps {
  artisan: Artisan;
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

/** Bottom-sheet review composer: 5-star rating + optional Darija comment. */
export function ReviewModal({ artisan, open, onClose, onSubmitted }: ReviewModalProps) {
  const { t } = useTranslation();
  const { user, displayName } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const starLabels = ["", "star1", "star2", "star3", "star4", "star5"] as const;

  const handleSubmit = async () => {
    if (!user || rating === 0) return;
    setSubmitting(true);
    try {
      await submitReview({
        artisanId: artisan.id,
        authorId: user.id,
        authorName: displayName ?? t("profile.guest"),
        rating,
        comment: comment.trim(),
      });
      toast.success(t("reviews.thanks"));
      setRating(0);
      setComment("");
      onSubmitted();
      onClose();
    } catch {
      toast.error(t("common.error"));
    } finally {
      setSubmitting(false);
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
            <div className="mb-1 flex items-start justify-between">
              <h2 className="text-xl font-black">{t("reviews.title")}</h2>
              <button onClick={onClose} aria-label={t("common.close")} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              {t("reviews.subtitle", { name: artisan.name })}
            </p>

            <div className="mb-2 flex flex-col items-center gap-3">
              <StarRating value={rating} onChange={setRating} size="lg" />
              <AnimatePresence mode="wait">
                {rating > 0 && (
                  <motion.p
                    key={rating}
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-black text-secondary"
                  >
                    {t(`reviews.${starLabels[rating]}`)}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <label className="mb-1 mt-4 block text-sm font-bold text-muted-foreground">
              {t("reviews.commentLabel")}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("reviews.commentPlaceholder")}
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-background p-3 outline-none transition-shadow focus:ring-2 focus:ring-primary/40"
            />

            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
              className="mt-4 h-12 w-full rounded-2xl text-base font-black"
            >
              {submitting ? t("common.loading") : t("reviews.submit")}
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
