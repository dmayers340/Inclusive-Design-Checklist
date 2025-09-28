import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import SourceSelector from '../SourceSelector';

afterEach(() => jest.restoreAllMocks());

test('loads sample checklist and passes a11y', async () => {
  const items = [
    { ID: 'X1', 'Checklist Item (Raw)': 'Sample Item', Severity: 'Low', Spaces: 'Lobby' }
  ];
  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => items,
  });

  const handleLoaded = jest.fn();
  const { container } = render(<SourceSelector onItemsLoaded={handleLoaded} />);

  // select 'sample'
  await userEvent.selectOptions(screen.getByRole('combobox'), 'sample');

  // wait for callback
  await waitFor(() => expect(handleLoaded).toHaveBeenCalledWith(items));

  // accessibility
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('handles file upload with valid and invalid JSON', async () => {
  const handleLoaded = jest.fn();
  render(<SourceSelector onItemsLoaded={handleLoaded} />);

  // get the file input directly
  const input = screen.getByTestId('file-input');

  // --- UPLOAD VALID FILE ---
  const validFile = new File([JSON.stringify([{ ID: 'Y1' }])], 'good.json', {
    type: 'application/json',
  });

  // directly upload file; skip selectOptions for upload in test
  await userEvent.upload(input, validFile);

  // wait for callback
  await waitFor(() => expect(handleLoaded).toHaveBeenCalledWith([{ ID: 'Y1' }]));

  // --- UPLOAD INVALID FILE ---
  const invalidFile = new File(['{oops'], 'bad.json', { type: 'application/json' });
  await userEvent.upload(input, invalidFile);

  expect(await screen.findByText(/Invalid JSON file/i)).toBeInTheDocument();
});

