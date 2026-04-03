'use client';
import { useEffect, useState } from 'react';
import { Combo, ScheduleDay } from '@/lib/types';

const COMBO_LABELS: Record<Combo, string> = {
  1: 'Gym AM (Off PM)', 2: 'Skating PM (Off AM)', 3: 'Full Rest Day', 4: 'Gym AM + Skating PM',
};
const COMBO_EMOJIS: Record<Combo, string> = { 1: '🏋️', 2: '⛸️', 3: '🌿', 4: '🏋️⛸️' };
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function SchedulePage() {
  const [days, setDays] = useState<ScheduleDay[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pin = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('pin') ?? ''
    : '';

  const weekStart = new Date().toISOString().slice(0, 10);

  const load = () => {
    fetch(`/api/schedule?week=${weekStart}&pin=${pin}`)
      .then((r) => r.json())
      .then((data) => setDays(data.days ?? []));
  };

  useEffect(() => { load(); }, []);

  const handleEdit = async (date: string, combo: Combo) => {
    setSaving(true);
    await fetch(`/api/schedule?pin=${pin}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, combo }),
    });
    setSaving(false);
    setEditing(null);
    load();
  };

  const handleReset = async () => {
    if (!confirm('Reset all overrides to defaults?')) return;
    await fetch(`/api/schedule/reset?pin=${pin}`, { method: 'POST' });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Weekly Schedule</h1>
        <button onClick={handleReset} className="text-sm text-red-500 hover:underline">
          Reset to defaults
        </button>
      </div>

      <div className="space-y-2">
        {days.map((d) => {
          const dayOfWeek = DAY_NAMES[new Date(d.date + 'T00:00:00Z').getUTCDay()];
          const dateLabel = new Date(d.date + 'T00:00:00Z').toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short',
          });
          return (
            <div key={d.date} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              {editing === d.date ? (
                <div>
                  <p className="font-semibold text-gray-700 mb-3">{dayOfWeek} {dateLabel}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {([1,2,3,4] as Combo[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => handleEdit(d.date, c)}
                        disabled={saving}
                        className={`px-3 py-2 rounded-lg text-sm text-left border ${
                          d.combo === c
                            ? 'border-teal-500 bg-teal-50 font-semibold'
                            : 'border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        {COMBO_EMOJIS[c]} {COMBO_LABELS[c]}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setEditing(null)} className="mt-2 text-xs text-gray-400 underline">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-700">{dayOfWeek}</span>
                    <span className="text-gray-400 ml-2 text-sm">{dateLabel}</span>
                    {d.isOverride && (
                      <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">override</span>
                    )}
                    <p className="text-sm text-teal-700 mt-0.5">
                      {COMBO_EMOJIS[d.combo]} {COMBO_LABELS[d.combo]}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditing(d.date)}
                    className="text-sm text-gray-400 hover:text-teal-600 underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
