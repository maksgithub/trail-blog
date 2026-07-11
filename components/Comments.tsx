"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Comment } from "@/lib/types";
import { useLang } from "@/lib/i18n";

const AVATAR_COLORS = [
  "bg-emerald-600",
  "bg-sky-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-violet-600",
  "bg-teal-600",
];

function avatarColor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.codePointAt(0)!) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const { t, lang } = useLang();

  const load = async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setComments((data as Comment[]) ?? []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || busy) return;
    setBusy(true);
    const supabase = getSupabase();
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_name: name.trim().slice(0, 50),
      content: text.trim().slice(0, 2000),
    });
    if (!error) {
      setText("");
      localStorage.setItem("commenter_name", name.trim());
      await load();
    }
    setBusy(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("commenter_name");
    if (saved) setName(saved);
  }, []);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        {t("comments.title")}{" "}
        <span className="text-gray-400 font-normal">({comments.length})</span>
      </h2>

      {comments.length === 0 && (
        <p className="text-gray-500 text-sm mb-4">{t("comments.empty")}</p>
      )}

      <ul className="space-y-3 mb-6">
        {comments.map((c) => (
          <li
            key={c.id}
            className="bg-white border border-[var(--ig-border)] rounded-xl p-4 flex gap-3 fade-up"
          >
            <div
              className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-bold ${avatarColor(
                c.author_name
              )}`}
              aria-hidden="true"
            >
              {c.author_name.trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-baseline gap-2 text-sm mb-1">
                <span className="font-semibold truncate">{c.author_name}</span>
                <span className="text-gray-400 text-xs shrink-0">
                  {new Date(c.created_at).toLocaleDateString(
                    lang === "uk" ? "uk-UA" : "en-GB"
                  )}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap break-words">
                {c.content}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("comments.name")}
          maxLength={50}
          required
          className="input-field"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("comments.text")}
          maxLength={2000}
          rows={3}
          required
          className="input-field resize-y"
        />
        <button type="submit" disabled={busy} className="btn-primary">
          {t("comments.send")}
        </button>
      </form>
    </section>
  );
}
