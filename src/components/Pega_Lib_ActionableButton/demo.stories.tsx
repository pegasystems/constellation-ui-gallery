import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsActionableButton } from './index';

export default {
  title: 'Fields/Actionable Button',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsActionableButton,
};

const setPCore = () => {
  (window as any).PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f,
      };
    },
    getConstants: () => {
      return {
        CASE_INFO: {
          AVAILABLEACTIONS: '',
        },
      };
    },
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local',
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsActionableButton>;

export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: 'C-123',
            };
          },
          getContextName: () => {
            return 'context';
          },
          getContainerName: () => {
            return 'workarea';
          },
          getValue: () => [{ ID: 'pyEditDetails', name: 'Edit Details' }],
          getActionsApi: () => {
            return {
              saveAssignment: () => Promise.resolve(),
              openLocalAction: (name: string, options: any) => {
                alert(`Launch local action ${name} for ${options.caseID}`);
              },
            };
          },
        };
      },
    };
    return <PegaExtensionsActionableButton {...props} />;
  },
  args: {
    label: 'Launch',
    localAction: 'pyEditDetails',
    value: 'Work-Case C-123',
  },
};
