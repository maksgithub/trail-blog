import type { Post } from "@/lib/types";

/**
 * Вбудовані пости: показуються на сайті навіть без рядка в базі даних.
 * Коли в Supabase з'являється пост із таким самим slug (див.
 * supabase/seed-camping-jungfrau.sql), пріоритет має версія з бази —
 * тоді працюють лайки й коментарі, а пост можна редагувати в адмінці.
 */

const JUNGFRAU_CONTENT_UK = `## Опис

**Camping Jungfrau Holiday Park** — легендарний кемпінг у кінці долини Лаутербруннен, просто під стіною водоспаду Штауббах. З намету видно засніжені вершини Юнгфрау, Мьонха та Айґера. На території — магазин, ресторан, кухня, пральня, дитячий майданчик і Wi-Fi; працює цілий рік. Орієнтовна ціна — від 18 CHF за дорослого плюс місце під намет. Влітку обов'язково бронюйте заздалегідь.

## План поїздки з Кракова

Автомобілем ≈ 1350 км, найзручніше розбити на 5 днів:

**День 1.** Краків → Нюрнберг (≈ 900 км, 9–10 год): А4 через Катовіце, далі Острава — Брно — Прага — Пльзень. Ночівля в Нюрнберзі або околицях.

**День 2.** Нюрнберг → Лаутербруннен (≈ 550 км, 6 год): Штутгарт — Цюрих — Берн — Інтерлакен. По обіді ставимо намет, вечірня прогулянка до водоспаду Штауббах (15 хв пішки).

**День 3.** Долина водоспадів: Штауббах, далі Трюммельбах — 10 льодовикових водоспадів усередині скелі (вхід платний). Пікнік на лузі, велопрогулянка до Штехельберга.

**День 4.** У гори: або Юнгфрауйох «Top of Europe» (дорого, від ~100 CHF зі знижками), або бюджетніша альтернатива — канатка на Ґрютчальп, панорамна стежка до Мюррена і Шильтгорн.

**День 5.** Повернення до Кракова — за один довгий день або з проміжною ночівлею.

## Чекліст

- [ ] Паспорти + туристична страховка (Шенген)
- [ ] Права, техпаспорт, зелена карта на авто
- [ ] Віньєтки: Чехія (купується онлайн), Швейцарія (40 CHF)
- [ ] Намет, кілочки, тент від дощу
- [ ] Спальники з комфортом 0…+5 °C — ночі в долині холодні
- [ ] Каремати
- [ ] Пальник, газовий балон, казанок, посуд
- [ ] Ліхтарики + павербанк
- [ ] Адаптер для швейцарських розеток (тип J)
- [ ] Дощовики і теплий одяг
- [ ] Трекінгове взуття
- [ ] Готівка у франках + банківська картка
- [ ] Аптечка
- [ ] Продукти на перший вечір

## Поради

- Ціни в Швейцарії високі — закупіться в німецьких супермаркетах дорогою або в Coop/Migros в Інтерлакені.
- Через Німеччину автобани безплатні, тож маршрут через Нюрнберг і Штутгарт вигідніший за австрійський.
- У долині часто дощить навіть улітку — водоспади від цього лише гарнішають, але тент обов'язковий.
- Тихі години в кемпінгу з 22:00 — сусіди тут висипаються перед горами.`;

