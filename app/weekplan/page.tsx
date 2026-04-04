'use client';
import { useEffect, useState } from 'react';
import { DailyPlan, PlanSlot } from '@/lib/types';

const COMBO_LABELS: Record<number, string> = {
  1: 'Gym Morning', 2: 'Skating Evening', 3: 'Full Rest Day', 4: 'Gym + Skating',
};
const COMBO_EMOJIS: Record<number, string> = { 1: '🏋️', 2: '⛸️', 3: '🌿', 4: '🏋️⛸️' };
const SLOT_LABELS: Record<string, string> = {
  on_waking: 'On Waking', breakfast: 'Breakfast', mid_morning: 'Mid Morning',
  lunch: 'Lunch', post_lunch: 'Post Lunch', pre_session: 'Pre Session',
  during_session: 'During Session', post_session: 'Post Session',
  evening_snack: 'Evening Snack', late_evening: 'Late Evening',
  dinner: 'Dinner', bedtime: 'Bedtime',
};

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return `${DAY_NAMES[d.getUTCDay()]} ${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]}`;
}

function PlanCard({ plan }: { plan: DailyPlan }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{COMBO_EMOJIS[plan.combo]}</span>
          <div className="text-left">
            <p className="font-semibold text-gray-800">{formatDate(plan.date)}</p>
            <p className="text-sm text-teal-700">{COMBO_LABELS[plan.combo]}</p>
          </div>
          {plan.isRecoveryDay && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Recovery</span>
          )}
          {plan.spleenDay && (
            <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Spleen</span>
          )}
        </div>
        <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 divide-y divide-gray-50">
          {plan.slots.map((s: PlanSlot, i: number) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-bold text-teal-600 w-12 shrink-0">{s.time}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {SLOT_LABELS[s.slot] ?? s.slot}
                  {s.options.length > 1 && <span className="text-teal-500 ml-1 normal-case">(pick one)</span>}
                </span>
              </div>
              <div className="ml-14">
                {s.options.length > 1 ? (
                  s.options.map((opt, j) => (
                    <p key={j} className="text-sm text-gray-700">
                      <span className="font-medium text-teal-700">Option {j + 1}:</span> {opt.label}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-700">{s.options[0].label}</p>
                )}
                {s.note && (
                  <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{s.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WeekPlanPage() {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    fetch(`/api/weekplan`)
      .then(r => r.json())
      .then(data => {
        setPlans(data.plans ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load week plan');
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const handleSend = async () => {
    setSending(true);
    setSendResult('');
    try {
      const res = await fetch(`/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendResult('✓ ' + (data.message ?? 'Sent'));
      } else {
        setSendResult('✗ ' + (data.message ?? 'Failed'));
      }
    } catch {
      setSendResult('✗ Network error');
    }
    setSending(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Next 7 Days</h1>
        <button
          onClick={load}
          className="text-sm text-teal-600 hover:underline"
        >
          ↻ Refresh
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-5">Tap any day to expand the full meal plan.</p>

      {loading && <div className="py-8 text-center text-gray-400">Generating 7-day plan…</div>}
      {error && <div className="py-4 text-center text-red-500">{error}</div>}

      <div className="space-y-3">
        {plans.map((plan, i) => (
          <PlanCard key={i} plan={plan} />
        ))}
      </div>

      {plans.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-4 flex-wrap">
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-teal-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 text-sm"
          >
            {sending ? 'Sending…' : '📧 Email Tomorrow\'s Plan Now'}
          </button>
          {sendResult && (
            <span className={`text-sm ${sendResult.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
              {sendResult}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
