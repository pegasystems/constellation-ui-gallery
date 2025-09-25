import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Card Gallery component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Card Gallery')).toBeVisible();
  expect(await screen.findByText('A-1001')).toBeVisible();
});
