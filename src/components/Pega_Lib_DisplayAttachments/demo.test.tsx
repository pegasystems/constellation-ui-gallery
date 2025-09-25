import { fireEvent, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default, Tiles } = composeStories(DemoStories);

test('renders DisplayAttachments component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Display attachments')).toBeVisible();
  expect(await screen.findByText('6')).toBeVisible();
  expect(await screen.findByText('pega.com')).toBeVisible();
  const BtnEl = await screen.findByText('View all');
  expect(BtnEl).toBeVisible();
  fireEvent.click(BtnEl);
  expect(await screen.findByRole('dialog')).toBeVisible();
  const CloseEl = await screen.findByLabelText('Close modal');
  expect(CloseEl).toBeVisible();
  fireEvent.click(CloseEl);
});

test('renders DisplayAttachments component with tiles args', async () => {
  render(<Tiles />);
  expect(await screen.findByText('Display attachments')).toBeVisible();
  expect(await screen.findByText('pega.com')).toBeVisible();
  expect(await screen.findByText('DemoFile')).toBeVisible();
  expect(await screen.findByText('SampleWord')).toBeVisible();
  expect(await screen.findByText('demoPDF')).toBeVisible();
  const BtnEl = await screen.findByLabelText('Download all');
  expect(BtnEl).toBeVisible();
  fireEvent.click(BtnEl);
});
