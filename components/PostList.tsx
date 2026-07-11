"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category, Post } from "@/lib/types";
import { useLang, pick } from "@/lib/i18n";

const CATS: (Category | "all")[] = ["all", "hike", "bike", "camp", "other"];
const CAT_EMOJI: Record<string, string> = {
  hike: "⛰️",
  bike: "🚴",
  camp: "⛺",
  other: "🧭",
};

export default function PostList({ posts }: { posts: Post[] }) {
  const { lang, t } = useLang();
  const [cat, setCat] = useState<Category | "all">("all");

  const filtered = cat === "all" ? posts : posts.filter((p) => p.category === cat);

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t("site.title")}</h1>
        <p className="text-gray-600">{t("site.tagline")}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm cursor-pointer ${
              cat === c
                ? "bg-[var(--forest)] text-white"
                : "bg-white border border-gray-300 hover:border-[var(--forest)]"
            }`}
          >
            {c !== "all" && `${CAT_EMOJI[c]} `}
            {t(`cat.${c}` as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-16">{t("empty.posts")}</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.slug}`}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {post.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover_url}
                alt=""
                className="h-44 w-full object-cover"
              />
            ) : (
              <div className="h-44 bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] flex items-center justify-center text-5xl">
                {CAT_EMOJI[post.category]}
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <div className="text-xs text-gray-500 mb-1 flex gap-3">
                <span>
                  {CAT_EMOJI[post.category]}{" "}
                  {t(`cat.${post.category}` as Parameters<typeof t>[0])}
                </span>
                {post.days ? <span>🗓 {post.days} {t("post.days")}</span> : null}
                {post.distance_km ? (
                  <span>📏 {post.distance_km} {t("post.km")}</span>
                ) : null}
              </div>
              <h2 className="font-semibold text-lg mb-1">
                {pick(lang, post.title_uk, post.title_en)}
              </h2>
              <p className="text-sm text-gray-600 flex-1">
                {pick(lang, post.excerpt_uk, post.excerpt_en)}
              </p>
              <span className="text-sm text-[var(--forest)] font-medium mt-3">
                {t("post.readMore")} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
