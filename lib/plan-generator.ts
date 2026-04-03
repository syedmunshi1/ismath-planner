import { Combo, DailyPlan, MealOption, MealSlot, PlanSlot } from './types';
import {
  BREAKFAST_OPTIONS,
  LUNCH_OPTIONS,
  DINNER_OPTIONS,
  PRE_SESSION_OPTIONS,
  ANTI_INFLAMMATORY_OPTIONS,
  AVOCADO_OPTIONS,
} from './meal-options';
import { isSpleenDay, addDays } from './schedule';
import { getRecentOptionKeys, saveMealHistory, getComboForDate } from './db';

export const SLOT_TIMINGS: Record<string, string> = {
  on_waking:      '06:00',
  breakfast:      '08:00',
  mid_morning:    '10:30',
  lunch:          '13:30',
  post_lunch:     '15:00',
  pre_session:    '16:30',
  during_session: '17:30',
  post_session:   '19:30',
  evening_snack:  '17:00',
  late_evening:   '19:00',
  dinner:         '20:30',
  bedtime:        '21:30',
};

/**
 * Pick `count` options from `pool`, preferring options NOT in `recentKeys`.
 * Falls back to least-recently-used (by position in recentKeys) if pool is exhausted.
 * If history is empty, picks randomly.
 */
