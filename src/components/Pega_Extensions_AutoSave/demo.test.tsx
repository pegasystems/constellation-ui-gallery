import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

// eslint-disable-next-line jest/expect-expect
test('renders AutoSave with default args', () => {
  render(<Default />);
});
