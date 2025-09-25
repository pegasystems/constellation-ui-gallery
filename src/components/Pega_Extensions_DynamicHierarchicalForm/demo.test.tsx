import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Dynamic Hierarchical Form component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Select your products')).toBeVisible();
  expect(await screen.findAllByText('Product #1')).toHaveLength(2);
  expect(await screen.findAllByText('Product #2')).toHaveLength(2);
  expect(await screen.findAllByText('Product #3')).toHaveLength(2);
});
