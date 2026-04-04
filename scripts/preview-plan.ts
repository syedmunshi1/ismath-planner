/**
 * Local plan preview — no DB or credentials needed.
 * Usage: npx ts-node scripts/preview-plan.ts [YYYY-MM-DD]
 * Example: npx ts-node scripts/preview-plan.ts 2026-04-08
 * Default: tomorrow (IST)
 */

// ── Types ─────────────────────────────────────────────────────────
type MealSlot =
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

type Combo = 1 | 2 | 3 | 4;

interface MealOption {
  key: string;
  slot: MealSlot;
  label: string;
  combos: Combo[];
  tags?: string[];
  fixed?: boolean;
}

interface PlanSlot {
  slot: MealSlot;
  time: string;
  options: MealOption[];
  note?: string;
}

interface DailyPlan {
  date: string;
  combo: Combo;
  slots: PlanSlot[];
  isRecoveryDay: boolean;
  spleenDay: boolean;
}

// ── Slot Timings ──────────────────────────────────────────────────
const SLOT_TIMINGS: Record<string, string> = {
  on_waking: '06:00',
  breakfast: '08:00',
  mid_morning: '10:30',
  lunch: '13:30',
  post_lunch: '15:00',
  pre_session: '16:30',
  during_session: '17:30',
  post_session: '19:30',
  evening_snack: '17:00',
  late_evening: '19:00',
  dinner: '20:30',
  bedtime: '21:30',
};

// ── Meal Options ──────────────────────────────────────────────────
const BREAKFAST_OPTIONS: MealOption[] = [
  { key: 'millet-idli', slot: 'breakfast', label: '4-5 millet/red-rice idlis + 100ml coconut milk or peanut chutney + 1 tsp ghee + papaya + Greek yoghurt', combos: [1, 2, 3, 4] },
  { key: 'foxtail-pongal', slot: 'breakfast', label: '100g foxtail millet pongal + 1 tsp ghee + pepper-cumin tempering + 1 boiled egg or 50g paneer', combos: [1, 2, 3, 4] },
  { key: 'dalia-upma', slot: 'breakfast', label: '100g vegetable broken-wheat upma + 1 boiled egg or 50g tofu + 1 tbsp hummus', combos: [1, 2, 3, 4] },
  { key: 'wholegrain-dosa', slot: 'breakfast', label: '2-3 wholegrain dosas (finger-millet/oats/amaranth) + 2 tbsp chutney + sautéed spinach or 50g paneer bhurji', combos: [1, 2, 3, 4] },
  { key: 'overnight-oats', slot: 'breakfast', label: 'Overnight oats/amaranth porridge (100ml milk + 1 tsp chia + ½ tsp cinnamon + 1 tsp nut butter) + seasonal fruit + Greek yoghurt', combos: [1, 2, 3, 4] },
  { key: 'sweet-potato-bowl', slot: 'breakfast', label: '100g sweet potato mash bowl + 1 egg omelette with sautéed spinach + 1 tsp nut butter + cinnamon', combos: [1, 2, 3, 4] },
  { key: 'wholegrain-wrap', slot: 'breakfast', label: '2 wholegrain wraps (chapati) + 2 scrambled eggs + 50g sautéed bell peppers + 1 tsp hummus + ½ orange or 3 dates', combos: [1, 2, 3, 4] },
];

