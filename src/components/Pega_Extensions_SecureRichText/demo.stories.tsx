// @ts-nocheck
import type { StoryObj } from '@storybook/react-webpack5';

import { PegaExtensionsSecureRichText } from './index';

const stateProps = {
  value: '.ParagraphSample',
  hasSuggestions: false,
};

export default {
  title: 'Fields/Secure Rich Text Editor',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
    displayMode: {
      table: {
        disable: true,
      },
    },
    additionalProps: {
      table: {
        disable: true,
      },
    },
    maxWords: { control: 'number', if: { arg: 'showWordCounter', eq: true } },
    formatter: {
      table: {
        disable: true,
      },
    },
    isTableFormatter: {
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
  parameters: {
    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsSecureRichText,
};

const setPCore = () => {
  (window as any).PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f,
      };
    },
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local',
      };
    },
    getActionsSequencer: () => {
      return {
        registerBlockingAction: () => {
          return new Promise((resolve) => {
            resolve();
          });
        },
      };
    },
    getAttachmentUtils: () => {
      return {
        uploadAttachment: () => {
          return new Promise((resolve) => {
            resolve({
              ID: 'sample',
            });
          });
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsSecureRichText>;

export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,

      getPConnect: () => {
        return {
          getStateProps: () => {
            return stateProps;
          },
          getServerURL: () => 'https://www.google.com',
          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
                /* nothing */
              },
              createWork: () => {
                /* nothing */
              },
              updateFieldValue: () => {
                /* nothing */
              },
              triggerFieldChange: () => {
                /* nothing */
              },
              showCasePreview: () => {
                /* nothing */
              },
            };
          },
          getActions: () => {
            return {
              ACTION_OPENWORKBYHANDLE: 'openWorkByHandle',
            };
          },
          clearErrorMessages: () => {
            /* nothing */
          },
          getValidationApi: () => {
            return {
              validate: () => {
                /* nothing */
              },
            };
          },
          getContextName: () => 'primary',
          getLocalizedValue: () => 'local value',
        };
      },
    };
    return <PegaExtensionsSecureRichText {...props} />;
  },
  args: {
    label: 'Paragraph Sample',
    value: '',
    helperText: 'Paragraph Helper Text',
    testId: 'paragraph-12345678',
    placeholder: 'Paragraph Placeholder',
    validatemessage: '',
    toolbarMode: 'normal',
    showWordCounter: true,
    maxWords: 100,
    disabled: false,
    readOnly: false,
    required: false,
    hideLabel: false,
  },
};
