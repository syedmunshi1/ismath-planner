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

function PlanCard({ plan, forceExpanded }: { plan: DailyPlan; forceExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isExpanded = expanded || forceExpanded;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden plan-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors no-print-hide"
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
        <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Always render content; hidden via CSS when not expanded (allows print to show it) */}
      <div className={`border-t border-gray-100 divide-y divide-gray-50 plan-card-body ${isExpanded ? '' : 'hidden print:block'}`}>
        {/* Print-only header */}
        <div className="hidden print:flex px-4 py-2 items-center gap-2 bg-gray-50">
          <span>{COMBO_EMOJIS[plan.combo]}</span>
          <span className="font-semibold text-sm">{formatDate(plan.date)}</span>
          <span className="text-xs text-gray-500">· {COMBO_LABELS[plan.combo]}</span>
          {plan.isRecoveryDay && <span className="text-xs text-amber-700">(Recovery)</span>}
          {plan.spleenDay && <span className="text-xs text-red-600">(Spleen)</span>}
        </div>
        {plan.slots.map((s: PlanSlot, i: number) => (
          <div key={i} className="px-4 py-2 flex items-start gap-3">
            <div className="w-28 shrink-0">
              <span className="text-xs font-bold text-teal-600">{s.time}</span>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">
                {SLOT_LABELS[s.slot] ?? s.slot}
                {s.options.length > 1 && <span className="text-teal-500 block normal-case font-normal">(pick one)</span>}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              {s.options.length > 1 ? (
                <div className="flex gap-4">
                  {s.options.map((opt, j) => (
                    <p key={j} className="text-sm text-gray-700 flex-1">
                      <span className="font-medium text-teal-700">Option {j+1}: </span>{opt.label}
                    </p>
                  ))}
                </div>
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
    </div>
  );
}

export default function WeekPlanPage() {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [waStatus, setWaStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [allExpanded, setAllExpanded] = useState(false);

  const saveAsPdf = () => {
    setAllExpanded(true);
    setTimeout(() => { window.print(); }, 150);
  };

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

  const handleSend = async (channel: 'whatsapp' | 'email') => {
    if (channel === 'whatsapp') setWaStatus('sending');
    else setEmailStatus('sending');
    setErrorMsg('');

    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force: true, channel }),
    });
    const data = await res.json();

    if (res.ok) {
      if (channel === 'whatsapp') setWaStatus('sent');
      else setEmailStatus('sent');
    } else {
      if (channel === 'whatsapp') setWaStatus('error');
      else setEmailStatus('error');
      setErrorMsg(data.message ?? 'Failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Next 7 Days</h1>
        <div className="flex items-center gap-3 no-print">
          <button onClick={saveAsPdf} className="text-sm bg-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800">
            ⬇ Save as PDF
          </button>
          <button onClick={load} className="text-sm text-teal-600 hover:underline">
            ↻ Refresh
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-5 no-print">Tap any day to expand the full meal plan.</p>

      {loading && <div className="py-8 text-center text-gray-400">Generating 7-day plan…</div>}
      {error && <div className="py-4 text-center text-red-500">{error}</div>}

      <div className="space-y-3">
        {plans.map((plan, i) => (
          <PlanCard key={i} plan={plan} forceExpanded={allExpanded} />
        ))}
      </div>

      {plans.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 no-print">
          <p className="text-xs text-gray-400 mb-3">Send tomorrow&apos;s plan:</p>
          <div className="flex gap-3 flex-wrap items-center">
            <button
              onClick={() => handleSend('whatsapp')}
              disabled={waStatus === 'sending'}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {waStatus === 'sending' ? '⏳ Sending…' : waStatus === 'sent' ? '✓ WhatsApp Sent' : '💬 Send WhatsApp'}
            </button>
            <button
              onClick={() => handleSend('email')}
              disabled={emailStatus === 'sending'}
              className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 text-sm"
            >
              {emailStatus === 'sending' ? '⏳ Sending…' : emailStatus === 'sent' ? '✓ Email Sent' : '📧 Send Email'}
            </button>
          </div>
          {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
        </div>
      )}
    </div>
  );
}
