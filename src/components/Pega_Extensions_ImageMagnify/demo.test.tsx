import React from 'react';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Image Magnify component with default args', async () => {
  render(<Default />);
  const images = document.querySelectorAll('img');
  expect(images).toHaveLength(2);
});
