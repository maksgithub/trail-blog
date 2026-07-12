import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { LatLng } from "@/lib/geo";
import { snapRoute, profileForCategory } from "@/lib/routing";

export const maxDuration = 60;

const SYSTEM_PROMPT = `Ти — досвідчений гід із гірських походів, велоподорожей та кемпінгу в Україні й Європі.
Користувач (автор блогу) дає коротку ідею маршруту. Згенеруй чернетку поста для блогу мандрів.

Поверни СТРОГО JSON-об'єкт (без markdown-обгортки) з полями:
{
  "title_uk": "назва українською",
  "title_en": "назва англійською",
  "excerpt_uk": "1-2 речення тизер українською",
  "excerpt_en": "1-2 sentence teaser in English",
  "content_uk": "повний текст поста українською в Markdown: ## Опис, ## Маршрут (по днях якщо багатоденний), ## Спорядження, ## Поради. 200-400 слів",
  "content_en": "the same post in English, Markdown",
  "category": "hike | bike | camp | other",
  "days": число днів (int),
  "route": [[lat, lng], ...] — 8-15 ОПОРНИХ точок маршруту в правильному порядку: старт, ключові повороти/перевали/вершини, фініш. Координати мають лежати на реальних стежках чи дорогах цього регіону або максимально близько до них (float, 4-6 знаків). Точки будуть автоматично з'єднані по реальних стежках,
  "waypoints": [{"lat": .., "lng": .., "title": "назва місця українською"}] — 2-5 ключових точок (вершини, озера, місця ночівлі, джерела води)
}

Координати мають відповідати реальній географії. Якщо регіон не вказано — обирай Українські Карпати.`;

const CATEGORIES = ["hike", "bike", "camp", "other"] as const;

function isValidLatLng(p: unknown): p is LatLng {
  return (
    Array.isArray(p) &&
    p.length === 2 &&
    typeof p[0] === "number" &&
    typeof p[1] === "number" &&
    Number.isFinite(p[0]) &&
    Number.isFinite(p[1]) &&
    p[0] >= -90 &&
    p[0] <= 90 &&
    p[1] >= -180 &&
    p[1] <= 180
  );
}

/** Gemini інколи загортає JSON у ```json … ``` попри responseMimeType */
function extractJson(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    // остання спроба: вирізати від першої { до останньої }
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY не налаштовано у Vercel" },
      { status: 500 }
    );
  }

  // тільки для залогіненого адміна
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  if (!user) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const { idea } = (await req.json()) as { idea?: string };
  if (!idea?.trim()) {
    return NextResponse.json({ error: "Опишіть ідею маршруту" }, { status: 400 });
  }

  let geminiRes: Response;
  try {
    geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: idea.slice(0, 2000) }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        }),
      }
    );
  } catch (e) {
    return NextResponse.json(
      { error: `Не вдалося з'єднатися з Gemini: ${(e as Error).message}` },
      { status: 502 }
    );
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    return NextResponse.json(
      { error: `Gemini API: ${geminiRes.status} ${errText.slice(0, 300)}` },
      { status: 502 }
    );
  }

  const data = await geminiRes.json();
  const parts: { text?: string }[] =
    data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => p.text ?? "").join("");
  if (!text) {
    return NextResponse.json(
      { error: "Порожня відповідь від Gemini" },
      { status: 502 }
    );
  }

  const raw = extractJson(text);
  if (!raw || typeof raw !== "object") {
    return NextResponse.json(
      { error: "Gemini повернув некоректний JSON, спробуйте ще раз" },
      { status: 502 }
    );
  }
  const parsed = raw as Record<string, unknown>;

  // санітизація полів, щоб у форму не потрапило сміття
  const category = CATEGORIES.includes(parsed.category as never)
    ? (parsed.category as string)
    : "hike";
  const days =
    typeof parsed.days === "number" && Number.isFinite(parsed.days)
      ? Math.max(1, Math.min(60, Math.round(parsed.days)))
      : null;
  const route = Array.isArray(parsed.route)
    ? (parsed.route.filter(isValidLatLng) as LatLng[])
    : [];
  const waypoints = Array.isArray(parsed.waypoints)
    ? parsed.waypoints.filter(
        (w: unknown): w is { lat: number; lng: number; title: string } =>
          typeof w === "object" &&
          w !== null &&
          isValidLatLng([
            (w as { lat: unknown }).lat,
            (w as { lng: unknown }).lng,
          ]) &&
          typeof (w as { title: unknown }).title === "string"
      )
    : [];

  // прокладаємо згенеровані опорні точки по реальних стежках (OSRM/OSM);
  // якщо роутинг недоступний — лишаємо точки Gemini як є
  let finalRoute: LatLng[] = route;
  let routeSnapped = false;
  if (route.length >= 2) {
    const snapped = await snapRoute(route, profileForCategory(category));
    if (snapped && snapped.length > 1) {
      finalRoute = snapped;
      routeSnapped = true;
    }
  }

  const str = (v: unknown) => (typeof v === "string" ? v : "");

  return NextResponse.json({
    title_uk: str(parsed.title_uk),
    title_en: str(parsed.title_en),
    excerpt_uk: str(parsed.excerpt_uk),
    excerpt_en: str(parsed.excerpt_en),
    content_uk: str(parsed.content_uk),
    content_en: str(parsed.content_en),
    category,
    days,
    route: finalRoute,
    waypoints,
    route_snapped: routeSnapped,
  });
}
