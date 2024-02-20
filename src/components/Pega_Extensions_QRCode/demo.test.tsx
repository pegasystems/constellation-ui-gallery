import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders QR Code with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('QRCode')).toBeVisible();
  expect(await screen.findByText('Scan with your phone')).toBeVisible();
  const imgEl = (await screen.findByAltText('QRCode')) as HTMLImageElement;
  expect(imgEl).not.toBeNull();
  expect(imgEl.src).toContain('data:image/png;base64,iVBORw0KGgoAAAANSUh');
});
