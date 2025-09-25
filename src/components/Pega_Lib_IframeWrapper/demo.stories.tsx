import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsIframeWrapper } from './index';

export default {
  title: 'Fields/Iframe Wrapper',
  argTypes: {
    height: { control: 'number', if: { arg: 'heightMode', eq: 'fixed' } },
  },
  component: PegaExtensionsIframeWrapper,
};

type Story = StoryObj<typeof PegaExtensionsIframeWrapper>;

export const Default: Story = {
  render: (args) => {
    const props = {
      ...args,
    };
    return <PegaExtensionsIframeWrapper {...props} />;
  },
  args: {
    title: 'iFrame title',
    value: 'https://pegasystems.github.io/uplus-wss/retail_bank/index.html',
    height: 500,
    heightMode: 'fixed',
  },
};
