import { getSupabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { mergeWithBuiltin } from "@/lib/builtin-posts";
import MapPageClient from "@/components/MapPageClient";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true);

  return <MapPageClient posts={mergeWithBuiltin((data as Post[]) ?? [])} />;
}