const JUNGFRAU_CONTENT_EN = `## About

**Camping Jungfrau Holiday Park** is a legendary campsite at the end of the Lauterbrunnen valley, right under the Staubbach falls. From your tent you can see the snowy peaks of the Jungfrau, Mönch and Eiger. On site: a shop, restaurant, kitchen, laundry, playground and Wi-Fi; open year round. Approximate price — from CHF 18 per adult plus a pitch. Book well ahead in summer.

## Trip plan from Krakow

By car ≈ 1350 km, best split into 5 days:

**Day 1.** Krakow → Nuremberg (≈ 900 km, 9–10 h): A4 via Katowice, then Ostrava — Brno — Prague — Pilsen. Overnight in or near Nuremberg.

**Day 2.** Nuremberg → Lauterbrunnen (≈ 550 km, 6 h): Stuttgart — Zurich — Bern — Interlaken. Pitch the tent in the afternoon, evening walk to the Staubbach falls (15 min on foot).

**Day 3.** Valley of waterfalls: Staubbach, then Trümmelbach — ten glacial waterfalls inside the rock (paid entry). Picnic on the meadow, bike ride to Stechelberg.

**Day 4.** Into the mountains: either Jungfraujoch "Top of Europe" (pricey, from ~CHF 100 with discounts) or the budget alternative — the Grütschalp cable car, the panorama trail to Mürren and the Schilthorn.

**Day 5.** Return to Krakow — in one long day or with an overnight stop.

## Checklist

- [ ] Passports + travel insurance (Schengen)
- [ ] Driving licence, car documents, green card
- [ ] Vignettes: Czechia (bought online), Switzerland (CHF 40)
- [ ] Tent, pegs, rain tarp
- [ ] Sleeping bags rated 0…+5 °C — valley nights are cold
- [ ] Sleeping pads
- [ ] Stove, gas canister, pot, utensils
- [ ] Headlamps + power bank
- [ ] Adapter for Swiss sockets (type J)
- [ ] Rain jackets and warm layers
- [ ] Hiking boots
- [ ] Swiss francs in cash + bank card
- [ ] First-aid kit
- [ ] Food for the first evening

## Tips

- Switzerland is expensive — stock up in German supermarkets on the way or at Coop/Migros in Interlaken.
- German autobahns are toll-free, so the route via Nuremberg and Stuttgart beats the Austrian one.
- It often rains in the valley even in summer — the waterfalls only get prettier, but a tarp is a must.
- Quiet hours from 22:00 — your neighbours are resting before the mountains.`;

export const BUILTIN_POSTS: Post[] = [
  {
    // той самий id, що й у supabase/seed-camping-jungfrau.sql
    id: "b7e6a3d0-91c4-4f5a-8f2e-6c1d2a9b4e77",
    slug: "camping-jungfrau",
    title_uk: "Кемпінг Camping Jungfrau у долині Лаутербруннен",
    title_en: "Camping Jungfrau in the Lauterbrunnen valley",
    excerpt_uk:
      "Кемпінг біля підніжжя Юнгфрау серед 72 водоспадів долини Лаутербруннен — з планом автоподорожі з Кракова та чеклістом спорядження.",
    excerpt_en:
      "A campsite at the foot of the Jungfrau among the 72 waterfalls of the Lauterbrunnen valley — with a road-trip plan from Krakow and a packing checklist.",
    content_uk: JUNGFRAU_CONTENT_UK,
    content_en: JUNGFRAU_CONTENT_EN,
    category: "camp",
    days: 5,
    distance_km: 1350,
    route: [
      [50.0647, 19.945],
      [50.2649, 19.0238],
      [49.8209, 18.2625],
      [49.5938, 17.2509],
      [49.1951, 16.6068],
      [49.3961, 15.5912],
      [50.0755, 14.4378],
      [49.7384, 13.3736],
      [49.4521, 11.0767],
      [48.7758, 9.1829],
      [47.3769, 8.5417],
      [46.948, 7.4474],
      [46.758, 7.628],
      [46.6863, 7.8632],
      [46.5877, 7.9036],
    ],
    waypoints: [
      { lat: 46.5877, lng: 7.9036, title: "Кемпінг Camping Jungfrau" },
      { lat: 49.4521, lng: 11.0767, title: "Нюрнберг — ночівля дорогою" },
      { lat: 46.5936, lng: 7.9059, title: "Водоспад Штауббах" },
      { lat: 46.5703, lng: 7.9155, title: "Водоспади Трюммельбах" },
      { lat: 46.6863, lng: 7.8632, title: "Інтерлакен" },
    ],
    photos: [],
    cover_url: null,
    published: true,
    created_at: "2026-07-12T09:00:00Z",
  },
];

/** Об'єднує пости з бази із вбудованими: база має пріоритет за slug */
export function mergeWithBuiltin(dbPosts: Post[]): Post[] {
  const slugs = new Set(dbPosts.map((p) => p.slug));
  const extra = BUILTIN_POSTS.filter((p) => !slugs.has(p.slug));
  return [...dbPosts, ...extra].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function findBuiltinPost(slug: string): Post | undefined {
  return BUILTIN_POSTS.find((p) => p.slug === slug);
}
