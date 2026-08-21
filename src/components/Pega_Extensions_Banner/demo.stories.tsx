import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsBanner } from './index';

export default {
  title: 'Widgets/Banner',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
    dismissAction: { control: 'text', if: { arg: 'dismissible', eq: true } },
  },
  component: PegaExtensionsBanner,
} satisfies Meta<typeof PegaExtensionsBanner>;

const setPCore = () => {
  window.PCore = {
    getConstants: () => {
      return {
        CASE_INFO: {},
      };
    },
    getNameSpaceUtils: () => {
      return {
        getDefaultQualifiedName: (name: string) => name,
      };
    },
    getEnvironmentInfo: () => {
      return {
        getKeyMapping: (key: string) => key,
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
    getContainerUtils: () => {
      return {
        getContainerItems: () => {
          return ['test'];
        },
        updateCaseContextEtag: () => {},
      };
    },
    getRestClient: () => {
      return {
        invokeRestApi: () => {
          return Promise.resolve({
            data: {
              data: { caseInfo: '2' },
            },
          });
        },
      };
    },
    createPConnect: () => ({
      getPConnect: () =>
        ({
          getActionsApi: () => ({
            finishAssignment: () => {
              return Promise.resolve({
                data: {
                  data: {},
                },
              });
            },
          }),
          getContextName: () => '',
          getValue: () => 'C-123',
          getListActions: () => {
            return {
              update: () => {},
              deleteEntry: () => {},
            };
          },
        }) as unknown as typeof PConnect,
    }),
    getDataApiUtils: () => {
      return {
        getCaseEditLock: () => {
          return Promise.resolve({
            headers: {
              etag: '123',
            },
          });
        },
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
  } as unknown as typeof PCore;
};

type Story = StoryObj<typeof PegaExtensionsBanner>;
export const Default: Story = {
  render: (args) => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getDataObject: () => {
            return {};
          },
          updateState: () => {},
          getContainerManager: () => {
            return {
              addContainerItem: () => {},
              removeContainerItem: () => {},
            };
          },
          getContextName: () => '',
          getValue: () => 'C-123',
          getActionsApi: () => {
            return {
              showPage: (name: string, classname: string) => {
                alert(`show page ${classname}.${name}`);
              },
            };
          },
        } as unknown as typeof PConnect;
      },
    };
    return <PegaExtensionsBanner {...props} />;
  },
  args: {
    variant: 'success',
    dataPage: 'D_error',
    dismissible: false,
    dismissAction: '',
  },
};
