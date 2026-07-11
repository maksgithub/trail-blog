"use client";

import { marked } from "marked";
import type { Post } from "@/lib/types";
import RouteMap from "@/components/RouteMap";
import LikeButton from "@/components/LikeButton";
import Comments from "@/components/Comments";
import { useLang, pick } from "@/lib/i18n";
import { CalendarIcon, RulerIcon } from "@/components/icons";

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
    <article className="max-w-3xl mx-auto fade-up">
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="meta-chip font-medium text-[var(--forest)] border-[var(--forest)]/30 bg-[var(--forest-light)]">
            {CAT_EMOJI[post.category]}{" "}
            {t(`cat.${post.category}` as Parameters<typeof t>[0])}
          </span>
          {post.days ? (
            <span className="meta-chip">
              <CalendarIcon />
              {post.days} {t("post.days")}
            </span>
          ) : null}
          {post.distance_km ? (
            <span className="meta-chip">
              <RulerIcon />
              {post.distance_km} {t("post.km")}
            </span>
          ) : null}
          <span className="meta-chip">
            {new Date(post.created_at).toLocaleDateString(
              lang === "uk" ? "uk-UA" : "en-GB",
              { day: "numeric", month: "long", year: "numeric" }
            )}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {title}
        </h1>
      </div>

      {post.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_url}
          alt={title}
          className="w-full rounded-2xl shadow-lg mb-8 max-h-[480px] object-cover"
        />
      )}

      {(post.route?.length || post.waypoints?.length) ? (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{t("post.route")}</h2>
          <div className="rounded-2xl overflow-hidden shadow-md border border-[var(--ig-border)]">
            <RouteMap
              route={post.route}
              waypoints={post.waypoints}
              category={post.category}
            />
          </div>
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
              <a
                key={i}
                href={ph.url}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-xl shadow group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ph.url}
                  alt={ph.caption ?? ""}
                  loading="lazy"
                  className="object-cover w-full h-40 transition-transform duration-300 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center gap-4 border-t border-b border-[var(--ig-border)] py-4 mb-8">
        <LikeButton postId={post.id} />
      </div>

      <div id="comments" className="scroll-mt-20">
        <Comments postId={post.id} />
      </div>
    </article>
  );
}
