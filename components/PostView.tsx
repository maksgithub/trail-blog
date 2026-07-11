"use client";

import { marked } from "marked";
import type { Post } from "@/lib/types";
import RouteMap from "@/components/RouteMap";
import LikeButton from "@/components/LikeButton";
import Comments from "@/components/Comments";
import { useLang, pick } from "@/lib/i18n";

const CAT_EMOJI: Record<string, string> = {
  hike: "⛰️",
  bike: "🚴",
  camp: "⛺",
  other: "🧭",
};

export default function PostView({ post }: { post: Post }) {
  const { lang, t } = useLang();
  const title = pick(lang, post.title_uk, post.title_en);
  const content = pick(lang, post.content_uk, post.content_en);

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2 flex flex-wrap gap-4">
          <span>
            {CAT_EMOJI[post.category]}{" "}
            {t(`cat.${post.category}` as Parameters<typeof t>[0])}
          </span>
          {post.days ? <span>🗓 {post.days} {t("post.days")}</span> : null}
          {post.distance_km ? (
            <span>📏 {post.distance_km} {t("post.km")}</span>
          ) : null}
          <span>
            {new Date(post.created_at).toLocaleDateString(
              lang === "uk" ? "uk-UA" : "en-GB"
            )}
          </span>
        </div>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>

      {post.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_url}
          alt={title}
          className="w-full rounded-xl shadow mb-6 max-h-[480px] object-cover"
        />
      )}

      {(post.route?.length || post.waypoints?.length) ? (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t("post.route")}</h2>
          <RouteMap
            route={post.route}
            waypoints={post.waypoints}
            category={post.category}
          />
        </section>
      ) : null}

      {content && (
        <div
          className="prose-content mb-8"
          dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }}
        />
      )}

      {post.photos && post.photos.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t("post.photos")}</h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
            {post.photos.map((ph, i) => (
              <a key={i} href={ph.url} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ph.url}
                  alt={ph.caption ?? ""}
                  className="rounded-lg shadow object-cover w-full h-40 hover:opacity-90"
                />
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center gap-4 border-t border-b border-gray-200 py-4 mb-8">
        <LikeButton postId={post.id} />
      </div>

      <Comments postId={post.id} />
    </article>
  );
}
