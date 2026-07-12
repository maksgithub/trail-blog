"use client";

import { useEffect, useRef } from "react";
import type { Waypoint } from "@/lib/types";
import { CATEGORY_COLORS, LatLng } from "@/lib/geo";
import { setupBaseLayers } from "@/lib/map-layers";
import { WORLD_VIEW } from "@/lib/map-config";

interface Props {
  route: LatLng[] | null;
  waypoints?: Waypoint[] | null;
  category?: string;
  height?: string;
  interactive?: boolean;
}

export default function RouteMap({
  route,
  waypoints,
  category = "hike",
  height = "420px",
  interactive = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || mapRef.current) return;

      const map = L.map(ref.current, {
        scrollWheelZoom: false,
        dragging: interactive,
        zoomControl: interactive,
        doubleClickZoom: interactive,
        touchZoom: interactive,
        keyboard: interactive,
      });
      mapRef.current = map;
      setupBaseLayers(L, map, {
        withControl: interactive,
        defaultBase: category === "bike" ? "Вело / Cycling" : undefined,
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

      for (const wp of waypoints ?? []) {
        const m = L.marker([wp.lat, wp.lng], {
          icon: L.divIcon({ className: "marker-photo", iconSize: [16, 16] }),
        }).addTo(map);
        const img = wp.photo_url
          ? `<img src="${wp.photo_url}" style="width:180px;border-radius:8px;margin-top:6px" />`
          : "";
        m.bindPopup(`<b>${wp.title}</b>${img}`);
        bounds.extend([wp.lat, wp.lng]);
      }

      if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30] });
      else map.setView(WORLD_VIEW.center, WORLD_VIEW.zoom);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [route, waypoints, category, interactive]);

  return <div ref={ref} style={{ height }} />;
}
