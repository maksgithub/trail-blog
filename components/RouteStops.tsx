"use client";

import type { Category, Waypoint } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/geo";
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

function ExternalIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

/**
 * Віджет «точки маршруту»: нумерований список зупинок із відкриттям
 * кожної (та всього маршруту) в Google Maps — реальні координати,
 * до яких можна прокласти дорогу.
 */
export default function RouteStops({
  waypoints,
  category = "hike",
}: {
  waypoints: Waypoint[];
  category?: Category;
}) {
  const { t } = useLang();
  const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.hike;
  if (!waypoints.length) return null;

  return (
    <div className="mt-3 bg-white border border-[var(--ig-border)] rounded-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-[var(--ig-border)]">
        <h3 className="font-semibold text-sm">{t("route.stops")}</h3>
        <a
          href={gmapsRouteUrl(waypoints)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--forest)] hover:text-[var(--forest-dark)] transition-colors"
        >
          {t("route.openAll")}
          <ExternalIcon />
        </a>
      </div>
      <ol>
        {waypoints.map((wp, i) => (
          <li key={i}>
            <a
              href={gmapsPointUrl(wp)}
              target="_blank"
              rel="noopener noreferrer"
              title={t("route.open")}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group border-b border-gray-100 last:border-b-0"
            >
              <span
                className="w-7 h-7 shrink-0 rounded-full text-white text-[13px] font-bold flex items-center justify-center border-2 border-white shadow"
                style={{ background: color }}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium truncate">
                  {wp.title}
                </span>
                <span className="block text-xs text-gray-400">
                  {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
                </span>
              </span>
              <span className="text-gray-300 group-hover:text-[var(--forest)] transition-colors">
                <ExternalIcon />
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
