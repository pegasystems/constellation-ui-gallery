import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default, NestedTable } = composeStories(DemoStories);

test('renders expandable table component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Computer inventory')).toBeVisible();
});

test('renders expand buttons for each row', async () => {
  render(<Default />);
  await screen.findByText('Computer inventory');
  const buttons = await screen.findAllByRole('button', { name: 'Expand row' });
  expect(buttons).toHaveLength(3);
});

test('expands a row to show detail view on button click', async () => {
  render(<Default />);
  await screen.findByText('Computer inventory');
  const expandButtons = await screen.findAllByRole('button', { name: 'Expand row' });
  fireEvent.click(expandButtons[0]);
  expect(await screen.findByText(/Serial number/i)).toBeVisible();
  expect(screen.getByRole('button', { name: 'Collapse row' })).toBeVisible();
});

test('collapses an expanded row on second button click', async () => {
  render(<Default />);
  await screen.findByText('Computer inventory');
  const expandButtons = await screen.findAllByRole('button', { name: 'Expand row' });
  fireEvent.click(expandButtons[0]);
  await screen.findByText(/Serial number/i);
  const collapseButton = screen.getByRole('button', { name: 'Collapse row' });
  fireEvent.click(collapseButton);
  expect(screen.queryByText(/Serial number/i)).not.toBeInTheDocument();
});

test('renders nested expandable table inside parent detail view', async () => {
  render(<NestedTable />);
  await screen.findByText('Order list');
  const expandButtons = await screen.findAllByRole('button', { name: 'Expand row' });
  fireEvent.click(expandButtons[0]);
  expect(await screen.findByText('Line items')).toBeVisible();
  expect(await screen.findByText('Widget B')).toBeVisible();
});
