import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsBannerInput } from './index';

export default {
  title: 'Fields/Banner Input',
  component: PegaExtensionsBannerInput,
};

type Story = StoryObj<typeof PegaExtensionsBannerInput>;

export const Default: Story = {
  render: (args) => {
    const props = {
      ...args,
    };
    return <PegaExtensionsBannerInput {...props} />;
  },
  args: {
    value:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    variant: 'success',
    icon: 'warn-solid',
  },
};
