import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Signature Capture with default args', async () => {
  const { container } = render(<Default />);
  expect(await screen.findByText('Signature')).toBeVisible();
  expect(await screen.findByText('Sign the document')).toBeVisible();
  expect(await screen.findByText('Accept')).toBeVisible();
  expect(await screen.findByText('Clear')).toBeVisible();

  const canvasEl = container.querySelector('canvas');
  expect(canvasEl).not.toBeNull();
});
