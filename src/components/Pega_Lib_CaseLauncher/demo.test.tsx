import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Case Launcher widget with default args', () => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Default />);

  const headingElement = screen.getByRole('heading');
  expect(headingElement).not.toBeNull();

  const buttonElement = screen.getByRole('button', { name: 'Start a case' });
  expect(buttonElement).not.toBeNull();
  fireEvent.click(buttonElement);
  expect(window.alert).toHaveBeenCalled();
});
