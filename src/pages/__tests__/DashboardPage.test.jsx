import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import DashboardPage from '../DashboardPage'

const sampleReport = {
  id: 'R1',
  buildingId: 'BLD-001',
  createdAt: '2025-01-01',
  items: [
    { ID: 'C1', Severity: 'Critical', Weight: 4 },
    { ID: 'H1', Severity: 'High', Weight: 3 }
  ],
  status: { C1: 'Bronze', H1: 'Not met' }
}

beforeEach(() => {
  localStorage.setItem('reports', JSON.stringify([sampleReport]))
})

afterEach(() => localStorage.clear())

test('renders dashboard metrics and charts, a11y clean', async () => {
  const { container } = render(<DashboardPage />)

  expect(screen.getByText(/Weighted Coverage/i)).toBeInTheDocument()
  expect(screen.getByText(/Critical Items Met/i)).toBeInTheDocument()

  // confirm some metric text
  expect(screen.getByText(/Bronze/i)).toBeInTheDocument()

  // chart headings
  expect(screen.getByRole('heading', { name: /Severity Coverage/i })).toBeInTheDocument()

  const results = await axe(container, {
    rules: { 'color-contrast': { enabled: false } } // skip canvas false positives
  })
  expect(results).toHaveNoViolations()
})
