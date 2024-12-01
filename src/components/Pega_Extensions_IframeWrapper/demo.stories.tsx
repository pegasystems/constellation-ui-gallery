import type { StoryObj } from '@storybook/react';
import { PegaExtensionsIframeWrapper } from './index';

export default {
  title: 'Fields/IFrame Wrapper',
  component: PegaExtensionsIframeWrapper
};

type Story = StoryObj<typeof PegaExtensionsIframeWrapper>;

export const Default: Story = {
  render: args => {
    const props = {
      ...args
    };
    return <PegaExtensionsIframeWrapper {...props} />;
  },
  args: {
    title: 'iFrame title',
    value: 'https://pegasystems.github.io/uplus-wss/retail_bank/index.html',
    height: 500,
    heightMode: 'fixed'
  }
};
