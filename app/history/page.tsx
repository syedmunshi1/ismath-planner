'use client';
import { useEffect, useState } from 'react';
import { MealHistoryRow } from '@/lib/types';

export default function HistoryPage() {
  const [history, setHistory] = useState<MealHistoryRow[]>([]);

  const pin = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('pin') ?? ''
    : '';

  useEffect(() => {
    fetch(`/api/history?pin=${pin}`)
      .then((r) => r.json())
      .then((data) => setHistory(data.history ?? []));
  }, []);

  const grouped: Record<string, MealHistoryRow[]> = {};
  for (const row of history) {
    if (!grouped[row.date]) grouped[row.date] = [];
    grouped[row.date].push(row);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meal History</h1>
      <p className="text-sm text-gray-500 mb-4">Last 14 days — drives rotation (no repeats within 5 days)</p>

      {Object.entries(grouped).map(([date, rows]) => (
        <div key={date} className="mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {new Date(date + 'T00:00:00Z').toLocaleDateString('en-IN', {
              weekday: 'long', day: 'numeric', month: 'short',
            })}
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {rows.map((row, i) => (
              <div key={i} className="px-4 py-2 text-sm">
                <span className="text-xs text-gray-400 uppercase tracking-wide w-24 inline-block">{row.slot}</span>
                <span className="text-gray-700">{row.option_key}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {history.length === 0 && (
        <p className="text-center text-gray-400 py-8">No history yet — send the first plan to start tracking.</p>
      )}
    </div>
  );
}
