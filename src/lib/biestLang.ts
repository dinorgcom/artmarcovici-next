// biest.com language choice (German / English) for pages inside the Next.js app.
//
// Same resolution as the static dossiers (public/shared/biest-lang.js):
//   1. ?lang=de | ?lang=en   (saved to localStorage, links stay shareable)
//   2. localStorage "lang"   (shared with the dossiers)
//   3. browser language: de* → German, everything else → English
//
// Only pages that opt in switch language; the rest of the site stays English.
// A page opts in by rendering a wrapper with data-biest-lang-root and the inline
// script from ./biestLangInit as its first child, which writes data-biest-lang/lang
// on the wrapper before first paint, so paired markup
//   <span data-lang="de">…</span><span data-lang="en">…</span>
// never flashes the wrong language (CSS rule in globals.css).

import { useCallback, useSyncExternalStore } from "react";

export type BiestLang = "de" | "en";

export const BIEST_LANGS: readonly BiestLang[] = ["de", "en"];
export const BIEST_LANG_KEY = "lang";

function isLang(v: unknown): v is BiestLang {
  return v === "de" || v === "en";
}

function fromUrl(): BiestLang | null {
  try {
    const p = new URLSearchParams(window.location.search).get("lang");
    return isLang(p) ? p : null;
  } catch {
    return null;
  }
}

function fromStore(): BiestLang | null {
  try {
    const s = window.localStorage.getItem(BIEST_LANG_KEY);
    return isLang(s) ? s : null;
  } catch {
    return null;
  }
}

function fromBrowser(): BiestLang {
  const list =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];
  for (const entry of list) {
    const l = String(entry || "").toLowerCase();
    if (l.startsWith("de")) return "de";
    if (l.startsWith("en")) return "en";
  }
  return "en";
}

/** Resolve the language from URL → localStorage → browser. Client only, no side effects. */
export function resolveBiestLang(): BiestLang {
  return fromUrl() ?? fromStore() ?? fromBrowser();
}

/** Save an explicit ?lang= choice, like the dossier script does. */
export function persistUrlLang(): void {
  const l = fromUrl();
  if (!l) return;
  try {
    window.localStorage.setItem(BIEST_LANG_KEY, l);
  } catch {
    /* private mode */
  }
}

// --- tiny external store ---------------------------------------------------

let current: BiestLang | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((cb) => cb());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): BiestLang {
  if (current === null) current = resolveBiestLang();
  return current;
}

// The server cannot know the visitor's language; it renders English (the site
// default). The inline script corrects the wrapper before paint, and React
// switches to the client value right after hydration.
function getServerSnapshot(): BiestLang {
  return "en";
}

/** Re-read the language (e.g. after a client-side navigation back to the page). */
export function refreshBiestLang(): void {
  persistUrlLang();
  const l = resolveBiestLang();
  if (l !== current) {
    current = l;
    emit();
  }
}

/** Forget the cached value when the opted-in page unmounts. */
export function resetBiestLang(): void {
  current = null;
}

/** Switch language in place: saves to localStorage and updates ?lang= without a reload. */
export function setBiestLang(l: BiestLang): void {
  if (!isLang(l)) return;
  try {
    window.localStorage.setItem(BIEST_LANG_KEY, l);
  } catch {
    /* ignore */
  }
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", l);
    window.history.replaceState(window.history.state, "", url.toString());
  } catch {
    /* ignore */
  }
  if (l !== current) {
    current = l;
    emit();
  }
}

export function useBiestLang() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const L = useCallback((de: string, en: string) => (lang === "de" ? de : en), [lang]);
  return { lang, setLang: setBiestLang, L };
}
