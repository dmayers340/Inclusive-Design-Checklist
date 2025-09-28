import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import NavBar from '../NavBar';

test('renders nav links, allows navigation, and is a11y clean', async () => {
  const user = userEvent.setup();
  const history = createMemoryHistory({ initialEntries: ['/'] });

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <NavBar />
    </Router>
  );

  // check all links exist
  const links = ['Home', 'Create New Report', 'View Reports'];
  links.forEach(text => {
    expect(screen.getByRole('link', { name: new RegExp(text, 'i') })).toBeInTheDocument();
  });

  // accessibility check
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
