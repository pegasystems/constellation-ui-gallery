import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsAutoSave } from './index';

export default {
  title: 'Fields/AutoSave Field',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsAutoSave,
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {},
    getCascadeManager: () => {
      return {
        registerFields: (f: string) => f,
        unRegisterFields: (f: string) => f,
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsAutoSave>;

export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getContextName: () => '',
          getPageReference: () => '',
          getValue: () => 'C-123',
        };
      },
    };
    return <PegaExtensionsAutoSave {...props} />;
  },
  args: {
    propertyName: '.pyDescription',
  },
};
