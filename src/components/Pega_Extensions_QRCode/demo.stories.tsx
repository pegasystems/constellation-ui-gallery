import type { StoryObj } from '@storybook/react';
import { PegaExtensionsQRCode } from './index';

export default {
  title: 'Fields/QRCode',
  argTypes: {
    value: {
      table: {
        disable: true
      }
    },
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsQRCode
};

const setPCore = () => {
  (window as any).PCore = {
    /* Nothing */
  };
};

type Story = StoryObj<typeof PegaExtensionsQRCode>;
export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: 'QRCodeImg'
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
    return <PegaExtensionsQRCode {...props} />;
  },
  args: {
    label: 'QRCode',
    value: '',
    inputProperty: 'https://www.pega.com',
    helperText: 'Scan with your phone',
    testId: '',
    validatemessage: '',
    readOnly: false,
    hideLabel: false
  }
};
