"use client";

import { useEffect, useRef } from "react";
import type { Waypoint } from "@/lib/types";
import { CATEGORY_COLORS, LatLng } from "@/lib/geo";
import { setupBaseLayers } from "@/lib/map-layers";
import { WORLD_VIEW } from "@/lib/map-config";
import { snapForDisplay } from "@/lib/routing";

/** API для зовнішніх віджетів (картки точок над картою) */
export interface RouteMapApi {
  focusWaypoint: (index: number) => void;
}

interface Props {
  route: LatLng[] | null;
  waypoints?: Waypoint[] | null;
  category?: string;
  height?: string;
  interactive?: boolean;
  /** Коли задано, контроли переїжджають донизу, звільняючи місце під картки */
  apiRef?: React.MutableRefObject<RouteMapApi | null>;
}

export default function RouteMap({
  route,
  waypoints,
  category = "hike",
  height = "420px",
  interactive = true,
  apiRef,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || mapRef.current) return;

      const controlsAtBottom = Boolean(apiRef);
      const map = L.map(ref.current, {
        scrollWheelZoom: false,
        dragging: interactive,
        zoomControl: interactive && !controlsAtBottom,
        doubleClickZoom: interactive,
        touchZoom: interactive,
        keyboard: interactive,
      });
      mapRef.current = map;
      if (interactive && controlsAtBottom) {
        L.control.zoom({ position: "bottomleft" }).addTo(map);
      }
      setupBaseLayers(L, map, {
        withControl: interactive,
        defaultBase: category === "bike" ? "Вело / Cycling" : undefined,
        controlPosition: controlsAtBottom ? "bottomright" : "topright",
      });

      const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.hike;
      const bounds = L.latLngBounds([]);

      if (route && route.length > 1) {
        const line = L.polyline(route, {
          color,
          weight: 4,
          smoothFactor: 1,
          lineJoin: "round",
          lineCap: "round",
        }).addTo(map);
        bounds.extend(line.getBounds());
        // опорні точки з'єднуємо по реальних дорогах і стежках (OSRM);
        // поки роутинг відповідає, показуємо прямі лінії як прев'ю
        snapForDisplay(route, category).then((snapped) => {
          if (snapped && !cancelled && mapRef.current) {
            line.setLatLngs(snapped);
          }
        });
        const start = route[0];
        const end = route[route.length - 1];
        L.marker(start, {
          icon: L.divIcon({ className: "marker-dot", iconSize: [14, 14] }),
        })
          .addTo(map)
          .bindPopup("Старт / Start");
        L.marker(end, {
          icon: L.divIcon({ className: "marker-dot", iconSize: [14, 14] }),
        })
          .addTo(map)
          .bindPopup("Фініш / Finish");
      }

      const wpMarkers: import("leaflet").Marker[] = [];
      (waypoints ?? []).forEach((wp, i) => {
        const m = L.marker([wp.lat, wp.lng], {
          icon: L.divIcon({
            className: "marker-badge-wrap",
            html: `<div class="marker-badge" style="background:${color}">${i + 1}</div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
            popupAnchor: [0, -14],
          }),
          // бейджі поверх крапок старту/фінішу
          zIndexOffset: 100,
        }).addTo(map);
        const img = wp.photo_url
          ? `<img src="${wp.photo_url}" style="width:180px;border-radius:8px;margin-top:6px" />`
          : "";
        const gmaps = `https://www.google.com/maps/search/?api=1&query=${wp.lat},${wp.lng}`;
        m.bindPopup(
          `<b>${wp.title}</b>${img}<br/><a href="${gmaps}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a>`
        );
        wpMarkers.push(m);
        bounds.extend([wp.lat, wp.lng]);
      });

      if (apiRef) {
        apiRef.current = {
          focusWaypoint(index: number) {
            const m = wpMarkers[index];
            const wp = (waypoints ?? [])[index];
            if (!m || !wp || !mapRef.current) return;
            mapRef.current.flyTo(
              [wp.lat, wp.lng],
              Math.max(mapRef.current.getZoom(), 13),
              { duration: 0.8 }
            );
            m.openPopup();
          },
        };
      }

      if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30] });
      else map.setView(WORLD_VIEW.center, WORLD_VIEW.zoom);
    })();

    return () => {
      cancelled = true;
      if (apiRef) apiRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, waypoints, category, interactive]);

  return <div ref={ref} style={{ height }} />;
}
