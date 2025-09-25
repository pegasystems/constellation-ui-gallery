import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Banner component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Success')).toBeVisible();
  expect(await screen.findByText('Message1')).toBeVisible();
  expect(await screen.findByText('Message2')).toBeVisible();
});
