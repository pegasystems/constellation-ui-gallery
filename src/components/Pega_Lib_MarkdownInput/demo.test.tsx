import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Markdown editor component with default args', async () => {
  render(<Default />);
  expect(screen.getByText('Markdown Helper Text')).toBeInTheDocument();
  expect(screen.getByTestId('markdown-12345678')).toBeInTheDocument();
});

test('renders the value in read only mode', async () => {
  render(<Default readOnly value='test value' />);
  expect(screen.getByText('test value')).toBeInTheDocument();
});

test('Should render the value if there is content in display only mode', async () => {
  render(<Default displayMode='DISPLAY_ONLY' value='test value' />);
  expect(screen.getByText('test value')).toBeInTheDocument();
});
