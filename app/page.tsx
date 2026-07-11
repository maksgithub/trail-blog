import { getSupabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import PostList from "@/components/PostList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return <PostList posts={(data as Post[]) ?? []} />;
}
