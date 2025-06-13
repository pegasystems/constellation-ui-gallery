import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders editable table component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Edit computers')).toBeVisible();
});
