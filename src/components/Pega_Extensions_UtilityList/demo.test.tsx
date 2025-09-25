import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Utility List component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('List of objects')).toBeVisible();
  expect(await screen.findByText('6')).toBeVisible();
  expect(await screen.findByText('Appointment for John smith')).toBeVisible();
  expect(await screen.findByText('Appointment for Sue Lee')).toBeVisible();
  const BtnEl = await screen.findByText('View all');
  expect(BtnEl).toBeVisible();
  fireEvent.click(BtnEl);
  expect(await screen.findByRole('dialog')).toBeVisible();
  const CloseEl = await screen.findByLabelText('Close modal');
  expect(CloseEl).toBeVisible();
  fireEvent.click(CloseEl);
});
