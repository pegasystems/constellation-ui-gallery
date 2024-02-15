import type { StoryObj } from '@storybook/react';
import PegaExtensionsPasswordInput from './index';

export default {
  title: 'Fields/Password Input',
  argTypes: {
    fieldMetadata: {
      table: {
        disable: true
      }
    },
    additionalProps: {
      table: {
        disable: true
      }
    },
    displayMode: {
      table: {
        disable: true
      }
    },
    variant: {
      table: {
        disable: true
      }
    },
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsPasswordInput
};

const setPCore = () => {
  PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f
      };
    },
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local'
      };
    }
  } as unknown as typeof PCore;
};

type Story = StoryObj<typeof PegaExtensionsPasswordInput>;

export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: 'C-123'
            };
          },
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
              }
            };
          },
          ignoreSuggestion: () => {
            /* nothing */
          },
          acceptSuggestion: () => {
            /* nothing */
          },
          setInheritedProps: () => {
            /* nothing */
          },
          resolveConfigProps: () => {
            /* nothing */
          }
        } as unknown as typeof PConnect;
      }
    };
    return <PegaExtensionsPasswordInput {...props} />;
  },
  args: {
    label: 'Password',
    value: 'demo',
    helperText: 'Enter a password with one uppercase letter and one special character',
    testId: '',
    placeholder: '',
    validatemessage: '',
    disabled: false,
    readOnly: false,
    required: false,
    hideLabel: false,
    hasSuggestions: false
  }
};
