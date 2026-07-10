import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Camera, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageTransition, EASE } from "@/components/m3allem/PageTransition";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { fetchVerificationStatus, submitVerification } from "@/lib/api";
import { cn } from "@/lib/utils";

/** ID-document upload flow that earns artisans the "Verified" badge. */
export default function Verification() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: status = "none" } = useQuery({
    queryKey: ["verification", user?.id],
    queryFn: () => fetchVerificationStatus(user!.id),
    enabled: Boolean(user),
  });

  const handleSubmit = async () => {
    if (!user || !front || !back) return;
    setSubmitting(true);
    try {
      await submitVerification(user.id, front, back);
      toast.success(t("verification.submitted"));
      queryClient.invalidateQueries({ queryKey: ["verification", user.id] });
    } catch {
      toast.error(t("common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition className="min-h-dvh bg-background pb-10">
      <header className="bg-hero rounded-b-[2.5rem] px-5 pb-10 pt-safe">
        <div className="mx-auto max-w-lg">
          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary-foreground/80"
          >
            <ArrowRight className="h-4 w-4 ltr:rotate-180" />
            {t("common.back")}
          </button>
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-gradient text-primary shadow-gold"
          >
            <ShieldCheck className="h-8 w-8" />
          </motion.div>
          <h1 className="mt-4 text-center text-2xl font-black text-primary-foreground">
            {t("verification.title")}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-primary-foreground/75">
            {t("verification.subtitle")}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-5 pt-6">
        <AnimatePresence mode="wait">
          {status === "pending" ? (
            <StatusCard key="pending" emoji="⏳" text={t("verification.pending")} tone="gold" />
          ) : status === "approved" ? (
            <StatusCard key="approved" emoji="🎉" text={t("verification.approved")} tone="emerald" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="space-y-4"
            >
              {status === "rejected" && (
                <div className="rounded-2xl bg-destructive/10 p-4 text-center text-sm font-bold text-destructive">
                  {t("verification.rejected")}
                </div>
              )}

              <UploadSlot label={t("verification.uploadFront")} file={front} onFile={setFront} />
              <UploadSlot label={t("verification.uploadBack")} file={back} onFile={setBack} />

              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                {t("verification.privacyNote")}
              </p>

              <Button
                disabled={!front || !back || submitting}
                onClick={handleSubmit}
                className="h-14 w-full rounded-2xl text-base font-black"
              >
                {submitting ? t("common.loading") : t("verification.submit")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

function UploadSlot({
  label,
  file,
  onFile,
}: {
  label: string;
  file: File | null;
  onFile: (f: File) => void;
}) {
  const { t } = useTranslation();
  return (
    <motion.label
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed p-5 transition-colors",
        file ? "border-primary bg-brand-emerald-soft" : "border-border bg-card hover:border-primary/50",
      )}
    >
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          file ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {file ? <CheckCircle2 className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-extrabold">{label}</span>
        <span className="block truncate text-sm text-muted-foreground">
          {file ? file.name : t("verification.chooseFile")}
        </span>
      </span>
    </motion.label>
  );
}

function StatusCard({ emoji, text, tone }: { emoji: string; text: string; tone: "gold" | "emerald" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "rounded-3xl p-8 text-center shadow-card",
        tone === "gold" ? "bg-brand-gold-soft" : "bg-brand-emerald-soft",
      )}
    >
      <motion.p
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.15 }}
        className="text-5xl"
      >
        {emoji}
      </motion.p>
      <p className="mt-4 font-extrabold leading-relaxed">{text}</p>
    </motion.div>
  );
}
