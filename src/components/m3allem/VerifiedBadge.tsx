import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

/**
 * Trust badge shown next to artisans whose ID documents were approved.
 * `size="sm"` renders icon-only for compact cards.
 */
export function VerifiedBadge({ size = "md", className }: { size?: "sm" | "md"; className?: string }) {
  const { t } = useTranslation();

  if (size === "sm") {
    return (
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.15 }}
        title={t("artisan.verifiedTooltip")}
        className={cn("inline-flex text-secondary", className)}
      >
        <BadgeCheck className="h-4 w-4 fill-secondary/20" />
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      title={t("artisan.verifiedTooltip")}
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-gold-soft px-2.5 py-0.5 text-xs font-bold text-secondary",
        className,
      )}
    >
      <BadgeCheck className="h-3.5 w-3.5" />
      {t("artisan.verified")}
    </motion.span>
  );
}
