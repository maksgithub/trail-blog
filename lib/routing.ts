import type { LatLng } from "@/lib/geo";

/**
 * Безкоштовний OSRM-роутинг від FOSSGIS (дані OpenStreetMap, без API-ключа).
 * routed-foot — пішохідні стежки, routed-bike — велодоріжки й ґрунтівки.
 * https://routing.openstreetmap.de
 */
const OSRM_BASE = "https://routing.openstreetmap.de";

export type RoutingProfile = "foot" | "bike" | "car";

export function profileForCategory(category?: string): RoutingProfile {
  return category === "bike" ? "bike" : "foot";
}

/** Профіль для відображення готового маршруту: авто-подорожі — по дорогах */
export function displayProfileForCategory(category?: string): RoutingProfile {
  if (category === "bike") return "bike";
  if (category === "hike") return "foot";
  return "car"; // camp / other — зазвичай доїзд автомобілем
}

interface OsrmResponse {
  code: string;
  routes?: { geometry: { coordinates: [number, number][] } }[];
}

/**
 * Прокладає маршрут по стежках/дорогах через задані точки.
 * Повертає полілінію [lat, lng][] або null, якщо роутинг недоступний —
 * тоді викликач лишає прямі лінії.
 */
export async function snapRoute(
  points: LatLng[],
  profile: RoutingProfile = "foot",
  signal?: AbortSignal
): Promise<LatLng[] | null> {
  if (points.length < 2) return null;

  // OSRM приймає до ~100 координат у GET-запиті; проріджуємо довші списки,
  // залишаючи перші/останні точки як опорні
  const MAX_VIA = 80;
  let via = points;
  if (points.length > MAX_VIA) {
    const step = (points.length - 1) / (MAX_VIA - 1);
    via = Array.from(
      { length: MAX_VIA },
      (_, i) => points[Math.round(i * step)]
    );
  }

  const coords = via.map(([lat, lng]) => `${lng},${lat}`).join(";");
  // сервіс car живе на routed-car, а сегмент профілю в URL — driving
  const urlProfile = profile === "car" ? "driving" : profile;
  const url = `${OSRM_BASE}/routed-${profile}/route/v1/${urlProfile}/${coords}?overview=full&geometries=geojson&steps=false&continue_straight=false`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const data = (await res.json()) as OsrmResponse;
    const geometry = data.routes?.[0]?.geometry?.coordinates;
    if (data.code !== "Ok" || !geometry || geometry.length < 2) return null;
    return geometry.map(([lng, lat]) => [
      Math.round(lat * 1e6) / 1e6,
      Math.round(lng * 1e6) / 1e6,
    ]);
  } catch {
    return null;
  }
}

function routeHash(points: LatLng[], profile: string): string {
  const str = profile + JSON.stringify(points);
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) | 0;
  return `snap:${(h >>> 0).toString(36)}`;
}

/**
 * Снапінг збереженого маршруту до реальних доріг/стежок для ВІДОБРАЖЕННЯ
 * (виконується в браузері відвідувача). Результат кешується в sessionStorage,
 * щоб не смикати OSRM на кожен перегляд. Якщо роутинг недоступний —
 * повертає null і викликач малює оригінальні точки.
 */
export async function snapForDisplay(
  points: LatLng[],
  category?: string
): Promise<LatLng[] | null> {
  if (typeof window === "undefined" || points.length < 2) return null;
  const profile = displayProfileForCategory(category);
  const key = routeHash(points, profile);
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached) as LatLng[] | null;
      return Array.isArray(parsed) && parsed.length > 1 ? parsed : null;
    }
  } catch {
    /* приватний режим — просто без кешу */
  }
  const snapped = await snapRoute(points, profile);
  try {
    // кешуємо і невдачу ("null"), щоб не бомбити недоступний сервіс
    sessionStorage.setItem(key, JSON.stringify(snapped));
  } catch {
    /* ігноруємо переповнення сховища */
  }
  return snapped;
}
