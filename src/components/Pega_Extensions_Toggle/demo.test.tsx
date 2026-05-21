import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default, On, ReadOnly } = composeStories(DemoStories);

test('renders Toggle with field label, caption, and helper text', async () => {
  render(<Default />);
  expect(await screen.findByText('Active status')).toBeVisible();
  expect(await screen.findByText('Is active')).toBeVisible();
  expect(await screen.findByText('Turn on to mark this record as active')).toBeVisible();
});

test('renders Toggle in the on state', async () => {
  render(<On />);
  const switchInput = await screen.findByRole('switch');
  expect(switchInput).toBeChecked();
});

test('renders read-only display text', async () => {
  render(<ReadOnly />);
  expect(await screen.findByText('Yes')).toBeVisible();
  expect(screen.queryByRole('switch')).not.toBeInTheDocument();
});
