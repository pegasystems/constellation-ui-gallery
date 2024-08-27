import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Case Hierarchy component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Case Hierarchy')).toBeVisible();
  expect(await screen.findByText('Child Case type 2 with a very long description')).toBeVisible();
});
