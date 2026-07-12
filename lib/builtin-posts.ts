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

const RYSY_CONTENT_UK = `## Опис

**Рисі (Rysy, 2499 м)** — найвища вершина Польщі на кордоні зі Словаччиною, серце Високих Татр. Класичний вікенд-траверс повністю на громадському транспорті: у п'ятницю зі Словаччини — електричкою до Штрбського Плеса й ночівля над Попрадським плесом, у суботу — вершина і спуск польським боком через Морське Око до Закопаного. Стежка маркована (червоний шлях), у верхній частині — ланцюги, тож потрібна суха погода і базова готовність до експонованих ділянок. Сезон — липень–вересень.

## План

**П'ятниця.** Автобус Краків (вокзал MDA) → Закопане, ~2 год (Szwagropol або FlixBus). Далі автобус Закопане → Попрад через Ждяр (~2 год, є й прямі рейси Краків → Попрад). У Попраді пересадка на зубчасту електричку **TEŽ** до курорту **Štrbské Pleso** (~40 хв). Звідти легка стежка (~1.25 год) до **Popradské pleso** — ночівля в гірському готелі над озером (бронювати заздалегідь; запасний варіант — готелі на Штрбському Плесі й ранковий вихід).

**Субота — траверс у Польщу.** Вихід о 6:00. Popradské pleso → Жаб'ї плеса Мєнгусовської долини → **Chata pod Rysmi** (2250 м, найвище розташована хатина Татр — чай, який шерпи заносять на плечах) → сідло Ваги → вершина **Рисі, 2499 м** (~4 год від озера, набір ~1000 м). Вершина стоїть просто на словацько-польському кордоні — переходимо на польський бік: спуск ланцюговою ділянкою до **Czarny Staw pod Rysami**, далі до **Морського Ока** (обід у схроніско PTTK), і 8 км Дорогою Бальцера до **Palenica Białczańska**. Бус до **Закопаного** (~40 хв), прогулянка Крупувками з жентицею — і вечірній автобус до Кракова (вдома близько опівночі).

## Чекліст

- [ ] Квитки на автобус Краків ⇄ Закопане
- [ ] Бронь ночівлі над Popradské pleso (гірський готель)
- [ ] Онлайн-квиток до Татшанського нацпарку (TPN)
- [ ] Паспорт або ID — вершина на кордоні зі Словаччиною
- [ ] Трекінгові черевики з фіксацією гомілки
- [ ] 2 л води + перекуси на день
- [ ] Дощовик і вітровка
- [ ] Шапка й рукавиці — на 2500 м холодно навіть улітку
- [ ] Налобний ліхтарик
- [ ] Готівка в злотих (схроніско, буси, нацпарк)
- [ ] Євро або картка — словацький бік (TEŽ, автобус, хатина)
- [ ] Павербанк
- [ ] Аптечка + рятувальна ковдра
- [ ] Трекінгові палиці (опційно, на спуск)

## Поради

- Рисі — тільки в суху стабільну погоду: мокрі ланцюги небезпечні. Прогноз дивись за 2–3 дні.
- Словацький бік крутіший, зате коротший — на підйом він зручніший за довгий польський траверс.
- Перехід кордону на вершині легальний (Шенген), але паспорт/ID обов'язковий.
- Немає місць над Попрадським плесом? Ночуй на Штрбському Плесі й виходь на годину раніше.
- Останній бус Palenica → Закопане ~19:00, автобуси Закопане → Краків ходять до ~22:00 — плануй спуск із запасом.
- Вечір над Попрадським плесом — одне з найкрасивіших місць Татр; прийди до заходу сонця.
- Рятувальники: TOPR (Польща) 601 100 300, HZS (Словаччина) 18 300.`;

