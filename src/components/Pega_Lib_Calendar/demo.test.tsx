import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Calendar component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('month')).toBeVisible();
  expect(await screen.findByText('week')).toBeVisible();
  expect(await screen.findByText('day')).toBeVisible();
  expect(await screen.findByText('Heading')).toBeVisible();
  const dayEl = screen.getByText('day');
  expect(dayEl).not.toBeNull();
  fireEvent.click(dayEl);
  const weekEl = await screen.findByText('week');
  expect(weekEl).not.toBeNull();
  fireEvent.click(weekEl);
});
