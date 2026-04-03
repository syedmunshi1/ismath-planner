import {
  pickOptions,
  SLOT_TIMINGS,
} from '@/lib/plan-generator';
import { BREAKFAST_OPTIONS, DINNER_OPTIONS, PRE_SESSION_OPTIONS } from '@/lib/meal-options';
import { MealOption } from '@/lib/types';

describe('pickOptions', () => {
  const options: MealOption[] = BREAKFAST_OPTIONS;

  it('returns 2 options when history is empty', () => {
    const result = pickOptions(options, [], 2);
    expect(result).toHaveLength(2);
    expect(result[0].key).not.toBe(result[1].key);
  });

  it('avoids recently used options', () => {
    const recentKeys = ['millet-idli', 'foxtail-pongal', 'dalia-upma', 'wholegrain-dosa', 'overnight-oats'];
    const result = pickOptions(options, recentKeys, 2);
    expect(result).toHaveLength(2);
    result.forEach((opt) => expect(recentKeys).not.toContain(opt.key));
  });

  it('falls back gracefully when all options are recent', () => {
    const allKeys = options.map((o) => o.key);
    const result = pickOptions(options, allKeys, 2);
    expect(result).toHaveLength(2);
  });

  it('returns 1 option when count=1', () => {
    const result = pickOptions(options, [], 1);
    expect(result).toHaveLength(1);
  });

  it('returns no duplicates in results', () => {
    const result = pickOptions(options, [], 2);
    const keys = result.map((o) => o.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('spleen hard override data', () => {
  it('spleen options have spleen tag', () => {
    const spleenOptions = DINNER_OPTIONS.filter((o) => o.tags?.includes('spleen'));
    expect(spleenOptions.length).toBe(2);
  });

  it('non-spleen dinner options exist', () => {
    const normalOptions = DINNER_OPTIONS.filter((o) => !o.tags?.includes('spleen'));
    expect(normalOptions.length).toBeGreaterThanOrEqual(2);
  });
});

describe('PRE_SESSION_OPTIONS', () => {
  it('all pre-session options are valid for combos 2 and 4', () => {
    PRE_SESSION_OPTIONS.forEach((opt) => {
      expect(opt.combos).toContain(2);
      expect(opt.combos).toContain(4);
    });
  });
});

describe('SLOT_TIMINGS', () => {
  it('has a timing for each required slot', () => {
    const requiredSlots = ['on_waking', 'breakfast', 'mid_morning', 'lunch', 'post_lunch', 'pre_session', 'during_session', 'post_session', 'evening_snack', 'late_evening', 'dinner', 'bedtime'];
    requiredSlots.forEach((slot) => {
      expect(SLOT_TIMINGS[slot]).toBeDefined();
      expect(SLOT_TIMINGS[slot]).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});
