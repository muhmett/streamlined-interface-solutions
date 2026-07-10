import { motion } from "framer-motion";
import { Home, Search, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const TABS = [
  { path: "/home", labelKey: "nav.home", icon: Home },
  { path: "/search", labelKey: "nav.search", icon: Search },
  { path: "/profile", labelKey: "nav.profile", icon: User },
] as const;

/** Fixed bottom tab bar with an animated active-pill (layoutId magic-move). */
export function BottomNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/85 pb-safe backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.path);
          return (
            <motion.button
              key={tab.path}
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate(tab.path)}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-2xl px-5 py-1.5 text-[11px] font-bold transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-2xl bg-brand-emerald-soft"
                />
              )}
              <tab.icon className="relative h-5 w-5" />
              <span className="relative">{t(tab.labelKey)}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
