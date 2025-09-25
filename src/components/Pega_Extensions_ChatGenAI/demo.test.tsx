import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

jest.setTimeout(10000);

test('renders ChatGenAI widget with default args', async () => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Default />);
  const txtEl = screen.getByTestId(':text-area:control');
  expect(txtEl).not.toBeNull();
  const BtnEl = screen.getByLabelText('Send');
  expect(BtnEl).not.toBeNull();

  act(() => {
    fireEvent.click(BtnEl);
  });
  expect(await screen.findByLabelText('GenAI Assistant is typing')).toBeVisible();
  await new Promise((r) => {
    setTimeout(r, 2000);
  });
  expect(await screen.findByText(/Thanks for asking/i)).toBeVisible();
});
