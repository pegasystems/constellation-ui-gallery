import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Gantt Chart component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Gantt chart')).toBeVisible();
  expect(await screen.findByText('Show task list')).toBeVisible();
  expect(await screen.findByText('Hourly')).toBeVisible();
  expect(await screen.findByText('Daily')).toBeVisible();
});
