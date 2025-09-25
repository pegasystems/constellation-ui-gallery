import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Case Reference component with default args', async () => {
  render(<Default />);
  const linkEl = screen.getByText('C-123');
  expect(linkEl).not.toBeNull();
});
