import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import { configProps, stateProps } from './mock';
import { PegaExtensionsJsonEditor } from './index';

const meta: Meta<typeof PegaExtensionsJsonEditor> = {
  title: 'Fields/JSON editor',
  component: PegaExtensionsJsonEditor,
  excludeStories: /.*Data$/,
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
    displayMode: {
      options: ['', 'DISPLAY_ONLY', 'LABELS_LEFT'],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;

export const BaseJsonEditor: StoryFn<typeof PegaExtensionsJsonEditor> = (args) => {
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

BaseJsonEditor.args = {
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
};
