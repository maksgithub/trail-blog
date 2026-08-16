"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category, Post } from "@/lib/types";
import { useLang, pick } from "@/lib/i18n";
import { getSupabase } from "@/lib/supabase";
import { getFingerprint } from "@/lib/fingerprint";
import { CATEGORY_COLORS } from "@/lib/geo";
import RouteMap from "@/components/RouteMap";
import { HeartIcon, CommentIcon, ShareIcon, CalendarIcon, RulerIcon } from "@/components/icons";

const CATS: (Category | "all")[] = ["all", "hike", "bike", "camp", "other"];
const CAT_EMOJI: Record<string, string> = {
  all: "✨",
  hike: "⛰️",
  bike: "🚴",
  camp: "⛺",
  other: "🧭",
};

interface Counts {
  likes: Record<string, number>;
  comments: Record<string, number>;
  likedByMe: Set<string>;
}

function FeedCard({
  post,
  counts,
  onToggleLike,
}: {
  post: Post;
  counts: Counts;
  onToggleLike: (postId: string) => void;
}) {
  const { lang, t } = useLang();
  const [pop, setPop] = useState(false);
  const [burst, setBurst] = useState(false);
  const [copied, setCopied] = useState(false);

  const title = pick(lang, post.title_uk, post.title_en);
  const excerpt = pick(lang, post.excerpt_uk, post.excerpt_en);
  const liked = counts.likedByMe.has(post.id);
  const likeCount = counts.likes[post.id] ?? 0;
  const commentCount = counts.comments[post.id] ?? 0;
  const catColor = CATEGORY_COLORS[post.category] ?? "#0891b2";

  const like = () => {
    onToggleLike(post.id);
    setPop(true);
    setTimeout(() => setPop(false), 350);
  };

  // подвійний тап по фото лайкає (ніколи не знімає лайк)
  const doubleTapLike = () => {
    if (!liked) onToggleLike(post.id);
    setBurst(true);
    setTimeout(() => setBurst(false), 900);
  };

  const share = async () => {
    const url = `${window.location.origin}/post/${post.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      /* cancelled */
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className="feed-card fade-up">
      {/* заголовок картки: категорія + дата */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ background: `${catColor}15`, color: catColor }}
        >
          {CAT_EMOJI[post.category]}{" "}
          {t(`cat.${post.category}` as Parameters<typeof t>[0])}
        </span>
        <time className="text-[11px] uppercase tracking-wide text-[var(--ink-soft)]">
          {new Date(post.created_at).toLocaleDateString(
            lang === "uk" ? "uk-UA" : "en-GB",
            { day: "numeric", month: "long", year: "numeric" }
          )}
        </time>
      </div>

      {/* медіа з бейджами метрик поверх */}
      <Link
        href={`/post/${post.slug}`}
        className="block relative group"
        onDoubleClick={(e) => {
          e.preventDefault();
          doubleTapLike();
        }}
      >
        <div className="overflow-hidden">
          {post.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_url}
              alt={title}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : post.route?.length || post.waypoints?.length ? (
            <div className="aspect-[4/3] pointer-events-none">
              <RouteMap
                route={post.route}
                waypoints={post.waypoints}
                category={post.category}
                height="100%"
                interactive={false}
              />
            </div>
          ) : (
            <div
              className="aspect-[4/3] flex items-center justify-center text-7xl"
              style={{
                background: `linear-gradient(135deg, ${catColor}cc, ${catColor})`,
              }}
            >
              {CAT_EMOJI[post.category]}
            </div>
          )}
        </div>
        {(post.days || post.distance_km) && (
          <div className="absolute bottom-2.5 left-2.5 flex gap-1.5 pointer-events-none">
            {post.days ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white">
                <CalendarIcon className="w-3 h-3" />
                {post.days} {t("post.days")}
              </span>
            ) : null}
            {post.distance_km ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white">
                <RulerIcon className="w-3 h-3" />
                {post.distance_km} {t("post.km")}
              </span>
            ) : null}
          </div>
        )}
        {burst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <HeartIcon className="w-24 h-24 heart-burst drop-shadow-lg" filled />
          </div>
        )}
      </Link>

      {/* тіло: заголовок → опис → дії */}
      <div className="px-4 pt-3 pb-4">
        <Link href={`/post/${post.slug}`}>
          <h2 className="text-lg font-bold tracking-tight leading-snug hover:text-[var(--forest)] transition-colors">
            {title}
          </h2>
        </Link>
        {excerpt && (
          <p className="text-sm text-[var(--ink-soft)] mt-1 line-clamp-2">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-0.5 mt-3 -ml-1.5">
          <button
            onClick={like}
            className={`p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer ${
              pop ? "heart-pop" : ""
            }`}
            aria-label={t("likes.like")}
            aria-pressed={liked}
          >
            <HeartIcon className="w-6 h-6" filled={liked} />
          </button>
          <Link
            href={`/post/${post.slug}#comments`}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            aria-label={t("comments.title")}
          >
            <CommentIcon className="w-6 h-6" />
          </Link>
          <button
            onClick={share}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Share"
          >
            <ShareIcon className="w-6 h-6" />
          </button>
          {copied && (
            <span className="text-xs text-[var(--forest)] font-medium fade-up">
              {t("share.copied")}
            </span>
          )}
          <span className="ml-auto text-sm font-semibold">
            {likeCount} {t("likes.count")}
          </span>
        </div>
        {commentCount > 0 && (
          <Link
            href={`/post/${post.slug}#comments`}
            className="block mt-1.5 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
          >
            {t("comments.view")} ({commentCount})
          </Link>
        )}
      </div>
    </article>
  );
}

