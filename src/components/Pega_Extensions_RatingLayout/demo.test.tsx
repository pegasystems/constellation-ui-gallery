import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders RatingLayout component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Category #1')).toBeVisible();
  expect(await screen.findByText('Category #2')).toBeVisible();
  expect(await screen.findByText('Category #3')).toBeVisible();
  expect(await screen.findByText('Category #1 - label #1')).toBeVisible();
});
