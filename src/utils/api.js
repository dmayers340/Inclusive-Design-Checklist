// Buildings list JSON will live in /public/buildings.json, e.g.:
// [ { "id":"BLD-001", "name":"HQ New York" }, { "id":"BLD-002", "name":"London Office" } ]
export async function loadBuildings() {
  const res = await fetch('/inputs/buildings.json', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function loadChecklist() {
  const res = await fetch('/inputs/inclusive_checklist.json', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

// Simple localStorage “DB” placeholder — swap with real API later
const LS_REPORTS = 'inclusive-reports';

export function saveReport(report) {
  const all = listReports();
  const idx = all.findIndex(r => r.id === report.id);
  if (idx >= 0) all[idx] = report; else all.push(report);
  localStorage.setItem(LS_REPORTS, JSON.stringify(all));
  return report.id;
}

export function listReports() {
  try {
    return JSON.parse(localStorage.getItem(LS_REPORTS) || '[]');
  } catch { return []; }
}

export function getReport(id) {
  return listReports().find(r => r.id === id);
}
