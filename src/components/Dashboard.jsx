import React, { useMemo } from 'react';

import { useChecklist } from '../context/ChecklistContext';
import ScoreCard from './ScoreCard';
import { computeScore } from '../utils/scoring';

export default function Dashboard() {
  const { items, status } = useChecklist();
  const score = useMemo(() => computeScore(items, status), [items, status]);

  const tier = score.passes.gold
    ? 'GOLD'
    : score.passes.silver
    ? 'SILVER'
    : score.passes.bronze
    ? 'BRONZE'
    : 'NOT MET';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <ScoreCard title="Weighted Coverage %" value={(score.coveragePct*100).toFixed(1)+'%'} hint={`${score.coveragePoints} / ${score.totalWeight}`} />
      <ScoreCard title="Weighted Achievement %" value={(score.achievementPct*100).toFixed(1)+'%'} hint={`${score.achievementPoints} / ${3*score.totalWeight}`} />
      <ScoreCard title="Critical Items Met?" value={score.critAllMet ? 'YES' : 'NO'} hint="All Critical must be covered" />
      <ScoreCard title="Tier" value={tier} hint={`High ${(score.highPct*100).toFixed(0)}% | High+Med ${(score.hiMedPct*100).toFixed(0)}%`} />
    </div>
  );
}
