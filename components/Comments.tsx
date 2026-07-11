"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Comment } from "@/lib/types";
import { useLang } from "@/lib/i18n";

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
        {t("comments.title")} ({comments.length})
      </h2>

      {comments.length === 0 && (
        <p className="text-gray-500 text-sm mb-4">{t("comments.empty")}</p>
      )}

      <ul className="space-y-4 mb-6">
        {comments.map((c) => (
          <li key={c.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">{c.author_name}</span>
              <span className="text-gray-400">
                {new Date(c.created_at).toLocaleDateString(
                  lang === "uk" ? "uk-UA" : "en-GB"
                )}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{c.content}</p>
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("comments.text")}
          maxLength={2000}
          rows={3}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
        />
        <button
          type="submit"
          disabled={busy}
          className="bg-[var(--forest)] text-white px-5 py-2 rounded-lg hover:bg-[var(--forest-dark)] disabled:opacity-50 cursor-pointer"
        >
          {t("comments.send")}
        </button>
      </form>
    </section>
  );
}
