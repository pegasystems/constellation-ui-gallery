import type { StoryObj } from '@storybook/react';
import { PegaExtensionsBanner } from './index';

export default {
  title: 'Widgets/Banner',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsBanner,
};

const setPCore = () => {
  (window as any).PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {},
      };
    },
    getMessagingServiceManager: () => {
      return {
        subscribe: () => {
          /* nothing */
        },
        unsubscribe: () => {
          /* nothing */
        },
      };
    },
    getDataApiUtils: () => {
      return {
        getData: () => {
          return Promise.resolve({
            data: {
              data: [
                {
                  pxObjClass: 'Data-',
                  pyDescription: 'Message1',
                },
                {
                  pxObjClass: 'Data-',
                  pyDescription: 'Message2',
                },
              ],
            },
          });
        },
      };
    },
    getSemanticUrlUtils: () => {
      return {
        getResolvedSemanticURL: () => {
          return '/case/case-1';
        },
        getActions: () => {
          return { ACTION_SHOWVIEW: 'ACTION_SHOWVIEW' };
        },
      };
    },
  };
};

type Story = StoryObj<typeof PegaExtensionsBanner>;
export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getContextName: () => '',
          getValue: () => 'C-123',
          getActionsApi: () => {
            return {
              showPage: (name: string, classname: string) => {
                // eslint-disable-next-line no-alert
                alert(`show page ${classname}.${name}`);
              },
            };
          },
        };
      },
    };
    return <PegaExtensionsBanner {...props} />;
  },
  args: {
    variant: 'success',
    dataPage: 'D_error',
  },
};
