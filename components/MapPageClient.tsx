"use client";

import type { Post } from "@/lib/types";
import AllRoutesMap from "@/components/AllRoutesMap";
import { CATEGORY_COLORS } from "@/lib/geo";
import { useLang } from "@/lib/i18n";

const LEGEND_CATS = ["hike", "bike", "camp", "other"] as const;

export default function MapPageClient({ posts }: { posts: Post[] }) {
  const { t } = useLang();
  return (
    <div className="fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("map.title")}</h1>
        <div className="flex flex-wrap gap-2">
          {LEGEND_CATS.map((c) => (
            <span key={c} className="meta-chip">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: CATEGORY_COLORS[c] }}
              />
              {t(`cat.${c}` as Parameters<typeof t>[0])}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden shadow-md border border-[var(--ig-border)]">
        <AllRoutesMap posts={posts} />
      </div>
    </div>
  );
}
