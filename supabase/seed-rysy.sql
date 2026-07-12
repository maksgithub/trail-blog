-- ============================================
-- Пост: Рисі (2499 м) за вікенд із Кракова громадським транспортом.
-- Виконати в Supabase Dashboard -> SQL Editor.
-- Повторний запуск безпечний (оновить пост за slug).
-- ============================================

insert into posts (
  id, slug, title_uk, title_en, excerpt_uk, excerpt_en,
  content_uk, content_en, category, days, distance_km,
  route, waypoints, photos, cover_url, published
) values (
  -- фіксований id: збігається з вбудованим постом у lib/builtin-posts.ts
  'e2c4d8f1-3a7b-4c9d-8e5f-1b2a3c4d5e6f',
  'rysy-weekend',
  'Рисі (2499 м) за вікенд: зі Словаччини на Закопане',
  'Rysy (2499 m) in a weekend: from Slovakia to Zakopane',
  'Найвища вершина Польщі за два дні: ніч над Попрадським плесом у Словаччині, траверс вершини й спуск через Морське Око до Закопаного.',
  'Poland''s highest peak in two days: a night above Popradské pleso in Slovakia, a summit traverse and a descent via Morskie Oko to Zakopane.',
  $uk$## Опис

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
- Рятувальники: TOPR (Польща) 601 100 300, HZS (Словаччина) 18 300.$uk$,
  $en$## About

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
- Mountain rescue: TOPR (Poland) 601 100 300, HZS (Slovakia) 18 300.$en$,
  'hike',
  2,
  21,
  '[[50.0679,19.9470],[49.8339,19.9401],[49.6089,19.9645],[49.4775,20.0324],[49.2969,19.9640],[49.2758,20.0432],[49.2657,20.1052],[49.2712,20.2585],[49.1850,20.3250],[49.0595,20.2977],[49.1050,20.1150],[49.1220,20.0575],[49.1350,20.0680],[49.1540,20.0810],[49.1650,20.0800],[49.1732,20.0836],[49.1747,20.0854],[49.1794,20.0881],[49.1806,20.0865],[49.1840,20.0820],[49.1858,20.0793],[49.1885,20.0770],[49.1975,20.0745],[49.2013,20.0704],[49.2100,20.0777],[49.2288,20.0888],[49.2450,20.0910],[49.2634,20.0872]]'::jsonb,
  '[
    {"lat":50.0679,"lng":19.9470,"title":"Краків, автовокзал MDA"},
    {"lat":49.2969,"lng":19.9640,"title":"Закопане — автобус на Попрад"},
    {"lat":49.0595,"lng":20.2977,"title":"Попрад — електричка TEŽ"},
    {"lat":49.1220,"lng":20.0575,"title":"Štrbské Pleso"},
    {"lat":49.1540,"lng":20.0810,"title":"Popradské pleso — ночівля"},
    {"lat":49.1732,"lng":20.0836,"title":"Chata pod Rysmi, 2250 м"},
    {"lat":49.1794,"lng":20.0881,"title":"Рисі, 2499 м"},
    {"lat":49.1885,"lng":20.0770,"title":"Czarny Staw pod Rysami"},
    {"lat":49.2013,"lng":20.0704,"title":"Схроніско Морське Око — обід"},
    {"lat":49.2634,"lng":20.0872,"title":"Palenica — бус до Закопаного"}
  ]'::jsonb,
  '[]'::jsonb,
  null,
  true
)
on conflict (slug) do update set
  title_uk = excluded.title_uk,
  title_en = excluded.title_en,
  excerpt_uk = excluded.excerpt_uk,
  excerpt_en = excluded.excerpt_en,
  content_uk = excluded.content_uk,
  content_en = excluded.content_en,
  category = excluded.category,
  days = excluded.days,
  distance_km = excluded.distance_km,
  route = excluded.route,
  waypoints = excluded.waypoints,
  published = excluded.published;
