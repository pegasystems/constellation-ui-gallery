import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Scheduler component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Scheduler')).toBeVisible();
  expect(await screen.findByText('My new event')).not.toBeNull();
  expect(await screen.findByText('Meeting #1 - John Doe')).not.toBeNull();
  expect(await screen.findByText('Meeting #2 - Frank Smith')).not.toBeNull();
  expect(await screen.findByText('Meeting #3 - John Doe')).not.toBeNull();
});
