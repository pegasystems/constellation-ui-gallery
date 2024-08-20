import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders QR Code with default args', async () => {
  const { container } = render(<Default />);
  expect(await screen.findByText('QRCode')).toBeVisible();
  expect(await screen.findByText('Scan with your phone')).toBeVisible();
  // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
  const svgEl = container.querySelector('svg') as SVGSVGElement;
  expect(svgEl).not.toBeNull();
});
