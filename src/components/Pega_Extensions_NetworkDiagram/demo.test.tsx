import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Network Diagram with default args', async () => {
  const { container } = render(<Default />);
  expect(await screen.findByText('Heading')).toBeVisible();
  expect(await screen.findByLabelText('Reload diagram')).toBeVisible();

  const svgEl = container.querySelector('.react-flow__container') as SVGSVGElement;
  expect(svgEl).not.toBeNull();
  expect(svgEl.textContent).toContain('New Wave Energy Solutions');
});
