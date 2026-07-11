"use client";

import { useEffect, useRef } from "react";
import type { Post } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/geo";
import { useLang, pick } from "@/lib/i18n";

export default function AllRoutesMap({ posts }: { posts: Post[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const { lang } = useLang();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || mapRef.current) return;

      const map = L.map(ref.current);
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const bounds = L.latLngBounds([]);

      for (const post of posts) {
        const color = CATEGORY_COLORS[post.category] ?? "#2d5a3d";
        const title = pick(lang, post.title_uk, post.title_en);
        const popup = `<b>${title}</b><br/><a href="/post/${post.slug}">→</a>`;

        if (post.route && post.route.length > 1) {
          const line = L.polyline(post.route, { color, weight: 4 })
            .addTo(map)
            .bindPopup(popup);
          line.on("click", () => line.openPopup());
          bounds.extend(line.getBounds());
        } else if (post.waypoints?.length) {
          const wp = post.waypoints[0];
          L.marker([wp.lat, wp.lng], {
            icon: L.divIcon({ className: "marker-dot", iconSize: [16, 16] }),
          })
            .addTo(map)
            .bindPopup(popup);
          bounds.extend([wp.lat, wp.lng]);
        }
      }

      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
      else map.setView([48.5, 24.5], 7);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [posts, lang]);

  return (
    <div ref={ref} style={{ height: "70vh" }} className="rounded-xl shadow" />
  );
}
