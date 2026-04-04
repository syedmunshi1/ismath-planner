'use client';
import { useEffect, useState } from 'react';
import { DailyPlan, PlanSlot } from '@/lib/types';

const SLOT_EMOJIS: Record<string, string> = {
  on_waking: '⏰', breakfast: '🍳', mid_morning: '🫙', lunch: '🍚',
  post_lunch: '🍫', pre_session: '⚡', during_session: '💧',
  post_session: '💪', evening_snack: '🌿', late_evening: '🍲',
  dinner: '🍽️', bedtime: '🌙',
};

const SLOT_LABELS: Record<string, string> = {
  on_waking: 'ON WAKING', breakfast: 'BREAKFAST', mid_morning: 'MID MORNING',
  lunch: 'LUNCH', post_lunch: 'POST LUNCH', pre_session: 'PRE SESSION',
  during_session: 'DURING SESSION', post_session: 'POST SESSION',
  evening_snack: 'EVENING SNACK', late_evening: 'LATE EVENING',
  dinner: 'DINNER', bedtime: 'BEDTIME',
};

const COMBO_LABELS: Record<number, string> = {
  1: 'Gym Morning', 2: 'Skating Evening', 3: 'Full Rest Day', 4: 'Gym + Skating',
};

export default function HomePage() {
  const [viewing, setViewing] = useState<'today' | 'tomorrow'>('tomorrow');
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [waStatus, setWaStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const targetDate = viewing === 'tomorrow'
    ? (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })()
    : new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setPlan(null);
    setLoading(true);
    fetch(`/api/mealplan/${targetDate}`)
      .then((r) => r.json())
      .then((data) => { setPlan(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [viewing, targetDate]);

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

  if (loading) return <div className="py-8 text-center text-gray-500">Loading plan...</div>;
  if (!plan) return <div className="py-8 text-center text-red-500">Failed to load plan</div>;

  return (
    <div>
      <div className="mb-6">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setViewing('today')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              viewing === 'today'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setViewing('tomorrow')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              viewing === 'tomorrow'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tomorrow
          </button>
        </div>
        <p className="text-gray-500 mt-1">
          {new Date(plan.date + 'T00:00:00').toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long',
          })}
          {' · '}
          <span className="font-medium text-teal-700">{COMBO_LABELS[plan.combo]}</span>
        </p>
        {plan.isRecoveryDay && (
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm">
            🔄 <strong>Recovery Day</strong> — See recovery notes in plan below
          </div>
        )}
      </div>

      {viewing === 'tomorrow' && (
        <div className="mb-6 no-print">
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

      <div className="space-y-3">
        {plan.slots.map((s: PlanSlot, i: number) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">{SLOT_EMOJIS[s.slot]}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-teal-700 tracking-wide">{s.time}</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {SLOT_LABELS[s.slot]}
                    {s.options.length > 1 && <span className="text-teal-600 ml-1">(pick one)</span>}
                  </span>
                </div>
                {s.options.length > 1 ? (
                  s.options.map((opt, j) => (
                    <p key={j} className="text-sm text-gray-700 mt-1">
                      <span className="font-medium text-teal-700">Option {j + 1}:</span> {opt.label}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-700">{s.options[0].label}</p>
                )}
                {s.note && (
                  <p className="text-xs text-gray-500 mt-2 whitespace-pre-line">{s.note}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
