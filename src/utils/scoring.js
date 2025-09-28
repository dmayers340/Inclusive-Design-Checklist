export const SEVERITY_WEIGHTS = { Critical: 4, High: 3, Medium: 2, Low: 1 };
export const THRESHOLDS = {
  bronze: { coveragePct: 0.60, criticalAllMet: true },
  silver: { coveragePct: 0.75, highPct: 0.90 },
  gold:   { coveragePct: 0.90, highMedPct: 0.95 },
};

const covered  = (st) => st === 'Bronze' || st === 'Silver' || st === 'Gold';
const isNA     = (st) => st === 'Not applicable';
const levelOf  = (st) => (st === 'Gold' ? 3 : st === 'Silver' ? 2 : st === 'Bronze' ? 1 : 0);

export function computeScore(items, statusMap) {
  const weightOf = (it) => Number(it.Weight ?? SEVERITY_WEIGHTS[it.Severity] ?? 1);

  // Exclude N/A items from denominators entirely
  const eligible = items.filter(it => !isNA(statusMap[it.ID]));

  const totalWeight = eligible.reduce((s, it) => s + weightOf(it), 0);

  const coveragePoints = eligible.reduce((s, it) => {
    const st = statusMap[it.ID];
    return s + (covered(st) ? weightOf(it) : 0);
  }, 0);

  const achievementPoints = eligible.reduce((s, it) => {
    const st = statusMap[it.ID];
    return s + levelOf(st) * weightOf(it);
  }, 0);

  const coveragePct    = totalWeight ? coveragePoints / totalWeight : 0;
  const achievementPct = totalWeight ? achievementPoints / (3 * totalWeight) : 0;

  // Gates computed on eligible subsets only
  const eligibleBy = (sev) => eligible.filter(it => it.Severity === sev);

  const crit = eligibleBy('Critical');
  const critAllMet = crit.length === 0 || crit.every(it => covered(statusMap[it.ID]));

  const highs = eligibleBy('High');
  const highPct = highs.length ? highs.filter(it => covered(statusMap[it.ID])).length / highs.length : 1;

  const hiMed = eligible.filter(it => it.Severity === 'High' || it.Severity === 'Medium');
  const hiMedPct = hiMed.length ? hiMed.filter(it => covered(statusMap[it.ID])).length / hiMed.length : 1;

  const passes = {
    bronze: coveragePct >= THRESHOLDS.bronze.coveragePct && (!THRESHOLDS.bronze.criticalAllMet || critAllMet),
    silver: coveragePct >= THRESHOLDS.silver.coveragePct && highPct >= THRESHOLDS.silver.highPct,
    gold:   coveragePct >= THRESHOLDS.gold.coveragePct   && hiMedPct >= THRESHOLDS.gold.highMedPct,
  };

  return { totalWeight, coveragePoints, achievementPoints, coveragePct, achievementPct, critAllMet, highPct, hiMedPct, passes };
}
