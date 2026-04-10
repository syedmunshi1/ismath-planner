import { sql } from '@vercel/postgres';
import { Combo, MealHistoryRow } from './types';
import { getDefaultCombo } from './schedule';

// ── Schedule overrides ──────────────────────────────────────────────

export async function getScheduleOverridesForWeek(weekStart: string): Promise<Record<string, Combo>> {
  const result = await sql`
    SELECT date::text, combo FROM schedule_overrides
    WHERE date >= ${weekStart}::date AND date < (${weekStart}::date + INTERVAL '7 days')
  `;
  const map: Record<string, Combo> = {};
  for (const row of result.rows) {
    map[row.date] = row.combo as Combo;
  }
  return map;
}

export async function getComboForDate(dateStr: string): Promise<{ combo: Combo; isOverride: boolean }> {
  const result = await sql`
    SELECT combo FROM schedule_overrides WHERE date = ${dateStr}::date
  `;
  if (result.rows.length > 0) {
    return { combo: result.rows[0].combo as Combo, isOverride: true };
  }
  return { combo: getDefaultCombo(dateStr), isOverride: false };
}

export async function setScheduleOverride(dateStr: string, combo: Combo): Promise<void> {
  await sql`
    INSERT INTO schedule_overrides (date, combo)
    VALUES (${dateStr}::date, ${combo})
    ON CONFLICT (date) DO UPDATE SET combo = EXCLUDED.combo, created_at = NOW()
  `;
}

export async function resetAllOverrides(): Promise<void> {
  await sql`DELETE FROM schedule_overrides`;
}

// ── Meal history ────────────────────────────────────────────────────

export async function getMealHistoryForSlot(slot: string, sinceDate: string): Promise<MealHistoryRow[]> {
  const result = await sql`
    SELECT date::text, slot, option_key, created_at::text
    FROM meal_history
    WHERE slot = ${slot} AND date >= ${sinceDate}::date
    ORDER BY date DESC
  `;
  return result.rows as MealHistoryRow[];
}

export async function getRecentOptionKeys(slot: string, beforeDate: string, days: number): Promise<string[]> {
  // Only count the first 2 option_keys per date (insertion order) to prevent
  // repeated page loads from inflating the "used" set with all 7 options.
  const result = await sql`
    SELECT DISTINCT option_key FROM (
      SELECT option_key,
             ROW_NUMBER() OVER (PARTITION BY date ORDER BY id ASC) AS rn
      FROM meal_history
      WHERE slot = ${slot}
        AND date < ${beforeDate}::date
        AND date >= (${beforeDate}::date - INTERVAL '1 day' * ${days})
    ) t WHERE rn <= 2
  `;
  return result.rows.map((r) => r.option_key);
}

export async function getPicksForDate(dateStr: string, slot: string): Promise<string[]> {
  // Return the first 2 options saved for this exact date+slot (by insertion order).
  // Allows generatePlan to be idempotent: reuse saved picks instead of re-rolling.
  const result = await sql`
    SELECT option_key FROM (
      SELECT option_key,
             ROW_NUMBER() OVER (ORDER BY id ASC) AS rn
      FROM meal_history
      WHERE date = ${dateStr}::date AND slot = ${slot}
    ) t WHERE rn <= 2
  `;
  return result.rows.map((r) => r.option_key);
}

export async function getLeastRecentlyUsed(slot: string, beforeDate: string): Promise<string | null> {
  const result = await sql`
    SELECT option_key FROM meal_history
    WHERE slot = ${slot} AND date < ${beforeDate}::date
    ORDER BY date ASC
    LIMIT 1
  `;
  return result.rows[0]?.option_key ?? null;
}

export async function saveMealHistory(dateStr: string, slot: string, optionKeys: string[]): Promise<void> {
  for (const key of optionKeys) {
    await sql`
      INSERT INTO meal_history (date, slot, option_key)
      VALUES (${dateStr}::date, ${slot}, ${key})
      ON CONFLICT (date, slot, option_key) DO NOTHING
    `;
  }
}

export async function getMealHistoryLast14Days(todayIST: string): Promise<MealHistoryRow[]> {
  const result = await sql`
    SELECT date::text, slot, option_key, created_at::text
    FROM meal_history
    WHERE date >= (${todayIST}::date - INTERVAL '14 days')
    ORDER BY date DESC, slot ASC
  `;
  return result.rows as MealHistoryRow[];
}

// ── Send log ────────────────────────────────────────────────────────

export async function getSendLog(planDate: string): Promise<{ status: string; sent_at: string; error_msg: string | null } | null> {
  const result = await sql`
    SELECT status, sent_at::text, error_msg
    FROM send_log WHERE plan_date = ${planDate}::date
  `;
  return (result.rows[0] as { status: string; sent_at: string; error_msg: string | null } | undefined) ?? null;
}

export async function upsertSendLog(planDate: string, status: 'success' | 'failed', errorMsg?: string): Promise<void> {
  await sql`
    INSERT INTO send_log (plan_date, status, error_msg)
    VALUES (${planDate}::date, ${status}, ${errorMsg ?? null})
    ON CONFLICT (plan_date)
    DO UPDATE SET status = EXCLUDED.status, sent_at = NOW(), error_msg = EXCLUDED.error_msg
  `;
}
