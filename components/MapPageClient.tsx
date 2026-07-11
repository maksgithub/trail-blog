"use client";

import type { Post } from "@/lib/types";
import AllRoutesMap from "@/components/AllRoutesMap";
import { useLang } from "@/lib/i18n";

export default function MapPageClient({ posts }: { posts: Post[] }) {
  const { t } = useLang();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("map.title")}</h1>
      <AllRoutesMap posts={posts} />
    </div>
  );
}
