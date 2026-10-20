import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';
import { PegaExtensionsCaseLauncher } from './index';

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

test('shows inline progress and prevents repeat clicks while creating a case when enabled', async () => {
  let resolveCreateWork!: () => void;
  const createWork = jest.fn(
    () =>
      new Promise<void>((resolve) => {
        resolveCreateWork = resolve;
      }),
  );
  const getPConnect = () => ({
    getActionsApi: () => ({ createWork }),
  });

  render(
    <PegaExtensionsCaseLauncher
      heading='Start Case'
      description='Start a case'
      classFilter='Work-'
      labelPrimaryButton='Start a case'
      showLoadingIndicator
      getPConnect={getPConnect}
    />,
  );

  const button = screen.getByRole('button', { name: 'Start a case' });
  fireEvent.click(button);

  expect(button).toBeDisabled();
  expect(screen.getByRole('progressbar')).toBeInTheDocument();

  fireEvent.click(button);
  expect(createWork).toHaveBeenCalledTimes(1);

  await act(async () => {
    resolveCreateWork();
  });

  expect(button).not.toBeDisabled();
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
});
