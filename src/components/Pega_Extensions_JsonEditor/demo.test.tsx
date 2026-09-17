import { fireEvent, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react-webpack5';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';
import { configProps } from './mock';

const { BaseJsonEditor } = composeStories(DemoStories);

test('renders JsonEditor', async () => {
  render(<BaseJsonEditor />);

  expect(await screen.findByRole('textbox', { name: 'JSON value' })).toHaveValue(configProps.value);
  expect(screen.getByRole('button', { name: 'Format JSON' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Validate JSON' })).toContainElement(
    screen.getByTestId('JsonEditor-12345678:action:validate').querySelector('[data-icon-name="check"]'),
  );
  expect(screen.getByTestId('JsonEditor-12345678:action:format')).toContainElement(
    screen.getByTestId('JsonEditor-12345678:action:format').querySelector('[data-icon-name="align-left"]'),
  );
  expect(screen.getByTestId('JsonEditor-12345678:action:minify')).toContainElement(
    screen.getByTestId('JsonEditor-12345678:action:minify').querySelector('[data-icon-name="code"]'),
  );
  expect(screen.getByTestId('JsonEditor-12345678:action:copy')).toContainElement(
    screen.getByTestId('JsonEditor-12345678:action:copy').querySelector('[data-icon-name="copy"]'),
  );
  expect(screen.getByTestId('JsonEditor-12345678:action:clear')).toContainElement(
    screen.getByTestId('JsonEditor-12345678:action:clear').querySelector('[data-icon-name="trash"]'),
  );
});

test('shows a placeholder covering all JSON value types', async () => {
  render(<BaseJsonEditor value='' />);

  expect(await screen.findByRole('textbox', { name: 'JSON value' })).toHaveAttribute(
    'placeholder',
    configProps.placeholder,
  );
});

test('formats valid JSON', async () => {
  render(<BaseJsonEditor />);

  const editor = await screen.findByRole('textbox', { name: 'JSON value' });
  fireEvent.change(editor, { target: { value: '{"name":"Pega"}' } });
  fireEvent.click(screen.getByRole('button', { name: 'Format JSON' }));

  expect(editor).toHaveValue('{\n  "name": "Pega"\n}');
});

test('honors authoring visibility settings for actions and counters', async () => {
  render(<BaseJsonEditor showValidate={false} showCopy={false} showCharacterCount={false} showLineCount={false} />);

  expect(screen.queryByRole('button', { name: 'Validate JSON' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Copy JSON' })).not.toBeInTheDocument();
  expect(screen.queryByText(/characters|lines/)).not.toBeInTheDocument();
});

test('renders syntax colors and line numbers', async () => {
  render(<BaseJsonEditor />);

  const editor = await screen.findByRole('textbox', { name: 'JSON value' });
  fireEvent.change(editor, {
    target: { value: '{\n  "name": "Pega",\n  "enabled": true\n}' },
  });

  expect(screen.getByTestId('JsonEditor-12345678:line-numbers').querySelectorAll('span')).toHaveLength(4);
  expect(screen.getByTestId('JsonEditor-12345678:highlight').querySelectorAll('.json-key')).toHaveLength(2);
  expect(screen.getByTestId('JsonEditor-12345678:highlight').querySelector('.json-literal')).toHaveTextContent('true');
});

test('reports invalid JSON and disables JSON transforms', async () => {
  render(<BaseJsonEditor />);

  const editor = await screen.findByRole('textbox', { name: 'JSON value' });
  fireEvent.change(editor, { target: { value: '{invalid' } });

  expect(screen.getByTestId('JsonEditor-12345678:status')).toHaveTextContent('Invalid JSON');
  expect(screen.getByRole('button', { name: 'Format JSON' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Minify JSON' })).toBeDisabled();
});

test('reports the invalid JSON line and column', async () => {
  render(<BaseJsonEditor />);

  const editor = await screen.findByRole('textbox', { name: 'JSON value' });
  fireEvent.change(editor, { target: { value: '{\n  "name": "Pega",\n}' } });

  expect(screen.getByTestId('JsonEditor-12345678:error')).toHaveTextContent('Line 3');
  expect(screen.getByTestId('JsonEditor-12345678:error')).toHaveTextContent('column');
});

test('minifies and clears JSON', async () => {
  render(<BaseJsonEditor />);

  const editor = await screen.findByRole('textbox', { name: 'JSON value' });
  fireEvent.change(editor, { target: { value: '{\n  "name": "Pega"\n}' } });
  fireEvent.click(screen.getByRole('button', { name: 'Minify JSON' }));
  expect(editor).toHaveValue('{"name":"Pega"}');

  fireEvent.click(screen.getByRole('button', { name: 'Clear JSON' }));
  expect(editor).toHaveValue('');
  expect(screen.queryByTestId('JsonEditor-12345678:status')).not.toBeInTheDocument();
});

test('copies JSON and reports copy success', async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });

  render(<BaseJsonEditor />);
  fireEvent.click(screen.getByRole('button', { name: 'Copy JSON' }));

  expect(await screen.findByRole('button', { name: 'Copied' })).toBeVisible();
  expect(writeText).toHaveBeenCalledWith(configProps.value);
});
