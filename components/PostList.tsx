"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category, Post } from "@/lib/types";
import { useLang, pick } from "@/lib/i18n";
import { getSupabase } from "@/lib/supabase";
import { getFingerprint } from "@/lib/fingerprint";
import RouteMap from "@/components/RouteMap";

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
  const [copied, setCopied] = useState(false);

  const title = pick(lang, post.title_uk, post.title_en);
  const excerpt = pick(lang, post.excerpt_uk, post.excerpt_en);
  const liked = counts.likedByMe.has(post.id);
  const likeCount = counts.likes[post.id] ?? 0;
  const commentCount = counts.comments[post.id] ?? 0;

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
    <article className="bg-white border border-[var(--ig-border)] rounded-lg overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 px-3.5 py-2.5">
        <div className="story-ring rounded-full p-[2px]">
          <div className="bg-white rounded-full p-[2px]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] flex items-center justify-center text-base">
              {CAT_EMOJI[post.category]}
            </div>
          </div>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">{t("site.handle")}</div>
          <div className="text-xs text-gray-500">
            {t(`cat.${post.category}` as Parameters<typeof t>[0])}
            {post.days ? ` · ${post.days} ${t("post.days")}` : ""}
            {post.distance_km ? ` · ${post.distance_km} ${t("post.km")}` : ""}
          </div>
        </div>
      </div>

      {/* media */}
      <Link href={`/post/${post.slug}`} className="block relative">
        {post.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_url}
            alt={title}
            className="w-full aspect-square object-cover"
          />
        ) : post.route?.length || post.waypoints?.length ? (
          <div className="aspect-square pointer-events-none">
            <RouteMap
              route={post.route}
              waypoints={post.waypoints}
              category={post.category}
              height="100%"
              interactive={false}
            />
          </div>
        ) : (
          <div className="aspect-square bg-gradient-to-br from-[var(--forest)] to-[var(--forest-dark)] flex items-center justify-center text-7xl">
            {CAT_EMOJI[post.category]}
          </div>
        )}
      </Link>

      {/* actions */}
      <div className="px-3.5 pt-3 pb-1 flex items-center gap-4 text-2xl">
        <button
          onClick={() => {
            onToggleLike(post.id);
            setPop(true);
            setTimeout(() => setPop(false), 350);
          }}
          className={`cursor-pointer ${pop ? "heart-pop" : ""}`}
          aria-label={t("likes.like")}
        >
          {liked ? "❤️" : "🤍"}
        </button>
        <Link href={`/post/${post.slug}#comments`} aria-label={t("comments.title")}>
          💬
        </Link>
        <button onClick={share} className="cursor-pointer" aria-label="Share">
          📤
        </button>
        {copied && (
          <span className="text-xs text-gray-500">{t("share.copied")}</span>
        )}
      </div>

      {/* likes + caption */}
      <div className="px-3.5 pb-3.5 text-sm space-y-1">
        <div className="font-semibold">
          {likeCount} {t("likes.count")}
        </div>
        <div>
          <span className="font-semibold mr-1.5">{t("site.handle")}</span>
          <span className="font-semibold">{title}.</span>{" "}
          <span className="text-gray-800">{excerpt}</span>
        </div>
        <Link
          href={`/post/${post.slug}`}
          className="text-[var(--forest)] font-medium inline-block"
        >
          {t("post.readMore")} →
        </Link>
        {commentCount > 0 && (
          <Link
            href={`/post/${post.slug}#comments`}
            className="text-gray-500 block"
          >
            {t("comments.view")} ({commentCount})
          </Link>
        )}
        <div className="text-[11px] text-gray-400 uppercase pt-1">
          {new Date(post.created_at).toLocaleDateString(
            lang === "uk" ? "uk-UA" : "en-GB",
            { day: "numeric", month: "long", year: "numeric" }
          )}
        </div>
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
    <div className="max-w-[470px] mx-auto">
      {/* stories-style категорії */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 justify-center">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="flex flex-col items-center gap-1 cursor-pointer shrink-0"
          >
            <div
              className={`rounded-full p-[2.5px] ${
                cat === c ? "story-ring" : "bg-[var(--ig-border)]"
              }`}
            >
              <div className="bg-[var(--ig-bg)] rounded-full p-[2px]">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
                  {CAT_EMOJI[c]}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-700">
              {t(`cat.${c}` as Parameters<typeof t>[0])}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-16">{t("empty.posts")}</p>
      )}

      <div className="space-y-6">
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
