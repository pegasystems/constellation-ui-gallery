import type { StoryObj } from '@storybook/react-webpack5';

import { PegaExtensionsCaseLauncher } from './index';

export default {
  title: 'Widgets/Case Launcher',
  component: PegaExtensionsCaseLauncher,
  argTypes: {
    classFilter: {
      options: ['Work-'],
      control: { control: 'select' },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
};

const setPCore = () => {
  (window as any).PCore = {
    getEnvironmentInfo: () => {
      return {};
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsCaseLauncher>;

export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getActionsApi: () => {
            return {
              createWork: (className: string) => {
                alert(`Create case type with className: ${className}`);
              },
            };
          },
        };
      },
    };
    return <PegaExtensionsCaseLauncher {...props} />;
  },
  args: {
    heading: 'Start Case',
    description: 'Short description about the case that you will be able to start',
    classFilter: 'Work-',
    labelPrimaryButton: 'Start a case',
  },
};
