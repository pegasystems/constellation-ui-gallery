import type { StoryObj } from '@storybook/react';
import PegaExtensionsActionableButton from './index';
import type ActionsApi from '@pega/pcore-pconnect-typedefs/actions/api';

export default {
  title: 'Fields/Actionable button',
  argTypes: {
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsActionableButton
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

type Story = StoryObj<typeof PegaExtensionsActionableButton>;

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
              openLocalAction: (name: string, options: any) => {
                // eslint-disable-next-line no-alert
                alert(`Launch local action ${name} for ${options.caseID}`);
              }
            };
          }
        } as unknown as typeof PConnect;
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
