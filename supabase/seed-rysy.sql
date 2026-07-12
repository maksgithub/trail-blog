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
  'Рисі (2499 м) за вікенд: із Кракова громадським транспортом',
  'Rysy (2499 m) in a weekend: from Krakow by public transport',
  'Найвища вершина Польщі за два дні: п''ятничний виїзд із Кракова, ніч у схроніско над Морським Оком, сходження ланцюгами і повернення через Закопане.',
  'Poland''s highest peak in two days: Friday departure from Krakow, a night at the Morskie Oko hut, a chain-assisted ascent and return via Zakopane.',
  $uk$## Опис

**Рисі (Rysy, 2499 м)** — найвища вершина Польщі на кордоні зі Словаччиною, серце Високих Татр. Класичний вікенд-маршрут із Кракова повністю на громадському транспорті: виїзд у п'ятницю, ніч у легендарному схроніско над Морським Оком і сходження в суботу. Стежка маркована (червоний шлях), у верхній частині — ланцюги, тож потрібна суха погода і базова готовність до експонованих ділянок. Сезон — липень–вересень.

## План

**П'ятниця.** Автобус Краків (вокзал MDA) → Закопане, ~2 год (Szwagropol або FlixBus, квитки краще купити онлайн заздалегідь). Із закопанського вокзалу — бус до **Palenica Białczańska** (~40 хв, останній зазвичай ~17:00–18:00, перевір розклад!). Далі 8 км пішки асфальтованою Дорогою Бальцера до **Морського Ока** (~2 год, набір ~400 м). Ночівля в **Schronisko PTTK Morskie Oko** — бронювати за 2–3 місяці; запасний варіант — схроніско в долині Розтоки.

**Субота.** Вихід о 6:00 — на ланцюгах у вихідні черги. Морське Око → **Czarny Staw pod Rysami** (50 хв) → кам'янисте плече і ланцюгова ділянка → вершина **Рисі, 2499 м** (загалом 3.5–4 год від схроніска, набір ~1100 м). З вершини видно пів Татр, а сама вона стоїть на польсько-словацькому кордоні. Спуск тим самим шляхом до Palenica (~4 год), бус до Закопаного, прогулянка Крупувками і жентиця на вечерю, вечірній автобус до Кракова (~21:00–22:00, вдома опівночі).

## Чекліст

- [ ] Квитки на автобус Краків ⇄ Закопане
- [ ] Бронь ночівлі в Schronisko Morskie Oko (за 2–3 місяці!)
- [ ] Онлайн-квиток до Татшанського нацпарку (TPN)
- [ ] Паспорт або ID — вершина на кордоні зі Словаччиною
- [ ] Трекінгові черевики з фіксацією гомілки
- [ ] 2 л води + перекуси на день
- [ ] Дощовик і вітровка
- [ ] Шапка й рукавиці — на 2500 м холодно навіть улітку
- [ ] Налобний ліхтарик
- [ ] Готівка в злотих (схроніско, буси, нацпарк)
- [ ] Павербанк
- [ ] Аптечка + рятувальна ковдра
- [ ] Трекінгові палиці (опційно, на спуск)

## Поради

- Рисі — тільки в суху стабільну погоду: мокрі ланцюги небезпечні. Прогноз дивись за 2–3 дні.
- Немає місць у Морському Оці? Схроніско Roztoka додає ~1.5 год пішки в п'ятницю, але бронюється легше.
- Останній бус Palenica → Закопане ~19:00 — плануй спуск із запасом.
- Увечері в п'ятницю Морське Око майже порожнє — золота година для фото без натовпу.
- Номер рятувальників TOPR: 601 100 300.$uk$,
  $en$## About

**Rysy (2499 m)** is the highest peak of Poland, on the border with Slovakia in the heart of the High Tatras. A classic weekend route from Krakow entirely by public transport: leave on Friday, sleep at the legendary mountain hut above Morskie Oko and summit on Saturday. The trail is marked (red route) with chains in the upper section, so you need dry weather and basic comfort with exposed terrain. Season — July to September.

## Plan

**Friday.** Bus Krakow (MDA station) → Zakopane, ~2 h (Szwagropol or FlixBus, book online in advance). From Zakopane bus station take a minibus to **Palenica Białczańska** (~40 min, the last one usually leaves 17:00–18:00 — check the timetable!). Then walk 8 km up the paved Balzer Road to **Morskie Oko** (~2 h, ~400 m of gain). Overnight at **Schronisko PTTK Morskie Oko** — book 2–3 months ahead; fallback — the hut in the Roztoka valley.

**Saturday.** Start at 6:00 — the chains get crowded on weekends. Morskie Oko → **Czarny Staw pod Rysami** (50 min) → the rocky shoulder and chain section → the summit of **Rysy, 2499 m** (3.5–4 h from the hut, ~1100 m of gain). Half of the Tatras are visible from the top, which sits right on the Polish–Slovak border. Descend the same way to Palenica (~4 h), minibus to Zakopane, a stroll along Krupówki with żentyca for dinner, and the evening bus to Krakow (~21:00–22:00, home by midnight).

## Checklist

- [ ] Bus tickets Krakow ⇄ Zakopane
- [ ] Bed booked at Schronisko Morskie Oko (2–3 months ahead!)
- [ ] Online ticket for the Tatra National Park (TPN)
- [ ] Passport or ID — the summit is on the Slovak border
- [ ] Hiking boots with ankle support
- [ ] 2 L of water + day snacks
- [ ] Rain jacket and windbreaker
- [ ] Hat and gloves — it is cold at 2500 m even in summer
- [ ] Headlamp
- [ ] Polish złoty in cash (hut, minibuses, park entry)
- [ ] Power bank
- [ ] First-aid kit + emergency blanket
- [ ] Trekking poles (optional, for the descent)

## Tips

- Rysy only in dry, stable weather: wet chains are dangerous. Check the forecast 2–3 days ahead.
- No beds at Morskie Oko? The Roztoka hut adds ~1.5 h of walking on Friday but is easier to book.
- The last minibus Palenica → Zakopane leaves around 19:00 — plan the descent with a margin.
- On Friday evening Morskie Oko is nearly empty — golden hour for photos without the crowds.
- TOPR mountain rescue: 601 100 300.$en$,
  'hike',
  2,
  26,
  '[[50.0679,19.9470],[49.8339,19.9401],[49.6089,19.9645],[49.4775,20.0324],[49.3355,20.0069],[49.2969,19.9640],[49.2895,20.0150],[49.2758,20.0432],[49.2790,20.0900],[49.2657,20.1052],[49.2634,20.0872],[49.2450,20.0910],[49.2288,20.0888],[49.2100,20.0777],[49.2013,20.0704],[49.1975,20.0745],[49.1885,20.0770],[49.1858,20.0793],[49.1840,20.0820],[49.1806,20.0865],[49.1794,20.0881]]'::jsonb,
  '[
    {"lat":50.0679,"lng":19.9470,"title":"Краків, автовокзал MDA"},
    {"lat":49.2969,"lng":19.9640,"title":"Закопане — пересадка на бус"},
    {"lat":49.2634,"lng":20.0872,"title":"Palenica Białczańska — вхід у нацпарк"},
    {"lat":49.2013,"lng":20.0704,"title":"Схроніско Морське Око — ночівля"},
    {"lat":49.1885,"lng":20.0770,"title":"Czarny Staw pod Rysami"},
    {"lat":49.1794,"lng":20.0881,"title":"Рисі, 2499 м"}
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
