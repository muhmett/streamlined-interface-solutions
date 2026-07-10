import { motion } from "framer-motion";
import { BadgeCheck, MapPin, Star, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageTransition, EASE, staggerContainer, staggerItem } from "@/components/m3allem/PageTransition";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: BadgeCheck, titleKey: "welcome.featureVerifiedTitle", descKey: "welcome.featureVerifiedDesc" },
  { icon: MapPin, titleKey: "welcome.featureNearbyTitle", descKey: "welcome.featureNearbyDesc" },
  { icon: Star, titleKey: "welcome.featureReviewsTitle", descKey: "welcome.featureReviewsDesc" },
] as const;

export default function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PageTransition className="flex min-h-dvh flex-col bg-hero-gradient">
      <div className="bg-zellige flex min-h-dvh flex-col px-6 pb-10 pt-safe">
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
          className="mx-auto mt-16 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gold-gradient shadow-gold"
        >
          <Wrench className="h-11 w-11 text-primary" strokeWidth={2.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
          className="mt-8 text-center text-4xl font-black text-primary-foreground"
        >
          {t("welcome.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
          className="mx-auto mt-4 max-w-sm text-center leading-relaxed text-primary-foreground/80"
        >
          {t("welcome.subtitle")}
        </motion.p>

        {/* Trust features */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="enter"
          className="mx-auto mt-10 w-full max-w-sm space-y-3"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.titleKey}
              variants={staggerItem}
              className="flex items-center gap-4 rounded-2xl bg-primary-foreground/10 p-4 backdrop-blur-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-extrabold text-primary-foreground">{t(f.titleKey)}</p>
                <p className="text-sm text-primary-foreground/70">{t(f.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex-1" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: EASE }}
          className="mx-auto w-full max-w-sm space-y-3"
        >
          <Button
            onClick={() => navigate("/login")}
            className="h-14 w-full rounded-2xl bg-gold-gradient text-lg font-black text-primary shadow-gold hover:opacity-90"
          >
            {t("welcome.getStarted")}
          </Button>
          <button
            onClick={() => navigate("/login")}
            className="w-full text-center text-sm font-semibold text-primary-foreground/70 underline-offset-4 hover:underline"
          >
            {t("welcome.alreadyHaveAccount")}
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
