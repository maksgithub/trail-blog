"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, t } = useLang();

  return (
    <header className="bg-[var(--forest-dark)] text-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ⛰️ {t("site.title")}
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="hover:underline">
            {t("nav.home")}
          </Link>
          <Link href="/map" className="hover:underline">
            {t("nav.map")}
          </Link>
          <button
            onClick={() => setLang(lang === "uk" ? "en" : "uk")}
            className="border border-white/40 rounded px-2 py-0.5 text-xs hover:bg-white/10 cursor-pointer"
            aria-label="Switch language"
          >
            {lang === "uk" ? "EN" : "УКР"}
          </button>
        </nav>
      </div>
    </header>
  );
}
