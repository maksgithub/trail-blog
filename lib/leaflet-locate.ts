import type * as Leaflet from "leaflet";

const CROSSHAIR_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>`;

/**
 * Додає на карту кнопку «моя геолокація»: показує маркер із колом точності
 * та центрує карту на користувачеві.
 */
export function addLocateControl(L: typeof Leaflet, map: Leaflet.Map) {
  let marker: Leaflet.CircleMarker | null = null;
  let accuracy: Leaflet.Circle | null = null;

  map.on("locationfound", (e: Leaflet.LocationEvent) => {
    marker?.remove();
    accuracy?.remove();
    accuracy = L.circle(e.latlng, {
      radius: e.accuracy,
      color: "#1d4ed8",
      weight: 1,
      fillColor: "#3b82f6",
      fillOpacity: 0.12,
      interactive: false,
    }).addTo(map);
    marker = L.circleMarker(e.latlng, {
      radius: 7,
      color: "#fff",
      weight: 2,
      fillColor: "#1d4ed8",
      fillOpacity: 1,
    }).addTo(map);
    const btn = document.querySelector<HTMLElement>(".locate-btn");
    btn?.classList.remove("locate-btn--busy");
  });

  map.on("locationerror", () => {
    const btn = document.querySelector<HTMLElement>(".locate-btn");
    btn?.classList.remove("locate-btn--busy");
    alert(
      "Не вдалося визначити геолокацію. Перевірте дозвіл на доступ до місцезнаходження."
    );
  });

  const Locate = L.Control.extend({
    options: { position: "topleft" as const },
    onAdd() {
      const div = L.DomUtil.create("div", "leaflet-bar");
      const a = L.DomUtil.create("a", "locate-btn", div);
      a.href = "#";
      a.title = "Моє місцезнаходження / My location";
      a.setAttribute("role", "button");
      a.setAttribute("aria-label", "My location");
      a.innerHTML = CROSSHAIR_SVG;
      L.DomEvent.on(a, "click", (e) => {
        L.DomEvent.stop(e);
        a.classList.add("locate-btn--busy");
        map.locate({ setView: true, maxZoom: 14, enableHighAccuracy: true });
      });
      return div;
    },
  });

  map.addControl(new Locate());
}
