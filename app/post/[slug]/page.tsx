import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { findBuiltinPost } from "@/lib/builtin-posts";
import PostView from "@/components/PostView";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  const post = (data as Post | null) ?? findBuiltinPost(slug);
  if (!post) notFound();
  return <PostView post={post} />;
}
