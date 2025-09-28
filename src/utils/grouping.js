export function groupByPrimarySpace(items) {
  const groups = {};
  for (const it of items) {
    const raw = (it.Spaces || '').split('|').map(s => s.trim()).filter(Boolean);
    const key = raw.length ? raw[0] : '(Unassigned)';
    (groups[key] ||= []).push(it);
  }
  // sort groups by name, items by severity/ID for stable UI
  const order = Object.keys(groups).sort((a, b) => a.localeCompare(b));
  for (const k of order) {
    groups[k].sort((a, b) => {
      const sevOrder = { Critical: 1, High: 2, Medium: 3, Low: 4 };
      const sa = sevOrder[a.Severity] || 99;
      const sb = sevOrder[b.Severity] || 99;
      return sa === sb ? String(a.ID).localeCompare(String(b.ID)) : sa - sb;
    });
  }
  return { order, groups };
}