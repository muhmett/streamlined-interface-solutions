import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, PhoneCall, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageTransition, staggerContainer, staggerItem } from "@/components/m3allem/PageTransition";
import { BottomNav } from "@/components/m3allem/BottomNav";
import { ContactSheet } from "@/components/m3allem/ContactSheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyJobs, updateJobStatus } from "@/lib/api";
import type { Job, JobStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<JobStatus, string> = {
  requested: "bg-brand-gold-soft text-foreground",
  accepted: "bg-primary text-primary-foreground",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-muted text-muted-foreground",
};

/** ليسطوريك ديال الخدمات — history for both the client and the artisan. */
export default function Jobs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, role } = useAuth();
  const [contact, setContact] = useState<{ name: string; phone: string } | null>(null);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", user?.id],
    queryFn: () => fetchMyJobs(user!.id),
    enabled: Boolean(user),
  });

  const setStatus = async (job: Job, status: JobStatus) => {
    try {
      await updateJobStatus(job.id, status);
      queryClient.invalidateQueries({ queryKey: ["jobs", user?.id] });
    } catch {
      toast.error(t("common.error"));
    }
  };

  return (
    <PageTransition className="min-h-dvh bg-background pb-28">
      <header className="bg-hero rounded-b-[2rem] px-5 pb-8 pt-safe">
        <div className="mx-auto max-w-lg">
          <h1 className="mt-8 text-2xl font-black text-primary-foreground">{t("jobs.title")}</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">{t("jobs.subtitle")}</p>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-5 pt-6">
        {!user ? (
          <EmptyState hint={t("jobs.mustLogin")} action={() => navigate("/login")} actionLabel={t("auth.loginTitle")} />
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <EmptyState
            hint={role === "artisan" ? t("jobs.emptyHintArtisan") : t("jobs.emptyHintClient")}
            action={() => navigate("/home")}
            actionLabel={t("nav.home")}
          />
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="enter" className="space-y-3">
            {jobs.map((job) => {
              const iAmClient = job.clientId === user.id;
              const other = iAmClient
                ? { name: job.artisanName, phone: job.artisanPhone, labelKey: "jobs.withArtisan" }
                : { name: job.clientName, phone: job.clientPhone, labelKey: "jobs.withClient" };
              return (
                <motion.article
                  key={job.id}
                  variants={staggerItem}
                  className="rounded-2xl bg-card p-4 shadow-card ring-1 ring-border/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-extrabold">{t(other.labelKey, { name: other.name })}</p>
                    <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-black", STATUS_STYLE[job.status])}>
                      {t(`jobs.status${job.status[0].toUpperCase()}${job.status.slice(1)}`)}
                    </span>
                  </div>
                  {job.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{job.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground/60">
                    {new Date(job.createdAt).toLocaleDateString("ar-MA", { month: "long", day: "numeric" })}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl font-bold"
                      onClick={() => setContact({ name: other.name, phone: other.phone })}
                    >
                      <PhoneCall className="h-4 w-4" />
                      {t("jobs.contact")}
                    </Button>

                    {/* Artisan accepts an incoming request */}
                    {!iAmClient && job.status === "requested" && (
                      <>
                        <Button size="sm" className="rounded-xl font-black" onClick={() => setStatus(job, "accepted")}>
                          <CheckCircle2 className="h-4 w-4" />
                          {t("jobs.accept")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl font-bold text-destructive hover:text-destructive"
                          onClick={() => setStatus(job, "cancelled")}
                        >
                          {t("jobs.decline")}
                        </Button>
                      </>
                    )}

                    {/* Client validates the finished job */}
                    {iAmClient && job.status === "accepted" && (
                      <Button
                        size="sm"
                        className="rounded-xl bg-gold-gradient font-black text-primary shadow-gold hover:opacity-90"
                        onClick={() => setStatus(job, "completed")}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {t("jobs.markDone")}
                      </Button>
                    )}

                    {/* Then rates the artisan */}
                    {iAmClient && job.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl font-bold"
                        onClick={() => navigate(`/artisan/${job.artisanId}`)}
                      >
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        {t("jobs.rateNow")}
                      </Button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>

      {contact && (
        <ContactSheet name={contact.name} phone={contact.phone} open onClose={() => setContact(null)} />
      )}
      <BottomNav />
    </PageTransition>
  );
}

function EmptyState({ hint, action, actionLabel }: { hint: string; action: () => void; actionLabel: string }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl bg-muted p-8 text-center"
    >
      <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/50" />
      <p className="mt-3 text-lg font-black">{t("jobs.empty")}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      <Button onClick={action} className="mt-5 rounded-xl font-black">
        {actionLabel}
      </Button>
    </motion.div>
  );
}
