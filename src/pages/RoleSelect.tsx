import { motion } from "framer-motion";
import { HardHat, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageTransition, EASE } from "@/components/m3allem/PageTransition";
import { useAuth, type UserRole } from "@/contexts/AuthContext";

const CHOICES: {
  role: UserRole;
  icon: typeof Search;
  titleKey: string;
  descKey: string;
  next: string;
}[] = [
  { role: "client", icon: Search, titleKey: "role.client", descKey: "role.clientDesc", next: "/home" },
  { role: "artisan", icon: HardHat, titleKey: "role.artisan", descKey: "role.artisanDesc", next: "/artisan-setup" },
];

/** First screen after login: choose client vs artisan. */
export default function RoleSelect() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setRole } = useAuth();

  const choose = (role: UserRole, next: string) => {
    setRole(role);
    navigate(next, { replace: true });
  };

  return (
    <PageTransition className="bg-hero flex min-h-dvh flex-col px-6 pb-10 pt-safe">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-20 text-center text-3xl font-black text-primary-foreground"
      >
        {t("role.title")}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-2 text-center text-primary-foreground/75"
      >
        {t("role.subtitle")}
      </motion.p>

      <div className="mx-auto mt-10 w-full max-w-sm flex-1 space-y-4">
        {CHOICES.map((choice, i) => (
          <motion.button
            key={choice.role}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25 + i * 0.12, duration: 0.45, ease: EASE }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => choose(choice.role, choice.next)}
            className="flex w-full items-center gap-5 rounded-3xl bg-card p-6 text-start shadow-elevated"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold-gradient text-primary shadow-gold">
              <choice.icon className="h-8 w-8" strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-xl font-black">{t(choice.titleKey)}</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                {t(choice.descKey)}
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-xs text-primary-foreground/60"
      >
        {t("role.changeLater")}
      </motion.p>
    </PageTransition>
  );
}
