import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import ViewReportsPage from '../ViewReportsPage'

const reports = [
  { id: 'R1', buildingId: 'BLD-001', createdAt: '2025-01-01', items: [], status: {} },
  { id: 'R2', buildingId: 'BLD-002', createdAt: '2025-02-01', items: [], status: {} }
]

beforeEach(() => {
  localStorage.setItem('reports', JSON.stringify(reports))
})

afterEach(() => localStorage.clear())

test('lists saved reports and is a11y clean', async () => {
  const { container } = render(<ViewReportsPage />)

  expect(screen.getByText(/BLD-001/)).toBeInTheDocument()
  expect(screen.getByText(/BLD-002/)).toBeInTheDocument()

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