const LUNCH_OPTIONS: MealOption[] = [
  { key: 'murunga-keerai-rice', slot: 'lunch', label: '100g murunga keerai rice (rice cooked with drumstick leaves) + 100g fish curry (tilapia/sardines/pomfret in tomato-ginger gravy) + drumstick stir-fry or sautéed spinach + 200ml buttermilk', combos: [1, 2, 3, 4] },
  { key: 'rice-dal', slot: 'lunch', label: '100g rice (70g white + 30g rakthasaali) + rajmah-tomato gravy + 60g soya chunks OR 2 boiled eggs + carrot-beetroot sabzi + Greek yoghurt', combos: [1, 2, 3, 4] },
  { key: 'chicken-fried-rice', slot: 'lunch', label: '150g chicken breast fried rice (homemade, minimal oil) + stir-fried broccoli + carrot + bell peppers + 50g Greek yoghurt', combos: [1, 2, 3, 4] },
  { key: 'vendhayam-rice', slot: 'lunch', label: '100g vendhayam red rice (fenugreek-infused) + 100g chicken OR mutton curry (simple spice base, no cream) + 100g avial (drumstick + carrot + raw banana + coconut) + Greek yoghurt', combos: [1, 2, 3, 4] },
  { key: 'coconut-ellu-rice', slot: 'lunch', label: '100g coconut rice or ellu sadham (sesame rice) + 80g paneer tikka OR 120g tofu curry + bhindi stir-fry or cauliflower-cluster beans sabzi + Greek yoghurt', combos: [1, 2, 3, 4] },
  { key: 'foxtail-millet-rice', slot: 'lunch', label: '100g foxtail millet rice or pasi payaru rice + 100g fish curry (mackerel/pomfret) OR chicken gravy + sautéed murunga keerai or spinach + 50g Greek yoghurt', combos: [1, 2, 3, 4] },
  { key: 'kambu-rice', slot: 'lunch', label: '100g kambu rice or thathha payaru sadham or ulundhu sadham + 100g beef OR chicken gravy (simple tomato base) + drumstick sabzi or carrot-bean stir-fry + 50g Epigamia Turbo', combos: [1, 2, 3, 4] },
];

const DINNER_OPTIONS: MealOption[] = [
  { key: 'khapli-dosa-gravy', slot: 'dinner', label: '3 medium khapli atta dosas + chicken OR fish curry 150g (simple spice-tomato base, no cream) + sautéed spinach with garlic or broccoli stir-fry', combos: [1, 2, 3, 4] },
  { key: 'sattu-dosa-gravy', slot: 'dinner', label: '2 sattu dosas or almond flaxseed rotis + egg curry 150g (2 eggs in onion-tomato gravy) OR soya chunks gravy + cauliflower-carrot sabzi or cluster beans stir-fry', combos: [1, 2, 3, 4] },
  { key: 'black-rice-bowl', slot: 'dinner', label: '100g black rice bowl + 100g grilled chicken breast or beef strips + steamed broccoli + carrot + cucumber-tomato salad with mint chutney', combos: [1, 2, 3, 4] },
  { key: 'red-rice-adai', slot: 'dinner', label: '2 red rice or kambu adai/pesarettu + 150g fish curry (sardines/pomfret) OR mutton gravy + murunga keerai thoran or drumstick sabzi', combos: [1, 2, 3, 4] },
  { key: 'barley-khichdi', slot: 'dinner', label: '100g barley khichdi + 80g paneer tikka (oil-free) or tofu stir-fry + beetroot-carrot sabzi + cucumber-tomato salad', combos: [1, 2, 3, 4] },
  { key: 'bowls-wraps-chicken', slot: 'dinner', label: 'Bowl: 100g brown/black rice + 100g grilled chicken OR paneer curry (no cream) + poached spinach or roasted drumstick + salad dressing', combos: [1, 2, 3, 4] },
  { key: 'spleen-masala', slot: 'dinner', label: 'Mutton/goat spleen masala (75-100g) + khapli atta dosa 2 + sautéed spinach + mint chutney', combos: [1, 2, 3, 4], tags: ['spleen'] },
  { key: 'spleen-stir-fry', slot: 'dinner', label: 'Spleen stir-fry with onions + ginger + garlic (75-100g) + kambu roti 2 + cucumber salad', combos: [1, 2, 3, 4], tags: ['spleen'] },
];

