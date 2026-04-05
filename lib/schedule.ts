import { Combo } from './types';

// IST = UTC+5:30, no DST
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Convert a Date (UTC) to an IST date string 'YYYY-MM-DD' */
export function toISTDate(date: Date = new Date()): string {
  const istMs = date.getTime() + IST_OFFSET_MS;
  const istDate = new Date(istMs);
  return istDate.toISOString().slice(0, 10);
}

/** Get today's date in IST as 'YYYY-MM-DD' */
export function getTodayIST(): string {
  return toISTDate(new Date());
}

/** Get tomorrow's date in IST as 'YYYY-MM-DD' */
export function getTomorrowIST(): string {
  return addDays(toISTDate(new Date()), 1);
}

/** Add N days to an IST date string (treats dateStr as UTC midnight) */
export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Get day of week (0=Sun, 1=Mon, ..., 6=Sat) from IST date string */
function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00Z').getUTCDay();
}

/**
 * Default combo for a given IST date string.
 * Mon/Tue/Thu/Sat = Combo 2 (Off AM + Skating PM)
 * Wed/Fri = Combo 4 (Gym AM + Skating PM)
 * Sun = Combo 1 (Gym AM + Off PM)
 */
export function getDefaultCombo(dateStr: string): Combo {
  const day = getDayOfWeek(dateStr);
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  if (day === 0) return 1; // Sunday: Gym AM + Off PM
  if (day === 3 || day === 5) return 4; // Wed, Fri: Gym+Skating
  return 2; // Mon, Tue, Thu, Sat: Off+Skating
}

/** Monday (1), Wednesday (3), Friday (5) are spleen days */
export function isSpleenDay(dateStr: string): boolean {
  const day = getDayOfWeek(dateStr);
  return day === 1 || day === 3 || day === 5;
}

/** Get the last N dates before dateStr as IST date strings (most recent first) */
export function getPreviousDates(dateStr: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDays(dateStr, -(i + 1)));
}
