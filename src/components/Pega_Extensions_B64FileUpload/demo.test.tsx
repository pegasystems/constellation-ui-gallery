import { fireEvent, render, screen, within } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';

const { BaseExtensionsB64FileUpload } = composeStories(DemoStories);

test('renders ExtensionsB64FileUpload upload box', () => {
  render(<BaseExtensionsB64FileUpload />);

  expect(screen.getByText('Upload File Component Demo')).toBeVisible();
  expect(screen.getByText(/Drag and drop a file here or/)).toBeVisible();
});

test('select file button opens the file picker', () => {
  render(<BaseExtensionsB64FileUpload />);

  const button = screen.getByRole('button', { name: 'Select file' });
  const clickSpy = jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});

  fireEvent.click(button);

  expect(clickSpy).toHaveBeenCalled();
  clickSpy.mockRestore();
});

test('reads the selected file and shows its name and size when done', async () => {
  render(<BaseExtensionsB64FileUpload />);

  const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' });
  fireEvent.change(screen.getByLabelText('Select file'), { target: { files: [file] } });

  const uploader = within(screen.getByTestId('bbva-upload-file'));
  expect(await uploader.findByText('hello.txt')).toBeInTheDocument();
  expect(uploader.getByText(/\(0\.00 MB\)/)).toBeInTheDocument();
});