const PRE_SESSION_OPTIONS: MealOption[] = [
  { key: 'sathumaav-kanji', slot: 'pre_session', label: 'Sathumaav kanji 200ml + 1 red banana + 1 tsp peanut butter', combos: [2, 4] },
  { key: 'watermelon-cashew', slot: 'pre_session', label: '200ml fresh watermelon juice + salt + banana & cashew mix (1 banana + 5-6 crushed cashews + salt)', combos: [2, 4] },
  { key: 'pineapple-puffed', slot: 'pre_session', label: '200ml fresh pineapple juice + 1 cup puffed rice + 1.5 tbsp roasted peanuts + ½ tsp jaggery powder', combos: [2, 4] },
  { key: 'watermelon-puffed', slot: 'pre_session', label: '200ml fresh watermelon juice + 1 cup puffed rice + 1.5 tbsp roasted peanuts + 1 chopped banana', combos: [2, 4] },
  { key: 'multigrain-banana', slot: 'pre_session', label: '1 slice multigrain bread + peanut butter + ½ banana + 1 dried fig + 3 pistachios + ½ tsp honey + cinnamon + 100ml OJ with salt', combos: [2, 4] },
  { key: 'dalia-porridge', slot: 'pre_session', label: '3 tbsp dalia porridge (rice flakes + almond milk + cardamom + honey + jaggery + raisins + pistachios)', combos: [2, 4] },
];

const ANTI_INFLAMMATORY_OPTIONS: MealOption[] = [
  { key: 'bhel-sprouts', slot: 'mid_morning', label: '100g homemade bhel with puffed rice + sprouted green gram + diced tomato + cucumber + onion + lime', combos: [1] },
  { key: 'makhana-yoghurt', slot: 'mid_morning', label: '1 katori makhana + 50g Greek yoghurt/SKYR', combos: [1] },
  { key: 'cucumber-chaat', slot: 'mid_morning', label: '100g cucumber chaat (diced cucumber + tomatoes + onion + lemon + mint)', combos: [1] },
  { key: 'boiled-sundal', slot: 'mid_morning', label: 'Boiled chickpeas or green gram 1 katori + fresh coconut + green chilli tempering + diced onion + lime squeeze', combos: [1] },
  { key: 'roasted-chickpeas', slot: 'mid_morning', label: '1 katori roasted chickpeas/edamame with choice of seasonings', combos: [1] },
  { key: 'avo-multigrain-snack', slot: 'mid_morning', label: '½ mashed avocado on multigrain/sourdough bread with seasonings', combos: [1] },
];

const AVOCADO_OPTIONS: MealOption[] = [
  { key: 'avo-smoothie', slot: 'on_waking', label: '+½ avocado blended into waking smoothie', combos: [2, 3] },
  { key: 'avo-toast', slot: 'breakfast', label: '+avocado toast: ½ mashed avo on multigrain + lime + chilli flakes', combos: [1, 2, 3, 4] },
  { key: 'avo-guac-lunch', slot: 'lunch', label: '+guacamole (mashed avo + lime + salt + coriander) as dressing', combos: [1, 2, 3, 4] },
  { key: 'avo-pre-session', slot: 'pre_session', label: '+½ mashed avocado on multigrain bread with salt + lime (add to pre-session)', combos: [2, 4] },
  { key: 'avo-dinner-salad', slot: 'dinner', label: '+avocado-cucumber salad (diced avo + cucumber + tomato + lime + mint)', combos: [1, 2, 3, 4] },
];

// ── Helper Functions ──────────────────────────────────────────────

/**
 * Pick `count` options from `pool`, preferring options NOT in `recentKeys`.
 * If history is empty, picks randomly.
 */
