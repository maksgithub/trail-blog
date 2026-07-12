"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, Waypoint } from "@/lib/types";
import { LatLng, parseGpx, routeDistanceKm } from "@/lib/geo";
import { snapRoute, profileForCategory } from "@/lib/routing";
import { addLocateControl } from "@/lib/leaflet-locate";
import { setupBaseLayers } from "@/lib/map-layers";
import { HOME_BASE, HOME_BASE_LATLNG } from "@/lib/map-config";

interface Props {
  route: LatLng[];
  waypoints: Waypoint[];
  category?: Category;
  onRouteChange: (route: LatLng[]) => void;
  onWaypointsChange: (wps: Waypoint[]) => void;
}

type Mode = "route" | "waypoint";

export default function RouteEditor({
  route,
  waypoints,
  category = "hike",
  onRouteChange,
  onWaypointsChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layersRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [mode, setMode] = useState<Mode>("route");
  const [snap, setSnap] = useState(true);
  const [routing, setRouting] = useState(false);
  const [notice, setNotice] = useState("");

  // історія для «відмінити» — один клік у snap-режимі додає багато точок
  const historyRef = useRef<LatLng[][]>([]);

  // refs, щоб click-handler бачив актуальний стан
  const modeRef = useRef(mode);
  const routeRef = useRef(route);
  const wpsRef = useRef(waypoints);
  const snapRef = useRef(snap);
  const routingRef = useRef(routing);
  const categoryRef = useRef(category);
  modeRef.current = mode;
  routeRef.current = route;
  wpsRef.current = waypoints;
  snapRef.current = snap;
  routingRef.current = routing;
  categoryRef.current = category;

  const setRouteWithHistory = (next: LatLng[]) => {
    historyRef.current.push(routeRef.current);
    if (historyRef.current.length > 50) historyRef.current.shift();
    onRouteChange(next);
  };

  const flashNotice = (text: string) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 4000);
  };

  const addRoutePoint = async (pt: LatLng) => {
    const current = routeRef.current;
    if (!snapRef.current || current.length === 0) {
      setRouteWithHistory([...current, pt]);
      return;
    }
    // прокладаємо сегмент від останньої точки по стежках
    setRouting(true);
    const seg = await snapRoute(
      [current[current.length - 1], pt],
      profileForCategory(categoryRef.current)
    );
    setRouting(false);
    if (seg && seg.length > 1) {
      setRouteWithHistory([...current, ...seg.slice(1)]);
    } else {
      setRouteWithHistory([...current, pt]);
      flashNotice(
        "Роутинг-сервіс недоступний — точку додано прямою лінією."
      );
    }
  };

  // ініціалізація карти (один раз)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current || mapRef.current) return;

      // стартовий вигляд — домашня база (див. NEXT_PUBLIC_HOME_BASE)
      const map = L.map(ref.current).setView(HOME_BASE_LATLNG, 10);
      mapRef.current = map;
      setupBaseLayers(L, map);
      addLocateControl(L, map);
      layersRef.current = L.layerGroup().addTo(map);

      map.on("click", (e: import("leaflet").LeafletMouseEvent) => {
        if (routingRef.current) return; // чекаємо завершення попереднього сегмента
        const pt: LatLng = [
          Math.round(e.latlng.lat * 1e6) / 1e6,
          Math.round(e.latlng.lng * 1e6) / 1e6,
        ];
        if (modeRef.current === "route") {
          addRoutePoint(pt);
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
        // маркери лише на початку/кінці — проміжні точки snap-маршруту не редагуються
        for (const i of [0, route.length - 1]) {
          if (i < 0) continue;
          L.circleMarker(route[i], {
            radius: 6,
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

  const undo = () => {
    const prev = historyRef.current.pop();
    onRouteChange(prev ?? routeRef.current.slice(0, -1));
  };

  // почати маршрут із домашньої бази
  const startFromBase = async () => {
    if (routing) return;
    setRouteWithHistory([HOME_BASE_LATLNG]);
    mapRef.current?.setView(HOME_BASE_LATLNG, 12);
  };

  // перепрокласти весь наявний маршрут по стежках (після AI чи GPX)
  const snapAll = async () => {
    if (route.length < 2 || routing) return;
    setRouting(true);
    const snapped = await snapRoute(route, profileForCategory(category));
    setRouting(false);
    if (snapped && snapped.length > 1) {
      setRouteWithHistory(snapped);
      const L = (await import("leaflet")).default;
      mapRef.current?.fitBounds(L.latLngBounds(snapped), { padding: [30, 30] });
    } else {
      flashNotice("Не вдалося прокласти по стежках — маршрут не змінено.");
    }
  };

  const handleGpx = async (file: File) => {
    const text = await file.text();
    const pts = parseGpx(text);
    if (pts.length < 2) {
      alert("Не вдалося прочитати трек із GPX-файлу");
      return;
    }
    setRouteWithHistory(pts);
    const L = (await import("leaflet")).default;
    mapRef.current?.fitBounds(L.latLngBounds(pts), { padding: [30, 30] });
  };

  const dist = routeDistanceKm(route);
  const btn = (active: boolean, activeCls = "bg-[var(--forest)] text-white") =>
    `px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
      active ? activeCls : "bg-gray-200 hover:bg-gray-300"
    }`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button type="button" onClick={() => setMode("route")} className={btn(mode === "route")}>
          ✏️ Малювати маршрут
        </button>
        <button
          type="button"
          onClick={() => setMode("waypoint")}
          className={btn(mode === "waypoint", "bg-orange-700 text-white")}
        >
          📍 Додати локацію
        </button>
        <button
          type="button"
          onClick={startFromBase}
          disabled={routing || route.length > 0}
          className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40 cursor-pointer transition-colors"
          title="Поставити першу точку маршруту в домашній базі (налаштовується через NEXT_PUBLIC_HOME_BASE)"
        >
          🏠 Старт: {HOME_BASE.name}
        </button>
        <label
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
            snap ? "bg-[var(--forest-light)] text-[var(--forest)] font-medium" : "bg-gray-200 hover:bg-gray-300"
          }`}
          title="Нові точки з'єднуються по реальних стежках і дорогах (OpenStreetMap)"
        >
          <input
            type="checkbox"
            checked={snap}
            onChange={(e) => setSnap(e.target.checked)}
            className="w-3.5 h-3.5 accent-[var(--forest)]"
          />
          🥾 По стежках
        </label>
        <button
          type="button"
          onClick={undo}
          disabled={route.length === 0}
          className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40 cursor-pointer transition-colors"
        >
          ↩️ Відмінити
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm("Очистити весь маршрут?")) setRouteWithHistory([]);
          }}
          disabled={route.length === 0}
          className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40 cursor-pointer transition-colors"
        >
          🗑️ Очистити
        </button>
        <label className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors">
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
        <button
          type="button"
          onClick={snapAll}
          disabled={route.length < 2 || routing}
          className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40 cursor-pointer transition-colors"
          title="Перепрокласти наявний маршрут по стежках і дорогах"
        >
          🧭 Вирівняти по стежках
        </button>
        {routing && (
          <span className="text-[var(--forest)] animate-pulse">
            Прокладаю маршрут…
          </span>
        )}
        {dist > 0 && <span className="text-gray-600 ml-auto">≈ {dist} км</span>}
      </div>

      {notice && <p className="text-xs text-amber-700">{notice}</p>}

      <div className="rounded-xl overflow-hidden shadow border border-[var(--ig-border)]">
        <div ref={ref} style={{ height: "420px" }} />
      </div>
      <p className="text-xs text-gray-500">
        Режим «Маршрут»: клікайте по карті — з увімкненим «По стежках» точки
        з&apos;єднуються по реальних стежках і дорогах OpenStreetMap
        (для веломаршрутів — по велодоріжках). Режим «Локація»: клік ставить
        маркер місця (можна перетягувати).
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
                className="border border-gray-300 rounded-lg px-2 py-1 flex-1"
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
