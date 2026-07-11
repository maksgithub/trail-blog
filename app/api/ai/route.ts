import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  "route": [[lat, lng], ...] — 10-25 точок полілінії маршруту з РЕАЛІСТИЧНИМИ координатами вздовж реальних стежок/доріг цього регіону (float, 4-6 знаків),
  "waypoints": [{"lat": .., "lng": .., "title": "назва місця українською"}] — 2-5 ключових точок (вершини, озера, місця ночівлі, джерела води)
}

Координати мають відповідати реальній географії. Якщо регіон не вказано — обирай Українські Карпати.`;

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

  const geminiRes = await fetch(
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

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    return NextResponse.json(
      { error: `Gemini API: ${geminiRes.status} ${errText.slice(0, 300)}` },
      { status: 502 }
    );
  }

  const data = await geminiRes.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return NextResponse.json(
      { error: "Порожня відповідь від Gemini" },
      { status: 502 }
    );
  }

  try {
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Gemini повернув некоректний JSON, спробуйте ще раз" },
      { status: 502 }
    );
  }
}
