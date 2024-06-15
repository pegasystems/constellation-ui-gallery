import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders ESRI Map with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Map')).toBeVisible();
  expect(await screen.findByText('Clear')).toBeVisible();
});
