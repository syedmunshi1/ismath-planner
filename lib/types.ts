export type MealSlot =
  | 'on_waking'
  | 'breakfast'
  | 'mid_morning'
  | 'lunch'
  | 'post_lunch'
  | 'pre_session'
  | 'during_session'
  | 'post_session'
  | 'evening_snack'
  | 'late_evening'
  | 'dinner'
  | 'bedtime';

export type Combo = 1 | 2 | 3 | 4;

export interface MealOption {
  key: string;
  slot: MealSlot;
  label: string;
  combos: Combo[];
  tags?: string[];
  fixed?: boolean;
}

export interface PlanSlot {
  slot: MealSlot;
  time: string;          // HH:MM IST e.g. '06:00'
  options: MealOption[]; // 1 for fixed, 2 for rotated
  note?: string;
}

export interface DailyPlan {
  date: string;           // 'YYYY-MM-DD' IST
  combo: Combo;
  slots: PlanSlot[];
  isRecoveryDay: boolean;
  spleenDay: boolean;
}

export interface ScheduleDay {
  date: string;           // 'YYYY-MM-DD' IST
  combo: Combo;
  isOverride: boolean;
}

export interface MealHistoryRow {
  date: string;
  slot: string;
  option_key: string;
  created_at: string;
}
