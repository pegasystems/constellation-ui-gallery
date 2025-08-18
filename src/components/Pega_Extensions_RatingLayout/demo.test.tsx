import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders RatingLayout component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Ratings')).toBeVisible();
});
