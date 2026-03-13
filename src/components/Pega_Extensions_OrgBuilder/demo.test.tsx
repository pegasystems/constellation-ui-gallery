import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Org Builder with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Org Builder')).toBeVisible();
  expect(await screen.findByText('Organisation Builder')).toBeVisible();
  expect(await screen.findByText('Reference organization')).toBeVisible();
});
