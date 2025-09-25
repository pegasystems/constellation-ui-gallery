import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsTaskList } from './index';

export default {
  title: 'Widgets/Task List',
  argTypes: {
    dataPage: {
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
            id: 'autocomplete-valid',
            enabled: false,
          },
        ],
      },
    },
  },
  component: PegaExtensionsTaskList,
};

const setPCore = () => {
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
        CASE_INFO: {},
      };
    },
    getRestClient: () => {
      return {
        invokeRestApi: () => {
          return Promise.resolve({ status: 200 });
        },
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return '/case/case-1';
        },
        getActions: () => {
          return {
            ACTION_OPENWORKBYHANDLE: 'openWorkByHandle',
          };
        },
      };
    },
    getDataApiUtils: () => {
      return {
        getData: () => {
          return Promise.resolve({
            data: {
              data: [
                {
                  Id: '1',
                  Label: 'Project configuration has been completed',
                  IsCompleted: true,
                },
                {
                  Id: '2',
                  Label: 'Create the project report',
                  IsCompleted: false,
                },
              ],
            },
          });
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsTaskList>;
export const Default: Story = {
  render: (args: any) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
          getContextName: () => '',
          getValue: () => 'C-123',
        };
      },
    };
    return <PegaExtensionsTaskList {...props} />;
  },
  args: {
    heading: 'Tasks',
    dataPage: 'D_TaskListList',
  },
};
