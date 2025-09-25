import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders meter component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Tasks completed')).toBeVisible();
});
