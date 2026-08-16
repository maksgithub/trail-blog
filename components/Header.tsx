"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { HomeIcon, MapIcon } from "@/components/icons";

export default function Header() {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();

  const navLink = (active: boolean) =>
    `flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active
        ? "bg-[var(--forest-light)] text-[var(--forest-dark)]"
        : "text-[var(--ink)] hover:bg-black/5"
    }`;

  return (
    <header className="bg-[var(--ig-bg)]/85 backdrop-blur-md border-b border-[var(--ig-border)] sticky top-0 z-20">
      <div className="max-w-[975px] mx-auto px-4 h-[60px] flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl" aria-hidden="true">
            🏔️
          </span>
          <span>{t("site.title")}</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/" title={t("nav.home")} className={navLink(pathname === "/")}>
            <HomeIcon className="w-5 h-5" filled={pathname === "/"} />
            <span className="hidden sm:inline">{t("nav.home")}</span>
          </Link>
          <Link
            href="/map"
            title={t("nav.map")}
            className={navLink(pathname === "/map")}
          >
            <MapIcon className="w-5 h-5" filled={pathname === "/map"} />
            <span className="hidden sm:inline">{t("nav.map")}</span>
          </Link>
          <button
            onClick={() => setLang(lang === "uk" ? "en" : "uk")}
            className="ml-2 border border-[var(--ig-border)] bg-white rounded-full px-3 py-1 text-xs font-semibold hover:border-[var(--forest)] hover:text-[var(--forest)] transition-colors cursor-pointer"
            aria-label="Switch language"
          >
            {lang === "uk" ? "EN" : "УКР"}
          </button>
        </nav>
      </div>
    </header>
  );
}