export default function PostList({ posts }: { posts: Post[] }) {
  const { t } = useLang();
  const [cat, setCat] = useState<Category | "all">("all");
  const [counts, setCounts] = useState<Counts>({
    likes: {},
    comments: {},
    likedByMe: new Set(),
  });

  useEffect(() => {
    const supabase = getSupabase();
    const fp = getFingerprint();
    (async () => {
      const [{ data: likes }, { data: comments }] = await Promise.all([
        supabase.from("likes").select("post_id, fingerprint"),
        supabase.from("comments").select("post_id"),
      ]);
      const likeMap: Record<string, number> = {};
      const mine = new Set<string>();
      for (const l of likes ?? []) {
        likeMap[l.post_id] = (likeMap[l.post_id] ?? 0) + 1;
        if (l.fingerprint === fp) mine.add(l.post_id);
      }
      const commentMap: Record<string, number> = {};
      for (const c of comments ?? []) {
        commentMap[c.post_id] = (commentMap[c.post_id] ?? 0) + 1;
      }
      setCounts({ likes: likeMap, comments: commentMap, likedByMe: mine });
    })();
  }, []);

  const toggleLike = async (postId: string) => {
    // оптимістичне оновлення
    setCounts((prev) => {
      const mine = new Set(prev.likedByMe);
      const likes = { ...prev.likes };
      if (mine.has(postId)) {
        mine.delete(postId);
        likes[postId] = Math.max(0, (likes[postId] ?? 1) - 1);
      } else {
        mine.add(postId);
        likes[postId] = (likes[postId] ?? 0) + 1;
      }
      return { ...prev, likes, likedByMe: mine };
    });
    await getSupabase().rpc("toggle_like", {
      p_post_id: postId,
      p_fingerprint: getFingerprint(),
    });
  };

  const filtered = cat === "all" ? posts : posts.filter((p) => p.category === cat);

  return (
    <div className="max-w-[520px] mx-auto">
      {/* фільтри-пігулки категорій */}
      <div className="flex gap-2 overflow-x-auto pb-5 pt-1 sm:justify-center">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium border transition-colors cursor-pointer ${
              cat === c
                ? "bg-[var(--ink)] text-white border-transparent"
                : "bg-white border-[var(--ig-border)] hover:border-[var(--ink-soft)]"
            }`}
          >
            {CAT_EMOJI[c]} {t(`cat.${c}` as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 fade-up">
          <div className="text-5xl mb-3">🌲</div>
          <p className="text-[var(--ink-soft)]">{t("empty.posts")}</p>
        </div>
      )}

      <div className="space-y-7">
        {filtered.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            counts={counts}
            onToggleLike={toggleLike}
          />
        ))}
      </div>
    </div>
  );
}
