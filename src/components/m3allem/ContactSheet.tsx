import { AnimatePresence, motion } from "framer-motion";
import { Copy, MessageCircle, Phone, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { EASE } from "./PageTransition";

interface ContactSheetProps {
  name: string;
  phone: string;
  open: boolean;
  onClose: () => void;
}

/**
 * Contact bottom-sheet: shows the number in the open (so it can always be
 * dialed by hand) plus call / WhatsApp / copy actions. Sandboxed browsers
 * block tel: links, so copy + the visible number are the safety net.
 */
export function ContactSheet({ name, phone, open, onClose }: ContactSheetProps) {
  const { t } = useTranslation();

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phone);
    } catch {
      // Clipboard API blocked (iframe/permissions): legacy fallback.
      const ta = document.createElement("textarea");
      ta.value = phone;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast.success(t("contact.copied"));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-card p-6 pb-safe shadow-elevated"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-black">{t("contact.title", { name })}</h2>
              <button onClick={onClose} aria-label={t("common.close")} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            {phone ? (
              <>
                {/* The number itself, big and selectable */}
                <p dir="ltr" className="mt-4 select-all rounded-2xl bg-muted py-4 text-center text-2xl font-black tracking-widest">
                  {phone}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <motion.a
                    whileTap={{ scale: 0.94 }}
                    href={`tel:${phone}`}
                    className="flex flex-col items-center gap-1.5 rounded-2xl bg-gold-gradient py-4 text-xs font-black text-primary shadow-gold"
                  >
                    <Phone className="h-6 w-6" />
                    {t("contact.call")}
                  </motion.a>
                  <motion.a
                    whileTap={{ scale: 0.94 }}
                    href={`https://wa.me/${phone.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#25D366] py-4 text-xs font-black text-white"
                  >
                    <MessageCircle className="h-6 w-6" />
                    {t("contact.whatsapp")}
                  </motion.a>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={copyNumber}
                    className="flex flex-col items-center gap-1.5 rounded-2xl bg-primary py-4 text-xs font-black text-primary-foreground"
                  >
                    <Copy className="h-6 w-6" />
                    {t("contact.copy")}
                  </motion.button>
                </div>
              </>
            ) : (
              <p className="mt-6 rounded-2xl bg-muted p-6 text-center text-sm font-bold text-muted-foreground">
                {t("contact.noPhone")}
              </p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
