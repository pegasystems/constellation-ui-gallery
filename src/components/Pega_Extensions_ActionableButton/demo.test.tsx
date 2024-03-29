import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default } = composeStories(DemoStories);

test('renders Actionable button with default args', () => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Default />);
  const buttonElement = screen.getByText('Launch');
  expect(buttonElement).not.toBeNull();
  fireEvent.click(buttonElement);
  expect(window.alert).toHaveBeenCalled();
});
