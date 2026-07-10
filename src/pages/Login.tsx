import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageTransition, EASE } from "@/components/m3allem/PageTransition";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth, DEMO_OTP } from "@/contexts/AuthContext";

type Step = "method" | "otp";

/** Moroccan mobile numbers: 6 or 7 followed by 8 digits. */
const MA_PHONE_RE = /^(6|7)\d{8}$/;

const stepVariants = {
  initial: (dir: number) => ({ opacity: 0, x: dir * 60 }),
  enter: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60, transition: { duration: 0.25 } }),
};

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, role, isDemo, signInWithGoogle, signInWithPhone, verifyOtp } = useAuth();

  const [step, setStep] = useState<Step>("method");
  const [direction, setDirection] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const fullPhone = useMemo(() => `+212${phone}`, [phone]);
  const phoneValid = MA_PHONE_RE.test(phone);

  // Signed in (or OAuth redirect just landed): first-timers pick a role.
  useEffect(() => {
    if (user) navigate(role ? "/home" : "/role", { replace: true });
  }, [user, role, navigate]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const goTo = (next: Step, dir: number) => {
    setDirection(dir);
    setStep(next);
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
      // Real OAuth navigates away; demo mode resolves in place.
      if (isDemo) toast.success(t("auth.loginSuccess"));
    } catch {
      toast.error(t("common.error"));
    } finally {
      setBusy(false);
    }
  };

  const handleSendCode = async () => {
    if (!phoneValid) {
      toast.error(t("auth.invalidPhone"));
      return;
    }
    setBusy(true);
    try {
      await signInWithPhone(fullPhone);
      toast.success(t("auth.otpSent"));
      setOtp("");
      setResendIn(30);
      goTo("otp", 1);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (code: string) => {
    setBusy(true);
    try {
      await verifyOtp(fullPhone, code);
      toast.success(t("auth.loginSuccess"));
    } catch {
      toast.error(t("auth.invalidOtp"));
      setOtp("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageTransition className="flex min-h-dvh flex-col bg-background">
      {/* Emerald header arch */}
      <div className="bg-hero rounded-b-[2.5rem] px-6 pb-12 pt-safe">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-14 text-3xl font-black text-primary-foreground"
        >
          {t("auth.loginTitle")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-primary-foreground/75"
        >
          {step === "method" ? t("auth.loginSubtitle") : t("auth.otpSubtitle", { phone: fullPhone })}
        </motion.p>
      </div>

      <div className="mx-auto w-full max-w-md flex-1 px-6 py-8">
        {isDemo && (
          <div className="mb-5 rounded-2xl bg-brand-gold-soft px-4 py-2.5 text-center text-xs font-bold text-secondary">
            {t("common.demoModeBanner")} — OTP: <span className="ltr-nums">{DEMO_OTP}</span>
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          {step === "method" ? (
            <motion.div
              key="method"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="space-y-6"
            >
              {/* Google OAuth */}
              <Button
                variant="outline"
                disabled={busy}
                onClick={handleGoogle}
                className="h-14 w-full gap-3 rounded-2xl border-2 text-base font-extrabold shadow-card"
              >
                <GoogleIcon />
                {t("auth.continueWithGoogle")}
              </Button>

              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-border" />
                <span className="text-sm font-bold text-muted-foreground">{t("auth.orWithPhone")}</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              {/* Phone number */}
              <div>
                <label className="mb-2 block text-sm font-bold text-muted-foreground">
                  {t("auth.phoneLabel")}
                </label>
                <div
                  dir="ltr"
                  className="flex items-center overflow-hidden rounded-2xl border border-border bg-card shadow-card focus-within:ring-2 focus-within:ring-primary/40"
                >
                  <span className="flex items-center gap-1.5 border-e border-border bg-muted px-3.5 py-4 text-sm font-black text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    +212
                  </span>
                  <input
                    inputMode="tel"
                    autoComplete="tel-national"
                    value={phone}
                    maxLength={9}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder={t("auth.phonePlaceholder")}
                    className="h-full w-full bg-transparent px-3 py-4 text-lg font-bold tracking-widest outline-none placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>

              <motion.div whileTap={{ scale: phoneValid ? 0.97 : 1 }}>
                <Button
                  disabled={!phoneValid || busy}
                  onClick={handleSendCode}
                  className="h-14 w-full gap-2 rounded-2xl text-base font-black"
                >
                  {busy ? t("common.loading") : t("auth.sendCode")}
                  <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                </Button>
              </motion.div>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">{t("auth.terms")}</p>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="space-y-6"
            >
              <h2 className="text-center text-xl font-black">{t("auth.otpTitle")}</h2>

              <div dir="ltr" className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(v) => {
                    setOtp(v);
                    if (v.length === 6) handleVerify(v);
                  }}
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-14 w-11 rounded-xl border-2 text-xl font-black first:rounded-s-xl last:rounded-e-xl"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                disabled={otp.length !== 6 || busy}
                onClick={() => handleVerify(otp)}
                className="h-14 w-full rounded-2xl text-base font-black"
              >
                {busy ? t("common.loading") : t("auth.verifyCode")}
              </Button>

              <div className="space-y-3 text-center text-sm">
                {resendIn > 0 ? (
                  <p className="text-muted-foreground">{t("auth.resendIn", { seconds: resendIn })}</p>
                ) : (
                  <button onClick={handleSendCode} disabled={busy} className="font-bold text-primary underline-offset-4 hover:underline">
                    {t("auth.resendCode")}
                  </button>
                )}
                <button
                  onClick={() => goTo("method", -1)}
                  className="block w-full font-semibold text-muted-foreground underline-offset-4 hover:underline"
                >
                  {t("auth.changeNumber")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
