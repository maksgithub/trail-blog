"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useLang } from "@/lib/i18n";

function getFingerprint(): string {
  let fp = localStorage.getItem("visitor_fp");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("visitor_fp", fp);
  }
  return fp;
}

export default function LikeButton({ postId }: { postId: string }) {
  const [count, setCount] = useState<number>(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const supabase = getSupabase();
    const fp = getFingerprint();
    supabase
      .from("likes")
      .select("fingerprint")
      .eq("post_id", postId)
      .then(({ data }) => {
        if (!data) return;
        setCount(data.length);
        setLiked(data.some((l) => l.fingerprint === fp));
      });
  }, [postId]);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc("toggle_like", {
      p_post_id: postId,
      p_fingerprint: getFingerprint(),
    });
    if (!error) {
      setLiked(data === true);
      setCount((c) => (data === true ? c + 1 : Math.max(0, c - 1)));
    }
    setBusy(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition ${
        liked
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
      }`}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span className="text-sm font-medium">
        {t("likes.like")} · {count}
      </span>
    </button>
  );
}
