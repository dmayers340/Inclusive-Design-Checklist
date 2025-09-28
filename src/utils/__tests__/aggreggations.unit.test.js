import { countsBySeverity, matrixSpaceSeverity, coverageBySpace, covered } from '../aggregations';

const items = [
  { ID: 'A', Severity: 'High',   Spaces: 'Lobby|Entrance' },
  { ID: 'B', Severity: 'Low',    Spaces: 'Lobby' },
  { ID: 'C', Severity: 'Medium', Spaces: 'Work Floor' },
  { ID: 'D', Severity: 'Critical', Spaces: 'Work Floor|Meeting Room' },
  { ID: 'E', Severity: 'Low',    Spaces: '' } // unassigned
];
const statuses = { A: 'Bronze', B: 'Not met', C: 'Gold', D: 'Silver', E: 'Not applicable' };

test('covered helper', () => {
  expect(covered('Bronze')).toBe(true);
  expect(covered('Silver')).toBe(true);
  expect(covered('Gold')).toBe(true);
  expect(covered('Not met')).toBe(false);
});

test('countsBySeverity excludes N/A', () => {
  const agg = countsBySeverity(items, statuses);
  expect(agg.High.total).toBe(1);
  expect(agg.High.covered).toBe(1);
  expect(agg.Low.total).toBe(1);         // E excluded (N/A), B remains
  expect(agg.Low.covered).toBe(0);
});

test('matrixSpaceSeverity counts per space, excludes N/A when statuses supplied', () => {
  const m = matrixSpaceSeverity(items, statuses);
  expect(m.Lobby.High).toBe(1);
  expect(m['(Unassigned)']).toBeUndefined(); // E excluded due to N/A
  expect(m['Meeting Room'].Critical).toBe(1);
});

test('coverageBySpace excludes N/A and counts covered correctly', () => {
  const cov = coverageBySpace(items, statuses);
  expect(cov.Lobby.total).toBe(2);      // A + B
  expect(cov.Lobby.covered).toBe(1);    // A covered, B not
  expect(cov['Work Floor'].total).toBe(2);  // C + D
  expect(cov['Work Floor'].covered).toBe(2);
});
