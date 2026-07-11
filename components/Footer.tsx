"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="text-gray-400 text-xs">
      <div className="max-w-[975px] mx-auto px-4 py-8 flex justify-between items-center">
        <span>
          © {new Date().getFullYear()} · {t("footer.text")}
        </span>
        <Link href="/admin" className="hover:text-gray-600">
          Admin
        </Link>
      </div>
    </footer>
  );
}
