import { computeScore } from '../scoring';

const base = [
  { ID: 'C1', Severity: 'Critical', Weight: 4 },
  { ID: 'H1', Severity: 'High',     Weight: 3 },
  { ID: 'M1', Severity: 'Medium',   Weight: 2 },
  { ID: 'L1', Severity: 'Low',      Weight: 1 },
  { ID: 'X1', Severity: 'Low',      Weight: 1 } // to test N/A
];

test('full coverage and tier gates with N/A excluded', () => {
  const status = {
    C1: 'Bronze',  // covered
    H1: 'Silver',  // covered
    M1: 'Gold',    // covered
    L1: 'Not met',
    X1: 'Not applicable' // excluded from denominators
  };
  const s = computeScore(base, status);
  expect(s.totalWeight).toBe(4+3+2+1);                    // X1 excluded
  expect(s.coveragePoints).toBe(4+3+2);                   // L1 not covered
  expect(+ (s.coveragePct*100).toFixed(0)).toBe(90);
  expect(s.critAllMet).toBe(true);
  expect(+ (s.highPct*100).toFixed(0)).toBe(100);
  expect(+ (s.hiMedPct*100).toFixed(0)).toBe(100);
  expect(s.passes.bronze).toBe(true);
  expect(s.passes.silver).toBe(true);
  expect(s.passes.gold).toBe(true);
});

test('empty items, everything defaults to zero but passes for empty highs/criticals', () => {
  const s = computeScore([], {});
  expect(s.totalWeight).toBe(0);
  expect(s.coveragePct).toBe(0);
  expect(s.passes.bronze).toBe(false); // no weight → 0% < 60%
});

test('gating fails when critical not covered', () => {
  const status = { C1: 'Not met', H1: 'Bronze', M1: 'Not evaluated', L1: 'Bronze', X1: 'Not applicable' };
  const s = computeScore(base, status);
  expect(s.critAllMet).toBe(false);
  expect(s.passes.bronze).toBe(false); // fails critical gate
});
