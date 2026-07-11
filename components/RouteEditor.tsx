"use client";

import { useEffect, useRef, useState } from "react";
import type { Waypoint } from "@/lib/types";
import { LatLng, parseGpx, routeDistanceKm } from "@/lib/geo";

interface Props {
  route: LatLng[];
  waypoints: Waypoint[];
  onRouteChange: (route: LatLng[]) => void;
  onWaypointsChange: (wps: Waypoint[]) => void;
}

type Mode = "route" | "waypoint";

export default function RouteEditor({
  route,
  waypoints,
  onRouteChange,
  onWaypointsChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layersRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [mode, setMode] = useState<Mode>("route");

  // refs, щоб click-handler бачив актуальний стан
  const modeRef = useRef(mode);
  const routeRef = useRef(route);
  const wpsRef = useRef(waypoints);
  modeRef.current = mode;
  routeRef.current = route;
  wpsRef.current = waypoints;

  // ініціалізація карти (один раз)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || mapRef.current) return;

      const map = L.map(ref.current).setView([48.5, 24.5], 8);
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      layersRef.current = L.layerGroup().addTo(map);

      map.on("click", (e: import("leaflet").LeafletMouseEvent) => {
        const pt: LatLng = [
          Math.round(e.latlng.lat * 1e6) / 1e6,
          Math.round(e.latlng.lng * 1e6) / 1e6,
        ];
        if (modeRef.current === "route") {
          onRouteChange([...routeRef.current, pt]);
        } else {
          const title = window.prompt("Назва локації:", "");
          if (title === null) return;
          onWaypointsChange([
            ...wpsRef.current,
            { lat: pt[0], lng: pt[1], title: title || "Локація" },
          ]);
        }
      });

      // якщо вже є маршрут (редагування) — підлаштувати вигляд
      if (routeRef.current.length > 1) {
        map.fitBounds(L.latLngBounds(routeRef.current), { padding: [30, 30] });
      }
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layersRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // перемалювання шарів при зміні даних
  useEffect(() => {
    (async () => {
      const L = (await import("leaflet")).default;
      const layers = layersRef.current;
      if (!layers) return;
      layers.clearLayers();

      if (route.length > 0) {
        L.polyline(route, { color: "#2d5a3d", weight: 4 }).addTo(layers);
        for (const [i, pt] of route.entries()) {
          L.circleMarker(pt, {
            radius: i === 0 || i === route.length - 1 ? 6 : 3,
            color: "#2d5a3d",
            fillColor: "#fff",
            fillOpacity: 1,
          }).addTo(layers);
        }
      }

      waypoints.forEach((wp, i) => {
        const m = L.marker([wp.lat, wp.lng], {
          icon: L.divIcon({ className: "marker-photo", iconSize: [16, 16] }),
          draggable: true,
        }).addTo(layers);
        m.bindTooltip(wp.title);
        m.on("dragend", () => {
          const pos = m.getLatLng();
          const next = [...wpsRef.current];
          next[i] = { ...next[i], lat: pos.lat, lng: pos.lng };
          onWaypointsChange(next);
        });
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, waypoints]);

  const handleGpx = async (file: File) => {
    const text = await file.text();
    const pts = parseGpx(text);
    if (pts.length < 2) {
      alert("Не вдалося прочитати трек із GPX-файлу");
      return;
    }
    onRouteChange(pts);
    const L = (await import("leaflet")).default;
    mapRef.current?.fitBounds(L.latLngBounds(pts), { padding: [30, 30] });
  };

  const dist = routeDistanceKm(route);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("route")}
          className={`px-3 py-1.5 rounded cursor-pointer ${mode === "route" ? "bg-[var(--forest)] text-white" : "bg-gray-200"}`}
        >
          ✏️ Малювати маршрут
        </button>
        <button
          type="button"
          onClick={() => setMode("waypoint")}
          className={`px-3 py-1.5 rounded cursor-pointer ${mode === "waypoint" ? "bg-orange-700 text-white" : "bg-gray-200"}`}
        >
          📍 Додати локацію
        </button>
        <button
          type="button"
          onClick={() => onRouteChange(route.slice(0, -1))}
          disabled={route.length === 0}
          className="px-3 py-1.5 rounded bg-gray-200 disabled:opacity-40 cursor-pointer"
        >
          ↩️ Відмінити точку
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm("Очистити весь маршрут?")) onRouteChange([]);
          }}
          disabled={route.length === 0}
          className="px-3 py-1.5 rounded bg-gray-200 disabled:opacity-40 cursor-pointer"
        >
          🗑️ Очистити
        </button>
        <label className="px-3 py-1.5 rounded bg-gray-200 cursor-pointer">
          ⬆️ GPX-файл
          <input
            type="file"
            accept=".gpx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleGpx(f);
              e.target.value = "";
            }}
          />
        </label>
        {dist > 0 && (
          <span className="text-gray-600 ml-auto">≈ {dist} км</span>
        )}
      </div>

      <div ref={ref} style={{ height: "420px" }} className="rounded-xl shadow" />
      <p className="text-xs text-gray-500">
        Режим «Маршрут»: клікайте по карті, щоб додавати точки лінії. Режим
        «Локація»: клік ставить маркер місця (можна перетягувати).
      </p>

      {waypoints.length > 0 && (
        <ul className="text-sm space-y-1">
          {waypoints.map((wp, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-orange-700">📍</span>
              <input
                value={wp.title}
                onChange={(e) => {
                  const next = [...waypoints];
                  next[i] = { ...next[i], title: e.target.value };
                  onWaypointsChange(next);
                }}
                className="border rounded px-2 py-1 flex-1"
              />
              <button
                type="button"
                onClick={() =>
                  onWaypointsChange(waypoints.filter((_, j) => j !== i))
                }
                className="text-red-600 cursor-pointer"
                aria-label="Видалити локацію"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
