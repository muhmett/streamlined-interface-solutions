import i18n, { DEFAULT_LANG, applyDirection, isSupportedLang, langFromPath } from "@/i18n";

/**
 * Resolves the UI language from the URL before React mounts, and makes sure
 * the URL always carries a language prefix (/ar/…, /fr/…, /en/…).
 *
 * Works for both history routing (production) and hash routing (the
 * single-file preview build), so one entry point covers both.
 */
/** True in the single-file preview build (see vite.preview.config.ts). */
export const USE_HASH_ROUTER = import.meta.env.VITE_HASH_ROUTER === "1";

export interface LangBoot {
  lang: string;
  /** Router basename — "/ar" etc. */
  basename: string;
  usesHash: boolean;
}

export function bootLanguage(): LangBoot {
  const usesHash = USE_HASH_ROUTER;
  // With hash routing the app owns only the hash — the surrounding path
  // belongs to the host page and must never be rewritten.
  const routePath = usesHash
    ? window.location.hash.replace(/^#/, "") || "/"
    : window.location.pathname;

  let lang = langFromPath(routePath);

  if (!lang) {
    // No prefix in the URL: fall back to the browser's preference, then default.
    const preferred = navigator.languages
      .map((l) => l.split("-")[0])
      .find((l) => isSupportedLang(l));
    lang = preferred ?? DEFAULT_LANG;

    const rest = routePath === "/" ? "" : routePath;
    if (usesHash) {
      window.location.hash = `#/${lang}${rest}`;
    } else {
      window.history.replaceState(null, "", `/${lang}${rest}${window.location.search}`);
    }
  }

  i18n.changeLanguage(lang);
  applyDirection(lang);

  return { lang, basename: `/${lang}`, usesHash };
}

/** Switch language, keeping the visitor on the same page. */
export function switchLanguage(next: string) {
  const usesHash = USE_HASH_ROUTER;
  const routePath = usesHash
    ? window.location.hash.replace(/^#/, "") || "/"
    : window.location.pathname;
  const current = langFromPath(routePath);
  const rest = current ? routePath.slice(current.length + 1) || "/" : routePath || "/";

  if (usesHash) {
    window.location.hash = `#/${next}${rest === "/" ? "" : rest}`;
    window.location.reload();
  } else {
    window.location.assign(`/${next}${rest === "/" ? "" : rest}${window.location.search}`);
  }
}
