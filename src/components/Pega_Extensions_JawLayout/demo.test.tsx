import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders dental chart component with default args', async () => {
  render(<Default />);

  // Test for dental chart specific elements that should be visible
  expect(await screen.findByText('Maxillary')).toBeVisible();
  expect(await screen.findByText('Mandibular')).toBeVisible();
  expect(await screen.findByText('Missing (M)')).toBeVisible();
  expect(await screen.findByText('Extracted (E)')).toBeVisible();

  // Test for healthy status in the legend
  expect(await screen.findByText('Healthy')).toBeVisible();
});
