import { axe } from 'jest-axe';

/**
 * Run axe and filter out known false positives.
 *
 * @param {HTMLElement} container - The container to test
 * @param {{ skipRules?: string[], skipTargets?: string[] }} [opts]
 *   skipRules: array of axe rule IDs to disable entirely
 *   skipTargets: array of CSS selectors; violations on only these targets are ignored
 */
export async function axeCheckFiltered(container, opts = {}) {
  const { skipRules = [], skipTargets = [] } = opts;

  // 1️⃣ Build rules config: disable rules entirely if listed
  const rulesConfig = skipRules.reduce(
    (acc, rule) => ({ ...acc, [rule]: { enabled: false } }),
    {}
  );

  // 2️⃣ Run axe with rules disabled
  const res = await axe(container, { rules: rulesConfig });

  // 3️⃣ Filter out violations that only affect skipTargets
  const filteredViolations = res.violations.filter(v => {
    if (!v.nodes || !v.nodes.length) return true;

    // Check if every node in this violation matches one of the skipTargets
    const allNodesSkipped = v.nodes.every(node =>
      node.target.some(targetSelector =>
        skipTargets.some(skipSel => targetSelector.includes(skipSel))
      )
    );

    return !allNodesSkipped;
  });

  // 4️⃣ Return same structure as axe but with filtered violations
  return { ...res, violations: filteredViolations };
}
