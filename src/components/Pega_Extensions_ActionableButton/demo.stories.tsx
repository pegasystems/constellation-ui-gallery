import type { StoryObj } from '@storybook/react';
import PegaExtensionsActionableButton from './index';

export default {
  title: 'Fields/Actionable button',
  argTypes: {
    label: {
      control: 'text'
    },
    localAction: {
      control: 'text'
    },
    value: {
      control: 'text'
    },
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsActionableButton
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
    }
  };
};

type Story = StoryObj<typeof PegaExtensionsActionableButton>;

export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      label: args.label,
      localAction: args.localAction,
      value: args.value,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: 'C-123'
            };
          },
          getActionsApi: () => {
            return {
              openLocalAction: {
                bind: () => {
                  return (name: string, options: any) => {
                    // eslint-disable-next-line no-alert
                    alert(`Launch local action ${name} for ${options.caseID}`);
                  };
                }
              }
            };
          }
        };
      }
    };
    return <PegaExtensionsActionableButton {...props} />;
  },
  args: {
    label: 'Launch',
    localAction: 'pyEditDetails',
    value: 'Work-Case C-123'
  }
};
