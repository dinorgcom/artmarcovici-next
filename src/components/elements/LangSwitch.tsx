"use client";

import { useEffect } from "react";
import { useBiestLang, type BiestLang } from "@/lib/biestLang";

/**
 * DE | EN toggle for pages that opt into German/English. Keeps the
 * data-biest-lang attribute of the page's language root in sync, so the
 * server-rendered paired markup (<span data-lang="de|en">) follows the choice.
 */
export default function LangSwitch() {
  const { lang, setLang } = useBiestLang();

  useEffect(() => {
    const root = document.querySelector("[data-biest-lang-root]");
    if (root) {
      root.setAttribute("data-biest-lang", lang);
      root.setAttribute("lang", lang);
    }
  }, [lang]);

  const options: [BiestLang, string, string][] = [
    ["de", "DE", "Deutsch"],
    ["en", "EN", "English"],
  ];

  return (
    <div
      role="group"
      aria-label={lang === "de" ? "Sprache" : "Language"}
      className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-white/15 p-0.5 text-[11px] font-semibold tracking-wider"
    >
      {options.map(([key, short, long]) => (
        <button
          key={key}
          type="button"
          lang={key}
          title={long}
          aria-pressed={lang === key}
          onClick={() => setLang(key)}
          className={`rounded-full px-2.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            lang === key ? "bg-accent text-black" : "text-gray-400 hover:text-white"
          }`}
        >
          {short}
        </button>
      ))}
    </div>
  );
}
