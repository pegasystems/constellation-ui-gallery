import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Masked Input component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Zip Code')).toBeVisible();
  expect(await screen.findByText('#####-####')).toBeVisible();
  expect(await screen.findByTestId('maskedinput')).toBeVisible();
});
