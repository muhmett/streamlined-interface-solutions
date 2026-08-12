import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/i18n";
import { switchLanguage } from "@/lib/lang-boot";
import { cn } from "@/lib/utils";

/**
 * Language chips. Each language is its own URL (/ar/…, /fr/…, /en/…), so
 * switching is a real navigation — links stay shareable and indexable.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n, t } = useTranslation();

  return (
    <div className={className}>
      <p className="mb-2 text-sm font-bold text-muted-foreground">{t("lang.title")}</p>
      <div className="flex gap-2" role="group" aria-label={t("lang.switch")}>
        {LANGUAGES.map((l) => {
          const active = i18n.language === l.code;
          return (
            <motion.button
              key={l.code}
              whileTap={{ scale: 0.93 }}
              onClick={() => !active && switchLanguage(l.code)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-sm font-black transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-muted text-muted-foreground hover:bg-brand-gold-soft hover:text-foreground",
              )}
            >
              <span aria-hidden>{l.flag}</span>
              {l.label}
              <span className="text-[10px] opacity-60">/{l.code}/</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
