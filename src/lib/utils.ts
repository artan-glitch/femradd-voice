import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Prepend Vite's base path to an absolute path (e.g. "/images/foo.webp"). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  if (!path.startsWith("/")) return path;
  // Avoid double slashes: base is "/" locally, "/femradd-voice/" on GH Pages
  return base === "/" ? path : `${base}${path.slice(1)}`;
}

const ALBANIAN_MONTHS = [
  "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor",
  "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor",
];

/** Format an ISO date string (e.g. "2026-03-08") to Albanian ("8 Mars 2026"). */
export function formatDateAlbanian(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  return `${d} ${ALBANIAN_MONTHS[m - 1]} ${y}`;
}
