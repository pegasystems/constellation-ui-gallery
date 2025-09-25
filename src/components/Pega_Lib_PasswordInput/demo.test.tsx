import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Password Input component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Password')).toBeVisible();
  expect(await screen.findByText('Enter a password with one uppercase letter and one special character')).toBeVisible();
  expect(await screen.findByTestId('PasswordID')).toBeVisible();
});
