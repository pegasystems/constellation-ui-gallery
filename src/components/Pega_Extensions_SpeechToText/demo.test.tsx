import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default, ReadOnly, DisplayOnly } = composeStories(DemoStories);

describe('PegaExtensionsSpeechToText', () => {
  test('renders Speech to Text component with default args', async () => {
    render(<Default />);
    expect(screen.getByText('Speech to Text Input')).toBeInTheDocument();
    expect(screen.getByText('Click "Start Recording" to begin capturing your voice')).toBeInTheDocument();
    expect(screen.getByTestId('speech-to-text-12345678-start-btn')).toBeInTheDocument();
  });

  test('renders start and stop buttons', async () => {
    render(<Default />);
    const startBtn = screen.getByTestId('speech-to-text-12345678-start-btn');
    const stopBtn = screen.getByTestId('speech-to-text-12345678-stop-btn');
    const clearBtn = screen.getByTestId('speech-to-text-12345678-clear-btn');

    expect(startBtn).toBeInTheDocument();
    expect(stopBtn).toBeInTheDocument();
    expect(clearBtn).toBeInTheDocument();
  });

  test('renders the value in read only mode', async () => {
    render(<ReadOnly readOnly value="test speech value" />);
    expect(screen.getByText('test speech value')).toBeInTheDocument();
  });

  test('should render the value if there is content in display only mode', async () => {
    render(<DisplayOnly displayMode="DISPLAY_ONLY" value="test display value" />);
    expect(screen.getByText('test display value')).toBeInTheDocument();
  });

  test('renders custom button text', async () => {
    render(
      <Default
        startButtonText="Tap to Record"
        stopButtonText="Stop"
      />
    );
    expect(screen.getByText('Tap to Record')).toBeInTheDocument();
    expect(screen.getByText('Stop')).toBeInTheDocument();
  });

  test('stop button is disabled when not listening', async () => {
    render(<Default />);
    const stopBtn = screen.getByTestId('speech-to-text-12345678-stop-btn');
    expect(stopBtn).toBeDisabled();
  });

  test('clear button is disabled when no text', async () => {
    render(<Default value="" />);
    const clearBtn = screen.getByTestId('speech-to-text-12345678-clear-btn');
    expect(clearBtn).toBeDisabled();
  });

  test('renders with placeholder text', async () => {
    const placeholder = 'Enter your speech here';
    render(<Default placeholder={placeholder} />);
    const input = screen.getByTestId('speech-to-text-12345678') as HTMLInputElement;
    expect(input.placeholder).toBe(placeholder);
  });
});
