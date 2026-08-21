import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default, NestedTable, SelectAllNested, IdUrlLink } = composeStories(DemoStories);

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

test('nested line-item rows expand a configured detail view', async () => {
  render(<NestedTable />);
  await screen.findByText('Order list');
  const parentExpand = await screen.findAllByRole('button', { name: 'Expand row' });
  fireEvent.click(parentExpand[0]);
  await screen.findByText('Line items');
  const nestedExpand = await screen.findAllByRole('button', { name: 'Expand row' });
  // first remaining expand is a line-item row
  fireEvent.click(nestedExpand[0]);
  expect(await screen.findByText(/Serial number/i)).toBeVisible();
  expect(screen.getByText(/LineItemDetails/i)).toBeVisible();
});

test('renders a checkbox for boolean fields as the first data column', async () => {
  render(<SelectAllNested />);
  await screen.findByText('Documents');
  const checkboxes = await screen.findAllByRole('checkbox');
  expect(checkboxes).toHaveLength(2);
  expect(checkboxes[0]).not.toBeChecked();
  expect(checkboxes[1]).not.toBeChecked();
});

test('toggles the boolean checkbox on click', async () => {
  render(<SelectAllNested />);
  await screen.findByText('Documents');
  const checkboxes = await screen.findAllByRole('checkbox');
  fireEvent.click(checkboxes[0]);
  expect(checkboxes[0]).toBeChecked();
});

test('select-all nested story selects nested file checkboxes from the parent', async () => {
  render(<SelectAllNested />);
  await screen.findByText('Documents');
  const expandButtons = await screen.findAllByRole('button', { name: 'Expand row' });
  fireEvent.click(expandButtons[0]);
  expect(await screen.findByText('Files')).toBeVisible();
  expect(await screen.findByText('cover.pdf')).toBeVisible();

  const checkboxes = await screen.findAllByRole('checkbox');
  // 2 document checkboxes + 3 file checkboxes for the expanded first document
  expect(checkboxes).toHaveLength(5);

  fireEvent.click(checkboxes[0]);
  expect(checkboxes[0]).toBeChecked();

  await waitFor(() => {
    expect(screen.getAllByRole('checkbox')[1]).toBeChecked();
  });
  const updated = screen.getAllByRole('checkbox');
  // DOM order: doc0, then nested files, then doc1
  expect(updated[2]).toBeChecked();
  expect(updated[3]).toBeChecked();
  expect(updated[4]).not.toBeChecked();
});

test('nested file rows expand a configured detail view', async () => {
  render(<SelectAllNested />);
  await screen.findByText('Documents');
  const parentExpand = await screen.findAllByRole('button', { name: 'Expand row' });
  fireEvent.click(parentExpand[0]);
  await screen.findByText('Files');
  const nestedExpand = await screen.findAllByRole('button', { name: 'Expand row' });
  fireEvent.click(nestedExpand[0]);
  expect(await screen.findByText(/Serial number/i)).toBeVisible();
  expect(screen.getByText(/FileDetails/i)).toBeVisible();
});

test('merges adjacent ID and URL columns into a single linked ID column', async () => {
  render(<IdUrlLink />);
  expect(await screen.findByText('Linked assets')).toBeVisible();

  expect(screen.getByRole('columnheader', { name: 'ID' })).toBeVisible();
  expect(screen.queryByRole('columnheader', { name: 'Asset URL' })).not.toBeInTheDocument();

  const link = await screen.findByRole('link', { name: /AST-1001/ });
  expect(link).toHaveAttribute('href', 'https://example.com/assets/AST-1001');
  expect(screen.getByRole('link', { name: /AST-1002/ })).toHaveAttribute('href', 'https://example.com/assets/AST-1002');
});
