import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default, FinancialReport, RadioButton } = composeStories(DemoStories);

test('renders CompareTable component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Heading')).toBeVisible();
  const linkEl = screen.getByText('MacBook Air');
  expect(linkEl).not.toBeNull();

  render(<FinancialReport />);
  expect(await screen.findByText('Financial report')).toBeVisible();

  render(<RadioButton />);
  expect(await screen.findByText('Radio-button')).toBeVisible();
});
