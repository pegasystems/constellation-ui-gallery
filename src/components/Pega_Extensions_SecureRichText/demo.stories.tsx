/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';

import PegaExtensionsSecureRichText from './index';

import { stateProps, configProps, fieldMetadata } from './mock';

export default {
  title: 'Fields/Secure rich text editor',
  argTypes: {
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsSecureRichText
};

const setPCore = () => {
  (window as any).PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f
      };
    },
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local'
      };
    },
    getActionsSequencer: () => {
      return {
        registerBlockingAction: () => {
          return new Promise(resolve => {
            resolve();
          });
        }
      };
    },
    getAttachmentUtils: () => {
      return {
        uploadAttachment: () => {
          return new Promise(resolve => {
            resolve({
              ID: 'sample'
            });
          });
        }
      };
    }
  };
};

type Story = StoryObj<typeof PegaExtensionsSecureRichText>;

export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      value: configProps.value,
      fieldMetadata,
      hasSuggestions: configProps.hasSuggestions,
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
              }
            };
          },
          getActions: () => {
            return {
              ACTION_OPENWORKBYHANDLE: 'openWorkByHandle'
            };
          },
          clearErrorMessages: () => {
            /* nothing */
          },
          getValidationApi: () => {
            return {
              validate: () => {
                /* nothing */
              }
            };
          },
          getContextName: () => 'primary',
          getLocalizedValue: () => 'local value'
        };
      }
    };
    return <PegaExtensionsSecureRichText {...props} />;
  },
  args: {
    label: configProps.label,
    helperText: configProps.helperText,
    placeholder: configProps.placeholder,
    testId: configProps.testId,
    readOnly: configProps.readOnly,
    disabled: configProps.disabled,
    required: configProps.required,
    status: configProps.status,
    hideLabel: configProps.hideLabel,
    displayMode: configProps.displayMode,
    variant: configProps.variant,
    validatemessage: configProps.validatemessage
  }
};
