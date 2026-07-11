"use client";

import { use, useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import PostForm from "@/components/PostForm";
import { getSupabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";

function Editor({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getSupabase()
      .from("posts")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setPost(data as Post);
        else setNotFound(true);
      });
  }, [id]);

  if (notFound) return <p className="text-center py-16">Пост не знайдено</p>;
  if (!post)
    return <p className="text-center py-16 text-gray-500">Завантаження…</p>;
  return <PostForm post={post} />;
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AdminGuard>
      <Editor id={id} />
    </AdminGuard>
  );
}
