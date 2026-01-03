import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsCameraCapture } from './index';

export default {
  title: 'Widgets/Camera',
  component: PegaExtensionsCameraCapture,
  argTypes: {
    buttonText: {
      control: 'text',
    },
    getPConnect: {
      table: { disable: true },
    },
  },
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {
          CASE_INFO: '',
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsCameraCapture>;

export const Default: Story = {
  render: (args) => {
    setPCore();

    const props = {
      ...args,
      getPConnect: () => ({
        getContextName: () => '',
        getValue: () => '',
      }),
    };

    return <PegaExtensionsCameraCapture {...props} />;
  },
  args: {
    buttonText: 'Capture with Camera',
  },
};
