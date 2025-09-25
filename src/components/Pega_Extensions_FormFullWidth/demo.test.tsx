import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders FormFullWidth component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Heading')).toBeVisible();
  expect(screen.getByLabelText('Field1')).toBeInTheDocument();
  expect(screen.getByLabelText('Field2')).toBeInTheDocument();
  expect(screen.getByLabelText('Field3')).toBeInTheDocument();
});
