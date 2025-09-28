// src/utils/aggregations.js

// Helper: consider Bronze/Silver/Gold as covered
export const covered = (st) => st === 'Bronze' || st === 'Silver' || st === 'Gold';
// Helper: items marked Not applicable should be excluded from chart denominators
const isNA = (st) => st === 'Not applicable';

/**
 * Counts by severity, excluding N/A.
 * Returns: { Critical:{total,covered}, High:{...}, Medium:{...}, Low:{...} }
 */
export function countsBySeverity(items, statuses = {}) {
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const out = Object.fromEntries(severities.map(s => [s, { total: 0, covered: 0 }]));

  for (const it of items) {
    const st = statuses[it.ID];
    if (isNA(st)) continue; // exclude N/A entirely

    const sev = severities.includes(it.Severity) ? it.Severity : 'Low'; // default bucket if missing
    out[sev].total += 1;
    if (covered(st)) out[sev].covered += 1;
  }
  return out;
}

/**
 * Space × Severity matrix (counts), excluding N/A when statuses provided.
 * Returns: { [space]: { Critical:n, High:n, Medium:n, Low:n } }
 * @param {Array} items
 * @param {Object} statuses  // optional; if omitted, no N/A filtering
 */
export function matrixSpaceSeverity(items, statuses = null) {
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const ensureRow = (obj, space) => {
    if (!obj[space]) obj[space] = Object.fromEntries(severities.map(s => [s, 0]));
    return obj[space];
  };

  const out = {};
  for (const it of items) {
    const st = statuses ? statuses[it.ID] : undefined;
    if (statuses && isNA(st)) continue; // exclude N/A only when statuses provided

    const sev = severities.includes(it.Severity) ? it.Severity : 'Low';
    const tags = (it.Spaces || '')
      .split('|')
      .map(s => s.trim())
      .filter(Boolean);
    const spaces = tags.length ? tags : ['(Unassigned)'];

    for (const sp of spaces) {
      const row = ensureRow(out, sp);
      row[sev] = (row[sev] || 0) + 1;
    }
  }
  return out;
}

/**
 * Coverage by space (covered vs total), excluding N/A.
 * Returns: { [space]: { total, covered } }
 */
export function coverageBySpace(items, statuses = {}) {
  const out = {};
  const ensure = (space) => (out[space] ||= { total: 0, covered: 0 });

  for (const it of items) {
    const st = statuses[it.ID];
    if (isNA(st)) continue; // exclude N/A entirely

    const tags = (it.Spaces || '')
      .split('|')
      .map(s => s.trim())
      .filter(Boolean);
    const spaces = tags.length ? tags : ['(Unassigned)'];

    for (const sp of spaces) {
      const row = ensure(sp);
      row.total += 1;
      if (covered(st)) row.covered += 1;
    }
  }
  return out;
}
