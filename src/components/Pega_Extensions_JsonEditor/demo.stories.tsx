import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { configProps, stateProps } from './mock';
import { PegaExtensionsJsonEditor, type PegaExtensionsJsonEditorProps } from './index';

type StoryArgs = Omit<PegaExtensionsJsonEditorProps, 'getPConnect'>;

const JsonEditorStory = (args: StoryArgs) => {
  const [value, setValue] = useState(configProps.value);

  const props = {
    value,
    getPConnect: () =>
      ({
        getStateProps: () => stateProps,
        getActionsApi: () => ({
          updateFieldValue: (_propName: string, nextValue: string) => setValue(nextValue),
        }),
        getLocalizedValue: (text: string) => text,
      }) as unknown as typeof PConnect,
  };

  return <PegaExtensionsJsonEditor {...props} {...args} />;
};

const meta = {
  title: 'Fields/JSON editor',
  component: JsonEditorStory,
  excludeStories: /.*Data$/,
  argTypes: {
    displayMode: {
      options: ['', 'DISPLAY_ONLY', 'LABELS_LEFT'],
      control: {
        type: 'select',
      },
    },
    status: {
      options: [undefined, 'error', 'success', 'warning', 'pending'],
      control: {
        type: 'select',
      },
    },
    indent: {
      control: {
        type: 'number',
        min: 0,
        step: 1,
      },
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BaseJsonEditor: Story = {
  render: (args) => <JsonEditorStory {...args} />,
  args: {
    label: configProps.label,
    value: configProps.value,
    helperText: configProps.helperText,
    placeholder: configProps.placeholder,
    testId: configProps.testId,
    readOnly: configProps.readOnly,
    disabled: configProps.disabled,
    required: configProps.required,
    status: configProps.status,
    hideLabel: configProps.hideLabel,
    displayMode: configProps.displayMode,
    validatemessage: configProps.validatemessage,
    indent: 2,
    showValidate: true,
    showFormat: true,
    showMinify: true,
    showCopy: true,
    showClear: true,
    showCharacterCount: true,
    showLineCount: true,
  },
};
