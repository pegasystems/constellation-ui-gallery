import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders the Image Carousel with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Title for Image 1')).toBeVisible();
});
