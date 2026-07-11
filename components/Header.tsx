"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, t } = useLang();

  return (
    <header className="bg-white border-b border-[var(--ig-border)] sticky top-0 z-20">
      <div className="max-w-[975px] mx-auto px-4 h-[60px] flex items-center justify-between gap-4">
        <Link href="/" className="logo-script text-2xl leading-none">
          {t("site.title")}
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" title={t("nav.home")} className="text-xl hover:opacity-70">
            🏠
          </Link>
          <Link href="/map" title={t("nav.map")} className="text-xl hover:opacity-70">
            🗺️
          </Link>
          <button
            onClick={() => setLang(lang === "uk" ? "en" : "uk")}
            className="border border-[var(--ig-border)] rounded-full px-2.5 py-0.5 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
            aria-label="Switch language"
          >
            {lang === "uk" ? "EN" : "УКР"}
          </button>
        </nav>
      </div>
    </header>
  );
}
