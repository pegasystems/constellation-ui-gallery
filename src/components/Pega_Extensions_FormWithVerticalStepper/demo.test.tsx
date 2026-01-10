// import { expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders PegaExtensionsFormWithVerticalStepper', async () => {
  render(<Default />);
  expect(await screen.findByText('Form template')).toBeVisible();

  expect(await screen.findByText('Step 1')).toBeVisible();
  expect(await screen.findByText('Step 2')).toBeVisible();
  expect(await screen.findByText('Step 3')).toBeVisible();
  expect(await screen.findByText('Step 4')).toBeVisible();
});
