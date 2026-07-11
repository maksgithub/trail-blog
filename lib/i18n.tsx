"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "uk" | "en";

const dict = {
  uk: {
    "nav.home": "Стрічка",
    "nav.map": "Карта",
    "nav.about": "Про блог",
    "site.title": "Стежки й Маршрути",
    "site.handle": "stezhky.marshruty",
    "site.tagline": "Гори, велопригоди та кемпінги, які варто відвідати",
    "cat.all": "Усі",
    "cat.hike": "Похід у гори",
    "cat.bike": "Веломаршрут",
    "cat.camp": "Кемпінг",
    "cat.other": "Інше",
    "post.days": "дн.",
    "post.km": "км",
    "post.readMore": "Переглянути маршрут",
    "post.route": "Маршрут",
    "post.photos": "Фотографії",
    "likes.like": "Подобається",
    "likes.count": "вподобань",
    "comments.title": "Коментарі",
    "comments.count": "коментарів",
    "comments.view": "Переглянути коментарі",
    "comments.name": "Ваше ім'я",
    "comments.text": "Ваш коментар…",
    "comments.send": "Надіслати",
    "comments.empty": "Поки що немає коментарів. Будьте першими!",
    "share.copied": "Посилання скопійовано!",
    "map.title": "Усі маршрути на карті",
    "empty.posts": "Поки що немає опублікованих маршрутів.",
    "footer.text": "Створено з любов'ю до подорожей",
  },
  en: {
    "nav.home": "Feed",
    "nav.map": "Map",
    "nav.about": "About",
    "site.title": "Trails & Routes",
    "site.handle": "stezhky.marshruty",
    "site.tagline": "Mountains, bikepacking and campsites worth visiting",
    "cat.all": "All",
    "cat.hike": "Mountain hike",
    "cat.bike": "Bike route",
    "cat.camp": "Camping",
    "cat.other": "Other",
    "post.days": "days",
    "post.km": "km",
    "post.readMore": "View route",
    "post.route": "Route",
    "post.photos": "Photos",
    "likes.like": "Like",
    "likes.count": "likes",
    "comments.title": "Comments",
    "comments.count": "comments",
    "comments.view": "View comments",
    "comments.name": "Your name",
    "comments.text": "Your comment…",
    "comments.send": "Send",
    "comments.empty": "No comments yet. Be the first!",
    "share.copied": "Link copied!",
    "map.title": "All routes on the map",
    "empty.posts": "No published routes yet.",
    "footer.text": "Made with love for travel",
  },
} as const;

type DictKey = keyof (typeof dict)["uk"];

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
}

const Ctx = createContext<LangCtx>({
  lang: "uk",
  setLang: () => {},
  t: (k) => dict.uk[k],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uk");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "uk" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: DictKey) => dict[lang][key] ?? dict.uk[key];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

/** Pick localized field from a post: falls back to Ukrainian */
export function pick(lang: Lang, uk: string | null, en: string | null): string {
  return (lang === "en" ? en || uk : uk) ?? "";
}
