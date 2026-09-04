import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Reveal Password component with default args', async () => {
  render(<Default />);
  expect(await screen.findByText('Password')).toBeVisible();
  expect(await screen.findByText('Enter a password with one uppercase letter and one special character')).toBeVisible();
  expect(await screen.findByTestId('RevealPasswordID')).toBeVisible();
});

test('press-and-hold reveal shows plain text and releases back to masked', async () => {
  render(<Default />);
  // The component's testId may be on a wrapper; find the native input inside it if needed
  const wrapper = await screen.findByTestId('RevealPasswordID') as HTMLElement;
  const input = (wrapper.tagName === 'INPUT'
    ? (wrapper as HTMLInputElement)
    : (wrapper.querySelector('input') as HTMLInputElement)
  );

  expect(input).toBeTruthy();
  // Initial type should be password (masked)
  expect(input.type).toBe('password');

  const revealBtn = await screen.findByTestId('RevealPasswordID-reveal') as HTMLButtonElement;
  expect(revealBtn).toBeTruthy();

  // Simulate mouse down (press-and-hold)
  fireEvent.mouseDown(revealBtn);
  // while held, input should be text
  expect(input.type).toBe('text');

  // Release mouse
  fireEvent.mouseUp(revealBtn);
  expect(input.type).toBe('password');

  // Keyboard interaction: keydown Space should reveal while held
  fireEvent.keyDown(revealBtn, { key: ' ' });
  expect(input.type).toBe('text');

  // keyup Space should mask again
  fireEvent.keyUp(revealBtn, { key: ' ' });
  expect(input.type).toBe('password');
});
