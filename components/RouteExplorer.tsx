"use client";

import { useRef, useState } from "react";
import type { Category, Waypoint } from "@/lib/types";
import type { LatLng } from "@/lib/geo";
import { CATEGORY_COLORS } from "@/lib/geo";
import RouteMap, { RouteMapApi } from "@/components/RouteMap";
import { useLang } from "@/lib/i18n";

/** Пряме посилання на точку в Google Maps */
export function gmapsPointUrl(wp: Waypoint): string {
  return `https://www.google.com/maps/search/?api=1&query=${wp.lat},${wp.lng}`;
}

/** Маршрут через усі точки в Google Maps (до 10 зупинок) */
export function gmapsRouteUrl(wps: Waypoint[]): string {
  const stops = wps.slice(0, 10).map((w) => `${w.lat},${w.lng}`);
  return `https://www.google.com/maps/dir/${stops.join("/")}`;
}

function ExternalIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

/**
 * Карта маршруту з віджетом-стрічкою карток угорі: горизонтальний скрол
 * точок маршруту; клік по картці плавно летить картою до локації,
 * посилання на картці відкриває справжнє місце в Google Maps.
 */
export default function RouteExplorer({
  route,
  waypoints,
  category = "hike",
}: {
  route: LatLng[] | null;
  waypoints?: Waypoint[] | null;
  category?: Category;
}) {
  const apiRef = useRef<RouteMapApi | null>(null);
  const [active, setActive] = useState(-1);
  const { t } = useLang();
  const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.hike;
  const wps = waypoints ?? [];

  return (
    <div className="relative">
      <RouteMap
        route={route}
        waypoints={wps}
        category={category}
        apiRef={apiRef}
      />

      {wps.length > 0 && (
        <div className="absolute top-2 left-0 right-0 z-[1000] pointer-events-none">
          <div className="stops-strip flex gap-2 overflow-x-auto px-2 pb-1.5 snap-x pointer-events-auto">
            {wps.map((wp, i) => (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActive(i);
                  apiRef.current?.focusWaypoint(i);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                    apiRef.current?.focusWaypoint(i);
                  }
                }}
                className={`snap-start shrink-0 flex items-center gap-2.5 rounded-xl bg-white/95 backdrop-blur px-3 py-2 shadow-md cursor-pointer transition-all select-none border ${
                  active === i
                    ? "border-transparent ring-2 shadow-lg"
                    : "border-[var(--ig-border)] hover:shadow-lg hover:-translate-y-0.5"
                }`}
                style={
                  active === i
                    ? ({ "--tw-ring-color": color } as React.CSSProperties)
                    : undefined
                }
              >
                <span
                  className="w-7 h-7 shrink-0 rounded-full text-white text-[13px] font-bold flex items-center justify-center shadow"
                  style={{ background: color }}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold max-w-[150px] truncate">
                    {wp.title}
                  </span>
                  <a
                    href={gmapsPointUrl(wp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Google Maps <ExternalIcon />
                  </a>
                </span>
              </div>
            ))}

            {/* остання картка — весь маршрут у Google Maps */}
            <a
              href={gmapsRouteUrl(wps)}
              target="_blank"
              rel="noopener noreferrer"
              className="snap-start shrink-0 flex items-center gap-2 rounded-xl px-3 py-2 shadow-md border border-transparent text-white text-xs font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              style={{ background: color }}
            >
              {t("route.openAll")} <ExternalIcon />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