const RYSY_CONTENT_EN = `## About

**Rysy (2499 m)** is the highest peak of Poland, on the border with Slovakia in the heart of the High Tatras. A classic weekend traverse entirely by public transport: on Friday from Slovakia — the rack railway to Štrbské Pleso and a night above Popradské pleso; on Saturday the summit and a descent on the Polish side via Morskie Oko to Zakopane. The trail is marked (red route) with chains in the upper section, so you need dry weather and basic comfort with exposed terrain. Season — July to September.

## Plan

**Friday.** Bus Krakow (MDA station) → Zakopane, ~2 h (Szwagropol or FlixBus). Then a bus Zakopane → Poprad via Ždiar (~2 h; direct Krakow → Poprad buses exist too). In Poprad change to the **TEŽ** rack railway to the **Štrbské Pleso** resort (~40 min). From there an easy trail (~1.25 h) leads to **Popradské pleso** — overnight at the mountain hotel above the lake (book ahead; fallback — hotels at Štrbské Pleso and an early start).

**Saturday — the traverse into Poland.** Start at 6:00. Popradské pleso → the Žabie tarns of the Mengusovská valley → **Chata pod Rysmi** (2250 m, the highest hut in the Tatras — tea carried up by sherpas) → the Váha saddle → the summit of **Rysy, 2499 m** (~4 h from the lake, ~1000 m of gain). The summit sits right on the Slovak–Polish border — cross to the Polish side: descend the chain section to **Czarny Staw pod Rysami**, on to **Morskie Oko** (lunch at the PTTK hut), then 8 km down the Balzer Road to **Palenica Białczańska**. Minibus to **Zakopane** (~40 min), a stroll along Krupówki with żentyca — and the evening bus to Krakow (home around midnight).

## Checklist

- [ ] Bus tickets Krakow ⇄ Zakopane
- [ ] Bed booked above Popradské pleso (mountain hotel)
- [ ] Online ticket for the Tatra National Park (TPN)
- [ ] Passport or ID — the summit is on the Slovak border
- [ ] Hiking boots with ankle support
- [ ] 2 L of water + day snacks
- [ ] Rain jacket and windbreaker
- [ ] Hat and gloves — it is cold at 2500 m even in summer
- [ ] Headlamp
- [ ] Polish złoty in cash (hut, minibuses, park entry)
- [ ] Euros or a card — the Slovak side (TEŽ, bus, hut)
- [ ] Power bank
- [ ] First-aid kit + emergency blanket
- [ ] Trekking poles (optional, for the descent)

## Tips

- Rysy only in dry, stable weather: wet chains are dangerous. Check the forecast 2–3 days ahead.
- The Slovak side is steeper but shorter — better for the ascent than the long Polish traverse.
- Crossing the border on the summit is legal (Schengen), but carry your passport/ID.
- No beds above Popradské pleso? Sleep at Štrbské Pleso and start an hour earlier.
- The last minibus Palenica → Zakopane leaves ~19:00 and Zakopane → Krakow buses run until ~22:00 — plan the descent with a margin.
- The evening above Popradské pleso is one of the prettiest spots in the Tatras — arrive before sunset.
- Mountain rescue: TOPR (Poland) 601 100 300, HZS (Slovakia) 18 300.`;

export const BUILTIN_POSTS: Post[] = [
  {
    // той самий id, що й у supabase/seed-rysy.sql
    id: "e2c4d8f1-3a7b-4c9d-8e5f-1b2a3c4d5e6f",
    slug: "rysy-weekend",
    title_uk: "Рисі (2499 м) за вікенд: зі Словаччини на Закопане",
    title_en: "Rysy (2499 m) in a weekend: from Slovakia to Zakopane",
    excerpt_uk:
      "Найвища вершина Польщі за два дні: ніч над Попрадським плесом у Словаччині, траверс вершини й спуск через Морське Око до Закопаного.",
    excerpt_en:
      "Poland's highest peak in two days: a night above Popradské pleso in Slovakia, a summit traverse and a descent via Morskie Oko to Zakopane.",
    content_uk: RYSY_CONTENT_UK,
    content_en: RYSY_CONTENT_EN,
    category: "hike",
    days: 2,
    distance_km: 21,
    route: [
      [50.0679, 19.947],
      [49.8339, 19.9401],
      [49.6089, 19.9645],
      [49.4775, 20.0324],
      [49.2969, 19.964],
      [49.2758, 20.0432],
      [49.2657, 20.1052],
      [49.2712, 20.2585],
      [49.185, 20.325],
      [49.0595, 20.2977],
      [49.105, 20.115],
      [49.122, 20.0575],
      [49.135, 20.068],
      [49.154, 20.081],
      [49.165, 20.08],
      [49.1732, 20.0836],
      [49.1747, 20.0854],
      [49.1794, 20.0881],
      [49.1806, 20.0865],
      [49.184, 20.082],
      [49.1858, 20.0793],
      [49.1885, 20.077],
      [49.1975, 20.0745],
      [49.2013, 20.0704],
      [49.21, 20.0777],
      [49.2288, 20.0888],
      [49.245, 20.091],
      [49.2634, 20.0872],
    ],
    waypoints: [
      { lat: 50.0679, lng: 19.947, title: "Краків, автовокзал MDA" },
      { lat: 49.2969, lng: 19.964, title: "Закопане — автобус на Попрад" },
      { lat: 49.0595, lng: 20.2977, title: "Попрад — електричка TEŽ" },
      { lat: 49.122, lng: 20.0575, title: "Štrbské Pleso" },
      { lat: 49.154, lng: 20.081, title: "Popradské pleso — ночівля" },
      { lat: 49.1732, lng: 20.0836, title: "Chata pod Rysmi, 2250 м" },
      { lat: 49.1794, lng: 20.0881, title: "Рисі, 2499 м" },
      { lat: 49.1885, lng: 20.077, title: "Czarny Staw pod Rysami" },
      { lat: 49.2013, lng: 20.0704, title: "Схроніско Морське Око — обід" },
      { lat: 49.2634, lng: 20.0872, title: "Palenica — бус до Закопаного" },
    ],
    photos: [],
    cover_url: null,
    published: true,
    created_at: "2026-07-12T11:00:00Z",
  },
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
