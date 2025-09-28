import React from 'react';

export default function ScoreCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      {hint ? <div className="text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}
