import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Camera Capture widget with default args', async () => {
  render(<Default />);

  const button = await screen.findByRole('button');
  expect(button).toBeVisible();
});
