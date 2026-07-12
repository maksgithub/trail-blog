"use client";

import { useEffect, useRef, useState } from "react";
import type { Post } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/geo";
import { snapForDisplay } from "@/lib/routing";
import { addLocateControl } from "@/lib/leaflet-locate";
import { setupBaseLayers } from "@/lib/map-layers";
import { WORLD_VIEW } from "@/lib/map-config";
import { useLang, pick } from "@/lib/i18n";

interface Props {
  posts: Post[];
  showHeat?: boolean;
}

export default function AllRoutesMap({ posts, showHeat = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const heatRef = useRef<import("leaflet").Layer | null>(null);
  const routesRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      // leaflet.heat — класичний плагін, шукає глобальний L
      (window as unknown as { L: typeof L }).L = L;
      await import("leaflet.heat");
      if (cancelled || !ref.current || mapRef.current) return;

      const map = L.map(ref.current);
      mapRef.current = map;
      setupBaseLayers(L, map);
      addLocateControl(L, map);

      const routes = L.layerGroup().addTo(map);
      routesRef.current = routes;
      const bounds = L.latLngBounds([]);
      const heatPoints: [number, number, number][] = [];

      for (const post of posts) {
        const color = CATEGORY_COLORS[post.category] ?? "#2d5a3d";
        const title = pick(lang, post.title_uk, post.title_en);
        const popup = `<a href="/post/${post.slug}" style="font-weight:600;color:${color}">${title} →</a>`;

        if (post.route && post.route.length > 1) {
          const line = L.polyline(post.route, {
            color,
            weight: 4,
            opacity: 0.9,
            smoothFactor: 1,
            lineJoin: "round",
            lineCap: "round",
          })
            .addTo(routes)
            .bindPopup(popup);
          line.on("mouseover", () => line.setStyle({ weight: 6 }));
          line.on("mouseout", () => line.setStyle({ weight: 4 }));
          // з'єднуємо опорні точки по реальних дорогах/стежках
          snapForDisplay(post.route, post.category).then((snapped) => {
            if (snapped && !cancelled && mapRef.current) {
              line.setLatLngs(snapped);
            }
          });
          bounds.extend(line.getBounds());
          for (const [lat, lng] of post.route) heatPoints.push([lat, lng, 0.6]);
        } else if (post.waypoints?.length) {
          const wp = post.waypoints[0];
          L.marker([wp.lat, wp.lng], {
            icon: L.divIcon({ className: "marker-dot", iconSize: [16, 16] }),
          })
            .addTo(routes)
            .bindPopup(popup);
          bounds.extend([wp.lat, wp.lng]);
        }
        for (const wp of post.waypoints ?? []) {
          heatPoints.push([wp.lat, wp.lng, 1]);
        }
      }

      heatRef.current = L.heatLayer(heatPoints, {
        radius: 22,
        blur: 18,
        maxZoom: 13,
        minOpacity: 0.35,
      });

      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
      else map.setView(WORLD_VIEW.center, WORLD_VIEW.zoom);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      heatRef.current = null;
      routesRef.current = null;
      setReady(false);
    };
  }, [posts, lang]);

  // перемикання хіт-мапи: показуємо щільність точок замість окремих ліній
  useEffect(() => {
    const map = mapRef.current;
    const heat = heatRef.current;
    const routes = routesRef.current;
    if (!ready || !map || !heat || !routes) return;
    if (showHeat) {
      routes.remove();
      heat.addTo(map);
    } else {
      heat.remove();
      routes.addTo(map);
    }
  }, [showHeat, ready]);

  return <div ref={ref} style={{ height: "70vh" }} />;
}
