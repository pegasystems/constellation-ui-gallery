// @ts-nocheck
import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsSpeechToText } from './index';

export default {
  title: 'Fields/Speech to Text',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
    additionalProps: {
      table: {
        disable: true,
      },
    },
    fieldMetadata: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsSpeechToText,
};

type Story = StoryObj<typeof PegaExtensionsSpeechToText>;

export const Default: Story = {
  render: (args) => {
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: '.SpeechToText',
            };
          },
          getActionsApi: () => {
            return {
              updateFieldValue: (prop: string, value: string) => {
                console.log(`Updated ${prop}:`, value);
              },
              triggerFieldChange: (prop: string, value: string) => {
                console.log(`Triggered change on ${prop}:`, value);
              },
            };
          },
        };
      },
    };
    return <PegaExtensionsSpeechToText {...props} />;
  },
  args: {
    displayMode: '',
    readOnly: false,
    required: false,
    hideLabel: false,
    disabled: false,
    label: 'Speech to Text Input',
    value: '',
    helperText: 'Click "Start Recording" to begin capturing your voice',
    testId: 'speech-to-text-12345678',
    placeholder: 'Click "Start Recording" to begin...',
    validatemessage: '',
    startButtonText: 'Start Recording',
    stopButtonText: 'Stop Recording',
    language: 'en-US',
  },
};

export const ReadOnly: Story = {
  render: (args) => {
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: '.SpeechToText',
            };
          },
          getActionsApi: () => {
            return {
              updateFieldValue: () => {
                /* nothing */
              },
              triggerFieldChange: () => {
                /* nothing */
              },
            };
          },
        };
      },
    };
    return <PegaExtensionsSpeechToText {...props} />;
  },
  args: {
    displayMode: '',
    readOnly: true,
    required: false,
    hideLabel: false,
    disabled: false,
    label: 'Speech to Text (Read Only)',
    value: 'This is recorded text from speech recognition.',
    helperText: 'This field is read-only',
    testId: 'speech-to-text-readonly',
    placeholder: '',
    validatemessage: '',
  },
};

export const DisplayOnly: Story = {
  render: (args) => {
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: '.SpeechToText',
            };
          },
          getActionsApi: () => {
            return {
              updateFieldValue: () => {
                /* nothing */
              },
              triggerFieldChange: () => {
                /* nothing */
              },
            };
          },
        };
      },
    };
    return <PegaExtensionsSpeechToText {...props} />;
  },
  args: {
    displayMode: 'DISPLAY_ONLY',
    readOnly: false,
    required: false,
    hideLabel: false,
    disabled: false,
    label: 'Speech to Text (Display Only)',
    value: 'Previously recorded speech text is displayed here.',
    helperText: '',
    testId: 'speech-to-text-display',
    placeholder: '',
    validatemessage: '',
  },
};
