"use client";

import { useState } from "react";
import type { Post } from "@/lib/types";
import AllRoutesMap from "@/components/AllRoutesMap";
import { CATEGORY_COLORS } from "@/lib/geo";
import { useLang } from "@/lib/i18n";

const LEGEND_CATS = ["hike", "bike", "camp", "other"] as const;

export default function MapPageClient({ posts }: { posts: Post[] }) {
  const { t } = useLang();
  const [heat, setHeat] = useState(false);

  return (
    <div className="fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("map.title")}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {!heat &&
            LEGEND_CATS.map((c) => (
              <span key={c} className="meta-chip">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: CATEGORY_COLORS[c] }}
                />
                {t(`cat.${c}` as Parameters<typeof t>[0])}
              </span>
            ))}
          <button
            type="button"
            onClick={() => setHeat((h) => !h)}
            aria-pressed={heat}
            className={`meta-chip cursor-pointer transition-colors ${
              heat
                ? "!bg-orange-50 !border-orange-400 !text-orange-700 font-semibold"
                : "hover:border-gray-400"
            }`}
          >
            🔥 {t("map.heat")}
          </button>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden shadow-md border border-[var(--ig-border)]">
        <AllRoutesMap posts={posts} showHeat={heat} />
      </div>
    </div>
  );
}
