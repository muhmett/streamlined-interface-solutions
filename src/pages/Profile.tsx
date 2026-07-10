import { motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, HardHat, HelpCircle, Info, LogOut, Star, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { PageTransition, staggerContainer, staggerItem } from "@/components/m3allem/PageTransition";
import { BottomNav } from "@/components/m3allem/BottomNav";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { fetchVerificationStatus } from "@/lib/api";

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, displayName, role, signOut } = useAuth();

  const { data: verificationStatus } = useQuery({
    queryKey: ["verification", user?.id],
    queryFn: () => fetchVerificationStatus(user!.id),
    enabled: Boolean(user),
  });

  const rows = [
    {
      icon: HardHat,
      label: role === "artisan" ? t("setup.editTitle") : t("profile.becomeArtisan"),
      onClick: () => navigate("/artisan-setup"),
    },
    {
      icon: BadgeCheck,
      label: t("profile.verification"),
      badge:
        verificationStatus === "approved" ? "✓" : verificationStatus === "pending" ? "⏳" : undefined,
      onClick: () => navigate("/verification"),
    },
    { icon: Star, label: t("profile.myReviews"), onClick: () => {} },
    { icon: HelpCircle, label: t("profile.help"), onClick: () => {} },
    { icon: Info, label: t("profile.about"), onClick: () => {} },
  ];

  return (
    <PageTransition className="min-h-dvh bg-background pb-28">
      <header className="bg-hero rounded-b-[2.5rem] px-5 pb-14 pt-safe">
        <h1 className="mx-auto mt-8 max-w-lg text-2xl font-black text-primary-foreground">
          {t("profile.title")}
        </h1>
      </header>

      <div className="mx-auto -mt-8 max-w-lg px-5">
        {/* Identity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-3xl bg-card p-5 shadow-elevated ring-1 ring-border/60"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-emerald-soft text-primary">
            <User className="h-8 w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-black">{displayName ?? t("profile.guest")}</p>
            {verificationStatus === "approved" && (
              <p className="text-sm font-bold text-secondary">{t("artisan.verified")}</p>
            )}
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="enter"
          className="mt-5 overflow-hidden rounded-3xl bg-card shadow-card ring-1 ring-border/60"
        >
          {rows.map((row) => (
            <motion.button
              key={row.label}
              variants={staggerItem}
              whileTap={{ scale: 0.98 }}
              onClick={row.onClick}
              className="flex w-full items-center gap-4 border-b border-border/60 px-5 py-4 text-start last:border-b-0 hover:bg-muted/50"
            >
              <row.icon className="h-5 w-5 text-primary" />
              <span className="flex-1 font-bold">{row.label}</span>
              {row.badge && <span className="text-lg">{row.badge}</span>}
              <ChevronLeft className="h-4 w-4 text-muted-foreground ltr:rotate-180" />
            </motion.button>
          ))}
        </motion.div>

        {/* Logout with confirm dialog */}
        {user && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-5 h-12 w-full gap-2 rounded-2xl border-destructive/40 font-black text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
                {t("auth.logout")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-sm rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">{t("auth.logoutConfirm")}</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row gap-2">
                <AlertDialogCancel className="mt-0 flex-1 rounded-xl font-bold">
                  {t("common.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  className="flex-1 rounded-xl bg-destructive font-bold hover:bg-destructive/90"
                  onClick={async () => {
                    await signOut();
                    navigate("/", { replace: true });
                  }}
                >
                  {t("auth.logout")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <BottomNav />
    </PageTransition>
  );
}
