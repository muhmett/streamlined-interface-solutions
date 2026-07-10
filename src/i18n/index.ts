import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import darija from "@/locales/darija.json";

/**
 * i18n setup — Moroccan Darija (Arabic script) is the default language.
 * To add another language, drop a JSON file in src/locales/ and register it
 * below, then add its direction to LANG_DIRECTIONS.
 */
export const LANG_DIRECTIONS: Record<string, "rtl" | "ltr"> = {
  ary: "rtl",
};

i18n.use(initReactI18next).init({
  resources: {
    ary: { translation: darija },
  },
  lng: "ary",
  fallbackLng: "ary",
  interpolation: { escapeValue: false },
});

/** Keep <html> dir/lang in sync with the active language. */
function applyDirection(lng: string) {
  document.documentElement.lang = lng;
  document.documentElement.dir = LANG_DIRECTIONS[lng] ?? "ltr";
}

applyDirection(i18n.language);
i18n.on("languageChanged", applyDirection);

export default i18n;
