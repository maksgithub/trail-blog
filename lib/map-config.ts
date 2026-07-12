import type { LatLng } from "@/lib/geo";

/**
 * Домашня база — точка, з якої за замовчуванням плануються подорожі
 * (початковий центр редактора маршрутів і підказка для AI-асистента).
 * Змінюється без коду через змінну середовища NEXT_PUBLIC_HOME_BASE
 * у форматі "lat,lng,Назва", напр. "50.4501,30.5234,Київ".
 */
const DEFAULT_HOME_BASE = { lat: 50.0647, lng: 19.945, name: "Краків" };

export interface HomeBase {
  lat: number;
  lng: number;
  name: string;
}

export function getHomeBase(): HomeBase {
  const raw = process.env.NEXT_PUBLIC_HOME_BASE;
  if (!raw) return DEFAULT_HOME_BASE;
  const [latStr, lngStr, ...nameParts] = raw.split(",");
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return DEFAULT_HOME_BASE;
  return {
    lat,
    lng,
    name: nameParts.join(",").trim() || DEFAULT_HOME_BASE.name,
  };
}

export const HOME_BASE = getHomeBase();
export const HOME_BASE_LATLNG: LatLng = [HOME_BASE.lat, HOME_BASE.lng];

/** Світовий вигляд за замовчуванням, коли на карті ще немає даних */
export const WORLD_VIEW = { center: [25, 10] as LatLng, zoom: 2 };
