import React from 'react';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders bar code with default args', () => {
  const { container } = render(<Default />);

  const svgEl = container.querySelector('svg') as SVGSVGElement;
  expect(svgEl).not.toBeNull();
  expect(svgEl.textContent).toContain('A2345FG721');
});
