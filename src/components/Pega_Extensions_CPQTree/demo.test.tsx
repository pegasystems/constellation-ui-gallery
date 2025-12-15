import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Tree component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('CPQ Tree')).toBeVisible();
  expect(await screen.findByText('Premises based Firewall')).toBeVisible();
});
