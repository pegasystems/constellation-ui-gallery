import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsCheckboxRow, type CheckboxRowProps } from './index';

export default {
  title: 'Fields/Checkbox Row',
  argTypes: {
    fieldMetadata: {
      table: {
        disable: true,
      },
    },
    additionalProps: {
      table: {
        disable: true,
      },
    },
    displayMode: {
      table: {
        disable: true,
      },
    },
    variant: {
      table: {
        disable: true,
      },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsCheckboxRow,
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
    getRestClient: () => {
      return {
        invokeRestApi: () => {
          return Promise.resolve({
            data: {
              responseData: { test: '2' },
            },
          });
        },
      };
    },
    getContainerUtils: () => {
      return {
        getContainerItemData: () => {
          return {
            test: '1',
          };
        },
      };
    },
    getStore: () => {
      return {
        getState: () => {
          return {
            data: {
              context: {
                dataInfo: {
                  content: {
                    test: '1',
                  },
                },
              },
            },
          };
        },
        dispatch: () => {},
      };
    },
  };
};

const setPConnect = () => {
  return {
    getStateProps: () => {
      return {
        value: 'C-123',
      };
    },
    getContextName: () => {
      return 'modal_1';
    },
    getTarget: () => {
      return 'modal';
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
        },
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
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsCheckboxRow>;

const CheckboxRowDemo = (inputs: CheckboxRowProps) => {
  return {
    render: (args: CheckboxRowProps) => {
      setPCore();
      const props = {
        ...args,
        getPConnect: setPConnect,
      };
      return <PegaExtensionsCheckboxRow {...props} />;
    },
    args: inputs,
  };
};

export const Default: Story = CheckboxRowDemo({
  label: 'Demo checkbox',
  value: false,
  testId: 'demo',
  labelProperty: '',
  validatemessage: '',
  helperText: '',
  disabled: false,
  readOnly: false,
  required: false,
});
