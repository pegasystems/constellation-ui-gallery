import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default, EmptyHTMLUsesDefaultSlots } = composeStories(DemoStories);

test('renders DynamicTemplate component with default args', async () => {
  const { container } = render(<Default />);
  expect(container.querySelector('.pega-extensions-dynamic-template')).toBeInTheDocument();
  expect(await screen.findByLabelText('Region A Field 1')).toBeVisible();
});

test('renders region content inside data-region slot', async () => {
  render(<Default />);
  expect(await screen.findByLabelText('Region A Field 1')).toBeVisible();
  expect(screen.getByLabelText('Region B Field 1')).toBeVisible();
});

test('empty HTMLContent uses default layout with six slots', async () => {
  render(<EmptyHTMLUsesDefaultSlots />);
  // Built-in default grid keeps placeholder labels (Region A–F) plus portaled fields.
  expect(await screen.findByText('Region A')).toBeVisible();
  expect(screen.getByLabelText('Region A Field 1')).toBeVisible();
  expect(screen.getByLabelText('Region F Field 1')).toBeVisible();
});
