import type { LatLng } from "@/lib/geo";

/**
 * Безкоштовний OSRM-роутинг від FOSSGIS (дані OpenStreetMap, без API-ключа).
 * routed-foot — пішохідні стежки, routed-bike — велодоріжки й ґрунтівки.
 * https://routing.openstreetmap.de
 */
const OSRM_BASE = "https://routing.openstreetmap.de";

export type RoutingProfile = "foot" | "bike";

export function profileForCategory(category?: string): RoutingProfile {
  return category === "bike" ? "bike" : "foot";
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
  const url = `${OSRM_BASE}/routed-${profile}/route/v1/${profile}/${coords}?overview=full&geometries=geojson&steps=false&continue_straight=false`;

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