export function pickOptions(pool: MealOption[], recentKeys: string[], count: number): MealOption[] {
  const fresh = pool.filter((o) => !recentKeys.includes(o.key));

  if (fresh.length >= count) {
    return shuffle(fresh).slice(0, count);
  }

  // Fallback: pick from full pool ordered by least-recently-used
  const ordered = [...pool].sort((a, b) => {
    const ai = recentKeys.lastIndexOf(a.key);
    const bi = recentKeys.lastIndexOf(b.key);
    return ai - bi; // earlier in recentKeys = older = preferred
  });

  const seen = new Set<string>();
  const result: MealOption[] = [];
  for (const opt of ordered) {
    if (!seen.has(opt.key)) {
      seen.add(opt.key);
      result.push(opt);
      if (result.length === count) break;
    }
  }
  return result;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fixedSlot(slot: MealSlot, label: string, note?: string): PlanSlot {
  return {
    slot,
    time: SLOT_TIMINGS[slot],
    options: [{ key: `fixed-${slot}`, slot, label, combos: [1,2,3,4], fixed: true }],
    note,
  };
}

function getFixedSlots(combo: Combo): PlanSlot[] {
  const slots: PlanSlot[] = [];

  // ON WAKING
  if (combo === 1 || combo === 4) {
    slots.push(fixedSlot('on_waking', '1 red banana/apple + 1 tbsp peanut butter + 1 slice The Health Factory bread'));
  } else if (combo === 3) {
    slots.push(fixedSlot('on_waking', 'Coconut/almond milk smoothie: 150ml milk + 1 banana + 1 tbsp PB + 2 dates + 2 figs + 4 tbsp oats + 5 cashews + 4 almonds + ½ tsp cardamom + pinch cinnamon + 1 tsp ghee + honey'));
  }

  // DURING SESSION — gym
  if (combo === 1 || combo === 4) {
    slots.push(fixedSlot('during_session', '🏋️ GYM — Sip A: Plain water 500ml | Sip B: Lime juice + pinch of salt + honey 750ml'));
  }

  // POST SESSION — gym
  if (combo === 1 || combo === 4) {
    slots.push(fixedSlot('post_session', '2 whole boiled eggs + 2 whites + 60g boiled sweet potato'));
  }

  // POST LUNCH
  if (combo === 1 || combo === 4) {
    slots.push(fixedSlot('post_lunch', '2 Medjoul dates + 2 cubes dark chocolate 70%'));
  } else if (combo === 2) {
    slots.push(fixedSlot('post_lunch', 'Black urad halwa/Kali 1 tbsp (toasted black urad + brown jaggery + cardamom + ghee)'));
  } else if (combo === 3) {
    slots.push(fixedSlot('post_lunch', '150ml beetroot juice + ½ inch ginger juice + 2 dried figs'));
  }

  // EVENING SNACK
  if (combo === 1) {
    slots.push(fixedSlot('evening_snack', '100g boiled sundal varieties with coconut + tadka + 200ml tender coconut water with salt'));
  } else if (combo === 3) {
    slots.push(fixedSlot('evening_snack', '100g soaked jowar flakes (True Elements) + seasonal fruits + 1 tbsp seeds'));
  }

  // LATE EVENING
  if (combo === 1) {
    slots.push(fixedSlot('late_evening', '100ml Mutton soup (simmered 4 hours)'));
  }

  // DURING SESSION — skating
  if (combo === 2 || combo === 4) {
    slots.push(fixedSlot('during_session', '⛸️ SKATING — Sip A: Plain water 500ml | Sip B: Fresh OJ/lime + tender coconut water + pinch salt + 1 tsp honey in 1000ml'));
  }

  // POST SESSION — skating
  if (combo === 2 || combo === 4) {
    slots.push(fixedSlot('post_session', '⛸️ POST SKATING (immediately): 1 scoop protein + 200ml plain water + 1 banana'));
  }

  // BEDTIME
  if (combo === 1) {
    slots.push(fixedSlot('bedtime', '5 pistachios + 2 soaked figs + 150ml diluted milk + 1 scoop protein'));
  } else if (combo === 2 || combo === 4) {
    slots.push(fixedSlot('bedtime', '2 walnuts + 5 soaked almonds + 150ml plain milk + 1 tbsp powdered pistachios'));
  } else if (combo === 3) {
    slots.push(fixedSlot('bedtime', '1 banana + 1 cube dark chocolate 70% + 150ml plain water + 1 scoop protein'));
  }

  return slots;
}

const ALIV_PREFIX = '🫙 80ml amla shot + ½ tsp aliv seeds (mix together)';

const SUPPLEMENTS_NOTE = [
  '💊 SUPPLEMENTS',
  '• Gritzo Supermilk — 1 scoop (as directed)',
  '• Nordic Naturals DHA — 1 cap post dinner',
  '• Vitamin D3 2000 IU — 1 post breakfast',
].join('\n');

export const RECOVERY_NOTE = [
  '🔄 RECOVERY DAY (yesterday was double session)',
  '• Amla juice 100ml — ideally before breakfast',
  '• Ginger shot 50-80ml + honey + warm water — mid-morning',
  '• Add sweet potatoes to both lunch AND dinner today',
  '• Overnight soaked fenugreek water (1 tsp soaked in 200ml) — drink when possible',
].join('\n');

export async function generatePlan(dateStr: string): Promise<DailyPlan> {
  const { combo } = await getComboForDate(dateStr);

  const prevDate = addDays(dateStr, -1);
  const { combo: prevCombo } = await getComboForDate(prevDate);
  const isRecoveryDay = prevCombo === 4;
  const spleen = isSpleenDay(dateStr);

  const slots: PlanSlot[] = [];

  // ON WAKING
  if (combo === 2) {
    const milkshakeOptions: MealOption[] = [
      { key: 'waking-oats-shake', slot: 'on_waking', label: 'Milkshake: 5 tbsp soaked oats + 1 banana + 1 tsp chia + 1 tsp flax + 2 dates + 2 figs + 50g Greek yoghurt + milk + 1 tbsp honey', combos: [2] },
      { key: 'waking-sago-shake', slot: 'on_waking', label: 'Milkshake: 5 tbsp cooked sago + 1 banana + 1 tsp chia + 1 tsp flax + 2 dates + 2 figs + 50g Greek yoghurt + milk + 1 tbsp honey', combos: [2] },
      { key: 'waking-dalia-shake', slot: 'on_waking', label: 'Milkshake: 5 tbsp cooked dalia + 1 banana + 1 tsp chia + 1 tsp flax + 2 dates + 2 figs + 50g Greek yoghurt + milk + 1 tbsp honey', combos: [2] },
    ];
    const recent = await getRecentOptionKeys('on_waking', dateStr, 5);
    const picked = pickOptions(milkshakeOptions, recent, 1);
    slots.push({ slot: 'on_waking', time: SLOT_TIMINGS['on_waking'], options: picked });
  } else {
    const fixedOnWaking = getFixedSlots(combo).find((s) => s.slot === 'on_waking');
    if (fixedOnWaking) slots.push(fixedOnWaking);
  }

  // BREAKFAST
  if (combo === 2 || combo === 3) {
    slots.push(fixedSlot('breakfast', '2 whole eggs + 1 white (boiled) or omelette with minimal light olive oil'));
  } else {
    const recent = await getRecentOptionKeys('breakfast', dateStr, 5);
    const picked = pickOptions(BREAKFAST_OPTIONS, recent, 1);
    slots.push({ slot: 'breakfast', time: SLOT_TIMINGS['breakfast'], options: picked });
  }

  // MID MORNING
  if (combo === 1) {
    const recent = await getRecentOptionKeys('mid_morning', dateStr, 5);
    const picked = pickOptions(ANTI_INFLAMMATORY_OPTIONS, recent, 1);
    slots.push({ slot: 'mid_morning', time: SLOT_TIMINGS['mid_morning'], options: picked, note: ALIV_PREFIX });
  } else if (combo === 2) {
    slots.push(fixedSlot('mid_morning', 'Boiled sweet potato sandwich 1 set OR sweet potato tikki 3-4 pieces + 200ml tender coconut water with salt', ALIV_PREFIX));
  } else if (combo === 3) {
    slots.push(fixedSlot('mid_morning', '200ml buttermilk (Epigamia Turbo/SKYR) + 2 tbsp sattu', ALIV_PREFIX));
  } else if (combo === 4) {
    slots.push(fixedSlot('mid_morning', '100g choice of seasonal fruits / 150ml seasonal fruit juice + 1 tbsp seeds powder', ALIV_PREFIX));
  }

  // LUNCH (2 rotated)
  const recentLunch = await getRecentOptionKeys('lunch', dateStr, 5);
  const lunchOpts = pickOptions(LUNCH_OPTIONS, recentLunch, 2);
  slots.push({ slot: 'lunch', time: SLOT_TIMINGS['lunch'], options: lunchOpts, note: '✅ Both: compulsory 100g keerai + lime squeeze + 1 tsp ghee' });

  // POST LUNCH
  const postLunchFixed = getFixedSlots(combo).find((s) => s.slot === 'post_lunch');
  if (postLunchFixed) slots.push(postLunchFixed);

  // PRE SESSION (Combo 2 & 4)
  if (combo === 2 || combo === 4) {
    const recentPre = await getRecentOptionKeys('pre_session', dateStr, 5);
    const preOpts = pickOptions(PRE_SESSION_OPTIONS, recentPre, 2);
    slots.push({ slot: 'pre_session', time: SLOT_TIMINGS['pre_session'], options: preOpts });
  }

  // DURING + POST SESSION
  const fixedAll = getFixedSlots(combo);
  const duringGym = fixedAll.find((s) => s.slot === 'during_session' && s.options[0].label.includes('GYM'));
  const duringSkt = fixedAll.find((s) => s.slot === 'during_session' && s.options[0].label.includes('SKATING'));
  if (duringGym) slots.push(duringGym);
  if (duringSkt) slots.push(duringSkt);

  const postGym = fixedAll.find((s) => s.slot === 'post_session' && s.options[0].label.includes('boiled eggs'));
  const postSkt = fixedAll.find((s) => s.slot === 'post_session' && s.options[0].label.includes('SKATING'));
  if (postGym) slots.push(postGym);
  if (postSkt) slots.push(postSkt);

  // EVENING SNACK & LATE EVENING
  const eveningSnack = fixedAll.find((s) => s.slot === 'evening_snack');
  if (eveningSnack) slots.push(eveningSnack);
  const lateEvening = fixedAll.find((s) => s.slot === 'late_evening');
  if (lateEvening) slots.push(lateEvening);

  // DINNER (2 rotated + spleen override)
  const spleenOptions = DINNER_OPTIONS.filter((o) => o.tags?.includes('spleen'));
  const normalDinner = DINNER_OPTIONS.filter((o) => !o.tags?.includes('spleen'));

  let dinnerOpts: MealOption[];
  if (spleen) {
    const recentSpleen = await getRecentOptionKeys('spleen', dateStr, 14);
    const spleenPick = pickOptions(spleenOptions, recentSpleen, 1);
    const recentDinner = await getRecentOptionKeys('dinner', dateStr, 5);
    const normalPick = pickOptions(normalDinner, recentDinner, 1);
    dinnerOpts = [spleenPick[0], normalPick[0]];
  } else {
    const recentDinner = await getRecentOptionKeys('dinner', dateStr, 5);
    dinnerOpts = pickOptions(normalDinner, recentDinner, 2);
  }
  slots.push({ slot: 'dinner', time: SLOT_TIMINGS['dinner'], options: dinnerOpts });

  // BEDTIME
  const bedtime = fixedAll.find((s) => s.slot === 'bedtime');
  if (bedtime) slots.push(bedtime);

  // AVOCADO add-on
  const recentAvo = await getRecentOptionKeys('avocado', dateStr, 5);
  const validAvo = AVOCADO_OPTIONS.filter((o) => o.combos.includes(combo));
  const avoPick = pickOptions(validAvo, recentAvo, 1)[0];
  const avoSlot = slots.find((s) => s.slot === avoPick.slot);
  if (avoSlot) {
    avoSlot.note = avoSlot.note ? avoSlot.note + '\n' + avoPick.label : avoPick.label;
  }

  // SAVE to meal_history
  const toSave: Array<[string, string[]]> = [
    ['on_waking', slots.find((s) => s.slot === 'on_waking')?.options.map((o) => o.key) ?? []],
    ['breakfast', slots.find((s) => s.slot === 'breakfast')?.options.map((o) => o.key) ?? []],
    ['mid_morning', slots.find((s) => s.slot === 'mid_morning')?.options.map((o) => o.key) ?? []],
    ['lunch', lunchOpts.map((o) => o.key)],
    ['pre_session', slots.find((s) => s.slot === 'pre_session')?.options.map((o) => o.key) ?? []],
    ['dinner', dinnerOpts.map((o) => o.key)],
    ['avocado', [avoPick.key]],
    spleen ? ['spleen', [dinnerOpts[0].key]] : ['spleen', []],
  ];

  for (const [slot, keys] of toSave) {
    if (keys.length > 0) await saveMealHistory(dateStr, slot, keys);
  }

  // Sort by time
  slots.sort((a, b) => a.time.localeCompare(b.time));

  // Append supplements to bedtime
  const bedtimeSlot = slots.find((s) => s.slot === 'bedtime');
  if (bedtimeSlot) {
    bedtimeSlot.note = SUPPLEMENTS_NOTE;
  }

  return { date: dateStr, combo, slots, isRecoveryDay, spleenDay: spleen };
}
