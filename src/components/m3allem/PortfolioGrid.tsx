import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PortfolioPost } from "@/types";
import { EASE, staggerContainer, staggerItem } from "./PageTransition";

/** Instagram-style 3-column grid with a tap-to-open lightbox. */
export function PortfolioGrid({ posts }: { posts: PortfolioPost[] }) {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<PortfolioPost | null>(null);

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl bg-muted p-6 text-center text-sm font-semibold text-muted-foreground">
        {t("portfolio.empty")}
      </div>
    );
  }

  return (
    <>
      <motion.div variants={staggerContainer} initial="initial" animate="enter" className="grid grid-cols-3 gap-1.5">
        {posts.map((post) => (
          <motion.button
            key={post.id}
            variants={staggerItem}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(post)}
            className="aspect-square overflow-hidden rounded-xl bg-muted"
          >
            <img src={post.imageUrl} alt={post.caption} loading="lazy" className="h-full w-full object-cover" />
          </motion.button>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground/90 p-5 backdrop-blur-sm"
          >
            <button
              aria-label={t("common.close")}
              className="absolute end-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-background/20 text-background"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease: EASE }}
              src={selected.imageUrl}
              alt={selected.caption}
              className="max-h-[70dvh] w-full max-w-lg rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {selected.caption && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 max-w-lg text-center font-bold leading-relaxed text-background"
              >
                {selected.caption}
              </motion.p>
            )}
            <p className="mt-2 text-xs text-background/60">
              {new Date(selected.createdAt).toLocaleDateString(i18n.language === "ary" ? "ar-MA" : undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
