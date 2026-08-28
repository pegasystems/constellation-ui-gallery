import type { StoryObj } from '@storybook/react-webpack5';
import { PegaExtensionsDuplicateRowButton } from './index';

const storeData = {
  caseInfo: {
    content: {
      Orders: [
        {
          classID: 'Data-Order',
          LineItems: [
            {
              classID: 'Data-LineItem',
              ProductName: 'Keyboard',
              Quantity: 2,
              pzInsKey: 'LINE-1',
              Components: [
                { classID: 'Data-Component', Name: 'Switch', pzInsKey: 'COMP-1' },
                { classID: 'Data-Component', Name: 'Case', pzInsKey: 'COMP-2' },
              ],
            },
            {
              classID: 'Data-LineItem',
              ProductName: 'Monitor',
              Quantity: 1,
              pzInsKey: 'LINE-2',
              Components: [{ classID: 'Data-Component', Name: 'Panel', pzInsKey: 'COMP-3' }],
            },
          ],
        },
      ],
    },
  },
};

export default {
  title: 'Fields/Duplicate Row Button',
  argTypes: {
    getPConnect: {
      table: {
        disable: true,
      },
    },
  },
  component: PegaExtensionsDuplicateRowButton,
};

const setPCore = () => {
  (window as any).PCore = {
    getComponentsRegistry: () => ({
      getLazyComponent: (f: string) => f,
    }),
    getConstants: () => ({
      CASE_INFO: {
        AVAILABLEACTIONS: '',
      },
    }),
    getEnvironmentInfo: () => ({
      getTimeZone: () => 'local',
    }),
    getStore: () => ({
      getState: () => ({
        data: {
          workarea: storeData,
        },
      }),
    }),
    createPConnect: () => ({
      getPConnect: () => ({
        getListActions: () => ({
          insert: () => {},
        }),
      }),
    }),
  };
};

type Story = StoryObj<typeof PegaExtensionsDuplicateRowButton>;

export const Default: Story = {
  render: (args: any) => {
    setPCore();

    const props = {
      ...args,
      getPConnect: () => ({
        getContextName: () => 'workarea',
        getPageReference: () => 'caseInfo.content.Orders[0].LineItems[0]',
        getTarget: () => 'workarea',
        options: {
          pageReference: 'caseInfo.content.Orders[0].LineItems[0]',
          viewName: 'LineItemRow',
        },
        getLocalizedValue: (val: string) => val,
      }),
    };

    return <PegaExtensionsDuplicateRowButton {...props} />;
  },
  args: {
    label: 'Duplicate row',
  },
};
