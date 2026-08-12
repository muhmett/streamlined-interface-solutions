import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import darija from "@/locales/darija.json";
import french from "@/locales/fr.json";
import english from "@/locales/en.json";

/**
 * i18n with per-language URL prefixes: /ar/… /fr/… /en/…
 * Darija (Moroccan Arabic, RTL) is the default.
 *
 * To add a language: drop a JSON file in src/locales/, register it in
 * LANGUAGES below, and its /xx/ routes start working immediately.
 */
export interface Language {
  code: string;
  dir: "rtl" | "ltr";
  /** Name shown in the language switcher, in its own language. */
  label: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "ar", dir: "rtl", label: "الدارجة", flag: "🇲🇦" },
  { code: "fr", dir: "ltr", label: "Français", flag: "🇫🇷" },
  { code: "en", dir: "ltr", label: "English", flag: "🇬🇧" },
];

export const DEFAULT_LANG = "ar";

export const isSupportedLang = (code: string | undefined): boolean =>
  Boolean(code) && LANGUAGES.some((l) => l.code === code);

export const langDir = (code: string): "rtl" | "ltr" =>
  LANGUAGES.find((l) => l.code === code)?.dir ?? "ltr";

/** First path segment of the URL if it is a supported language, else null. */
export function langFromPath(pathname: string): string | null {
  const seg = pathname.replace(/^\/+/, "").split("/")[0];
  return isSupportedLang(seg) ? seg : null;
}

/** The path with any language prefix removed ("/ar/home" → "/home"). */
export function stripLang(pathname: string): string {
  const lang = langFromPath(pathname);
  if (!lang) return pathname || "/";
  const rest = pathname.slice(lang.length + 1);
  return rest || "/";
}

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: darija },
    fr: { translation: french },
    en: { translation: english },
  },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  interpolation: { escapeValue: false },
});

/** Keep <html> lang/dir in sync with the active language. */
export function applyDirection(code: string) {
  document.documentElement.lang = code;
  document.documentElement.dir = langDir(code);
}

i18n.on("languageChanged", applyDirection);

export default i18n;
