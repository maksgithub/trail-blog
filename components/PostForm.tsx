"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { Category, Photo, Post, Waypoint } from "@/lib/types";
import RouteEditor from "@/components/RouteEditor";
import { LatLng, routeDistanceKm } from "@/lib/geo";

const CATS: { value: Category; label: string }[] = [
  { value: "hike", label: "⛰️ Похід у гори" },
  { value: "bike", label: "🚴 Веломаршрут / байкпакінг" },
  { value: "camp", label: "⛺ Кемпінг" },
  { value: "other", label: "🧭 Інше" },
];

function slugify(s: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie",
    ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l",
    м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "",
    ю: "iu", я: "ia",
  };
  return s
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);

  const [titleUk, setTitleUk] = useState(post?.title_uk ?? "");
  const [titleEn, setTitleEn] = useState(post?.title_en ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerptUk, setExcerptUk] = useState(post?.excerpt_uk ?? "");
  const [excerptEn, setExcerptEn] = useState(post?.excerpt_en ?? "");
  const [contentUk, setContentUk] = useState(post?.content_uk ?? "");
  const [contentEn, setContentEn] = useState(post?.content_en ?? "");
  const [category, setCategory] = useState<Category>(post?.category ?? "hike");
  const [days, setDays] = useState<string>(post?.days?.toString() ?? "");
  const [route, setRoute] = useState<LatLng[]>(post?.route ?? []);
  const [waypoints, setWaypoints] = useState<Waypoint[]>(post?.waypoints ?? []);
  const [photos, setPhotos] = useState<Photo[]>(post?.photos ?? []);
  const [coverUrl, setCoverUrl] = useState(post?.cover_url ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [tab, setTab] = useState<"uk" | "en">("uk");
  const [aiIdea, setAiIdea] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiNotice, setAiNotice] = useState("");

  const runAi = async () => {
    if (!aiIdea.trim() || aiBusy) return;
    setAiBusy(true);
    setError("");
    setAiNotice("");
    try {
      const { data } = await getSupabase().auth.getSession();
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session?.access_token ?? ""}`,
        },
        body: JSON.stringify({ idea: aiIdea }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? "Помилка AI-асистента");
      } else {
        if (result.title_uk) {
          setTitleUk(result.title_uk);
          setSlug(slugify(result.title_uk));
        }
        if (result.title_en) setTitleEn(result.title_en);
        if (result.excerpt_uk) setExcerptUk(result.excerpt_uk);
        if (result.excerpt_en) setExcerptEn(result.excerpt_en);
        if (result.content_uk) setContentUk(result.content_uk);
        if (result.content_en) setContentEn(result.content_en);
        if (["hike", "bike", "camp", "other"].includes(result.category))
          setCategory(result.category);
        if (result.days) setDays(String(result.days));
        if (Array.isArray(result.route) && result.route.length > 1)
          setRoute(
            result.route.filter(
              (p: unknown): p is LatLng =>
                Array.isArray(p) &&
                p.length === 2 &&
                typeof p[0] === "number" &&
                typeof p[1] === "number"
            )
          );
        if (Array.isArray(result.waypoints))
          setWaypoints(
            result.waypoints.filter(
              (w: Waypoint) =>
                typeof w?.lat === "number" &&
                typeof w?.lng === "number" &&
                typeof w?.title === "string"
            )
          );
        if (Array.isArray(result.route) && result.route.length > 1) {
          setAiNotice(
            result.route_snapped
              ? "✅ Чернетку згенеровано, маршрут прокладено по реальних стежках. Перевір і підправ на карті."
              : "⚠️ Чернетку згенеровано, але маршрут приблизний (роутинг недоступний). Скористайся кнопкою «Вирівняти по стежках» на карті."
          );
        } else {
          setAiNotice("✅ Чернетку згенеровано. Домалюй маршрут на карті нижче.");
        }
      }
    } catch (e) {
      setError(`Помилка AI-асистента: ${(e as Error).message}`);
    }
    setAiBusy(false);
  };

  const uploadFiles = async (files: FileList, asCover: boolean) => {
    setUploadBusy(true);
    setError("");
    const supabase = getSupabase();
    try {
      for (const file of Array.from(files)) {
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        const { error } = await supabase.storage
          .from("photos")
          .upload(path, file, { cacheControl: "31536000" });
        if (error) throw error;
        const { data } = supabase.storage.from("photos").getPublicUrl(path);
        if (asCover) setCoverUrl(data.publicUrl);
        else setPhotos((p) => [...p, { url: data.publicUrl }]);
      }
    } catch (e) {
      setError(`Помилка завантаження фото: ${(e as Error).message}`);
    }
    setUploadBusy(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const supabase = getSupabase();
    const payload = {
      slug: slug || slugify(titleUk),
      title_uk: titleUk,
      title_en: titleEn || null,
      excerpt_uk: excerptUk || null,
      excerpt_en: excerptEn || null,
      content_uk: contentUk || null,
      content_en: contentEn || null,
      category,
      days: days ? parseInt(days) : null,
      distance_km: route.length > 1 ? routeDistanceKm(route) : null,
      route: route.length > 0 ? route : null,
      waypoints: waypoints.length > 0 ? waypoints : null,
      photos,
      cover_url: coverUrl || null,
      published,
    };

    const { error } = post
      ? await supabase.from("posts").update(payload).eq("id", post.id)
      : await supabase.from("posts").insert(payload);

    if (error) {
      setError(`Помилка збереження: ${error.message}`);
      setSaving(false);
      return;
    }
    router.push("/admin");
  };

  const input =
    "w-full border border-gray-300 rounded-lg px-3 py-2 bg-white";

  return (
    <form onSubmit={save} className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">
        {post ? "Редагувати маршрут" : "Новий маршрут"}
      </h1>

      {/* AI-асистент */}
      <section className="rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 p-4 space-y-3">
        <h2 className="font-semibold flex items-center gap-2">
          ✨ AI-асистент
          <span className="text-xs font-normal text-gray-500">
            опиши ідею — отримаєш назву, тексти обома мовами й маршрут на карті
          </span>
        </h2>
        <textarea
          value={aiIdea}
          onChange={(e) => setAiIdea(e.target.value)}
          placeholder="Напр.: «Триденний похід Чорногорським хребтом від Заросляка до Попа Івана, з ночівлями біля озер» або «Веломаршрут на вихідні навколо Синевиру»"
          rows={3}
          className={`${"w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"}`}
        />
        <button
          type="button"
          onClick={runAi}
          disabled={aiBusy || !aiIdea.trim()}
          className="bg-violet-600 text-white px-5 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
        >
          {aiBusy ? "🪄 Генерую… (до 30 сек)" : "✨ Згенерувати чернетку"}
        </button>
        {aiNotice && <p className="text-sm">{aiNotice}</p>}
        <p className="text-xs text-gray-500">
          Опорні точки від AI автоматично прокладаються по реальних стежках і
          дорогах OpenStreetMap — але обов&apos;язково перевір результат на
          карті нижче. Все згенероване можна редагувати.
        </p>
      </section>

      {/* Мовні вкладки */}
      <div className="flex gap-2">
        {(["uk", "en"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setTab(l)}
            className={`px-4 py-1.5 rounded-full text-sm cursor-pointer ${
              tab === l ? "bg-[var(--forest)] text-white" : "bg-gray-200"
            }`}
          >
            {l === "uk" ? "🇺🇦 Українська" : "🇬🇧 English"}
          </button>
        ))}
      </div>

      {tab === "uk" ? (
        <div className="space-y-3">
          <input
            value={titleUk}
            onChange={(e) => setTitleUk(e.target.value)}
            placeholder="Назва (українською) *"
            required
            className={input}
          />
          <input
            value={excerptUk}
            onChange={(e) => setExcerptUk(e.target.value)}
            placeholder="Короткий опис для картки"
            className={input}
          />
          <textarea
            value={contentUk}
            onChange={(e) => setContentUk(e.target.value)}
            placeholder="Текст поста (підтримується Markdown: ## заголовки, **жирний**, списки…)"
            rows={12}
            className={input}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="Title (English, optional)"
            className={input}
          />
          <input
            value={excerptEn}
            onChange={(e) => setExcerptEn(e.target.value)}
            placeholder="Short excerpt"
            className={input}
          />
          <textarea
            value={contentEn}
            onChange={(e) => setContentEn(e.target.value)}
            placeholder="Post content (Markdown supported)"
            rows={12}
            className={input}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className={input}
        >
          {CATS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="Кількість днів"
          className={input}
        />
        <input
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder={`URL: ${slugify(titleUk) || "avto-slug"}`}
          className={input}
        />
      </div>

      <section>
        <h2 className="font-semibold mb-2">Маршрут на карті</h2>
        <RouteEditor
          route={route}
          waypoints={waypoints}
          category={category}
          onRouteChange={setRoute}
          onWaypointsChange={setWaypoints}
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Фотографії</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <label className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer text-sm">
            🖼️ Обкладинка
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && uploadFiles(e.target.files, true)}
            />
          </label>
          <label className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer text-sm">
            📷 Додати фото (можна кілька)
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && uploadFiles(e.target.files, false)}
            />
          </label>
          {uploadBusy && <span className="text-sm text-gray-500">Завантаження…</span>}
        </div>

        {coverUrl && (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="cover" className="h-28 rounded-lg shadow" />
            <button
              type="button"
              onClick={() => setCoverUrl("")}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs cursor-pointer"
            >
              ✕
            </button>
            <div className="text-xs text-gray-500 mt-1">Обкладинка</div>
          </div>
        )}

        {photos.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {photos.map((ph, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.url} alt="" className="h-24 rounded-lg shadow" />
                <button
                  type="button"
                  onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4"
        />
        <span>Опублікувати (видно всім відвідувачам)</span>
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploadBusy}
          className="bg-[var(--forest)] text-white px-6 py-2.5 rounded-lg hover:bg-[var(--forest-dark)] disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Збереження…" : "Зберегти"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-2.5 rounded-lg bg-gray-200 cursor-pointer"
        >
          Скасувати
        </button>
      </div>
    </form>
  );
}
