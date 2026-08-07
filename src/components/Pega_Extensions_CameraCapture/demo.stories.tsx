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
  window.PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {
          CASE_INFO: '',
        },
      };
    },
  } as unknown as typeof PCore;
};

type Story = StoryObj<typeof PegaExtensionsCameraCapture>;

export const Default: Story = {
  render: (args) => {
    setPCore();

    const props = {
      ...args,
      getPConnect: () =>
        ({
          getContextName: () => '',
          getValue: () => '',
        }) as unknown as typeof PConnect,
    };

    return <PegaExtensionsCameraCapture {...props} />;
  },
  args: {
    buttonText: 'Capture with Camera',
  },
};
