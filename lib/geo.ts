export type LatLng = [number, number];

/** Дистанція маршруту в км (формула гаверсинусів) */
export function routeDistanceKm(points: LatLng[]): number {
  const R = 6371;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const [lat1, lng1] = points[i - 1];
    const [lat2, lng2] = points[i];
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    total += 2 * R * Math.asin(Math.sqrt(a));
  }
  return Math.round(total * 10) / 10;
}

/** Парсинг GPX-файлу: витягує точки треку (trkpt) або маршруту (rtept) */
export function parseGpx(xml: string): LatLng[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  let pts = Array.from(doc.getElementsByTagName("trkpt"));
  if (pts.length === 0) pts = Array.from(doc.getElementsByTagName("rtept"));
  const coords: LatLng[] = [];
  for (const p of pts) {
    const lat = parseFloat(p.getAttribute("lat") ?? "");
    const lng = parseFloat(p.getAttribute("lon") ?? "");
    if (!isNaN(lat) && !isNaN(lng)) coords.push([lat, lng]);
  }
  // Проріджуємо дуже великі треки, щоб не роздувати БД
  const MAX = 2000;
  if (coords.length > MAX) {
    const step = Math.ceil(coords.length / MAX);
    return coords.filter((_, i) => i % step === 0 || i === coords.length - 1);
  }
  return coords;
}

export const CATEGORY_COLORS: Record<string, string> = {
  hike: "#2d5a3d",
  bike: "#c2410c",
  camp: "#1d4ed8",
  other: "#6b21a8",
};
