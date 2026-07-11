# ⛰️ Стежки й Маршрути — Trail Blog

Блог про місця, які варто відвідати: гірські походи, веломаршрути з байкпакінгом, кемпінги.

## Стек

- **Next.js 15** (App Router, TypeScript) — фронтенд і сторінки
- **Vercel** — безплатний хостинг (`*.vercel.app`, домен не потрібен)
- **Supabase** — безплатна база даних (Postgres), авторизація адміна, зберігання фото
- **Leaflet + OpenStreetMap** — безплатні карти без API-ключів
- **Tailwind CSS 4** — стилі

## Можливості

- 🗺️ Малювання маршруту кліками по карті + завантаження GPX (Strava/Garmin/Komoot)
- 📍 Локації-маркери з назвами та фото
- 📷 Завантаження фотографій (обкладинка + галерея)
- 🇺🇦/🇬🇧 Двомовний інтерфейс (українська + англійська)
- ❤️ Лайки без реєстрації · 💬 Коментарі без реєстрації
- 🔐 Адмін-панель: `/admin` (створення, редагування, публікація, видалення)
- 📏 Автоматичний підрахунок дистанції маршруту

## Налаштування (один раз)

### 1. Supabase

1. Створіть проєкт на [supabase.com](https://supabase.com) (безплатний тариф).
2. У **SQL Editor** виконайте вміст файлу `supabase/schema.sql`.
3. У **Authentication → Users** створіть користувача-адміна (email + пароль).
4. У **Authentication → Sign In / Up** вимкніть "Allow new users to sign up".
5. Скопіюйте з **Project Settings → API**: `Project URL` і `anon public` ключ.

### 2. Vercel

1. Імпортуйте цей GitHub-репозиторій на [vercel.com](https://vercel.com).
2. Додайте Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon ключ
3. Deploy. Сайт буде на `https://<назва>.vercel.app`.

## Локальний запуск

```bash
cp .env.example .env.local   # вставте свої ключі
npm install
npm run dev
```

## Адмінка

Відкрийте `/admin`, увійдіть з email/паролем адміна. Дані захищені Row Level Security: писати пости може лише залогінений адмін, відвідувачі можуть лише коментувати та лайкати.
