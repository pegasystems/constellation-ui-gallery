import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react-webpack5';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';

const { Default, Complete, Indeterminate } = composeStories(DemoStories);

test('renders a labeled Progress Bar with accessible values', () => {
  render(<Default />);

  const progress = screen.getByRole('progressbar', { name: 'Project completion' });
  expect(progress).toHaveAttribute('aria-valuenow', '68');
  expect(progress).toHaveAttribute('aria-valuemax', '100');
  expect(screen.getByText('68%')).toBeVisible();
  expect(screen.getByText('On track')).toBeVisible();
  expect(screen.queryByText('Halfway')).not.toBeInTheDocument();
  expect(screen.queryByText('Start')).not.toBeInTheDocument();
  expect(screen.getByTestId('ProgressBar-12345678:marker:50')).toBeInTheDocument();
});

test('renders completion state', () => {
  render(<Complete />);

  expect(screen.getByRole('progressbar', { name: 'Release readiness' })).toHaveAttribute('aria-valuenow', '100');
  expect(screen.getByRole('progressbar', { name: 'Release readiness' })).toHaveAttribute(
    'aria-valuetext',
    '100% complete',
  );
  expect(screen.getAllByText('Complete')).not.toHaveLength(0);
});

test('supports indeterminate progress', () => {
  render(<Indeterminate />);

  const progress = screen.getByRole('progressbar', { name: 'Preparing workspace' });
  expect(progress).not.toHaveAttribute('aria-valuenow');
  expect(progress).toHaveAttribute('aria-valuetext', 'In progress');
  expect(screen.getByText('In progress')).toBeVisible();
  expect(screen.queryByTestId('ProgressBar-12345678:marker:50')).not.toBeInTheDocument();
});

test('clamps values to the configured range', () => {
  render(<Default value={140} max={120} />);

  expect(screen.getByRole('progressbar', { name: 'Project completion' })).toHaveAttribute('aria-valuenow', '120');
  expect(screen.getAllByText('Complete')).not.toHaveLength(0);
});
