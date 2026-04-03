import { formatPlan } from '@/lib/whatsapp';
import { DailyPlan } from '@/lib/types';

const mockPlan: DailyPlan = {
  date: '2026-04-08', // Wednesday
  combo: 4,
  isRecoveryDay: false,
  spleenDay: true,
  slots: [
    {
      slot: 'on_waking',
      time: '06:00',
      options: [{ key: 'fixed-on_waking', slot: 'on_waking', label: '1 red banana + 1 tbsp PB + 1 slice bread', combos: [4], fixed: true }],
    },
    {
      slot: 'lunch',
      time: '13:30',
      options: [
        { key: 'vendhayam-rice', slot: 'lunch', label: 'Vendhayam rice + fish curry', combos: [1,2,3,4] },
        { key: 'kambu-rice', slot: 'lunch', label: 'Kambu rice + dal + veggies', combos: [1,2,3,4] },
      ],
      note: '✅ Both: compulsory 100g keerai + lime',
    },
    {
      slot: 'dinner',
      time: '20:30',
      options: [
        { key: 'spleen-masala', slot: 'dinner', label: 'Spleen masala + khapli dosa', combos: [1,2,3,4], tags: ['spleen'] },
        { key: 'black-rice-bowl', slot: 'dinner', label: 'Black rice bowl + chicken', combos: [1,2,3,4] },
      ],
    },
    {
      slot: 'bedtime',
      time: '21:30',
      options: [{ key: 'fixed-bedtime', slot: 'bedtime', label: '2 walnuts + 5 almonds + milk', combos: [4], fixed: true }],
      note: '💊 SUPPLEMENTS\n• Gritzo Supermilk',
    },
  ],
};

describe('formatPlan', () => {
  it('includes the day and date in the header', () => {
    const msg = formatPlan(mockPlan);
    expect(msg).toContain('WEDNESDAY');
    expect(msg).toContain('8 APR');
  });

  it('includes the training label for combo 4', () => {
    const msg = formatPlan(mockPlan);
    expect(msg).toContain('Gym Morning + Skating Evening');
  });

  it('shows LUNCH with (pick one) and both options', () => {
    const msg = formatPlan(mockPlan);
    expect(msg).toContain('LUNCH (pick one)');
    expect(msg).toContain('Option 1:');
    expect(msg).toContain('Option 2:');
    expect(msg).toContain('Vendhayam rice');
    expect(msg).toContain('Kambu rice');
  });

  it('shows DINNER with (pick one) and both options', () => {
    const msg = formatPlan(mockPlan);
    expect(msg).toContain('DINNER (pick one)');
    expect(msg).toContain('Spleen masala');
    expect(msg).toContain('Black rice bowl');
  });

  it('includes the lunch note', () => {
    const msg = formatPlan(mockPlan);
    expect(msg).toContain('100g keerai');
  });

  it('includes the bedtime note (supplements)', () => {
    const msg = formatPlan(mockPlan);
    expect(msg).toContain('Gritzo Supermilk');
  });

  it('includes recovery note when isRecoveryDay is true', () => {
    const plan = { ...mockPlan, isRecoveryDay: true };
    const msg = formatPlan(plan);
    expect(msg).toContain('RECOVERY DAY');
    expect(msg).toContain('Amla juice');
  });

  it('does NOT include recovery note when isRecoveryDay is false', () => {
    const msg = formatPlan(mockPlan);
    expect(msg).not.toContain('RECOVERY DAY');
  });

  it('single-option slots do NOT show (pick one)', () => {
    const msg = formatPlan(mockPlan);
    // on_waking has 1 option
    expect(msg).not.toContain('ON WAKING (pick one)');
  });
});
