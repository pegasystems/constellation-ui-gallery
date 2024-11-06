import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders secure rich text editor component with default args', async () => {
  render(<Default />);
  expect(screen.getByLabelText('Paragraph Sample')).toBeInTheDocument();
  expect(screen.getByText('Paragraph Helper Text')).toBeInTheDocument();
  expect(screen.getByTestId('paragraph-12345678')).toBeInTheDocument();
});
