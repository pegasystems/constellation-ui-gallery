import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { BasePegaExtensionsJapaneseInput } = composeStories(DemoStories);

test('renders Password Input component with default args', async () => {
  render(<BasePegaExtensionsJapaneseInput />);
  expect(await screen.findByText('TextInput Sample')).toBeVisible();
});
