import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import ChecklistTable from '../ChecklistTable'
import { ChecklistProvider } from '../../context/ChecklistContext'

const sampleItems = [
  {
    ID: 'WCH-03',
    'Checklist Item (Raw)': 'Doors clear width',
    Severity: 'High',
    Bronze: '≥34"',
    Silver: '≥36"',
    Gold: '≥36" powered',
    Spaces: 'Entrance|Lobby'
  }
]

function setup(ui) {
  return render(<ChecklistProvider initialItems={sampleItems}>{ui}</ChecklistProvider>)
}

test('renders items, lets user change status, is a11y clean', async () => {
  const user = userEvent.setup()
  const { container } = setup(<ChecklistTable filters={{ space: 'All', severity: 'All', q: '' }} />)

  // starts with "Not evaluated" checked
  expect(screen.getByLabelText(/Not evaluated/i)).toBeChecked()

  // user changes to "Not applicable"
  await user.click(screen.getByLabelText(/Not applicable/i))
  expect(screen.getByLabelText(/Not applicable/i)).toBeChecked()

  // user changes to "Gold"
  await user.click(screen.getByLabelText(/Gold/i))
  expect(screen.getByLabelText(/Gold/i)).toBeChecked()

  // ensure only one status is selected
  expect(screen.getByLabelText(/Not applicable/i)).not.toBeChecked()

  // accessibility audit
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
