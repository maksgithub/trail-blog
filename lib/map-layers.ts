import type * as Leaflet from "leaflet";

/**
 * Безкоштовні шари без API-ключа (джерело: leaflet-extras/leaflet-providers):
 * — OpenTopoMap: топографія з рельєфом і стежками — найкраща для походів;
 * — OSM: класична;
 * — CyclOSM: веломапа з велоінфраструктурою;
 * — Esri World Imagery: супутник;
 * — Waymarked Trails: оверлей маркованих піших маршрутів.
 * Обраний шар запам'ятовується в localStorage.
 */

const OSM_ATTR =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const STORAGE_KEY = "basemap";
const DEFAULT_BASE = "Топо / Topo";

export function createBaseLayers(
  L: typeof Leaflet
): Record<string, Leaflet.TileLayer> {
  return {
    "Топо / Topo": L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        maxNativeZoom: 17,
        maxZoom: 19,
        attribution: `${OSM_ATTR}, <a href="http://viewfinderpanoramas.org">SRTM</a> | © <a href="https://opentopomap.org">OpenTopoMap</a>`,
      }
    ),
    OpenStreetMap: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: OSM_ATTR,
    }),
    "Вело / Cycling": L.tileLayer(
      "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: `<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases">CyclOSM</a> | ${OSM_ATTR}`,
      }
    ),
    "Супутник / Satellite": L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxNativeZoom: 18,
        maxZoom: 19,
        attribution:
          "© <a href=\"https://www.esri.com\">Esri</a> — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye",
      }
    ),
  };
}

export function createTrailsOverlay(
  L: typeof Leaflet
): Record<string, Leaflet.TileLayer> {
  return {
    "Марковані стежки / Marked trails": L.tileLayer(
      "https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png",
      {
        maxNativeZoom: 18,
        maxZoom: 19,
        attribution:
          '| © <a href="https://waymarkedtrails.org">waymarkedtrails.org</a>',
      }
    ),
  };
}

/**
 * Додає базовий шар (збережений вибір користувача або топографічний)
 * і перемикач шарів. defaultBase дозволяє обрати інший стартовий шар,
 * напр. "Вело / Cycling" для веломаршрутів.
 */
export function setupBaseLayers(
  L: typeof Leaflet,
  map: Leaflet.Map,
  { withControl = true, defaultBase = DEFAULT_BASE, controlPosition = "topright" }: {
    withControl?: boolean;
    defaultBase?: string;
    controlPosition?: Leaflet.ControlPosition;
  } = {}
) {
  const bases = createBaseLayers(L);
  let choice = defaultBase;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && bases[saved]) choice = saved;
  } catch {
    /* SSR або приватний режим */
  }
  (bases[choice] ?? bases[DEFAULT_BASE]).addTo(map);

  if (withControl) {
    L.control
      .layers(bases, createTrailsOverlay(L), { position: controlPosition })
      .addTo(map);
    map.on("baselayerchange", (e: Leaflet.LayersControlEvent) => {
      try {
        localStorage.setItem(STORAGE_KEY, e.name);
      } catch {
        /* ігноруємо */
      }
    });
  }
}
