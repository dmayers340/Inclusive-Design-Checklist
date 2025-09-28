import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import * as api from '../../utils/api';
import CreateReportPage from '../CreateReportPage';
import { ChecklistProvider } from '../../context/ChecklistContext';

// Mock alert to prevent actual popups
jest.spyOn(window, 'alert').mockImplementation(() => {});

// Wrapper component that injects a mocked context
function MockChecklistProvider({ children }) {
  const [items, setItems] = React.useState([]);
  const status = {};

  return (
    <ChecklistProvider value={{ items, setItems, status }}>
      {children}
    </ChecklistProvider>
  );
}

describe('CreateReportPage (mocked provider wrapper)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('full flow: select building, load checklist, set status, save report, a11y clean', async () => {
    jest.spyOn(api, 'loadBuildings').mockResolvedValue([{ id: 'BLD-001', name: 'HQ' }]);
    jest.spyOn(api, 'loadChecklist').mockResolvedValue([
      { ID: 'X', 'Checklist Item (Raw)': 'Doors', Severity: 'High', Spaces: 'Lobby', Bronze: '≥34"', Silver: '≥36"', Gold: '≥36" powered' },
    ]);
    const saveSpy = jest.spyOn(api, 'saveReport').mockImplementation(r => r.id);

    const user = userEvent.setup();
    const { container } = render(
      <MockChecklistProvider>
        <CreateReportPage />
      </MockChecklistProvider>
    );

    // Select building
    await screen.findByLabelText(/Building/i);
    await user.selectOptions(screen.getByRole('combobox'), 'BLD-001');

    // Load checklist
    await user.click(screen.getByRole('button', { name: /Load Inclusive Checklist/i }));
    await screen.findByText(/Doors/);

    // Select Gold for item
    await user.click(screen.getByLabelText(/Gold/i));
    expect(screen.getByLabelText(/Gold/i)).toBeChecked();

    // Save report
    await user.click(screen.getByRole('button', { name: /Save Report/i }));
    expect(saveSpy).toHaveBeenCalled();

    // Accessibility check
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
