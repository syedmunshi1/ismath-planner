import { DailyPlan, Combo, MealSlot } from './types';

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
  on_waking:      '⏰',
  breakfast:      '🍳',
  mid_morning:    '🫙',
  lunch:          '🍚',
  post_lunch:     '🍫',
  pre_session:    '⚡',
  during_session: '💧',
  post_session:   '💪',
  evening_snack:  '🌿',
  late_evening:   '🍲',
  dinner:         '🍽️',
  bedtime:        '🌙',
};

const SLOT_LABELS: Record<MealSlot, string> = {
  on_waking:      'ON WAKING',
  breakfast:      'BREAKFAST',
  mid_morning:    'MID MORNING',
  lunch:          'LUNCH',
  post_lunch:     'POST LUNCH',
  pre_session:    'PRE SESSION',
  during_session: 'DURING SESSION',
  post_session:   'POST SESSION',
  evening_snack:  'EVENING SNACK',
  late_evening:   'LATE EVENING',
  dinner:         'DINNER',
  bedtime:        'BEDTIME',
};

const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAY_NAMES = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

const RECOVERY_NOTE = [
  '🔄 RECOVERY DAY (yesterday was double session)',
  '• Amla juice 100ml — ideally before breakfast',
  '• Ginger shot 50-80ml + honey + warm water — mid-morning',
  '• Add sweet potatoes to both lunch AND dinner today',
  '• Overnight soaked fenugreek water (1 tsp soaked in 200ml) — drink when possible',
].join('\n');

function formatDateHeader(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  const dayName = DAY_NAMES[d.getUTCDay()];
  const month = MONTH_NAMES[d.getUTCMonth()];
  const day = d.getUTCDate();
  return `${dayName}, ${day} ${month}`;
}

export function formatPlan(plan: DailyPlan): string {
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

export async function sendWhatsApp(message: string): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_RECIPIENT_NUMBER;

  if (!token || !phoneId || !to) {
    throw new Error('Missing WhatsApp env vars: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_RECIPIENT_NUMBER');
  }

  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'daily_nutrition_plan',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: message }],
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WhatsApp API error ${res.status}: ${body}`);
  }
}
