import {
  getDefaultCombo,
  toISTDate,
  getTomorrowIST,
  isSpleenDay,
  addDays,
  getPreviousDates,
} from '@/lib/schedule';

describe('getDefaultCombo', () => {
  it('returns Combo 2 for Monday', () => {
    expect(getDefaultCombo('2026-04-06')).toBe(2); // Monday
  });
  it('returns Combo 4 for Wednesday', () => {
    expect(getDefaultCombo('2026-04-08')).toBe(4); // Wednesday
  });
  it('returns Combo 4 for Friday', () => {
    expect(getDefaultCombo('2026-04-10')).toBe(4); // Friday
  });
  it('returns Combo 3 for Sunday', () => {
    expect(getDefaultCombo('2026-04-12')).toBe(3); // Sunday
  });
  it('returns Combo 2 for Saturday', () => {
    expect(getDefaultCombo('2026-04-11')).toBe(2); // Saturday
  });
  it('returns Combo 2 for Tuesday', () => {
    expect(getDefaultCombo('2026-04-07')).toBe(2); // Tuesday
  });
  it('returns Combo 2 for Thursday', () => {
    expect(getDefaultCombo('2026-04-09')).toBe(2); // Thursday
  });
});

describe('toISTDate', () => {
  it('converts UTC timestamp to IST date string — same day at 14:30 UTC = 20:00 IST', () => {
    const utcDate = new Date('2026-04-02T14:30:00Z');
    expect(toISTDate(utcDate)).toBe('2026-04-02');
  });
  it('handles UTC times that are still the same IST date at midnight UTC', () => {
    const utcDate = new Date('2026-04-02T00:00:00Z');
    expect(toISTDate(utcDate)).toBe('2026-04-02');
  });
  it('correctly handles date rollover — 18:31 UTC = 00:01 IST next day', () => {
    const utcDate = new Date('2026-04-02T18:31:00Z');
    expect(toISTDate(utcDate)).toBe('2026-04-03');
  });
});

describe('isSpleenDay', () => {
  it('Monday is a spleen day', () => {
    expect(isSpleenDay('2026-04-06')).toBe(true); // Monday
  });
  it('Wednesday is a spleen day', () => {
    expect(isSpleenDay('2026-04-08')).toBe(true); // Wednesday
  });
  it('Friday is a spleen day', () => {
    expect(isSpleenDay('2026-04-10')).toBe(true); // Friday
  });
  it('Tuesday is NOT a spleen day', () => {
    expect(isSpleenDay('2026-04-07')).toBe(false); // Tuesday
  });
  it('Sunday is NOT a spleen day', () => {
    expect(isSpleenDay('2026-04-12')).toBe(false); // Sunday
  });
});

describe('addDays', () => {
  it('adds 1 day', () => {
    expect(addDays('2026-04-02', 1)).toBe('2026-04-03');
  });
  it('handles month rollover', () => {
    expect(addDays('2026-04-30', 1)).toBe('2026-05-01');
  });
  it('subtracts days with negative n', () => {
    expect(addDays('2026-04-02', -1)).toBe('2026-04-01');
  });
});

describe('getPreviousDates', () => {
  it('returns n dates before the given date', () => {
    const result = getPreviousDates('2026-04-05', 3);
    expect(result).toEqual(['2026-04-04', '2026-04-03', '2026-04-02']);
  });
});
