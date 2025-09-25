import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsImageCarousel } from './index';

export default {
  title: 'Widgets/Image Carousel',
  argTypes: {
    datasource: {
      table: {
        disable: true,
      },
    },
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsImageCarousel,
};

const setPCore = () => {
  (window as any).PCore = {
    /* Nothing */
  };
};

type Story = StoryObj<typeof PegaExtensionsImageCarousel>;

export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getLocalizedValue: (val: string) => {
            return val;
          },
        };
      },
      datasource: {
        source: [
          {
            imageURL:
              'https://images.pexels.com/photos/1166644/pexels-photo-1166644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            description: 'Description for Image 1',
            title: 'Title for Image 1',
          },
          {
            imageURL:
              'https://images.pexels.com/photos/1166644/pexels-photo-1166644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            description: 'Description for Image 2',
            title: 'Title for Image 2',
          },
          {
            imageURL:
              'https://images.pexels.com/photos/1166644/pexels-photo-1166644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            description: 'Description for Image 3',
            title: 'Title for Image 3',
          },
        ],
        fields: {},
      },
    };
    return <PegaExtensionsImageCarousel {...props} />;
  },
  args: {
    height: '40rem',
    textPosition: 'Center',
    objectFit: 'cover',
    autoplay: true,
    autoplayDuration: 3000,
    controlType: 'Dots',
    animationType: 'fade-in',
  },
};