function pickOptions(pool: MealOption[], recentKeys: string[], count: number): MealOption[] {
  const fresh = pool.filter((o) => !recentKeys.includes(o.key));

  if (fresh.length >= count) {
    return shuffle(fresh).slice(0, count);
  }

  const ordered = [...pool].sort((a, b) => {
    const ai = recentKeys.lastIndexOf(a.key);
    const bi = recentKeys.lastIndexOf(b.key);
    return ai - bi;
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
    options: [{ key: `fixed-${slot}`, slot, label, combos: [1, 2, 3, 4], fixed: true }],
    note,
  };
}

function getFixedSlots(combo: Combo): PlanSlot[] {
  const slots: PlanSlot[] = [];

  // ON WAKING
  if (combo === 1 || combo === 4) {
    slots.push(
      fixedSlot('on_waking', '1 red banana/apple + 1 tbsp peanut butter + 1 slice The Health Factory bread')
    );
  } else if (combo === 3) {
    slots.push(
      fixedSlot(
        'on_waking',
        'Coconut/almond milk smoothie: 150ml milk + 1 banana + 1 tbsp PB + 2 dates + 2 figs + 4 tbsp oats + 5 cashews + 4 almonds + ½ tsp cardamom + pinch cinnamon + 1 tsp ghee + honey'
      )
    );
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
    slots.push(
      fixedSlot('post_lunch', 'Black urad halwa/Kali 1 tbsp (toasted black urad + brown jaggery + cardamom + ghee)')
    );
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
    slots.push(
      fixedSlot(
        'during_session',
        '⛸️ SKATING — Sip A: Plain water 500ml | Sip B: Fresh OJ/lime + tender coconut water + pinch salt + 1 tsp honey in 1000ml'
      )
    );
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

// ── Schedule Functions ────────────────────────────────────────────

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function toISTDate(date: Date = new Date()): string {
  const istMs = date.getTime() + IST_OFFSET_MS;
  const istDate = new Date(istMs);
  return istDate.toISOString().slice(0, 10);
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00Z').getUTCDay();
}

function getDefaultCombo(dateStr: string): Combo {
  const day = getDayOfWeek(dateStr);
  if (day === 0) return 1; // Sunday: Gym AM + Off PM
  if (day === 3 || day === 5) return 4; // Wed, Fri: Gym+Skating
  return 2; // Mon, Tue, Thu, Sat: Off+Skating
}

function isSpleenDay(dateStr: string): boolean {
  const day = getDayOfWeek(dateStr);
  return day === 1 || day === 3 || day === 5;
}

// ── Format Functions ─────────────────────────────────────────────

const ALIV_PREFIX = '🫙 80ml amla shot + ½ tsp aliv seeds (mix together)';

const SUPPLEMENTS_NOTE = [
  '💊 SUPPLEMENTS',
  '• Gritzo Supermilk — 1 scoop (as directed)',
  '• Nordic Naturals DHA — 1 cap post dinner',
  '• Vitamin D3 2000 IU — 1 post breakfast',
].join('\n');

const RECOVERY_NOTE = [
  '🔄 RECOVERY DAY (yesterday was double session)',
  '• Amla juice 100ml — ideally before breakfast',
  '• Ginger shot 50-80ml + honey + warm water — mid-morning',
  '• Add sweet potatoes to both lunch AND dinner today',
  '• Overnight soaked fenugreek water (1 tsp soaked in 200ml) — drink when possible',
].join('\n');

const COMBO_LABELS: Record<Combo, string> = {
  1: 'Gym Morning',
  2: 'Skating Evening',
  3: 'Full Rest Day',
  4: 'Gym Morning + Skating Evening',
};

const COMBO_EMOJIS: Record<Combo, string> = {
  1: '🏋️',
  2: '⛸️',
  3: '🌿',
  4: '🏋️⛸️',
};

const SLOT_EMOJIS: Record<MealSlot, string> = {
  on_waking: '⏰',
  breakfast: '🍳',
  mid_morning: '🫙',
  lunch: '🍚',
  post_lunch: '🍫',
  pre_session: '⚡',
  during_session: '💧',
  post_session: '💪',
  evening_snack: '🌿',
  late_evening: '🍲',
  dinner: '🍽️',
  bedtime: '🌙',
};

const SLOT_LABELS: Record<MealSlot, string> = {
  on_waking: 'ON WAKING',
  breakfast: 'BREAKFAST',
  mid_morning: 'MID MORNING',
  lunch: 'LUNCH',
  post_lunch: 'POST LUNCH',
  pre_session: 'PRE SESSION',
  during_session: 'DURING SESSION',
  post_session: 'POST SESSION',
  evening_snack: 'EVENING SNACK',
  late_evening: 'LATE EVENING',
  dinner: 'DINNER',
  bedtime: 'BEDTIME',
};

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

function formatDateHeader(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  const dayName = DAY_NAMES[d.getUTCDay()];
  const month = MONTH_NAMES[d.getUTCMonth()];
  const day = d.getUTCDate();
  return `${dayName}, ${day} ${month}`;
}

function formatPlan(plan: DailyPlan): string {
  const lines: string[] = [];
  const emoji = COMBO_EMOJIS[plan.combo];
  const training = COMBO_LABELS[plan.combo];
  const header = formatDateHeader(plan.date);

  lines.push(`${emoji} ISMATH'S PLAN — ${header}`);
  lines.push('');
  lines.push(`Training: ${training}`);

  if (plan.isRecoveryDay) {
    lines.push('');
    lines.push(RECOVERY_NOTE);
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━');

  for (const s of plan.slots) {
    lines.push('');
    const slotEmoji = SLOT_EMOJIS[s.slot];
    const slotLabel = SLOT_LABELS[s.slot];
    const multiOption = s.options.length > 1;

    lines.push(`${slotEmoji} ${s.time} | ${slotLabel}${multiOption ? ' (pick one)' : ''}`);

    if (multiOption) {
      s.options.forEach((opt, i) => {
        lines.push(`Option ${i + 1}: ${opt.label}`);
      });
    } else {
      lines.push(s.options[0].label);
    }

    if (s.note) {
      lines.push(s.note);
    }
  }

  return lines.join('\n');
}

// ── Plan Builder ──────────────────────────────────────────────────

function buildPlan(dateStr: string): DailyPlan {
  const combo = getDefaultCombo(dateStr);
  const prevDate = addDays(dateStr, -1);
  const prevCombo = getDefaultCombo(prevDate);
  const isRecoveryDay = prevCombo === 4;
  const spleen = isSpleenDay(dateStr);

  const slots: PlanSlot[] = [];
  const fixedAll = getFixedSlots(combo);

  // ON WAKING
  if (combo === 2) {
    const milkshakeOptions: MealOption[] = [
      {
        key: 'waking-oats-shake',
        slot: 'on_waking',
        label: 'Milkshake: 5 tbsp soaked oats + 1 banana + 1 tsp chia + 1 tsp flax + 2 dates + 2 figs + 50g Greek yoghurt + milk + 1 tbsp honey',
        combos: [2],
      },
      {
        key: 'waking-sago-shake',
        slot: 'on_waking',
        label: 'Milkshake: 5 tbsp cooked sago + 1 banana + 1 tsp chia + 1 tsp flax + 2 dates + 2 figs + 50g Greek yoghurt + milk + 1 tbsp honey',
        combos: [2],
      },
      {
        key: 'waking-dalia-shake',
        slot: 'on_waking',
        label: 'Milkshake: 5 tbsp cooked dalia + 1 banana + 1 tsp chia + 1 tsp flax + 2 dates + 2 figs + 50g Greek yoghurt + milk + 1 tbsp honey',
        combos: [2],
      },
    ];
    slots.push({
      slot: 'on_waking',
      time: SLOT_TIMINGS['on_waking'],
      options: pickOptions(milkshakeOptions, [], 1),
    });
  } else {
    const f = fixedAll.find((s) => s.slot === 'on_waking');
    if (f) slots.push(f);
  }

  // BREAKFAST
  if (combo === 2 || combo === 3) {
    slots.push(fixedSlot('breakfast', '2 whole eggs + 1 white (boiled) or omelette with minimal light olive oil'));
  } else {
    slots.push({
      slot: 'breakfast',
      time: SLOT_TIMINGS['breakfast'],
      options: pickOptions(BREAKFAST_OPTIONS, [], 1),
    });
  }

  // MID MORNING
  if (combo === 1) {
    slots.push({
      slot: 'mid_morning',
      time: SLOT_TIMINGS['mid_morning'],
      options: pickOptions(ANTI_INFLAMMATORY_OPTIONS, [], 1),
      note: ALIV_PREFIX,
    });
  } else if (combo === 2) {
    slots.push(
      fixedSlot(
        'mid_morning',
        'Boiled sweet potato sandwich 1 set OR sweet potato tikki 3-4 pieces + 200ml tender coconut water with salt',
        ALIV_PREFIX
      )
    );
  } else if (combo === 3) {
    slots.push(
      fixedSlot('mid_morning', '200ml buttermilk (Epigamia Turbo/SKYR) + 2 tbsp sattu', ALIV_PREFIX)
    );
  } else if (combo === 4) {
    slots.push(
      fixedSlot(
        'mid_morning',
        '100g choice of seasonal fruits / 150ml seasonal fruit juice + 1 tbsp seeds powder',
        ALIV_PREFIX
      )
    );
  }

  // LUNCH
  const lunchOpts = pickOptions(LUNCH_OPTIONS, [], 2);
  slots.push({
    slot: 'lunch',
    time: SLOT_TIMINGS['lunch'],
    options: lunchOpts,
    note: '✅ Both: compulsory 100g keerai + lime squeeze + 1 tsp ghee',
  });

  // POST LUNCH
  const postLunch = fixedAll.find((s) => s.slot === 'post_lunch');
  if (postLunch) slots.push(postLunch);

  // PRE SESSION
  if (combo === 2 || combo === 4) {
    slots.push({
      slot: 'pre_session',
      time: SLOT_TIMINGS['pre_session'],
      options: pickOptions(PRE_SESSION_OPTIONS, [], 2),
    });
  }

  // DURING + POST SESSION
  const duringGym = fixedAll.find(
    (s) => s.slot === 'during_session' && s.options[0].label.includes('GYM')
  );
  const duringSkt = fixedAll.find(
    (s) => s.slot === 'during_session' && s.options[0].label.includes('SKATING')
  );
  if (duringGym) slots.push(duringGym);
  if (duringSkt) slots.push(duringSkt);

  const postGym = fixedAll.find((s) => s.slot === 'post_session' && s.options[0].label.includes('boiled eggs'));
  const postSkt = fixedAll.find((s) => s.slot === 'post_session' && s.options[0].label.includes('SKATING'));
  if (postGym) slots.push(postGym);
  if (postSkt) slots.push(postSkt);

  // EVENING SNACK + LATE EVENING
  const eve = fixedAll.find((s) => s.slot === 'evening_snack');
  if (eve) slots.push(eve);
  const late = fixedAll.find((s) => s.slot === 'late_evening');
  if (late) slots.push(late);

  // DINNER
  const spleenOpts = DINNER_OPTIONS.filter((o) => o.tags?.includes('spleen'));
  const normalDinner = DINNER_OPTIONS.filter((o) => !o.tags?.includes('spleen'));
  let dinnerOpts: MealOption[];
  if (spleen) {
    dinnerOpts = [pickOptions(spleenOpts, [], 1)[0], pickOptions(normalDinner, [], 1)[0]];
  } else {
    dinnerOpts = pickOptions(normalDinner, [], 2);
  }
  slots.push({ slot: 'dinner', time: SLOT_TIMINGS['dinner'], options: dinnerOpts });

  // BEDTIME
  const bedtime = fixedAll.find((s) => s.slot === 'bedtime');
  if (bedtime) slots.push(bedtime);

  // AVOCADO add-on
  const validAvo = AVOCADO_OPTIONS.filter((o) => o.combos.includes(combo));
  const avoPick = pickOptions(validAvo, [], 1)[0];
  const avoSlot = slots.find((s) => s.slot === avoPick.slot);
  if (avoSlot) avoSlot.note = avoSlot.note ? avoSlot.note + '\n' + avoPick.label : avoPick.label;

  // Sort by time
  slots.sort((a, b) => a.time.localeCompare(b.time));

  // Supplements on bedtime
  const bt = slots.find((s) => s.slot === 'bedtime');
  if (bt) bt.note = SUPPLEMENTS_NOTE;

  return { date: dateStr, combo, slots, isRecoveryDay, spleenDay: spleen };
}

// ── Main ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isWeek = args.includes('--week');
const dateArg = args.find(a => !a.startsWith('--'));
const startDate = dateArg ?? addDays(toISTDate(new Date()), 1);
const days = isWeek ? 7 : 1;

const divider = '═'.repeat(60);

for (let i = 0; i < days; i++) {
  const targetDate = addDays(startDate, i);
  if (i > 0) console.log('\n' + divider + '\n');
  if (isWeek) console.log(`📅 Day ${i + 1} of 7\n`);
  const plan = buildPlan(targetDate);
  const output = formatPlan(plan);
  console.log(output);
  console.log('\n---');
  console.log(`Combo: ${plan.combo} | Recovery: ${plan.isRecoveryDay} | Spleen day: ${plan.spleenDay}`);
}
