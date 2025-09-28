// src/components/__tests__/ReportCharts.withProvider.test.jsx
import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import ReportCharts from '../ReportCharts';
import { ChecklistProvider, useChecklist } from '../../context/ChecklistContext';

jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
  Doughnut: () => <div data-testid="mock-doughnut-chart" />,
}));
// Sample fixture
const sampleItems = [
  { ID: 'A', Severity: 'High', Spaces: 'Lobby|Entrance' },
  { ID: 'B', Severity: 'Low', Spaces: 'Lobby' },
];

// Helper component to bootstrap provider state
function ProviderWithStatusSetter({ initialItems, initialStatus, children }) {
  function Bootstrapped() {
    const { setManyStatuses } = useChecklist();

    useEffect(() => {
      if (initialStatus && setManyStatuses) {
        const entries = Object.entries(initialStatus);
        setManyStatuses(entries);
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return children;
  }

  return (
    <ChecklistProvider initialItems={initialItems}>
      <Bootstrapped />
    </ChecklistProvider>
  );
}

// Robust axeCheckFiltered inline for this test
async function axeCheckFiltered(container, { skipRules = [], skipTargets = [] } = {}) {
  const results = await axe(container, {
    rules: skipRules.reduce((acc, rule) => ({ ...acc, [rule]: { enabled: false } }), {})
  });

  const filtered = {
    ...results,
    violations: results.violations.filter(v =>
      !v.nodes.every(n => n.target.some(t => skipTargets.some(sel => t.includes(sel))))
    )
  };

  return filtered;
}

test('ReportCharts renders with real provider and is accessible', async () => {
  // 1️⃣ Define initial status before render
  const initialStatus = { A: 'Bronze', B: 'Not met' };

  // 2️⃣ Render component with provider
  const { container } = render(
    <ProviderWithStatusSetter initialItems={sampleItems} initialStatus={initialStatus}>
      <ReportCharts items={sampleItems} statuses={initialStatus} />
    </ProviderWithStatusSetter>
  );

  const user = userEvent.setup();
  // 3️⃣ Interact with the UI: open Severity Coverage table
  const buttons = await screen.getAllByRole('button', { name: /Show data table/i });
  const severityBtn = buttons[0]; // first button is Severity Coverage
  await user.click(severityBtn);


  // 4️⃣ Assert that table shows correct data
  expect(screen.getByTestId('sev-covered-High')).toHaveTextContent('1');

  // 5️⃣ Accessibility check, skip canvas and disable color-contrast
  const results = await axeCheckFiltered(container, {
    skipRules: ['color-contrast'],
    skipTargets: ['canvas']
  });

  expect(results.violations).toHaveLength(0);
});
