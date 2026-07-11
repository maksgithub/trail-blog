"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-[var(--forest-dark)] text-white/70 text-sm">
      <div className="max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
        <span>
          © {new Date().getFullYear()} · {t("footer.text")}
        </span>
        <Link href="/admin" className="hover:text-white text-xs">
          Admin
        </Link>
      </div>
    </footer>
  );
}
