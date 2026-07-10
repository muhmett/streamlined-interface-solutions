import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageTransition } from "@/components/m3allem/PageTransition";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PageTransition className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="text-center">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-7xl font-black text-primary"
        >
          {t("notFound.title")}
        </motion.h1>
        <p className="mt-4 text-xl font-bold text-muted-foreground">{t("notFound.message")}</p>
        <Button onClick={() => navigate("/home")} className="mt-8 h-12 rounded-2xl px-8 font-black">
          {t("notFound.goHome")}
        </Button>
      </div>
    </PageTransition>
  );
};

export default NotFound;
