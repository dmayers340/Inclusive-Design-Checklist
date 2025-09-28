import React from 'react';
import { render } from '@testing-library/react';
import { axeAudit } from '../../test-utils/axeSnapshot';
import HomePage from '../HomePage';

test('HomePage a11y snapshot', async () => {
  const { container } = render(<HomePage />);
  const { results, summary } = await axeAudit(container);
  // Expect no serious/critical; warn on moderate/minor via snapshot diff
  const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact));
  expect(serious).toHaveLength(0);
  expect(summary).toMatchSnapshot();
});
