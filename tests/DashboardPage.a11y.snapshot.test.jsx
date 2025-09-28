import React from 'react';
import { render } from '@testing-library/react';
import { axeAudit } from '../../test-utils/axeSnapshot';
import DashboardPage from '../DashboardPage';

test('DashboardPage a11y snapshot (empty state)', async () => {
  const { container } = render(<DashboardPage />);
  const { results, summary } = await axeAudit(container);
  const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact));
  expect(serious).toHaveLength(0);
  expect(summary).toMatchSnapshot();
});
