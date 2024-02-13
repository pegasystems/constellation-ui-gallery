import type { StoryObj } from '@storybook/react';
import PegaExtensionsBarCode, { BarcodeType } from './index';

export default {
  title: 'Fields/Barcode',
  argTypes: {
    format: {
      options: Object.values(BarcodeType),
      control: 'select'
    }
  },
  component: PegaExtensionsBarCode
};

const setPCore = () => {
  (window as any).PCore = {
    /* Nothing */
  };
};

type Story = StoryObj<typeof PegaExtensionsBarCode>;

export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              outputProperty: '.BarcodeImg'
            };
          },
          getActionsApi: () => {
            return {
              updateFieldValue: (prop: string, value: string) => {
                // eslint-disable-next-line no-console
                console.log(`Updating property ${prop} with value: ${value}`);
              }
            };
          }
        };
      }
    };
    return <PegaExtensionsBarCode {...props} />;
  },
  args: {
    label: 'Barcode',
    inputProperty: 'A2345FG721',
    format: BarcodeType.CODE128,
    displayValue: true,
    helperText: 'Product details',
    testId: '',
    validatemessage: '',
    hideLabel: false
  }
};
