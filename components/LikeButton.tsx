"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { getFingerprint } from "@/lib/fingerprint";
import { useLang } from "@/lib/i18n";

export default function LikeButton({ postId }: { postId: string }) {
  const [count, setCount] = useState<number>(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pop, setPop] = useState(false);
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
    setPop(true);
    setTimeout(() => setPop(false), 350);
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
      className="flex items-center gap-2 cursor-pointer"
      aria-label={t("likes.like")}
    >
      <span className={`text-2xl ${pop ? "heart-pop" : ""}`}>
        {liked ? "❤️" : "🤍"}
      </span>
      <span className="text-sm font-semibold">
        {count} {t("likes.count")}
      </span>
    </button>
  );
}
