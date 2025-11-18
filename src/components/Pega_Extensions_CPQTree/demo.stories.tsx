import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsCPQTree, type CPQTreeProps } from './index';
import sampleData1 from './sample1.json';
import sampleData2 from './sample2.json';
import sampleData3 from './sample3.json';
import sampleData4 from './sample4.json';

export default {
  title: 'Fields/CPQ Tree',
  argTypes: {
    Example: {
      options: ['example1', 'example2', 'example3', 'example4'],
      control: { type: 'radio' },
    },
    dataPage: {
      table: {
        disable: true,
      },
    },
    selectionProperty: {
      table: {
        disable: true,
      },
    },
    childrenPropertyName: {
      table: {
        disable: true,
      },
    },
    displayPropertyName: {
      table: {
        disable: true,
      },
    },
    idPropertyName: {
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
  parameters: {
    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            id: 'nested-interactive',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsCPQTree,
};

const setPCore = (Example: string) => {
  // Use data from sample.json regardless of example selection for now
  let data = {};
  switch (Example) {
    case 'example1':
      data = sampleData1;
      break;
    case 'example2':
      data = sampleData2;
      break;
    case 'example3':
      data = sampleData3;
      break;
    case 'example4':
      data = sampleData4;
      break;
  }

  (window as any).PCore = {
    getLocaleUtils: () => {
      return {
        getLocaleValue: (val: string) => {
          return val;
        },
      };
    },
    getConstants: () => {
      return {
        CASE_INFO: {
          AVAILABLEACTIONS: '',
          CASE_INFO_ID: 'CASE_INFO_ID',
        },
      };
    },
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local',
      };
    },
    getEvents: () => {
      return {
        getCaseEvent: () => {
          return {
            ASSIGNMENT_SUBMISSION: 'ASSIGNMENT_SUBMISSION',
          };
        },
      };
    },
    getPubSubUtils: () => {
      return {
        subscribe: () => {
          /* nothing */
        },
        unsubscribe: () => {
          /* nothing */
        },
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return window.location.href;
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle',
          };
        },
      };
    },
    getDataPageUtils: () => {
      return {
        getPageDataAsync: () => {
          return Promise.resolve(data);
        },
      };
    },
  };
};

interface CPQTreePropsExt extends CPQTreeProps {
  Example: string;
}

type Story = StoryObj<CPQTreePropsExt>;
export const Default: Story = {
  render: (args: CPQTreePropsExt) => {
    setPCore(args.Example);
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
          getContextName: () => '',
          getValue: (key?: string) => {
            if (key === 'CASE_INFO_ID') {
              return 'test-case-instance-key';
            }
            return [{ ID: 'pyEditDetails', name: 'Edit Details' }];
          },

          getActionsApi: () => {
            return {
              openWorkByHandle: () => {
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
      },
    };
    return <PegaExtensionsCPQTree {...props} />;
  },
  args: {
    Example: 'example1',
    dataPage: '',
    heading: 'CPQ Tree',
    readOnly: false,
    childrenPropertyName: 'Tree|Configuration',
  },
};
