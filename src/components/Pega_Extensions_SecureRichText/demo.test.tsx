import React from 'react';
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

test('renders the value in read only mode', async () => {
  render(<Default readOnly value='test value' />);
  expect(screen.getByText('test value')).toBeInTheDocument();
});

test('Should render the value if there is content in display only mode', async () => {
  render(<Default displayMode='DISPLAY_ONLY' formatter='TextInput' value='test value' isTableFormatter />);
  expect(screen.getByText('test value')).toBeInTheDocument();
});
