import React, { useMemo } from 'react';

import { useChecklist } from '../context/ChecklistContext';

export default function Filters({ filters, onChange }) {
  const { items } = useChecklist();

  const spaces = useMemo(() => {
    const s = new Set();
    items.forEach(r => (r.Spaces || '').split('|').map(x => x.trim()).forEach(v => v && s.add(v)));
    return ['All', ...Array.from(s).sort()];
  }, [items]);

  const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
      <div>
        <label className="block text-sm font-medium mb-1">Space
          <select className="w-full border rounded-md p-2" value={filters.space} onChange={(e) => onChange({ ...filters, space: e.target.value })}>
            {spaces.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Severity
          <select className="w-full border rounded-md p-2" value={filters.severity} onChange={(e) => onChange({ ...filters, severity: e.target.value })}>
            {severities.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Search
          <input className="w-full border rounded-md p-2" placeholder="Search IDs, text, spaces" value={filters.q} onChange={(e) => onChange({ ...filters, q: e.target.value })} />
        </label>
      </div>
    </div>
  );
}
