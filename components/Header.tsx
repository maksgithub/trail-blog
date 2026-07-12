"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { HomeIcon, MapIcon } from "@/components/icons";

export default function Header() {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();

  const navLink = (active: boolean) =>
    `p-1.5 rounded-lg transition-colors ${
      active ? "text-[var(--forest)]" : "text-[var(--ink)] hover:bg-gray-100"
    }`;

  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-[var(--ig-border)] sticky top-0 z-20">
      <div className="max-w-[975px] mx-auto px-4 h-[60px] flex items-center justify-between gap-4">
        <Link
          href="/"
          className="logo-script text-2xl leading-none hover:opacity-80 transition-opacity"
        >
          {t("site.title")}
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" title={t("nav.home")} className={navLink(pathname === "/")}>
            <HomeIcon className="w-6 h-6" filled={pathname === "/"} />
          </Link>
          <Link
            href="/map"
            title={t("nav.map")}
            className={navLink(pathname === "/map")}
          >
            <MapIcon className="w-6 h-6" filled={pathname === "/map"} />
          </Link>
          <button
            onClick={() => setLang(lang === "uk" ? "en" : "uk")}
            className="ml-2 border border-[var(--ig-border)] rounded-full px-3 py-1 text-xs font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
            aria-label="Switch language"
          >
            {lang === "uk" ? "EN" : "УКР"}
          </button>
        </nav>
      </div>
    </header>
  );
}
