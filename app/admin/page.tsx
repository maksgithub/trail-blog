"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { getSupabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";

function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);

  const load = async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as Post[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const togglePublish = async (post: Post) => {
    const supabase = getSupabase();
    await supabase
      .from("posts")
      .update({ published: !post.published })
      .eq("id", post.id);
    load();
  };

  const remove = async (post: Post) => {
    if (!confirm(`Видалити «${post.title_uk}»? Це незворотно.`)) return;
    const supabase = getSupabase();
    await supabase.from("posts").delete().eq("id", post.id);
    load();
  };

  const logout = async () => {
    await getSupabase().auth.signOut();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Панель адміна</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/new"
            className="bg-[var(--forest)] text-white px-4 py-2 rounded-lg hover:bg-[var(--forest-dark)]"
          >
            + Новий маршрут
          </Link>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            Вийти
          </button>
        </div>
      </div>

      {posts.length === 0 && (
        <p className="text-gray-500">Постів ще немає. Створіть перший!</p>
      )}

      <ul className="space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between gap-4 flex-wrap"
          >
            <div>
              <div className="font-semibold">{post.title_uk}</div>
              <div className="text-xs text-gray-500">
                /{post.slug} ·{" "}
                {new Date(post.created_at).toLocaleDateString("uk-UA")}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <button
                onClick={() => togglePublish(post)}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  post.published
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {post.published ? "✅ Опубліковано" : "📝 Чернетка"}
              </button>
              <Link
                href={`/admin/edit/${post.id}`}
                className="text-[var(--forest)] hover:underline"
              >
                Редагувати
              </Link>
              <button
                onClick={() => remove(post)}
                className="text-red-600 hover:underline cursor-pointer"
              >
                Видалити
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <Dashboard />
    </AdminGuard>
  );
}
