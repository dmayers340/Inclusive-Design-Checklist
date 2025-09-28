import { axe } from 'jest-axe';

/** Run axe and return results plus a compact summary string for snapshots. */
export async function axeAudit(container) {
  const results = await axe(container);
  const summary = results.violations.map(v => {
    const nodes = v.nodes.map(n => n.target.join(' ')).slice(0, 5); // cap
    return `• ${v.id} (${v.impact}) – ${v.help}\n  nodes: ${nodes.join(', ')}`;
  }).join('\n') || 'no-violations';
  return { results, summary };
}
