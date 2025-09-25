import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders OAuth Connect component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Demo Application')).toBeVisible();
  const buttonElement = screen.getByRole('button', { name: 'Connect' });
  expect(buttonElement).not.toBeNull();
});
