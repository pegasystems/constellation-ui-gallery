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
    selectAllProperty: {
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
  window.PCore = {
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
  } as unknown as typeof PCore;
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
  } as unknown as typeof PConnect;
};

type Story = StoryObj<typeof PegaExtensionsCheckboxRow>;

const CheckboxRowDemo = (inputs: Omit<CheckboxRowProps, 'getPConnect'>) => {
  return {
    render: (args: Omit<CheckboxRowProps, 'getPConnect'>) => {
      setPCore();
      const props = {
        ...args,
        getPConnect: setPConnect as () => typeof PConnect,
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
  selectAllProperty: '',
  disabled: false,
  readOnly: false,
  required: false,
});
